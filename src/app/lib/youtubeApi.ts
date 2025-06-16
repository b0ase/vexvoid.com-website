// YouTube API Integration
import { google } from 'googleapis';

const youtube = google.youtube('v3');

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  categoryId?: string;
  privacyStatus: 'private' | 'public' | 'unlisted';
}

export interface UploadProgress {
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
}

export class YouTubeUploader {
  private oauth2Client: any;

  constructor() {
    // Support both naming conventions
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET;
    
    // Use environment variable or fallback to localhost:3000 (current server port)
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
    
    console.log('YouTube OAuth Config:', {
      clientId: clientId ? 'Set' : 'Missing',
      clientSecret: clientSecret ? 'Set' : 'Missing',
      redirectUri
    });

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  }

  // Get authorization URL for OAuth flow
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Set access token from OAuth callback
  async setCredentials(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    // Store tokens securely (you might want to use a database)
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtube_tokens', JSON.stringify(tokens));
    }
  }

  // Load stored tokens
  loadStoredTokens(): boolean {
    if (typeof window === 'undefined') return false;
    
    const storedTokens = localStorage.getItem('youtube_tokens');
    if (storedTokens) {
      this.oauth2Client.setCredentials(JSON.parse(storedTokens));
      return true;
    }
    return false;
  }

  // Upload video to YouTube
  async uploadVideo(
    videoBlob: Blob,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    if (!this.oauth2Client.credentials) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    google.options({ auth: this.oauth2Client });

    const videoBuffer = await videoBlob.arrayBuffer();
    const videoStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(videoBuffer));
        controller.close();
      }
    });

    try {
      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId || '10', // Music category
          },
          status: {
            privacyStatus: metadata.privacyStatus,
          },
        },
        media: {
          body: videoStream,
        },
      });

      return response.data.id!;
    } catch (error) {
      console.error('YouTube upload error:', error);
      throw new Error(`Failed to upload video: ${error}`);
    }
  }

  // Get channel info
  async getChannelInfo(): Promise<any> {
    if (!this.oauth2Client.credentials) {
      throw new Error('Not authenticated');
    }

    google.options({ auth: this.oauth2Client });

    const response = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    return response.data.items?.[0];
  }

  // List uploaded videos
  async listVideos(maxResults: number = 10): Promise<any[]> {
    if (!this.oauth2Client.credentials) {
      throw new Error('Not authenticated');
    }

    google.options({ auth: this.oauth2Client });

    const response = await youtube.search.list({
      part: ['snippet'],
      forMine: true,
      type: ['video'],
      maxResults,
      order: 'date',
    });

    return response.data.items || [];
  }
}

// Utility function to generate video metadata
export const generateVideoMetadata = (
  artPattern: string,
  musicTitle: string,
  duration: number
): VideoMetadata => {
  const title = `${musicTitle} - ${artPattern} Visuals | V3XV0ID`;
  
  const description = `
🎵 Music: ${musicTitle}
🎨 Visuals: ${artPattern} generative art
⏱️ Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}

Generated using custom algorithms and procedural art techniques.
Black and white aesthetic with organic flow patterns.

#GenerativeArt #V3XV0ID #ProceduralVisuals #ElectronicMusic #VisualMusic
`.trim();

  return {
    title,
    description,
    tags: [
      'generative art',
      'procedural visuals',
      'electronic music',
      'v3xv0id',
      'visual music',
      'algorithmic art',
      artPattern.toLowerCase(),
      'black and white'
    ],
    categoryId: '10', // Music
    privacyStatus: 'public'
  };
}; 