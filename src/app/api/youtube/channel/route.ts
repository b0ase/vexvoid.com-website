import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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

    const response = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    })

    const channel = response.data.items?.[0]
    
    if (!channel) {
      return NextResponse.json(
        { error: 'No channel found' },
        { status: 404 }
      )
    }

    const channelInfo = {
      id: channel.id,
      title: channel.snippet?.title,
      description: channel.snippet?.description,
      subscriberCount: channel.statistics?.subscriberCount,
      videoCount: channel.statistics?.videoCount,
      viewCount: channel.statistics?.viewCount,
      thumbnails: channel.snippet?.thumbnails
    }

    return NextResponse.json(channelInfo)
  } catch (error) {
    console.error('YouTube channel error:', error)
    return NextResponse.json(
      { error: 'Failed to get channel info' },
      { status: 500 }
    )
  }
} 