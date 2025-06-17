import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * VEX VOID Canva OAuth Callback Handler
 * Handles the OAuth authorization code exchange for access tokens
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/studio?canva_error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/studio?canva_error=no_code', request.url)
      )
    }

    // Validate state (in production, compare with stored state)
    const storedState = request.cookies.get('canva_oauth_state')?.value
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/studio?canva_error=invalid_state', request.url)
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.CANVA_CLIENT_ID!,
        client_secret: process.env.CANVA_CLIENT_SECRET!,
        redirect_uri: process.env.CANVA_REDIRECT_URI!,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      return NextResponse.redirect(
        new URL('/studio?canva_error=token_exchange_failed', request.url)
      )
    }

    const tokenData = await tokenResponse.json()
    
    // In production, store tokens securely (database, encrypted cookies, etc.)
    // For now, redirect with success and store in localStorage via client-side
    const successUrl = new URL('/studio', request.url)
    successUrl.searchParams.append('canva_success', 'true')
    
    const response = NextResponse.redirect(successUrl)
    
    // Clear the state cookie
    response.cookies.delete('canva_oauth_state')
    
    // Store access token in secure cookie (temporary solution)
    response.cookies.set('canva_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 3600,
      path: '/'
    })

    if (tokenData.refresh_token) {
      response.cookies.set('canva_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400 * 30, // 30 days
        path: '/'
      })
    }

    return response

  } catch (error) {
    console.error('Canva callback error:', error)
    return NextResponse.redirect(
      new URL('/studio?canva_error=callback_failed', request.url)
    )
  }
} 