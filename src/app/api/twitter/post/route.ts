import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { text, mediaPath, mediaType, scheduledTime } = await request.json();
    
    const accessToken = request.cookies.get('twitter_access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated with Twitter' }, { status: 401 });
    }

    const client = new TwitterApi(accessToken);

    let mediaId;
    if (mediaPath) {
      try {
        const fullPath = path.join(process.cwd(), 'public', mediaPath);
        const mediaBuffer = fs.readFileSync(fullPath);
        
        // Upload media based on type
        if (mediaType === 'video') {
          mediaId = await client.v1.uploadMedia(mediaBuffer, { 
            mimeType: 'video/mp4',
            additionalOwners: [],
          });
        } else if (mediaType === 'image') {
          mediaId = await client.v1.uploadMedia(mediaBuffer, { 
            mimeType: 'image/jpeg',
          });
        }
      } catch (mediaError) {
        console.error('Media upload error:', mediaError);
        // Continue without media if upload fails
      }
    }

    // Craft V3XV0ID style tweet
    const vexVoidText = `${text}

🌆 #VexVoid #UndergroundVibes #NinjaJazz #DigitalArt #V3XV0ID
🎵 Echoes in the digital abyss...
`;

    const tweetOptions: any = {
      text: vexVoidText.slice(0, 280), // Twitter character limit
    };

    if (mediaId) {
      tweetOptions.media = { media_ids: [mediaId] };
    }

    const tweet = await client.v2.tweet(tweetOptions);

    return NextResponse.json({
      success: true,
      tweetId: tweet.data.id,
      text: tweet.data.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Twitter post error:', error);
    return NextResponse.json(
      { error: 'Failed to post to Twitter' },
      { status: 500 }
    );
  }
}

// Auto-post generated content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    
    const accessToken = request.cookies.get('twitter_access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let content;
    let mediaPath;
    let mediaType;

    switch (type) {
      case 'video':
        // Get latest generated video
        const videoDir = path.join(process.cwd(), 'public', 'generated');
        const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4'));
        if (videoFiles.length > 0) {
          const latestVideo = videoFiles[videoFiles.length - 1];
          mediaPath = `generated/${latestVideo}`;
          mediaType = 'video';
          content = `🎬 New V3XV0ID visual experience dropped!
          
Urban decay meets digital dreams in this cinematic journey through the underground...`;
        }
        break;
        
      case 'concept':
        // Get random concept art
        const conceptDirs = ['VexVoid_concept_art', 'VexVoid_concept_art_2', 'VexVoid_concept_art_3'];
        const randomDir = conceptDirs[Math.floor(Math.random() * conceptDirs.length)];
        const conceptPath = path.join(process.cwd(), 'public', 'images', randomDir);
        
        if (fs.existsSync(conceptPath)) {
          const conceptFiles = fs.readdirSync(conceptPath).filter(f => f.endsWith('.jpg'));
          if (conceptFiles.length > 0) {
            const randomConcept = conceptFiles[Math.floor(Math.random() * conceptFiles.length)];
            mediaPath = `images/${randomDir}/${randomConcept}`;
            mediaType = 'image';
            content = `🎨 V3XV0ID concept art from the digital underground...
            
Exploring the aesthetic of urban decay and neon dreams`;
          }
        }
        break;
        
      default:
        content = `🌃 The digital underground never sleeps...
        
V3XV0ID continues to evolve in the spaces between reality and virtuality.
        
#CyberPunk #DigitalArt #UndergroundCulture`;
    }

    if (!content) {
      return NextResponse.json({ error: 'No content to post' }, { status: 400 });
    }

    // Use the POST handler
    const postRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({
        text: content,
        mediaPath,
        mediaType
      })
    });

    return POST(postRequest);

  } catch (error) {
    console.error('Auto-post error:', error);
    return NextResponse.json({ error: 'Auto-post failed' }, { status: 500 });
  }
} 