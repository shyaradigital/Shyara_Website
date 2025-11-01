# Deployment Guide - Fixing Direct Link Routing

This guide helps fix the issue where direct links like `shyara.co.in/services` show "Not Found".

## Quick Fix Steps

### 1. Build the Frontend
```bash
cd frontend
npm run build
cd ..
```

This creates the `frontend/build` directory with all the production files.

### 2. Restart Your Server
```bash
# If using Node.js directly:
cd backend
npm start

# If using PM2:
pm2 restart shyara-app

# If using Docker:
docker-compose restart
# OR rebuild:
docker-compose up -d --build
```

### 3. Verify Build Directory Exists
```bash
# Check if build directory exists
ls -la frontend/build

# Should show index.html and other files
```

## Server Configuration

### If using Express Server directly:
The `backend/server.js` has been updated to:
- Serve static files from `frontend/build`
- Handle SPA routing (all routes serve index.html)
- Properly handle API routes

### If using Nginx as Reverse Proxy:
1. Copy `nginx.conf` to your nginx sites directory:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/shyara.co.in
   sudo ln -s /etc/nginx/sites-available/shyara.co.in /etc/nginx/sites-enabled/
   ```

2. Test nginx configuration:
   ```bash
   sudo nginx -t
   ```

3. Reload nginx:
   ```bash
   sudo systemctl reload nginx
   ```

### If using Apache:
The `.htaccess` file in `frontend/public/` should automatically handle routing when deployed.

### If using Netlify/Vercel:
The `_redirects` file in `frontend/public/` should automatically handle routing.

## Troubleshooting

### Check Server Logs
```bash
# Node.js/PM2:
pm2 logs shyara-app

# Docker:
docker logs <container-name>

# Check what path server is using:
# Look for: "Serving static files from: ..." in logs
```

### Verify Files Are Served
1. Visit `http://shyara.co.in/` - should load homepage
2. Visit `http://shyara.co.in/services` - should load services page
3. Check browser console for any errors

### Common Issues

**Issue**: "Not Found" on direct links
- **Solution**: Ensure `frontend/build/index.html` exists
- **Solution**: Restart server after building
- **Solution**: Check server logs to see what path it's serving from

**Issue**: API routes not working
- **Solution**: Ensure API routes are defined before static file serving in server.js

**Issue**: Static assets (CSS/JS) not loading
- **Solution**: Ensure build directory contains `static` folder with assets
- **Solution**: Check if static files are being served correctly

## Testing Locally

1. Build frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Start server:
   ```bash
   cd ../backend && npm start
   ```

3. Test direct links:
   - Open `http://localhost:3000/services` in a new incognito window
   - Should load the services page, not show "Not Found"

## Production Checklist

- [ ] Frontend is built (`npm run build` in frontend directory)
- [ ] Build directory exists (`frontend/build/`)
- [ ] Server is restarted with new code
- [ ] Server logs show correct static path
- [ ] Direct links work (test in incognito/new browser)
- [ ] API routes work (`/api/contact`)
- [ ] Static assets load (CSS, JS, images)

## Need Help?

If issues persist:
1. Check server logs for error messages
2. Verify the build directory structure
3. Test with a fresh browser/incognito window
4. Verify domain DNS points to correct server
5. Check if there's a reverse proxy that needs configuration

