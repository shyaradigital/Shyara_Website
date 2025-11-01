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
app.use(express.static(staticPath));

// Fallback to index.html for any unknown routes (SPA routing)
// This must be last to catch all routes that aren't API or static files
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 