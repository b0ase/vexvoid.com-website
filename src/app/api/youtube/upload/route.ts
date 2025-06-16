import { NextRequest, NextResponse } from 'next/server';
import { YouTubeUploader, generateVideoMetadata } from '../../../lib/youtubeApi';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const artPattern = formData.get('artPattern') as string;
    const musicTitle = formData.get('musicTitle') as string;
    const duration = parseInt(formData.get('duration') as string);
    
    if (!videoFile || !artPattern || !musicTitle || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const uploader = new YouTubeUploader();
    
    // Load stored tokens
    if (!uploader.loadStoredTokens()) {
      return NextResponse.json(
        { error: 'Not authenticated. Please authenticate first.' },
        { status: 401 }
      );
    }
    
    // Generate metadata
    const metadata = generateVideoMetadata(artPattern, musicTitle, duration);
    
    // Convert File to Blob
    const videoBlob = new Blob([await videoFile.arrayBuffer()], { 
      type: videoFile.type 
    });
    
    // Upload to YouTube
    const videoId = await uploader.uploadVideo(videoBlob, metadata);
    
    return NextResponse.json({ 
      success: true, 
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`
    });
    
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error}` },
      { status: 500 }
    );
  }
} 