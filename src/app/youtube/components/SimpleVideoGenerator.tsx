'use client';

import { useState, useRef, useEffect } from 'react';
import { musicTracks, getRandomTrack, getRecommendedArtPattern, type MusicTrack } from '../../lib/musicLibrary';

interface SimpleVideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void;
}

export default function SimpleVideoGenerator({ onVideoGenerated }: SimpleVideoGeneratorProps) {
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string>('organicFlow');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);

  // Auto-select random track on mount
  useEffect(() => {
    const randomTrack = getRandomTrack();
    setSelectedTrack(randomTrack);
    const pattern = getRecommendedArtPattern(randomTrack);
    setSelectedPattern(pattern);
  }, []);

  // Initialize canvas when pattern changes
  useEffect(() => {
    if (canvasRef.current && selectedPattern) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // High DPI canvas setup
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = 800;
      const displayHeight = 600;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false; // Keep it crisp/pixelated
      
      generateArtFrame(canvas, 0, selectedPattern);
    }
  }, [selectedPattern]);

  // Live preview animation
  useEffect(() => {
    if (isPreviewRunning && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure high DPI is maintained during animation
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = 800;
      const displayHeight = 600;
      
      if (canvas.width !== displayWidth * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;
      }

      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (canvasRef.current) {
          generateArtFrame(canvasRef.current, elapsed, selectedPattern);
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
  }, [isPreviewRunning, selectedPattern]);

  const togglePreview = () => {
    setIsPreviewRunning(!isPreviewRunning);
  };

  const handleTrackChange = (trackId: string) => {
    const track = musicTracks.find(t => t.id === trackId);
    if (track) {
      setSelectedTrack(track);
      setSelectedPattern(getRecommendedArtPattern(track));
    }
  };

  // Simplified art generation function
  const generateArtFrame = (canvas: HTMLCanvasElement, time: number, pattern: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use display dimensions for calculations (not actual canvas dimensions)
    const displayWidth = 800;
    const displayHeight = 600;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;

    switch (pattern) {
      case 'organicFlow':
        // Fixed organic flow algorithm based on your original
        for (let i = 0; i < 2000; i++) {
          const x = i % 200;
          const y = i / 43;
          
          // Calculate distance and effects
          const k = 5 * Math.cos(x / 14) * Math.cos(y / 30);
          const e = y / 8 - 13;
          const d = Math.sqrt(k * k + e * e) / 59 + 4;
          
          // Calculate position with time animation
          const q = 60 - 3 * Math.sin(Math.atan2(k, e) * e) + k * (3 + 4 / d * Math.sin(d * d - time * 2));
          const c = d / 2 + e / 99 - time / 18;
          
          // Final coordinates
          const finalX = q * Math.sin(c) + centerX;
          const finalY = (q + d * 9) * Math.cos(c) + centerY;
          
          // Draw point if within bounds
          if (finalX >= 0 && finalX < displayWidth && finalY >= 0 && finalY < displayHeight) {
            ctx.fillRect(Math.floor(finalX), Math.floor(finalY), 1, 1);
          }
        }
        break;

      case 'flowingParticles':
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 300; i++) {
          const angle = (i / 300) * Math.PI * 2 + time * 0.5;
          const radius = 30 + Math.sin(time * 2 + i * 0.1) * 80;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            ctx.beginPath();
            ctx.arc(x, y, 1 + Math.sin(time + i * 0.1), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;

      case 'geometricWaves':
        ctx.fillStyle = '#ffffff';
        for (let x = 0; x < displayWidth; x += 8) {
          const y1 = centerY + Math.sin(x * 0.02 + time) * 80;
          const y2 = centerY + Math.sin(x * 0.015 + time * 1.5) * 60;
          const y3 = centerY + Math.sin(x * 0.025 + time * 0.7) * 40;
          
          ctx.fillRect(x, y1, 2, 2);
          ctx.fillRect(x, y2, 1, 1);
          ctx.fillRect(x, y3, 1, 1);
        }
        break;

      case 'spiralMatrix':
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 150; i++) {
          const angle = i * 0.2 + time;
          const radius = i * 1.5;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            const size = 1 + Math.sin(time + i * 0.1) * 2;
            ctx.fillRect(x - size/2, y - size/2, size, size);
          }
        }
        break;

      case 'quantumField':
        // NEURAL NETWORK SYNAPSES - Brain-like intelligence emerging
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        
                 // Create neural nodes with memory
         const neurons: Array<{
           x: number;
           y: number;
           activity: number;
           connections: Array<{target: number; strength: number; firing: boolean}>;
         }> = [];
         const neuronCount = 60;
         for (let i = 0; i < neuronCount; i++) {
           const angle = (i / neuronCount) * Math.PI * 2 * 2.618; // Golden ratio spiral
           const radius = Math.sqrt(i) * 25 + Math.sin(time * 0.3 + i) * 40;
           neurons.push({
             x: centerX + Math.cos(angle + time * 0.1) * radius,
             y: centerY + Math.sin(angle + time * 0.08) * radius,
             activity: Math.sin(time * 4 + i * 0.7) * 0.5 + 0.5,
             connections: []
           });
         }
        
        // Calculate neural connections and firing patterns
        for (let i = 0; i < neurons.length; i++) {
          for (let j = i + 1; j < neurons.length; j++) {
            const dx = neurons[j].x - neurons[i].x;
            const dy = neurons[j].y - neurons[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
              const synapse = {
                target: j,
                strength: (120 - dist) / 120,
                firing: Math.sin(time * 6 + i * 0.3 + j * 0.8) > 0.3
              };
              neurons[i].connections.push(synapse);
            }
          }
        }
        
        // Draw synaptic connections with electrical pulses
        for (let i = 0; i < neurons.length; i++) {
          const neuron = neurons[i];
          for (const synapse of neuron.connections) {
            const target = neurons[synapse.target];
            
            if (synapse.firing && neuron.activity > 0.4 && target.activity > 0.4) {
              // Electrical pulse traveling along synapse
              const pulseProgress = (Math.sin(time * 8 + i * 0.5) + 1) / 2;
              const pulseX = neuron.x + (target.x - neuron.x) * pulseProgress;
              const pulseY = neuron.y + (target.y - neuron.y) * pulseProgress;
              
              // Draw connection
              ctx.globalAlpha = synapse.strength * 0.6;
              ctx.lineWidth = synapse.strength * 3;
              ctx.beginPath();
              ctx.moveTo(neuron.x, neuron.y);
              ctx.lineTo(target.x, target.y);
              ctx.stroke();
              
              // Draw traveling pulse
              ctx.globalAlpha = 1;
              const pulseSize = 4 + synapse.strength * 6;
              ctx.fillRect(pulseX - pulseSize/2, pulseY - pulseSize/2, pulseSize, pulseSize);
            }
          }
        }
        
        // Draw neural nodes with activity-based sizing
        ctx.globalAlpha = 1;
        for (const neuron of neurons) {
          if (neuron.x >= 0 && neuron.x < displayWidth && neuron.y >= 0 && neuron.y < displayHeight) {
            const size = 3 + neuron.activity * 8;
            ctx.fillRect(neuron.x - size/2, neuron.y - size/2, size, size);
            
            // Neural glow effect
            if (neuron.activity > 0.7) {
              ctx.globalAlpha = 0.3;
              const glowSize = size * 4;
              ctx.fillRect(neuron.x - glowSize/2, neuron.y - glowSize/2, glowSize, glowSize);
              ctx.globalAlpha = 1;
            }
          }
        }
        break;

      case 'fractalStorm':
        // PLASMA STORM - Electromagnetic chaos with particle physics
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        
        // Create electromagnetic field sources
        const fieldSources = [];
        const sourceCount = 12;
        for (let i = 0; i < sourceCount; i++) {
          const angle = (i / sourceCount) * Math.PI * 2 + time * 0.3;
          const radius = 100 + Math.sin(time * 0.7 + i * 1.3) * 80;
          fieldSources.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            charge: Math.sin(time * 2 + i * 0.8) > 0 ? 1 : -1,
            intensity: 0.5 + Math.abs(Math.sin(time * 1.5 + i)) * 0.5
          });
        }
        
        // Generate plasma arcs between charged sources
        for (let i = 0; i < fieldSources.length; i++) {
          const source = fieldSources[i];
          
          // Find nearby opposite charges for arc formation
          for (let j = i + 1; j < fieldSources.length; j++) {
            const target = fieldSources[j];
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Arc probability based on distance and charge difference
            if (dist < 200 && source.charge !== target.charge) {
              const arcStrength = (200 - dist) / 200 * source.intensity * target.intensity;
              
              if (Math.sin(time * 4 + i * 0.7 + j * 1.1) > (1 - arcStrength)) {
                // Draw main plasma arc with electromagnetic distortion
                const segments = 20;
                ctx.globalAlpha = arcStrength;
                ctx.lineWidth = 1 + arcStrength * 4;
                
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                
                for (let s = 1; s <= segments; s++) {
                  const progress = s / segments;
                  
                  // Base arc path
                  let arcX = source.x + dx * progress;
                  let arcY = source.y + dy * progress;
                  
                  // Electromagnetic field distortion
                  const fieldDistortion = Math.sin(progress * Math.PI * 6 + time * 8) * 
                                        Math.sin(time * 3 + i + j) * 15;
                  const perpX = -dy / dist;
                  const perpY = dx / dist;
                  
                  arcX += perpX * fieldDistortion;
                  arcY += perpY * fieldDistortion;
                  
                  // Quantum fluctuations
                  arcX += (Math.random() - 0.5) * 8 * arcStrength;
                  arcY += (Math.random() - 0.5) * 8 * arcStrength;
                  
                  if (s === 1) {
                    ctx.moveTo(arcX, arcY);
                  } else {
                    ctx.lineTo(arcX, arcY);
                  }
                  
                  // Particle emission at high energy points
                  if (Math.abs(fieldDistortion) > 10 && Math.random() < 0.3) {
                    const particleAngle = Math.random() * Math.PI * 2;
                    const particleSpeed = 5 + Math.random() * 15;
                    const particleX = arcX + Math.cos(particleAngle) * particleSpeed;
                    const particleY = arcY + Math.sin(particleAngle) * particleSpeed;
                    
                    ctx.globalAlpha = arcStrength * 0.8;
                    const particleSize = 1 + Math.random() * 3;
                    ctx.fillRect(particleX - particleSize/2, particleY - particleSize/2, 
                               particleSize, particleSize);
                  }
                }
                
                ctx.stroke();
                
                // Secondary arc branches
                if (arcStrength > 0.6) {
                  const branchCount = Math.floor(arcStrength * 5);
                  for (let b = 0; b < branchCount; b++) {
                    const branchStart = 0.2 + Math.random() * 0.6;
                    const branchX = source.x + dx * branchStart;
                    const branchY = source.y + dy * branchStart;
                    
                    const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
                    const branchLength = 20 + Math.random() * 40;
                    const branchEndX = branchX + Math.cos(branchAngle) * branchLength;
                    const branchEndY = branchY + Math.sin(branchAngle) * branchLength;
                    
                    ctx.globalAlpha = arcStrength * 0.4;
                    ctx.lineWidth = 1 + arcStrength * 2;
                    ctx.beginPath();
                    ctx.moveTo(branchX, branchY);
                    ctx.lineTo(branchEndX, branchEndY);
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
        
        // Draw electromagnetic field sources with corona effects
        ctx.globalAlpha = 1;
        for (const source of fieldSources) {
          if (source.x >= 0 && source.x < displayWidth && source.y >= 0 && source.y < displayHeight) {
            const coreSize = 3 + source.intensity * 5;
            const coronaSize = coreSize * 3;
            
            // Corona glow
            ctx.globalAlpha = 0.3 * source.intensity;
            ctx.fillRect(source.x - coronaSize/2, source.y - coronaSize/2, coronaSize, coronaSize);
            
            // Core charge
            ctx.globalAlpha = 1;
            ctx.fillRect(source.x - coreSize/2, source.y - coreSize/2, coreSize, coreSize);
            
            // Charge indicator (different patterns for +/-)
            if (source.charge > 0) {
              // Positive charge - cross pattern
              ctx.fillRect(source.x - 8, source.y - 1, 16, 2);
              ctx.fillRect(source.x - 1, source.y - 8, 2, 16);
            } else {
              // Negative charge - horizontal line
              ctx.fillRect(source.x - 8, source.y - 1, 16, 2);
            }
          }
        }
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        break;

      case 'voidDance':
        // DIGITAL DNA HELIX - Life's code unraveling in space
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        
        const helixHeight = displayHeight * 0.8;
        const helixRadius = 80;
        const basePairs = 40;
        const helixSpeed = time * 0.8;
        
        // Draw the double helix structure
        for (let i = 0; i < basePairs; i++) {
          const progress = i / basePairs;
          const y = displayHeight * 0.1 + progress * helixHeight;
          const angle1 = progress * Math.PI * 8 + helixSpeed;
          const angle2 = angle1 + Math.PI;
          
          // First strand
          const x1 = centerX + Math.cos(angle1) * helixRadius;
          const z1 = Math.sin(angle1) * helixRadius;
          
          // Second strand  
          const x2 = centerX + Math.cos(angle2) * helixRadius;
          const z2 = Math.sin(angle2) * helixRadius;
          
          // Depth-based sizing and alpha
          const depth1 = (z1 + helixRadius) / (helixRadius * 2);
          const depth2 = (z2 + helixRadius) / (helixRadius * 2);
          
          // Draw base pairs (connecting rungs)
          if (i % 3 === 0) {
            ctx.globalAlpha = Math.min(depth1, depth2) * 0.8;
            ctx.lineWidth = 2 + Math.min(depth1, depth2) * 3;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            
            // Add genetic markers (A, T, G, C representation)
            const markerType = i % 4;
            const markerSize = 3 + Math.min(depth1, depth2) * 4;
            const markerX = (x1 + x2) / 2;
            
            ctx.globalAlpha = 1;
            switch(markerType) {
              case 0: // Adenine
                ctx.fillRect(markerX - markerSize, y - markerSize/2, markerSize * 2, markerSize);
                break;
              case 1: // Thymine  
                ctx.fillRect(markerX - markerSize/2, y - markerSize, markerSize, markerSize * 2);
                break;
              case 2: // Guanine
                ctx.fillRect(markerX - markerSize, y - markerSize, markerSize * 2, markerSize * 2);
                break;
              case 3: // Cytosine
                const radius = markerSize;
                for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                  const px = markerX + Math.cos(angle) * radius;
                  const py = y + Math.sin(angle) * radius;
                  ctx.fillRect(px - 1, py - 1, 2, 2);
                }
                break;
            }
          }
          
          // Draw strand nodes with depth
          ctx.globalAlpha = depth1;
          const size1 = 2 + depth1 * 6;
          if (x1 >= 0 && x1 < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(x1 - size1/2, y - size1/2, size1, size1);
          }
          
          ctx.globalAlpha = depth2;
          const size2 = 2 + depth2 * 6;
          if (x2 >= 0 && x2 < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(x2 - size2/2, y - size2/2, size2, size2);
          }
          
          // Connect to next strand segment
          if (i < basePairs - 1) {
            const nextY = displayHeight * 0.1 + ((i + 1) / basePairs) * helixHeight;
            const nextAngle1 = ((i + 1) / basePairs) * Math.PI * 8 + helixSpeed;
            const nextAngle2 = nextAngle1 + Math.PI;
            const nextX1 = centerX + Math.cos(nextAngle1) * helixRadius;
            const nextX2 = centerX + Math.cos(nextAngle2) * helixRadius;
            
            // Strand connections
            ctx.globalAlpha = depth1 * 0.6;
            ctx.lineWidth = 1 + depth1 * 2;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(nextX1, nextY);
            ctx.stroke();
            
            ctx.globalAlpha = depth2 * 0.6;
            ctx.lineWidth = 1 + depth2 * 2;
            ctx.beginPath();
            ctx.moveTo(x2, y);
            ctx.lineTo(nextX2, nextY);
            ctx.stroke();
          }
        }
        
        ctx.globalAlpha = 1;
        break;

      case 'cosmicWeb':
        // COSMIC WEB - Dark matter structure of the universe
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        
        // Create nodes (galaxies)
        const nodes = [];
        const nodeCount = 25;
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2 * 3.7; // Prime-like distribution
          const radius = 50 + (i % 7) * 40 + Math.sin(time * 0.5 + i) * 30;
          nodes.push({
            x: centerX + Math.cos(angle + time * 0.2) * radius,
            y: centerY + Math.sin(angle + time * 0.15) * radius,
            mass: 1 + Math.sin(time + i) * 0.5
          });
        }
        
        // Draw cosmic web connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Connect nearby nodes with varying strength
            if (dist < 150) {
              const strength = 1 - (dist / 150);
              const webFlow = Math.sin(time * 2 + i * 0.3 + j * 0.7) * 0.3 + 0.7;
              
              ctx.globalAlpha = strength * webFlow * 0.4;
              ctx.lineWidth = strength * 2;
              
              // Curved cosmic filaments
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              
              const midX = (nodes[i].x + nodes[j].x) / 2 + Math.sin(time + i + j) * 20;
              const midY = (nodes[i].y + nodes[j].y) / 2 + Math.cos(time * 1.3 + i + j) * 20;
              
              ctx.quadraticCurveTo(midX, midY, nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        
        // Draw galaxy nodes
        ctx.globalAlpha = 1;
        for (const node of nodes) {
          if (node.x >= 0 && node.x < displayWidth && node.y >= 0 && node.y < displayHeight) {
            const pulse = 1 + Math.sin(time * 3 + node.x * 0.01) * 0.3;
            const size = node.mass * 4 * pulse;
            
            ctx.fillRect(node.x - size/2, node.y - size/2, size, size);
            
            // Halo effect
            ctx.globalAlpha = 0.2;
            const haloSize = size * 3;
            ctx.fillRect(node.x - haloSize/2, node.y - haloSize/2, haloSize, haloSize);
            ctx.globalAlpha = 1;
          }
        }
        break;

      case 'matrixRain':
        // PURE MATHEMATICAL FLOW - Inspired by your legendary algorithm
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 8000; i++) {
          const x = i % 180;
          const y = i / 120;
          
          const k = (4 + Math.sin(y * 2 - time) * 3) * Math.cos(x / 29);
          const e = y / 8 - 13;
          const d = Math.sqrt(k * k + e * e);
          
          const q = 3 * Math.sin(k * 2) + 0.3 / (k + 0.1) + Math.sin(y / 25) * k * (9 + 4 * Math.sin(e * 9 - d * 3 + time * 2));
          const c = d - time;
          
          const finalX = q + 30 * Math.cos(c) + centerX;
          const finalY = q * Math.sin(c) + d * 39 - 220 + centerY;
          
          if (finalX >= 0 && finalX < displayWidth && finalY >= 0 && finalY < displayHeight) {
            ctx.fillRect(Math.floor(finalX), Math.floor(finalY), 1, 1);
          }
        }
        break;

      case 'blackHole':
        // MATHEMATICAL VORTEX - Pure equation-driven flow
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 6000; i++) {
          const angle = i * 0.1 + time * 2;
          const radius = Math.sqrt(i) * 3;
          
          const spiral = Math.sin(radius * 0.05 - time * 3) * 20;
          const wave = Math.cos(angle * 3 + time) * Math.sin(radius * 0.02) * 15;
          
          const x = centerX + Math.cos(angle) * (radius + spiral) + wave;
          const y = centerY + Math.sin(angle) * (radius + spiral) + Math.sin(angle * 2 + time) * 10;
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
          }
        }
        break;

      case 'crystalGrowth':
        // HARMONIC RESONANCE - Mathematical wave interference
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5000; i++) {
          const x = (i % 200) * 4;
          const y = Math.floor(i / 200) * 8;
          
          const wave1 = Math.sin(x * 0.03 + time * 2) * Math.cos(y * 0.02 + time);
          const wave2 = Math.cos(x * 0.02 - time * 1.5) * Math.sin(y * 0.04 - time * 0.8);
          const interference = wave1 * wave2;
          
          const amplitude = Math.abs(interference) * 40;
          const phase = Math.atan2(wave2, wave1) + time;
          
          const finalX = x + Math.cos(phase) * amplitude;
          const finalY = y + Math.sin(phase) * amplitude;
          
          if (finalX >= 0 && finalX < displayWidth && finalY >= 0 && finalY < displayHeight) {
            ctx.fillRect(Math.floor(finalX), Math.floor(finalY), 1, 1);
          }
        }
        break;

      case 'plasmaTunnel':
        // FIBONACCI SPIRAL - Nature's perfect mathematical sequence
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 4000; i++) {
          const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
          const angle = i * 2.4 + time; // Fibonacci angle approximation
          const radius = Math.sqrt(i) * 6;
          
          const modulation = Math.sin(i * 0.1 + time * 2) * Math.cos(radius * 0.02 - time);
          const spiral_x = Math.cos(angle) * (radius + modulation * 15);
          const spiral_y = Math.sin(angle) * (radius + modulation * 15);
          
          const x = centerX + spiral_x;
          const y = centerY + spiral_y;
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
          }
        }
        break;

      case 'goldenSpiral':
        // FIBONACCI SPIRAL - Nature's perfect mathematical sequence
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 4000; i++) {
          const angle = i * 2.4 + time; // Fibonacci angle approximation
          const radius = Math.sqrt(i) * 6;
          
          const modulation = Math.sin(i * 0.1 + time * 2) * Math.cos(radius * 0.02 - time);
          const spiral_x = Math.cos(angle) * (radius + modulation * 15);
          const spiral_y = Math.sin(angle) * (radius + modulation * 15);
          
          const x = centerX + spiral_x;
          const y = centerY + spiral_y;
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
          }
        }
        break;
        
      default:
        // Fallback pattern - simple dots
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
          const x = centerX + Math.cos(time + i * 0.5) * (50 + i * 2);
          const y = centerY + Math.sin(time + i * 0.5) * (50 + i * 2);
          
          if (x >= 0 && x < displayWidth && y >= 0 && y < displayHeight) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
        break;
    }
  };

  const generateVideo = async () => {
    if (!selectedTrack || !canvasRef.current) return;

    setIsGenerating(true);
    setProgress(0);
    setStatus('Initializing canvas...');

    try {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 600;

      setStatus('Generating art frames...');
      setProgress(20);

      // Generate frames (simplified - just create a few frames for demo)
      const frames: string[] = [];
      const frameCount = 30; // 1 second at 30fps for demo
      
      for (let i = 0; i < frameCount; i++) {
        const time = i / 30; // time in seconds
        generateArtFrame(canvas, time, selectedPattern);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        frames.push(dataUrl);
        
        setProgress(20 + (i / frameCount) * 60);
        setStatus(`Generating frame ${i + 1}/${frameCount}...`);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setProgress(80);
      setStatus('Creating video file...');

      // For now, let's create a simple "video" by creating a zip of frames
      // In a real implementation, you'd use FFmpeg here
      const videoData = {
        title: `${selectedTrack.title} - ${selectedPattern} Visuals`,
        frames: frames.length,
        pattern: selectedPattern,
        track: selectedTrack.title,
        timestamp: new Date().toISOString()
      };

      // Create a blob with video metadata
      const blob = new Blob([JSON.stringify(videoData, null, 2)], { 
        type: 'application/json' 
      });
      const videoUrl = URL.createObjectURL(blob);
      
      setGeneratedVideoUrl(videoUrl);
      setProgress(100);
      setStatus('Video generated successfully!');

      if (onVideoGenerated) {
        onVideoGenerated(`${selectedTrack.id}-${selectedPattern}-${Date.now()}`);
      }

    } catch (error) {
      console.error('Video generation error:', error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (generatedVideoUrl && selectedTrack) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `${selectedTrack.title}-${selectedPattern}-V3XV0ID.json`;
      link.click();
    }
  };

  return (
    <div className="border border-white/20 p-6 bg-black/50">
      <h2 className="text-lg cyber-text mb-6">SIMPLE VIDEO GENERATOR</h2>
      
      {/* Track Selection */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">SELECT MUSIC TRACK</label>
        <select
          value={selectedTrack?.id || ''}
          onChange={(e) => handleTrackChange(e.target.value)}
          className="w-full bg-black border border-white/30 text-white text-xs p-2 font-mono"
        >
          {musicTracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title} ({track.mood})
            </option>
          ))}
        </select>
      </div>

      {/* Pattern Selection */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">ART PATTERN</label>
        <div className="grid grid-cols-4 gap-2">
          {['organicFlow', 'flowingParticles', 'geometricWaves', 'spiralMatrix', 'quantumField', 'fractalStorm', 'voidDance', 'cosmicWeb', 'matrixRain', 'blackHole', 'crystalGrowth', 'goldenSpiral'].map((pattern) => (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern)}
              className={`p-2 text-xs font-mono border transition-colors ${
                selectedPattern === pattern
                  ? 'border-white bg-white text-black'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {pattern.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs cyber-text">LIVE PREVIEW</label>
          <button
            onClick={togglePreview}
            className={`px-2 py-1 text-xs font-mono border transition-colors ${
              isPreviewRunning
                ? 'border-red-500 bg-red-500 text-white'
                : 'border-green-500 bg-green-500 text-white'
            }`}
          >
            {isPreviewRunning ? 'STOP' : 'START'}
          </button>
        </div>
        <div className="border border-white/30 p-2">
          <canvas
            ref={canvasRef}
            className="w-full bg-black"
            style={{ 
              imageRendering: 'pixelated',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mb-6">
          <div className="text-xs cyber-text mb-2">{status}</div>
          <div className="w-full bg-white/20 h-2">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-white/70 mt-1">{progress.toFixed(0)}%</div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateVideo}
        disabled={isGenerating || !selectedTrack}
        className={`w-full py-3 px-4 text-sm font-mono transition-colors mb-4 ${
          !isGenerating && selectedTrack
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isGenerating ? 'GENERATING...' : 'GENERATE VIDEO'}
      </button>

      {/* Download Button */}
      {generatedVideoUrl && (
        <button
          onClick={downloadVideo}
          className="w-full bg-green-600 text-white py-2 px-4 text-sm font-mono hover:bg-green-700 transition-colors"
        >
          DOWNLOAD VIDEO DATA
        </button>
      )}

      {/* Info */}
      <div className="mt-4 p-3 border border-blue-500/50 bg-blue-500/10">
        <div className="text-xs text-blue-400">
          📹 This is a simplified generator that creates video metadata and frame data.
          For full MP4 generation, we'd need to integrate FFmpeg properly.
        </div>
      </div>
    </div>
  );
} 