// Quick test script to verify server configuration
const path = require('path');
const fs = require('fs');

console.log('=== Server Configuration Check ===\n');

const buildPath = path.join(__dirname, 'frontend/build');
const publicPath = path.join(__dirname, 'frontend/public');
const indexPath = path.join(buildPath, 'index.html');

console.log('1. Path Check:');
console.log('   Build path:', buildPath);
console.log('   Public path:', publicPath);
console.log('   Index.html path:', indexPath);
console.log('');

console.log('2. Directory Existence:');
console.log('   Build directory exists:', fs.existsSync(buildPath));
console.log('   Public directory exists:', fs.existsSync(publicPath));
console.log('   Index.html exists:', fs.existsSync(indexPath));
console.log('');

if (fs.existsSync(buildPath)) {
  console.log('3. Build Directory Contents:');
  const buildFiles = fs.readdirSync(buildPath);
  console.log('   Files/folders:', buildFiles.join(', '));
  console.log('');
  
  if (fs.existsSync(indexPath)) {
    console.log('4. Index.html Content Check:');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const hasReactRoot = indexContent.includes('root') || indexContent.includes('react');
    console.log('   Contains React root:', hasReactRoot);
    console.log('   File size:', (indexContent.length / 1024).toFixed(2), 'KB');
    console.log('');
  }
}

console.log('5. Recommendations:');
if (!fs.existsSync(buildPath)) {
  console.log('   ❌ Build directory not found!');
  console.log('   → Run: cd frontend && npm run build');
} else if (!fs.existsSync(indexPath)) {
  console.log('   ❌ index.html not found in build directory!');
  console.log('   → Rebuild: cd frontend && npm run build');
} else {
  console.log('   ✅ Build directory and index.html exist');
  console.log('   → Check server logs when accessing /services');
  console.log('   → Verify server is restarted with new code');
}
console.log('');

