# VEX VOID OAuth Configuration Guide

## The Situation

You have **two separate Google OAuth applications** for different purposes:

### 1. YouTube Upload Credentials (V3XV0ID Channel)
- **Account**: v3xv0id@gmail.com
- **Purpose**: Upload videos to the VEX VOID YouTube channel
- **Client ID**: `464808329497-qr2fbn9874ktg45qlatk26fj329g9j8u.apps.googleusercontent.com`
- **Client Secret**: `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`

### 2. Veo Video Generation Credentials (Personal Account)
- **Account**: Your personal Google account (with credits)
- **Purpose**: Generate videos using Google's Veo AI
- **Client ID**: `611528281396-ilkn7huncasd7c453t9qi0o4psvv4mt4.apps.googleusercontent.com`
- **Client Secret**: `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`

## Clean Environment Setup

Replace your `.env.local` file with this organized version:

```bash
# =============================================================================
# VEX VOID ENVIRONMENT CONFIGURATION
# =============================================================================

# YouTube API Configuration (V3XV0ID Channel - v3xv0id@gmail.com)
# Used for: Uploading videos to the VEX VOID YouTube channel
YOUTUBE_API_KEY=AIzaSyBBsv13Ks8IHtqsdqpxfgrbpYSDsdG2D80
YOUTUBE_CLIENT_ID=464808329497-qr2fbn9874ktg45qlatk26fj329g9j8u.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_REDIRECT_URI=http://localhost:3001/api/auth/callback

# Google Veo Video Generation (Personal Account with Credits)
# Used for: Generating videos with Google's Veo AI
VEO_CLIENT_ID=611528281396-ilkn7huncasd7c453t9qi0o4psvv4mt4.apps.googleusercontent.com
VEO_CLIENT_SECRET=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
VEO_PROJECT_ID=your-veo-project-id-here

# Canva Connect API Configuration
# Used for: Programmatic design editing, autofill, and exports
CANVA_CLIENT_ID=your-canva-client-id-here
CANVA_CLIENT_SECRET=your-canva-client-secret-here
CANVA_REDIRECT_URI=http://localhost:3001/api/canva/callback
CANVA_API_BASE_URL=https://api.canva.com/rest/v1

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_random_secret_here

# Default Google OAuth (using YouTube credentials for general app auth)
GOOGLE_CLIENT_ID=464808329497-qr2fbn9874ktg45qlatk26fj329g9j8u.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# =============================================================================
# EXTERNAL SERVICES
# =============================================================================

# Perchance Configuration
perchance-password=.cx7dCJBP#p_VHm

# Suno API Configuration
SUNOAPI_ORG_API_KEY=0e014e21e49142b4f37b4e152e77071b

# Supabase Configuration
supabase_password=vRxxWq6NgHhC9A6a
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnb3R2dnJzbG9saG9seGdjaXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTU0ODksImV4cCI6MjA2NTY3MTQ4OX0.zBeEf2NeSRq_zW2MBcZkX_m_dIas7aJoZS7IAM4UQ-8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnb3R2dnJzbG9saG9seGdjaXZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA5NTQ4OSwiZXhwIjoyMDY1NjcxNDg5fQ.Ek_L9OMlcJUFGsB_QuUHQciXA1RReu7mg9maujU0E8g
SUPABASE_PROJECT_URL=https://bgotvvrslolholxgcivz.supabase.co
```

## Next Steps

1. **Update .env.local**: Copy the above configuration
2. **Find your Veo Project ID**: Check your Google Cloud Console for the project with Veo credits
3. **Generate proper NextAuth secret**: Replace `your_random_secret_here` with a real secret
4. **Update code**: Modify API routes to use the correct credentials for each service

## Code Updates Needed

We'll need to update:
- YouTube upload routes to use `YOUTUBE_CLIENT_ID/SECRET`
- Veo generation routes to use `VEO_CLIENT_ID/SECRET`
- General auth to use default `GOOGLE_CLIENT_ID/SECRET`

This separation ensures each service uses the correct account and credentials. 

## Canva Setup Instructions

### 1. Create Canva Connect App
- Go to [Canva Developer Portal](https://developers.canva.com)
- Create a new "Connect" app
- Set redirect URI to: `http://localhost:3001/api/canva/callback`
- Copy the Client ID and Client Secret to your `.env.local`

### 2. Required Scopes
Request these OAuth scopes for V3X VOID video editing:
- `design:read` - Access your designs
- `design:write` - Modify designs 
- `folder:read` - Access folders
- `asset:read` - Access brand assets
- `asset:write` - Upload assets
- `export` - Export finished videos 