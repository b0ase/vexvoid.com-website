import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;
    const storedState = request.cookies.get('twitter_state')?.value;

    if (!code || !codeVerifier || state !== storedState) {
      return NextResponse.json({ error: 'Invalid callback parameters' }, { status: 400 });
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const { accessToken, refreshToken } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL!,
    });

    // Store tokens securely (you might want to use a database)
    const response = NextResponse.redirect(new URL('/studio?twitter=connected', request.url));
    
    // In production, store these in a secure database
    response.cookies.set('twitter_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400 * 30, // 30 days
    });
    
    if (refreshToken) {
      response.cookies.set('twitter_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400 * 30,
      });
    }

    // Clear auth cookies
    response.cookies.delete('twitter_code_verifier');
    response.cookies.delete('twitter_state');

    return response;
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 