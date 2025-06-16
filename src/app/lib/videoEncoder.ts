// Video Encoder using FFmpeg.wasm
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const initFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const createVideoFromFrames = async (
  frames: Blob[],
  audioBlob?: Blob,
  options: {
    fps?: number;
    width?: number;
    height?: number;
    duration?: number;
  } = {}
): Promise<Blob> => {
  const { fps = 30, width = 400, height = 400 } = options;
  
  const ffmpeg = await initFFmpeg();
  
  // Write frames to FFmpeg filesystem
  for (let i = 0; i < frames.length; i++) {
    const frameData = await fetchFile(frames[i]);
    await ffmpeg.writeFile(`frame${i.toString().padStart(4, '0')}.png`, frameData);
  }
  
  // Write audio if provided
  if (audioBlob) {
    const audioData = await fetchFile(audioBlob);
    await ffmpeg.writeFile('audio.mp3', audioData);
  }
  
  // Create video from frames
  const videoCommand = [
    '-framerate', fps.toString(),
    '-i', 'frame%04d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-s', `${width}x${height}`,
  ];
  
  // Add audio if provided
  if (audioBlob) {
    videoCommand.push('-i', 'audio.mp3', '-c:a', 'aac', '-shortest');
  }
  
  videoCommand.push('output.mp4');
  
  await ffmpeg.exec(videoCommand);
  
  // Read the output video
  const videoData = await ffmpeg.readFile('output.mp4');
  
  // Clean up files
  for (let i = 0; i < frames.length; i++) {
    await ffmpeg.deleteFile(`frame${i.toString().padStart(4, '0')}.png`);
  }
  if (audioBlob) {
    await ffmpeg.deleteFile('audio.mp3');
  }
  await ffmpeg.deleteFile('output.mp4');
  
  return new Blob([videoData], { type: 'video/mp4' });
}; 