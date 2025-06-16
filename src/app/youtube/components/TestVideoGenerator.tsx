'use client';

import { useState, useRef, useEffect } from 'react';

export default function TestVideoGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isAnimating && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw simple animation
        ctx.fillStyle = '#ffffff';
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Simple rotating dots
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + elapsed;
          const radius = 50;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="border border-white/20 p-6 bg-black/50">
      <h2 className="text-lg cyber-text mb-6">TEST VIDEO GENERATOR</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs cyber-text">ANIMATION TEST</label>
          <button
            onClick={toggleAnimation}
            className={`px-3 py-1 text-xs font-mono border transition-colors ${
              isAnimating
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-green-500 bg-green-500 text-white'
            }`}
          >
            {isAnimating ? 'STOP' : 'START'}
          </button>
        </div>
        
        <div className="border border-white/30 p-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full bg-black border border-white/10"
          />
        </div>
      </div>

      <div className="text-xs text-white/70">
        🎯 This is a simple test to verify canvas animation works.
        If you see rotating white dots, the system is working!
      </div>
    </div>
  );
} 