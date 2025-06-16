'use client';

import { useEffect, useRef, useState } from 'react';
import { organicFlow, artPatterns, type ArtPatternName } from '../../lib/generativeArt';

interface OrganicFlowDemoProps {
  pattern?: ArtPatternName;
  width?: number;
  height?: number;
}

export default function OrganicFlowDemo({ 
  pattern = 'organicFlow', 
  width = 400, 
  height = 400 
}: OrganicFlowDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPattern, setCurrentPattern] = useState<ArtPatternName>(pattern);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = width;
    canvas.height = height;
    
    let startTime = Date.now();
    
    const animate = () => {
      if (!isPlaying) return;
      
      const t = (Date.now() - startTime) * 0.001; // Convert to seconds
      const selectedPattern = artPatterns[currentPattern];
      selectedPattern(canvas, t);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentPattern, width, height]);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const resetAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4 p-4 border border-white/20 bg-black/50">
      <div className="text-white text-sm font-mono">
        LIVE PREVIEW: {currentPattern.toUpperCase()}
      </div>
      
      <canvas
        ref={canvasRef}
        className="border border-white/30"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={togglePlayback}
          className="px-3 py-1 text-xs font-mono border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        
        <button
          onClick={resetAnimation}
          className="px-3 py-1 text-xs font-mono border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          RESET
        </button>
      </div>
      
      <div className="flex flex-wrap gap-1 justify-center">
        {Object.keys(artPatterns).map((patternName) => (
          <button
            key={patternName}
            onClick={() => setCurrentPattern(patternName as ArtPatternName)}
            className={`px-2 py-1 text-xs font-mono border transition-colors ${
              currentPattern === patternName
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            {patternName.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="text-white/60 text-xs font-mono text-center max-w-md">
        Real-time generative art preview. This shows what the video frames will look like.
      </div>
    </div>
  );
} 