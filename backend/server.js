// Load environment variables
// In production (Render), environment variables are set directly in the dashboard
// In development, load from .env file
const path = require('path');
const fs = require('fs');

// Only load dotenv in development - Render provides env vars directly in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  // Development mode: Try multiple locations for .env file
  const possibleEnvPaths = [
    path.join(__dirname, '.env'),           // Same directory as server.js
    path.join(__dirname, '..', '.env'),     // Parent directory
    path.join(process.cwd(), '.env'),       // Current working directory
    path.join(process.cwd(), 'backend', '.env') // backend subdirectory from root
  ];

  let envLoaded = false;
  for (const envPath of possibleEnvPaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log('✅ Loaded .env file from:', envPath);
      envLoaded = true;
      break;
    }
  }

  if (!envLoaded) {
    // Try default dotenv behavior (looks for .env in current directory)
    require('dotenv').config();
    console.log('ℹ️  No .env file found, using process.env');
  }
} else {
  // Production mode: Use process.env directly (Render sets these automatically)
  console.log('ℹ️  Production mode: Using environment variables from Render');
}

const express = require('express');
const app = express();
// Use different port in development (3001) to avoid conflict with React dev server (3000)
// In production, use PORT from environment or default to 3000
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// Middleware for parsing JSON (must come before routes)
app.use(express.json());

// API routes (must come before static file serving)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // For demo: log the contact form data
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true });
});

// Diagnostic endpoint to check API key status (useful for debugging)
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'undefined',
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    timestamp: new Date().toISOString()
  });
});

// Google Drive Image Proxy - Streams images from Drive API to bypass CORS
// Endpoint: GET /api/drive-image/:fileId
// Uses ONLY: https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media&key=API_KEY
app.get('/api/drive-image/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!apiKey) {
      console.error('ERROR: Google Drive API key not configured');
      return res.status(500).json({ 
        error: 'Google Drive API key not configured' 
      });
    }

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    // First, get file metadata to determine MIME type
    const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${apiKey}&fields=mimeType,name`;
    let mimeType = 'image/jpeg'; // Default fallback
    
    try {
      const metadataResponse = await fetch(metadataUrl);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        mimeType = metadata.mimeType || 'image/jpeg';
      }
    } catch (metaError) {
      console.warn('Could not fetch metadata for file:', fileId, metaError.message);
    }

    // Google Drive API endpoint to get file content - ONLY this endpoint, no googleusercontent URLs
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

    console.log('📸 Proxying image request:', fileId, 'MIME:', mimeType);

    // Fetch the image from Google Drive
    const response = await fetch(driveUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    });

    if (!response.ok) {
      console.error('❌ Drive API error:', response.status, response.statusText, 'for file:', fileId);
      
      // Return error placeholder image (1x1 transparent PNG as base64)
      const errorPlaceholder = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).send(errorPlaceholder);
    }

    // Get content type from Drive response (supports PNG, JPG, WEBP, etc.)
    const contentType = response.headers.get('content-type') || mimeType || 'image/jpeg';
    
    // Set appropriate headers for image streaming
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Stream the image data directly to the response
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    console.log('✅ Image proxied successfully:', fileId, `(${buffer.length} bytes, ${contentType})`);
    
    res.send(buffer);

  } catch (error) {
    console.error('❌ Error proxying image:', error.message, 'for file:', req.params.fileId);
    
    // Return error placeholder on exception
    const errorPlaceholder = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(errorPlaceholder);
  }
});

// Google Drive API route - List files in a folder
app.get('/api/drive-list/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    // Debug: Check if API key is loaded
    console.log('═══════════════════════════════════════════════════');
    console.log('🔑 API KEY DEBUG INFO:');
    console.log('  - API KEY PRESENT:', apiKey ? 'YES' : 'NO');
    console.log('  - API KEY LENGTH:', apiKey ? apiKey.length : 0);
    console.log('  - API KEY PREFIX:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
    console.log('  - FOLDER ID:', folderId);
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'undefined');
    console.log('  - CWD:', process.cwd());
    console.log('  - __dirname:', __dirname);
    console.log('═══════════════════════════════════════════════════');

    if (!apiKey) {
      console.error('ERROR: Google Drive API key not found in environment variables');
      return res.status(500).json({ 
        error: 'Google Drive API key not configured. Please set GOOGLE_DRIVE_API_KEY in environment variables.' 
      });
    }

    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Google Drive API v3 endpoint - EXACT format with all required parameters
    // Important: Single quotes around folder ID, proper encoding, and required flags
    const encodedFolderId = encodeURIComponent(folderId);
    // Request id, name, mimeType, thumbnailLink - frontend will use thumbnailLink or fallback
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${encodedFolderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink)&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=name`;

    console.log('GOOGLE DRIVE API URL:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'));

    // Fetch with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Shyara-Portfolio/1.0'
      }
    });
    
    if (!response.ok) {
      // Get raw error response - clone the response first to avoid "body already read" error
      let rawError = '';
      let errorDetails = {};
      
      try {
        // Clone the response to read it safely
        const clonedResponse = response.clone();
        rawError = await clonedResponse.text();
        
        console.error('═══════════════════════════════════════════════════');
        console.error('GOOGLE DRIVE RAW ERROR (Status:', response.status, '):');
        console.error(rawError);
        console.error('═══════════════════════════════════════════════════');
        
        // Try to parse as JSON for better error message
        try {
          errorDetails = JSON.parse(rawError);
        } catch (e) {
          errorDetails = { raw: rawError };
        }
      } catch (readError) {
        console.error('Error reading error response:', readError.message);
        errorDetails = { error: 'Could not read error response' };
      }

      return res.status(response.status).json({ 
        error: 'Failed to fetch files from Google Drive',
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      });
    }

    const data = await response.json();
    console.log('Google Drive API Success - Files found:', data.files ? data.files.length : 0);
    
    // Filter only images and videos
    const mediaFiles = (data.files || []).filter(file => 
      file.mimeType && (
        file.mimeType.startsWith('image/') || 
        file.mimeType.startsWith('video/')
      )
    );

    console.log('Media files after filtering:', mediaFiles.length);

    // Transform to our format - return id, name, mimeType, thumbnailLink
    // Frontend will use thumbnailLink or fallback URL: https://lh3.googleusercontent.com/d/<FILE_ID>=s800
    const mapDriveFile = (file) => {
      const { id, name, mimeType, thumbnailLink } = file;

      return {
        id,
        name,
        mimeType,
        thumbnailLink: thumbnailLink || null // null if not available, frontend will use fallback
      };
    };

    const files = mediaFiles.map(mapDriveFile);
    
    // Debug: Log first file structure
    if (files.length > 0) {
      console.log('✅ Sample Drive file mapping:', {
        id: files[0].id,
        name: files[0].name,
        proxyUrl: `/api/drive-image/${files[0].id}`,
        mimeType: files[0].mimeType
      });
    }

    // Return JSON response
    return res.status(200).json({ files });
  } catch (error) {
    console.error('═══════════════════════════════════════════════════');
    console.error('Error fetching Drive files:', error);
    console.error('Error stack:', error.stack);
    console.error('═══════════════════════════════════════════════════');
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve static files from the build directory (production)
const buildPath = path.join(__dirname, '../frontend/build');
const publicPath = path.join(__dirname, '../frontend/public');

// Check if build directory exists (production), otherwise serve from public (development)
const staticPath = fs.existsSync(buildPath) ? buildPath : publicPath;

console.log('Serving static files from:', staticPath);
console.log('Build path exists:', fs.existsSync(buildPath));
console.log('Public path exists:', fs.existsSync(publicPath));

// Get the index.html path
const indexPath = path.join(staticPath, 'index.html');
console.log('Index.html path:', indexPath);
console.log('Index.html exists:', fs.existsSync(indexPath));

const optimizedMediaPath = path.join(staticPath, 'pics-optimized');
if (fs.existsSync(optimizedMediaPath)) {
  app.use('/pics-optimized', express.static(optimizedMediaPath, {
    index: false,
    maxAge: '30d',
    immutable: true,
    setHeaders: (res) => {
      res.set('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }));
}

// Serve static files (JS, CSS, images, etc.)
// But don't automatically serve index.html for directories
app.use(express.static(staticPath, {
  index: false,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Log when serving static files
    if (process.env.NODE_ENV !== 'production') {
      console.log('Serving static file:', filePath);
    }
  },
  // Don't fall through to next middleware if file doesn't exist
  // This allows our catch-all route to handle it
  fallthrough: true
}));

// SPA fallback: serve index.html for all GET requests that:
// 1. Are not API routes
// 2. Are not actual static files (those are handled above)
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Skip if it's a static file request (has extension)
  // This prevents serving index.html for actual file requests
  const hasExtension = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|txt|webmanifest)$/i.test(req.path);
  if (hasExtension) {
    return next();
  }
  
  // Log the request
  console.log('SPA route requested:', req.path);
  
  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return res.status(404).send('index.html not found. Please run: cd frontend && npm run build');
  }
  
  // Send index.html - React Router will handle the routing
  res.sendFile(path.resolve(indexPath), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      if (!res.headersSent) {
        res.status(500).send('Error loading page');
      }
    } else {
      console.log('Successfully served index.html for route:', req.path);
    }
  });
});

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 Server starting...');
  console.log(`   Port: ${PORT}`);
  console.log(`   Static files: ${staticPath}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
  console.log(`   Environment: ${isProduction ? 'PRODUCTION (Render)' : 'DEVELOPMENT'}`);
  console.log('');
  
  // Check API key
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  console.log(`   🔑 GOOGLE_DRIVE_API_KEY: ${apiKey ? '✅ LOADED' : '❌ NOT FOUND'}`);
  if (apiKey) {
    console.log(`      - Length: ${apiKey.length} characters`);
    console.log(`      - Prefix: ${apiKey.substring(0, 10)}...`);
  } else {
    console.log('   ⚠️  WARNING: Google Drive API will not work!');
    if (isProduction) {
      console.log('   📝 To fix: Set GOOGLE_DRIVE_API_KEY in Render dashboard:');
      console.log('      1. Go to your Render service dashboard');
      console.log('      2. Navigate to Environment tab');
      console.log('      3. Add: GOOGLE_DRIVE_API_KEY = your_api_key_here');
      console.log('      4. Save and redeploy');
    } else {
      console.log('   📝 To fix: Create backend/.env file with:');
      console.log('      GOOGLE_DRIVE_API_KEY=your_api_key_here');
    }
  }
  console.log('═══════════════════════════════════════════════════');
  console.log(`Server running on http://localhost:${PORT}`);
  if (!isProduction) {
    console.log(`Make sure frontend is built: cd frontend && npm run build`);
  }
}); 