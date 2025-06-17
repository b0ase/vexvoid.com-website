import { NextRequest, NextResponse } from 'next/server'

/**
 * VEX VOID Canva OAuth Authorization
 * Initiates the OAuth flow for Canva Connect API access
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.CANVA_CLIENT_ID
    const redirectUri = process.env.CANVA_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Canva OAuth not configured properly' },
        { status: 500 }
      )
    }

    // Required scopes for VEX VOID video editing
    const scopes = [
      'design:read',
      'design:write', 
      'folder:read',
      'asset:read',
      'asset:write',
      'export'
    ].join(' ')

    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15)
    
    // Build Canva authorization URL
    const authUrl = new URL('https://www.canva.com/api/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('scope', scopes)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('state', state)

    // Store state in response for validation (in production, use sessions)
    const response = NextResponse.redirect(authUrl.toString())
    response.cookies.set('canva_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600 // 10 minutes
    })

    return response

  } catch (error) {
    console.error('Canva OAuth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Canva OAuth' },
      { status: 500 }
    )
  }
} 