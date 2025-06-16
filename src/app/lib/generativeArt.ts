// Generative Art Library for V3XV0ID
// Black and white aesthetic with organic flow patterns

export interface ArtConfig {
  width: number;
  height: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWeight: number;
  frameRate: number;
  duration: number; // in seconds
}

export const defaultConfig: ArtConfig = {
  width: 400,
  height: 400,
  backgroundColor: '#000000',
  strokeColor: '#ffffff',
  strokeWeight: 1,
  frameRate: 30,
  duration: 10
};

// Your beautiful organic flow algorithm
export const organicFlow = (canvas: HTMLCanvasElement, t: number) => {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  
  // Your algorithm translated to canvas
  const a = (x: number, y: number) => {
    const k = 5 * Math.cos(x / 14) * Math.cos(y / 30);
    const e = y / 8 - 13;
    const d = Math.sqrt(k * k + e * e) ** 2 / 59 + 4;
    const q = 60 - 3 * Math.sin(Math.atan2(k, e) * e) + k * (3 + 4 / d * Math.sin(d * d - t * 2));
    const c = d / 2 + e / 99 - t / 18;
    
    return {
      x: q * Math.sin(c) + 200,
      y: (q + d * 9) * Math.cos(c) + 200
    };
  };

  // Clear with background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, w);
  
  // Set stroke style
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.26)';
  ctx.lineWidth = 1;
  
  // Draw 10000 points
  ctx.beginPath();
  for (let i = 0; i < 10000; i++) {
    const point = a(i % 200, Math.floor(i / 43));
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();
};

// Flowing particles pattern
export const flowingParticles = (canvas: HTMLCanvasElement, t: number) => {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, w, h);
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < 200; i++) {
    const x = (i * 13 + t * 50) % w;
    const y = (Math.sin(i * 0.1 + t * 0.02) * h * 0.3 + h * 0.5);
    const size = Math.sin(i * 0.05 + t * 0.03) * 3 + 2;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }
};

// Geometric waves
export const geometricWaves = (canvas: HTMLCanvasElement, t: number) => {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  
  for (let y = 0; y < h; y += 20) {
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const wave1 = Math.sin(x * 0.01 + t * 0.02) * 30;
      const wave2 = Math.sin(x * 0.005 + y * 0.01 + t * 0.01) * 15;
      ctx.lineTo(x, y + wave1 + wave2);
    }
    ctx.stroke();
  }
};

// Spiral matrix
export const spiralMatrix = (canvas: HTMLCanvasElement, t: number) => {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const centerX = w / 2;
  const centerY = h / 2;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < 500; i++) {
    const angle = i * 0.1 + t * 0.01;
    const radius = i * 0.5;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (x >= 0 && x < w && y >= 0 && y < h) {
      ctx.beginPath();
      ctx.arc(x, y, Math.sin(i * 0.1 + t * 0.02) * 2 + 1, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
};

export const artPatterns = {
  organicFlow,
  flowingParticles,
  geometricWaves,
  spiralMatrix
};

export type ArtPatternName = keyof typeof artPatterns;

// Generate frames for video
export const generateFrames = async (
  patternName: ArtPatternName,
  config: ArtConfig = defaultConfig
): Promise<Blob[]> => {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  
  const frames: Blob[] = [];
  const totalFrames = config.duration * config.frameRate;
  const pattern = artPatterns[patternName];
  
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = (frame / config.frameRate) * Math.PI / 10; // Time parameter
    
    pattern(canvas, t);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    frames.push(blob);
  }
  
  return frames;
};

// Export the video encoder function for use in this module
export { createVideoFromFrames } from './videoEncoder'; 