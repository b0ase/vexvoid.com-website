import { NextRequest, NextResponse } from 'next/server';
import { YouTubeUploader } from '../../../lib/youtubeApi';

export async function GET(request: NextRequest) {
  try {
    console.log('Environment variables check:', {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID ? 'Set' : 'Missing',
      YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET ? 'Set' : 'Missing',
      YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI || 'Not set'
    });

    const uploader = new YouTubeUploader();
    const authUrl = uploader.getAuthUrl();
    
    console.log('Generated auth URL:', authUrl);
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Auth URL generation error:', error);
    return NextResponse.json(
      { error: `Failed to generate auth URL: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }
    
    const uploader = new YouTubeUploader();
    await uploader.setCredentials(code);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Failed to exchange authorization code' },
      { status: 500 }
    );
  }
} 