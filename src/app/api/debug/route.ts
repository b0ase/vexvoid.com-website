import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set (length: ' + process.env.GOOGLE_CLIENT_ID.length + ')' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set (length: ' + process.env.GOOGLE_CLIENT_SECRET.length + ')' : 'Missing',
      YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI || 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString()
  });
} 