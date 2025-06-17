import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/youtube/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'YouTube API credentials not configured' },
        { status: 500 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    const { tokens } = await oauth2Client.getToken(code)
    
    // Store tokens in HTTP-only cookies for security
    const cookieStore = cookies()
    cookieStore.set('youtube_access_token', tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    })
    
    if (tokens.refresh_token) {
      cookieStore.set('youtube_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('YouTube callback error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Handle OAuth redirect (GET request)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/youtube?error=${error}`)
  }

  if (code) {
    // For GET requests, we'll redirect to the frontend with the code
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/youtube?code=${code}`)
  }

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/youtube?error=no_code`)
} 