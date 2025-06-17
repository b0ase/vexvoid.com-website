// Video Encoder using FFmpeg.wasm with improved error handling
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isInitializing = false;

export interface VideoEncodingOptions {
  fps?: number;
  width?: number;
  height?: number;
  duration?: number;
  quality?: 'low' | 'medium' | 'high';
  onProgress?: (progress: number) => void;
}

export const initFFmpeg = async (onProgress?: (message: string) => void): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;
  
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpeg) return ffmpeg;
  }
  
  isInitializing = true;
  
  try {
    onProgress?.('Starting FFmpeg initialization...');
    
    ffmpeg = new FFmpeg();
    
    // Enhanced logging
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg:', message);
      onProgress?.(message);
    });

    ffmpeg.on('progress', ({ progress, time }) => {
      console.log('FFmpeg progress:', progress, time);
      onProgress?.(progress > 0 ? `Processing: ${Math.round(progress * 100)}%` : 'Processing...');
    });

    // Use a more reliable CDN for FFmpeg core files
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    onProgress?.('Loading FFmpeg core files...');
    
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    onProgress?.('FFmpeg ready! 🎬');
    isInitializing = false;
    return ffmpeg;
    
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    ffmpeg = null;
    isInitializing = false;
    throw new Error(`Failed to initialize FFmpeg: ${error}`);
  }
};

export const createVideoFromFrames = async (
  frames: Blob[],
  audioBlob?: Blob,
  options: VideoEncodingOptions = {}
): Promise<Blob> => {
  const { 
    fps = 30, 
    width = 1920, 
    height = 1080, 
    quality = 'medium',
    onProgress 
  } = options;
  
  if (frames.length === 0) {
    throw new Error('No frames provided for video creation');
  }
  
  onProgress?.(0);
  const ffmpeg = await initFFmpeg((msg) => console.log(msg));
  
  try {
    onProgress?.(5);
    
    // Clean up any existing files first
    try {
      const files = await ffmpeg.listDir('/');
      for (const file of files) {
        if (file.name.endsWith('.png') || file.name.endsWith('.mp3') || file.name.endsWith('.mp4')) {
          await ffmpeg.deleteFile(file.name);
        }
      }
    } catch (e) {
      // Ignore cleanup errors
      console.log('Cleanup skipped:', e);
    }
    
    onProgress?.(10);
    
    // Write frames with better error handling
    const frameFiles: string[] = [];
    for (let i = 0; i < frames.length; i++) {
      try {
        const frameData = await fetchFile(frames[i]);
        const filename = `frame${i.toString().padStart(4, '0')}.png`;
        await ffmpeg.writeFile(filename, frameData);
        frameFiles.push(filename);
        
        // Update progress for frame writing (10-40%)
        const frameProgress = 10 + (i / frames.length) * 30;
        onProgress?.(frameProgress);
      } catch (error) {
        console.error(`Failed to write frame ${i}:`, error);
        throw new Error(`Failed to process frame ${i}: ${error}`);
      }
    }
    
    onProgress?.(40);
    
    // Write audio if provided
    let audioFile: string | null = null;
    if (audioBlob) {
      try {
        const audioData = await fetchFile(audioBlob);
        audioFile = 'audio.mp3';
        await ffmpeg.writeFile(audioFile, audioData);
        onProgress?.(45);
      } catch (error) {
        console.warn('Failed to load audio, continuing without:', error);
        audioFile = null;
      }
    }
    
    onProgress?.(50);
    
    // Quality settings - more conservative for browser
    const qualitySettings = {
      low: { crf: '30', preset: 'ultrafast' },
      medium: { crf: '26', preset: 'fast' },
      high: { crf: '22', preset: 'medium' }
    };
    
    const { crf, preset } = qualitySettings[quality];
    
    // Build FFmpeg command with error handling
    const videoCommand = [
      '-framerate', fps.toString(),
      '-i', 'frame%04d.png',
      '-c:v', 'libx264',
      '-preset', preset,
      '-crf', crf,
      '-pix_fmt', 'yuv420p',
      '-s', `${width}x${height}`,
      '-avoid_negative_ts', 'make_zero',  // Handle timestamp issues
    ];
    
    // Add audio or silent track
    if (audioFile) {
      videoCommand.push(
        '-i', audioFile, 
        '-c:a', 'aac', 
        '-b:a', '128k',
        '-shortest'
      );
    } else {
      // Create silent audio for better compatibility
      const silentDuration = frames.length / fps;
      videoCommand.push(
        '-f', 'lavfi',
        '-i', `anullsrc=channel_layout=stereo:sample_rate=44100`,
        '-c:a', 'aac',
        '-t', silentDuration.toString()
      );
    }
    
    videoCommand.push('-y', 'output.mp4'); // Overwrite output
    
    onProgress?.(60);
    
    console.log('Executing FFmpeg command:', videoCommand.join(' '));
    
    // Execute with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Video encoding timeout')), 60000); // 60 second timeout
    });
    
    const encodingPromise = ffmpeg.exec(videoCommand);
    await Promise.race([encodingPromise, timeoutPromise]);
    
    onProgress?.(90);
    
    // Read the output video
    let videoData: Uint8Array;
    try {
      videoData = await ffmpeg.readFile('output.mp4') as Uint8Array;
    } catch (error) {
      throw new Error(`Failed to read output video: ${error}`);
    }
    
    onProgress?.(95);
    
    // Clean up files
    for (const filename of frameFiles) {
      try {
        await ffmpeg.deleteFile(filename);
      } catch (e) {
        console.warn(`Failed to delete ${filename}:`, e);
      }
    }
    
    if (audioFile) {
      try {
        await ffmpeg.deleteFile(audioFile);
      } catch (e) {
        console.warn(`Failed to delete ${audioFile}:`, e);
      }
    }
    
    try {
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      console.warn('Failed to delete output.mp4:', e);
    }
    
    onProgress?.(100);
    
    if (!videoData || videoData.length === 0) {
      throw new Error('Generated video is empty');
    }
    
    return new Blob([videoData], { type: 'video/mp4' });
    
  } catch (error) {
    console.error('Video creation failed:', error);
    throw new Error(`Video encoding failed: ${error}`);
  }
};

// Fallback simple video creator for when FFmpeg fails
export const createSimpleSlideshow = async (
  images: string[],
  audioUrl?: string,
  duration: number = 30
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas-based slideshow as fallback
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      
      canvas.width = 1920;
      canvas.height = 1080;
      
      // This is a placeholder for a simpler approach
      // In practice, you'd use MediaRecorder API or similar
      const frames: ImageData[] = [];
      
      // For now, throw error to show user the issue
      throw new Error('FFmpeg.wasm failed - consider using server-side encoding');
      
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to create a test video
export const createTestVideo = async (
  duration: number = 5,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  
  const frames: Blob[] = [];
  const fps = 30;
  const totalFrames = duration * fps;
  
  // Generate simple test frames
  for (let i = 0; i < totalFrames; i++) {
    const t = i / fps;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw simple animation
    ctx.fillStyle = '#ffffff';
    const x = 200 + Math.cos(t * 2) * 100;
    const y = 200 + Math.sin(t * 2) * 100;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    frames.push(blob);
  }
  
  return createVideoFromFrames(frames, undefined, {
    fps,
    width: 400,
    height: 400,
    onProgress
  });
}; 