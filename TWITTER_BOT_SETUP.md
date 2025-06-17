# V3XV0ID Twitter Bot Setup Guide

## 🐦 Twitter/X Developer Account Setup

### Step 1: Create Twitter Developer Account
1. Go to https://developer.twitter.com/
2. Apply for a developer account
3. Create a new project/app called "V3XV0ID Bot"

### Step 2: App Configuration
Use these exact settings for your Twitter app:

#### App Permissions (Required)
- **Read and write**: Read Posts and profile information, read and post Direct messages
- **Request email from users**: ✅ Enabled

#### Type of App
- **Web App, Automated App or Bot**: Confidential client

#### App URLs
```
Callback URI / Redirect URL:
- http://localhost:3000/api/twitter/callback
- http://localhost:3001/api/twitter/callback
- https://yourdomain.com/api/twitter/callback (when deployed)

Website URL:
- http://localhost:3000 (for development)
- https://yourdomain.com (when deployed)

Terms of Service:
- http://localhost:3000/terms (for development)
- https://yourdomain.com/terms (when deployed)

Privacy Policy:
- http://localhost:3000/privacy (for development)
- https://yourdomain.com/privacy (when deployed)
```

#### Organization Info
```
Organization name: V3XV0ID
Organization URL: https://yourdomain.com
```

### Step 3: Get OAuth 2.0 Credentials
After creating your app, get these credentials:
- **Client ID** (OAuth 2.0 Client ID)
- **Client Secret** (OAuth 2.0 Client Secret)
- **Bearer Token** (for API v2 access)

## 🔧 Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Twitter OAuth 2.0 Configuration
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_CALLBACK_URL=http://localhost:3000/api/twitter/callback
```

## 🚀 Bot Features

### Manual Posting
- Custom text posts with V3XV0ID branding
- Latest generated video sharing
- Random concept art posting
- Automatic hashtag addition

### Auto-Posting
- Posts every 4 hours automatically
- Randomly selects content type:
  - Latest generated videos
  - Concept art from collections
  - Inspirational V3XV0ID messages
- Maintains consistent brand voice

### Content Sources
The bot automatically pulls from:
- `/public/generated/` - Generated videos
- `/public/images/VexVoid_concept_art/` - Concept art
- `/public/images/VexVoid_concept_art_2/` - More concept art
- `/public/images/VexVoid_concept_art_3/` - Additional concept art

## 🎨 Auto-Generated Content Examples

### Video Posts
```
🎬 New V3XV0ID visual experience dropped!

Urban decay meets digital dreams in this cinematic journey through the underground...

🌆 #VexVoid #UndergroundVibes #NinjaJazz #DigitalArt #V3XV0ID
🎵 Echoes in the digital abyss...
```

### Concept Art Posts
```
🎨 V3XV0ID concept art from the digital underground...

Exploring the aesthetic of urban decay and neon dreams

🌆 #VexVoid #UndergroundVibes #NinjaJazz #DigitalArt #V3XV0ID
🎵 Echoes in the digital abyss...
```

### General Posts
```
🌃 The digital underground never sleeps...

V3XV0ID continues to evolve in the spaces between reality and virtuality.

#CyberPunk #DigitalArt #UndergroundCulture
```

## 🛠️ API Endpoints

### Authentication
- `GET /api/twitter/auth` - Initiate OAuth flow
- `GET /api/twitter/callback` - Handle OAuth callback

### Posting
- `POST /api/twitter/post` - Manual post with custom content
- `GET /api/twitter/post?type=video` - Auto-post latest video
- `GET /api/twitter/post?type=concept` - Auto-post random concept art
- `GET /api/twitter/post?type=latest` - Auto-post general content

## 🔒 Security Notes

1. **Never commit API keys** to version control
2. Use `.env.local` for development
3. Use secure environment variables in production
4. Tokens are stored in httpOnly cookies for security
5. OAuth state validation prevents CSRF attacks

## 🎯 Usage in Studio

1. Go to `/studio` and enter password
2. Click **🐦 TWITTER** tab
3. Click **Connect Twitter** if not authenticated
4. Use manual posting controls or enable auto-posting
5. Monitor posting activity and engagement

## 📱 Mobile Support

The bot interface is fully responsive and works on:
- Desktop browsers
- Mobile Safari/Chrome
- Tablet devices

## 🚨 Rate Limits

Twitter API v2 rate limits:
- **Tweet creation**: 300 tweets per 15-minute window
- **Media upload**: 300 uploads per 15-minute window
- **Auto-posting interval**: 4 hours (safe limit)

## 🔄 Auto-Posting Schedule

Default schedule (customizable):
- **Every 4 hours**: Random content type
- **Peak times**: 9 AM, 1 PM, 5 PM, 9 PM
- **Content rotation**: Ensures variety
- **Engagement tracking**: Monitor performance

## 🐛 Troubleshooting

### Common Issues

1. **"Not authenticated" error**
   - Regenerate API keys in Twitter Developer Portal
   - Check callback URL matches exactly

2. **Media upload fails**
   - Ensure video files are < 512MB
   - Check file format (MP4 recommended)
   - Verify image formats (JPEG/PNG)

3. **Auto-posting not working**
   - Check environment variables
   - Verify Twitter API permissions
   - Monitor browser console for errors

### Debug Mode
Add this to see detailed logs:
```bash
DEBUG_TWITTER_BOT=true
```

## 📈 Analytics & Monitoring

Track these metrics:
- Posts per day
- Engagement rate
- Media upload success rate
- API rate limit usage
- Error frequency

## 🔮 Future Features

- Scheduled posting calendar
- Thread support for longer content
- Analytics dashboard
- Custom posting templates
- Hashtag optimization
- Engagement analytics
- Multi-account support

---

*Ready to unleash the V3XV0ID bot onto the digital underground? 🌆🤖* 