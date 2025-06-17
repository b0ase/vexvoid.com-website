import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET || !process.env.TWITTER_CALLBACK_URL) {
      console.error('Missing Twitter environment variables');
      return NextResponse.json({ 
        error: 'Twitter API credentials not configured' 
      }, { status: 500 });
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL,
      { 
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] 
      }
    );

    // Store codeVerifier in session/database for callback
    const response = NextResponse.redirect(url);
    response.cookies.set('twitter_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600, // 10 minutes
    });
    response.cookies.set('twitter_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600,
    });

    return response;
  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.json({ error: 'Failed to initiate Twitter auth' }, { status: 500 });
  }
} 