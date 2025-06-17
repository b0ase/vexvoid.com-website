import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const hasClientId = !!process.env.TWITTER_CLIENT_ID;
  const hasClientSecret = !!process.env.TWITTER_CLIENT_SECRET;
  const hasCallbackUrl = !!process.env.TWITTER_CALLBACK_URL;
  
  return NextResponse.json({
    status: 'Twitter API Test',
    credentials: {
      TWITTER_CLIENT_ID: hasClientId ? '✅ Set' : '❌ Missing',
      TWITTER_CLIENT_SECRET: hasClientSecret ? '✅ Set' : '❌ Missing',
      TWITTER_CALLBACK_URL: hasCallbackUrl ? '✅ Set' : '❌ Missing',
      callbackUrl: process.env.TWITTER_CALLBACK_URL || 'Not set'
    },
    allConfigured: hasClientId && hasClientSecret && hasCallbackUrl
  });
} 