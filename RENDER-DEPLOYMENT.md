# Render Deployment Guide

## How to Restart Server on Render

### Option 1: Manual Restart from Dashboard (Quickest)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Log in to your account

2. **Navigate to Your Service**
   - Click on your service name (e.g., "shyara-app" or your service name)

3. **Click "Manual Deploy"**
   - Find the "Manual Deploy" button in the top right
   - Click "Deploy latest commit"
   - This will rebuild and restart your service

### Option 2: Restart from Service Dashboard

1. **Go to Your Service**
   - Open your service in Render dashboard

2. **Click "Manual Deploy"** or **"Redeploy"**
   - This will restart the service with the latest code

### Option 3: Push to Trigger Auto-Deploy

1. **Commit and Push Your Changes**
   ```bash
   git add .
   git commit -m "Fix SPA routing"
   git push origin main  # or your branch name
   ```

2. **Render will automatically**
   - Detect the push
   - Rebuild the application
   - Restart the service

## Render Configuration

Make sure your Render service is configured correctly:

### Build Command (for Docker):
```bash
# If using Docker:
docker build -t shyara-app .

# Render should auto-detect Docker if Dockerfile exists
```

### Start Command:
```bash
# For Node.js (if not using Docker):
cd backend && npm start

# For Docker:
# Render will use CMD from Dockerfile
```

### Environment Variables:
- `NODE_ENV=production`
- `PORT=3000` (or use Render's `$PORT` variable)

### Root Directory:
- If your repo root is the project root, leave blank
- If needed, set to: `.` (root)

## Verify Deployment Settings

1. **Check Build Command**:
   - Should be empty (for Docker) OR
   - `cd backend && npm install && cd ../frontend && npm install && npm run build && cd ../backend && npm start`

2. **Check Start Command**:
   - If using Docker: Leave empty (uses Dockerfile CMD)
   - If not using Docker: `cd backend && npm start`

3. **Check Environment Variables**:
   - `NODE_ENV=production`
   - `PORT` will be set automatically by Render

## Troubleshooting

### Service Won't Start:
1. Check **Logs** tab in Render dashboard
2. Look for errors in build or startup
3. Verify all dependencies are in package.json

### Direct Links Still Not Working:
1. **Verify the build completed** - Check logs for "Build folder is ready"
2. **Check server logs** - Should show:
   ```
   Serving static files from: /app/frontend/build
   Index.html exists: true
   ```
3. **Test the route** - Check logs when accessing `/services`

### How to View Logs:
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. You'll see real-time logs

## Quick Restart Steps:

1. **Go to**: https://dashboard.render.com
2. **Click**: Your service name
3. **Click**: "Manual Deploy" → "Deploy latest commit"
4. **Wait**: 2-5 minutes for deployment
5. **Test**: Visit `shyara.co.in/services`

## Important Notes:

- **First Deploy**: Make sure all files are committed and pushed to your repository
- **Docker Setup**: If using Docker, Render will auto-detect the Dockerfile
- **Auto-Deploy**: Render auto-deploys on push to your connected branch (usually `main`)
- **Build Time**: Typically takes 3-5 minutes to rebuild and restart

