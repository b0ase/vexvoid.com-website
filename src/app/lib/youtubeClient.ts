// Client-side YouTube API interface
// This communicates with our server-side API routes

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

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

export class YouTubeClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
  }

  // Get authorization URL for OAuth flow
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/youtube/auth`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get auth URL');
    }
    
    return data.authUrl;
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/youtube/channel`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Upload video to YouTube
  async uploadVideo(
    videoBlob: Blob,
    metadata: VideoMetadata,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('video', videoBlob, 'video.mp4');
    formData.append('metadata', JSON.stringify(metadata));

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            bytesUploaded: event.loaded,
            totalBytes: event.total,
            percentage: (event.loaded / event.total) * 100
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.videoId);
        } else {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error || 'Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${this.baseUrl}/api/youtube/upload`);
      xhr.send(formData);
    });
  }

  // Get channel info
  async getChannelInfo(): Promise<ChannelInfo> {
    const response = await fetch(`${this.baseUrl}/api/youtube/channel`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get channel info');
    }
    
    return data;
  }

  // List uploaded videos
  async listVideos(maxResults: number = 10): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/youtube/videos?maxResults=${maxResults}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to list videos');
    }
    
    return data.videos;
  }

  // Handle OAuth callback
  async handleCallback(code: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/youtube/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }
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