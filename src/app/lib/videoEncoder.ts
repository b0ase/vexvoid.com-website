// Video Encoder using FFmpeg.wasm
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
    // Wait for existing initialization
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpeg) return ffmpeg;
  }
  
  isInitializing = true;
  onProgress?.('Initializing FFmpeg...');
  
  try {
    ffmpeg = new FFmpeg();
    
    // Add logging for debugging
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg:', message);
    });
    
    ffmpeg.on('progress', ({ progress, time }) => {
      console.log('FFmpeg progress:', progress, time);
    });
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    onProgress?.('Loading FFmpeg core...');
    
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    onProgress?.('FFmpeg initialized successfully');
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    ffmpeg = null;
    throw new Error(`Failed to initialize FFmpeg: ${error}`);
  } finally {
    isInitializing = false;
  }
};

export const createVideoFromFrames = async (
  frames: Blob[],
  audioBlob?: Blob,
  options: VideoEncodingOptions = {}
): Promise<Blob> => {
  const { 
    fps = 30, 
    width = 800, 
    height = 600, 
    quality = 'medium',
    onProgress 
  } = options;
  
  if (frames.length === 0) {
    throw new Error('No frames provided for video creation');
  }
  
  onProgress?.(0);
  const ffmpeg = await initFFmpeg((msg) => console.log(msg));
  
  try {
    onProgress?.(10);
    
    // Write frames to FFmpeg filesystem
    for (let i = 0; i < frames.length; i++) {
      const frameData = await fetchFile(frames[i]);
      const filename = `frame${i.toString().padStart(4, '0')}.png`;
      await ffmpeg.writeFile(filename, frameData);
      
      // Update progress for frame writing (10-40%)
      const frameProgress = 10 + (i / frames.length) * 30;
      onProgress?.(frameProgress);
    }
    
    onProgress?.(40);
    
    // Write audio if provided
    if (audioBlob) {
      const audioData = await fetchFile(audioBlob);
      await ffmpeg.writeFile('audio.mp3', audioData);
    }
    
    onProgress?.(50);
    
    // Quality settings
    const qualitySettings = {
      low: { crf: '28', preset: 'fast' },
      medium: { crf: '23', preset: 'medium' },
      high: { crf: '18', preset: 'slow' }
    };
    
    const { crf, preset } = qualitySettings[quality];
    
    // Create video from frames
    const videoCommand = [
      '-framerate', fps.toString(),
      '-i', 'frame%04d.png',
      '-c:v', 'libx264',
      '-preset', preset,
      '-crf', crf,
      '-pix_fmt', 'yuv420p',
      '-s', `${width}x${height}`,
    ];
    
    // Add audio if provided
    if (audioBlob) {
      videoCommand.push(
        '-i', 'audio.mp3', 
        '-c:a', 'aac', 
        '-b:a', '128k',
        '-shortest'
      );
    } else {
      // Add silent audio track for better compatibility
      videoCommand.push(
        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-c:a', 'aac',
        '-t', (frames.length / fps).toString()
      );
    }
    
    videoCommand.push('-y', 'output.mp4'); // -y to overwrite output file
    
    onProgress?.(60);
    
    console.log('Executing FFmpeg command:', videoCommand.join(' '));
    await ffmpeg.exec(videoCommand);
    
    onProgress?.(90);
    
    // Read the output video
    const videoData = await ffmpeg.readFile('output.mp4');
    
    onProgress?.(95);
    
    // Clean up files
    for (let i = 0; i < frames.length; i++) {
      const filename = `frame${i.toString().padStart(4, '0')}.png`;
      try {
        await ffmpeg.deleteFile(filename);
      } catch (e) {
        console.warn(`Failed to delete ${filename}:`, e);
      }
    }
    
    if (audioBlob) {
      try {
        await ffmpeg.deleteFile('audio.mp3');
      } catch (e) {
        console.warn('Failed to delete audio.mp3:', e);
      }
    }
    
    try {
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      console.warn('Failed to delete output.mp4:', e);
    }
    
    onProgress?.(100);
    
    return new Blob([videoData], { type: 'video/mp4' });
    
  } catch (error) {
    console.error('Video creation failed:', error);
    throw new Error(`Video encoding failed: ${error}`);
  }
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