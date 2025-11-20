# Google Drive API Key Setup Guide

## ⚠️ CRITICAL Configuration Requirements

### Application Restrictions: MUST BE "None"

**DO NOT use "HTTP referrers" restrictions!**

- Server-side API calls (from the backend) do NOT include a Referer header
- Google will block all requests with 403 Forbidden if HTTP referrer restrictions are enabled
- Error message: `"Requests from referer <empty> are blocked."`

### Correct Configuration:

1. **Application restrictions**: **None** ✅
   - This allows server-side requests without a referrer
   - Safe because the key is only used server-side (never exposed to clients)

2. **API restrictions**: **Google Drive API** ✅
   - Limits the key to only access Google Drive API
   - Provides security by restricting which APIs can be called

### Why This Is Safe:

- ✅ API key is stored in `backend/.env` (never exposed to client-side code)
- ✅ Only the backend server makes API calls
- ✅ API restrictions limit it to Google Drive API only
- ✅ Server-side requests cannot satisfy HTTP referrer requirements

### How to Configure in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions**:
   - Select **"None"** (NOT "HTTP referrers")
5. Under **API restrictions**:
   - Select **"Restrict key"**
   - Choose **"Google Drive API"** only
6. Click **Save**

### Troubleshooting:

If you see `403 Forbidden` with error `"Requests from referer <empty> are blocked"`:
- Check that Application restrictions is set to "None"
- Wait 1-2 minutes after changing restrictions for changes to propagate
- Verify the API key in `backend/.env` matches the one in Google Cloud Console

