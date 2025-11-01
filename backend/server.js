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

// Serve static files
app.use(express.static(staticPath, {
  index: false, // Don't serve index.html automatically for directories
  etag: true,
  lastModified: true
}));

// Fallback to index.html for any unknown routes (SPA routing)
// This must be last to catch all routes that aren't API or static files
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  const indexPath = path.join(staticPath, 'index.html');
  
  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return res.status(404).send('index.html not found. Please run: cd frontend && npm run build');
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Static files served from: ${staticPath}`);
}); 