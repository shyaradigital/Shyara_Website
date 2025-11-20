# Google Drive Gallery Setup Guide

## Environment Variables

### Backend (.env file in `backend/` directory)

Create a `.env` file in the `backend/` directory with your Google Drive API key:

```
GOOGLE_DRIVE_API_KEY=your_actual_api_key_here
```

**How to get a Google Drive API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Drive API" for your project
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and paste it in the `.env` file

**⚠️ CRITICAL: API Key Restrictions Configuration**

Since the API calls are made **server-side** (from the backend), the API key must be configured correctly:

1. **Application restrictions**: Set to **"None"** (NOT "HTTP referrers")
   - Server-side requests don't include a Referer header
   - HTTP referrer restrictions will block all backend requests with 403 Forbidden
   - This is safe because the key is only used server-side and never exposed to clients

2. **API restrictions**: Set to **"Google Drive API"** only
   - This limits the key to only access Google Drive API
   - Provides security by restricting which APIs can be called

**Why "None" for Application restrictions is safe:**
- The API key is stored in `backend/.env` (never exposed to client)
- Only the backend server uses the key
- API restrictions limit it to Google Drive API only
- Server-side requests cannot satisfy HTTP referrer requirements

**Important:** The API key should have access to public Google Drive folders. Make sure your Drive folders are set to "Anyone with the link can view".

## Running the Application

### Development Mode

1. **Start the backend server** (runs on port 3001):
   ```bash
   cd backend
   npm install  # if not already done
   npm start
   ```

2. **Start the frontend** (runs on port 3000):
   ```bash
   cd frontend
   npm install  # if not already done
   npm start
   ```

The frontend will automatically proxy API requests to the backend.

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend (serves both API and frontend):
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

## Folder IDs

The following Google Drive folder IDs are configured:

- **SMM**: `1AUVLMsKOhDkiE4gzPPI84cY19Wo5BVvT`
- **Ads**: `1gpUYQ2CwvVpaR-rBc082en8yHoMIbeW7`
- **App Dev**: `1I9qFffnhctJwVEprMa0u4PerZJUhMHwU`
- **Festive**: `1YojPkvfm2s_PjG2ZwimarcJZmggGKwvj`
- **Reels**: `1EMh6UMcshbub8A-g2ZyH8-6oQNSgQ3op`

Make sure all these folders are set to "Anyone with the link can view" in Google Drive.

## Troubleshooting

### Gallery not loading
- Check that the `.env` file exists in the `backend/` directory
- Verify the API key is correct
- Ensure the Google Drive API is enabled in your Google Cloud project
- Check that folders are publicly accessible

### CORS errors
- The backend should handle CORS automatically
- If issues persist, check the backend server logs

### Images not displaying
- Verify folder permissions in Google Drive
- Check browser console for errors
- Ensure the API key has proper permissions

