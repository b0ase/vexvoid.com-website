# VEX VOID OAuth Configuration Guide

## The Situation

You have **multiple Google services** for different purposes:

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

### 3. Google AI Studio API Key
- **Purpose**: Access Gemini AI for graffiti analysis and content generation
- **Usage**: Analyze VEX VOID aesthetic, generate video descriptions, scene prompts

### 4. Suno API Key (NEW!)
- **Purpose**: Automated VEX VOID music generation
- **Capacity**: 500 tracks/month ($10 subscription)
- **Usage**: Generate 8 curated tracks daily with ninja jazz aesthetic

## Clean Environment Setup

Replace your `.env.local` file with this clean version:

```bash
# YouTube API Configuration (V3XV0ID Channel)
YOUTUBE_CLIENT_ID=464808329497-qr2fbn9874ktg45qlatk26fj329g9j8u.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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

# Veo Video Generation (Personal Account with Credits)
VEO_CLIENT_ID=611528281396-ilkn7huncasd7c453t9qi0o4psvv4mt4.apps.googleusercontent.com
VEO_CLIENT_SECRET=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

# Google AI Studio (Gemini Analysis)
GOOGLE_AI_STUDIO_API_KEY=your-ai-studio-api-key

# Suno API (Music Generation)
SUNOAPI_ORG_API_KEY=your-suno-api-key

# Supabase Configuration
SUPABASE_PROJECT_URL=https://bgotvvrslolholxgcivz.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=generate-a-random-secret-here

# Legacy Support (fallbacks)
GOOGLE_CLIENT_ID=464808329497-qr2fbn9874ktg45qlatk26fj329g9j8u.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## What Each Service Does

### 🎬 YouTube Integration
- **Routes**: `/api/youtube/auth`, `/api/youtube/upload`
- **Purpose**: Upload generated videos to V3XV0ID channel
- **Uses**: `YOUTUBE_CLIENT_ID/SECRET`

### 🎥 Veo Video Generation  
- **Routes**: `/api/veo/auth`, `/api/veo/generate`
- **Purpose**: AI video generation using Google's Veo
- **Uses**: `VEO_CLIENT_ID/SECRET`

### 🤖 AI Analysis & Content
- **Routes**: `/api/ai/analyze-graffiti`, `/api/ai/generate-content`
- **Purpose**: Analyze graffiti photos, generate video metadata
- **Uses**: `GOOGLE_AI_STUDIO_API_KEY`

### 🎵 Automated Music Generation
- **Routes**: `/api/suno/generate-track`, `/api/suno/batch-generate`
- **Purpose**: Generate VEX VOID ninja jazz tracks automatically
- **Uses**: `SUNOAPI_ORG_API_KEY`
- **Capacity**: 500 tracks/month = ~16 tracks/day
- **Strategy**: 8 curated tracks/day across 5 series

## VEX VOID Music Pipeline

### **Daily Generation Schedule**
- **2 AM**: Midnight Mission (dark ambient)
- **6 AM**: Shadow Steps (contemplative)  
- **10 AM**: Aerosol Dreams (creative flow)
- **2 PM**: Four Ton Shadow (heavy industrial)
- **6 PM**: Experimental fusion
- **10 PM**: Vinyl crackle downtempo
- **12 AM**: Police scanner glitch
- **4 AM**: Train yard field recording

### **Quality Control**
- AI aesthetic scoring (7+ required for upload)
- VEX VOID DNA validation (jazz + industrial + train yard)
- BPM range compliance (60-140)
- Automatic Supabase storage

## Next Steps

1. **Add Suno API key** to your `.env.local`
2. **Test music generation** in Studio → Suno tab
3. **Set up automation** for daily track generation
4. **Curate releases** into themed albums

The VEX VOID aesthetic system is now complete with:
- ✅ 202 local assets (graffiti photos + videos)
- ✅ Supabase storage integration
- ✅ YouTube upload pipeline
- ✅ AI content generation
- ✅ Automated music production
- ✅ VEX VOID lore and influences 