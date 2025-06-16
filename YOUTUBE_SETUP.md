# YouTube Integration Setup Guide

## 🎯 Overview
This guide will help you set up actual YouTube video publishing for your V3XV0ID generative art videos.

## 📋 Prerequisites
- Google account
- YouTube channel
- Node.js project with Next.js

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project"
3. Name it "V3XV0ID YouTube Integration"
4. Click "Create"

### 1.2 Enable YouTube Data API v3
1. In your project, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure consent screen first if prompted:
   - User Type: External
   - App name: V3XV0ID
   - User support email: your email
   - Developer contact: your email
4. Application type: Web application
5. Name: V3XV0ID YouTube Uploader
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3001/api/auth/callback` 
   - `http://localhost:3002/api/auth/callback`
   - `https://yourdomain.com/api/auth/callback` (for production)
7. Click "Create"
8. **IMPORTANT**: Copy the Client ID and Client Secret

## 🔐 Step 2: Environment Variables

Create `.env.local` in your project root:

```env
# YouTube API Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Optional: For production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_random_secret_here
```

## 📦 Step 3: Install Dependencies

```bash
npm install googleapis @ffmpeg/ffmpeg @ffmpeg/util
```

## 🚀 Step 4: Authentication Flow

### 4.1 First-time Authentication
1. Visit your `/youtube` page
2. Click "Authenticate with YouTube"
3. Complete Google OAuth flow
4. Tokens will be stored in localStorage

### 4.2 Testing Authentication
```javascript
// In browser console on /youtube page
const uploader = new YouTubeUploader();
uploader.loadStoredTokens();
uploader.getChannelInfo().then(console.log);
```

## 🎬 Step 5: Video Generation & Upload Process

### 5.1 Complete Workflow
```javascript
import { generateFrames, artPatterns } from './lib/generativeArt';
import { createVideoFromFrames } from './lib/videoEncoder';
import { YouTubeUploader, generateVideoMetadata } from './lib/youtubeApi';

// 1. Generate art frames
const frames = await generateFrames('organicFlow', {
  width: 1920,
  height: 1080,
  duration: 30, // 30 seconds
  frameRate: 30
});

// 2. Load audio
const audioResponse = await fetch('/music/Echoes in the Abyss.mp3');
const audioBlob = await audioResponse.blob();

// 3. Create video
const videoBlob = await createVideoFromFrames(frames, audioBlob, {
  fps: 30,
  width: 1920,
  height: 1080
});

// 4. Upload to YouTube
const uploader = new YouTubeUploader();
const metadata = generateVideoMetadata('Organic Flow', 'Echoes in the Abyss', 30);
const videoId = await uploader.uploadVideo(videoBlob, metadata);

console.log(`Video uploaded: https://www.youtube.com/watch?v=${videoId}`);
```

## 🔄 Step 6: Automated Workflow

### 6.1 Scheduled Generation
Create a cron job or use Vercel's cron functions:

```javascript
// pages/api/cron/generate-video.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your video generation logic here
    const result = await generateAndUploadVideo();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 6.2 Webhook Integration
Set up webhooks to trigger video generation:
- New music uploaded
- Scheduled daily/weekly uploads
- Manual triggers from admin panel

## 🎨 Step 7: Customization Options

### 7.1 Art Patterns
Your current patterns:
- `organicFlow` - Your beautiful algorithm
- `flowingParticles` - Particle systems
- `geometricWaves` - Wave patterns
- `spiralMatrix` - Spiral formations

### 7.2 Video Settings
```javascript
const videoConfig = {
  width: 1920,      // 1080p
  height: 1080,
  frameRate: 30,    // Smooth playback
  duration: 60,     // 1 minute videos
  bitrate: '2M',    // High quality
};
```

### 7.3 Audio Integration
- Sync visuals to BPM
- React to frequency analysis
- Multiple audio tracks support

## 🚨 Important Notes

### Security
- Never commit `.env.local` to git
- Use secure token storage in production
- Implement rate limiting for API routes

### YouTube Limits
- Daily upload quota: 6 videos/day (default)
- File size limit: 256GB or 12 hours
- Request quota limits apply

### Performance
- FFmpeg.wasm is CPU intensive
- Consider server-side rendering for production
- Implement progress indicators for long operations

## 🐛 Troubleshooting

### Common Issues
1. **"Not authenticated"** - Run authentication flow again
2. **FFmpeg errors** - Check browser compatibility
3. **Upload failures** - Verify API quotas and file formats
4. **CORS errors** - Check redirect URIs in Google Console

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'youtube:*');
```

## 🎯 Next Steps

1. Set up Google Cloud project ✅
2. Configure environment variables ✅
3. Test authentication flow
4. Generate first video
5. Upload to YouTube
6. Set up automated workflow
7. Monitor and optimize

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables
3. Test API endpoints individually
4. Check Google Cloud Console for quota usage

---

**Your beautiful organic flow algorithm is now ready to create stunning YouTube videos! 🎨✨** 