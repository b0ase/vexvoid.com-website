# 🎬 YouTube API Setup Instructions

## 🚨 **REQUIRED: Set up YouTube API credentials**

The YouTube page won't connect without proper API credentials. Follow these steps:

### 1. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### 2. **Create OAuth 2.0 Credentials**

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URI:
   ```
   http://localhost:3001/api/youtube/callback
   ```
5. Copy the **Client ID** and **Client Secret**

### 3. **Create Environment Variables File**

Create a file called `.env.local` in your project root:

```env
# YouTube API Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3001/api/youtube/callback
NEXTAUTH_URL=http://localhost:3001

# Optional: Veo3 API
VEO3_API_KEY=your_veo3_api_key_here
```

### 4. **Restart Development Server**

After creating `.env.local`:
```bash
npm run dev
```

### 5. **Test Authentication**

1. Go to `http://localhost:3001/youtube`
2. Click "Authenticate with YouTube"
3. Complete OAuth flow
4. You should see "✅ Connected to YouTube"

## 🔧 **Troubleshooting**

**"YouTube API credentials not configured"**
- Make sure `.env.local` exists with correct variables
- Restart the dev server after creating `.env.local`

**"OAuth error" or redirect issues**
- Check that redirect URI in Google Cloud Console matches exactly:
  `http://localhost:3001/api/youtube/callback`
- Make sure you're running on port 3001 (or update the redirect URI)

**"Not authenticated" errors**
- Complete the OAuth flow first
- Check browser console for errors
- Cookies might be blocked - try in incognito mode

## 📋 **What Works After Setup**

✅ YouTube channel authentication
✅ Video upload with metadata
✅ Real-time upload progress
✅ Multiple visual generation styles
✅ Audio analysis and synchronization
✅ Veo3 AI video generation (if API key provided)

The complete video generation pipeline will be functional once credentials are configured! 