const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

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
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Static files served from: ${staticPath}`);
  console.log(`Make sure frontend is built: cd frontend && npm run build`);
}); 