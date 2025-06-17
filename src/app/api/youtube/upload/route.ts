import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

// Utility function to generate video metadata
const generateVideoMetadata = (
  artPattern: string,
  musicTitle: string,
  duration: number
) => {
  const title = `${musicTitle} - ${artPattern} Visuals | V3XV0ID`
  
  const description = `
🎵 Music: ${musicTitle}
🎨 Visuals: ${artPattern} generative art
⏱️ Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}

Generated using custom algorithms and procedural art techniques.
Black and white aesthetic with organic flow patterns.

#GenerativeArt #V3XV0ID #ProceduralVisuals #ElectronicMusic #VisualMusic
`.trim()

  return {
    title,
    description,
    tags: [
      'generative art',
      'procedural visuals',
      'electronic music',
      'v3xv0id',
      'visual music',
      'algorithmic art',
      artPattern.toLowerCase(),
      'black and white'
    ],
    categoryId: '10', // Music
    privacyStatus: 'public' as const
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const metadataString = formData.get('metadata') as string
    
    if (!videoFile || !metadataString) {
      return NextResponse.json(
        { error: 'Missing video file or metadata' },
        { status: 400 }
      )
    }

    const metadata = JSON.parse(metadataString)
    
    // Get authentication tokens from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get('youtube_access_token')?.value
    const refreshToken = cookieStore.get('youtube_refresh_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'YouTube API credentials not configured' },
        { status: 500 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

    // Convert File to buffer for upload
    const videoBuffer = await videoFile.arrayBuffer()
    
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: metadata.categoryId || '10',
        },
        status: {
          privacyStatus: metadata.privacyStatus || 'public',
        },
      },
      media: {
        body: Buffer.from(videoBuffer),
      },
    })

    const videoId = response.data.id

    return NextResponse.json({ 
      success: true, 
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`
    })
    
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { error: `Upload failed: ${error}` },
      { status: 500 }
    )
  }
} 