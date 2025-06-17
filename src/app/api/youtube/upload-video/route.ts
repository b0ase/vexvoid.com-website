import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const youtube = google.youtube('v3')

interface UploadRequest {
  videoPath: string
  title: string
  description?: string
  tags?: string[]
  categoryId?: string
  privacy?: 'private' | 'unlisted' | 'public'
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadRequest = await request.json()
    
    console.log('📺 UPLOADING TO YOUTUBE:', body.title)
    
    // Validate inputs
    if (!body.videoPath || !body.title) {
      return NextResponse.json({ error: 'Missing video path or title' }, { status: 400 })
    }
    
    // Check if file exists
    const fullVideoPath = body.videoPath.startsWith('/') 
      ? path.join(process.cwd(), 'public', body.videoPath.substring(1))
      : body.videoPath
    
    if (!fs.existsSync(fullVideoPath)) {
      return NextResponse.json({ error: 'Video file not found' }, { status: 404 })
    }
    
    // Set up OAuth2 client
    const auth = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    )
    
    // Set credentials (you'll need to handle OAuth flow separately)
    const tokens = getStoredTokens() // Implement this function
    if (!tokens) {
      return NextResponse.json({ 
        error: 'YouTube authentication required',
        authUrl: `Please set up YouTube OAuth first`
      }, { status: 401 })
    }
    
    auth.setCredentials(tokens)
    
    // Prepare video metadata
    const videoMetadata = {
      snippet: {
        title: body.title,
        description: body.description || generateDescription(body.title),
        tags: body.tags || ['v3xv0id', 'music', 'ninja jazz', 'cyberpunk', 'experimental'],
        categoryId: body.categoryId || '10', // Music category
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: body.privacy || 'unlisted',
        embeddable: true,
        license: 'youtube',
        publicStatsViewable: true
      }
    }
    
    console.log('📤 Starting YouTube upload...')
    
    // Upload video
    const uploadResponse = await youtube.videos.insert({
      auth: auth,
      part: ['snippet', 'status'],
      requestBody: videoMetadata,
      media: {
        body: fs.createReadStream(fullVideoPath),
      },
    })
    
    const videoId = uploadResponse.data.id
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
    
    console.log(`✅ Video uploaded successfully: ${videoUrl}`)
    
    return NextResponse.json({
      success: true,
      videoId,
      videoUrl,
      title: body.title,
      privacy: body.privacy || 'unlisted',
      message: `🎬 "${body.title}" uploaded to YouTube successfully!`
    })
    
  } catch (error) {
    console.error('YouTube upload failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload to YouTube',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Generate default description for V3XV0ID videos
function generateDescription(title: string): string {
  return `${title}

🎵 V3XV0ID - Experimental Ninja Jazz & Digital Art

Generated using AI-powered video composition with original V3XV0ID concept art and ninja jazz soundscapes.

#v3xv0id #ninjajazz #cyberpunk #digitalart #experimentalmusic #ai #generative

---
Created with V3XV0ID Video Studio
🌐 Website: [Your website]
🎨 Art & Music: V3XV0ID
🤖 Generated: ${new Date().toLocaleDateString()}`
}

// TODO: Implement proper token storage
function getStoredTokens() {
  // In production, you'd store these securely in a database
  // For now, return null to indicate authentication needed
  
  // Example of what stored tokens would look like:
  // return {
  //   access_token: process.env.YOUTUBE_ACCESS_TOKEN,
  //   refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  //   scope: 'https://www.googleapis.com/auth/youtube.upload',
  //   token_type: 'Bearer'
  // }
  
  return null
} 