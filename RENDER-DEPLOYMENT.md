# Render Deployment Guide

This guide explains how to deploy the Shyara website to Render and configure the Google Drive API.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A Google Drive API key (see below)
3. Your code pushed to GitHub

## Step 1: Get Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - (Optional) Restrict the API key to only Google Drive API for security

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub (the `render.yaml` file is already configured)
2. In Render dashboard:
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and configure the service

### Option B: Manual Setup

1. In Render dashboard, click "New" > "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `shyara-website` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to repository root)

## Step 3: Set Environment Variables

**CRITICAL**: You must set the `GOOGLE_DRIVE_API_KEY` environment variable in Render.

1. In your Render service dashboard, go to the **Environment** tab
2. Click "Add Environment Variable"
3. Add:
   - **Key**: `GOOGLE_DRIVE_API_KEY`
   - **Value**: Your Google Drive API key (from Step 1)
4. Click "Save Changes"
5. Render will automatically redeploy your service

### Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_DRIVE_API_KEY` | ✅ Yes | Your Google Drive API key |
| `NODE_ENV` | Auto-set | Automatically set to `production` |
| `PORT` | Auto-set | Automatically set by Render |

## Step 4: Verify Deployment

1. Wait for the deployment to complete (check the "Logs" tab)
2. Visit your Render service URL
3. Check the server logs for:
   ```
   🔑 GOOGLE_DRIVE_API_KEY: ✅ LOADED
   ```
   If you see `❌ NOT FOUND`, the environment variable is not set correctly.

4. Test the API key:
   - Visit: `https://your-app.onrender.com/api/health`
   - You should see: `{"apiKeyConfigured": true, ...}`

## Troubleshooting

### Google Drive API Not Working

**Problem**: Images from Google Drive don't load on the deployed site.

**Solutions**:

1. **Check Environment Variable**:
   - Go to Render dashboard > Environment tab
   - Verify `GOOGLE_DRIVE_API_KEY` is set
   - Check the value doesn't have extra spaces or quotes
   - Save and redeploy

2. **Check Server Logs**:
   - In Render dashboard, go to "Logs" tab
   - Look for startup messages
   - If you see `❌ NOT FOUND`, the API key is not loaded

3. **Verify API Key**:
   - Test the health endpoint: `https://your-app.onrender.com/api/health`
   - Check `apiKeyConfigured` is `true`

4. **API Key Restrictions**:
   - If your API key has restrictions, make sure:
     - Google Drive API is enabled
     - HTTP referrer restrictions allow your Render domain
     - IP restrictions allow Render's IPs (or remove IP restrictions)

5. **Redeploy**:
   - After changing environment variables, Render should auto-redeploy
   - If not, manually trigger a redeploy from the dashboard

### Build Failures

- Check the build logs in Render dashboard
- Ensure `frontend/package.json` and `backend/package.json` are correct
- Verify Node.js version compatibility (Render uses Node 18 by default)

### Port Issues

- Render automatically sets the `PORT` environment variable
- The server code uses `process.env.PORT || 3000`
- No manual configuration needed

## Security Notes

- **Never commit** your `.env` file or API keys to GitHub
- Use Render's environment variables for all secrets
- Consider restricting your Google Drive API key to specific domains/IPs
- Regularly rotate your API keys

## Support

If you continue to have issues:
1. Check Render's logs for detailed error messages
2. Verify your Google Drive API key works by testing it locally
3. Ensure your Google Drive folders are shared correctly (if using shared folders)

