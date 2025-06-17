import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.VEO_CLIENT_ID;
    const clientSecret = process.env.VEO_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/veo/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { 
          error: 'Veo API credentials not configured',
          details: 'Please set VEO_CLIENT_ID and VEO_CLIENT_SECRET environment variables'
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Scopes for Google Veo and related AI services
    const scopes = [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/aiplatform'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    return NextResponse.json({ 
      authUrl,
      message: 'Veo authentication URL generated (using personal account with credits)'
    });
  } catch (error) {
    console.error('Veo auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Veo auth URL' },
      { status: 500 }
    );
  }
} 