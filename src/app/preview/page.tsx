'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  getConceptArtImages, 
  getLandscapeImages, 
  getPortraitImages, 
  getVideoJamImages,
  getAllCloudImages 
} from '../lib/supabaseImages'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import { applyGlitchEffect, getRandomGlitchEffect, applyMultipleGlitchEffects } from '../lib/glitchEffects'
import Image from 'next/image'

// Available video clips - using Supabase cloud storage (updated list)
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/videos/vex_video_jam_01/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Train Rush'
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (2).mp4'),
    title: 'Train Rush 2'
  },
  {
    id: 'train-rush-3',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (3).mp4'),
    title: 'Train Rush 3'
  },
  {
    id: 'footsteps',
    path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'),
    title: 'Footsteps Echo'
  },
  {
    id: 'extended',
    path: getVideoUrl('Extended_Video.mp4'),
    title: 'Extended Scene'
  },
  {
    id: 'professional-1',
    path: getVideoUrl('Professional_Mode_Generated_Video.mp4'),
    title: 'Professional Mode'
  },
  {
    id: 'professional-2',
    path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'),
    title: 'Professional Mode Alt'
  },
  {
    id: 'standard-1',
    path: getVideoUrl('Standard_Mode_Generated_Video (1).mp4'),
    title: 'Standard Mode'
  }
]

// Get all images for backdrop and overlays - over 100 images total!
const conceptArtImages = getConceptArtImages()
const landscapeImages = getLandscapeImages()
const portraitImages = getPortraitImages()
const videoJamImages = getVideoJamImages()
const allImages = getAllCloudImages()

// Logo images - focus on concept art for logo corner
const logoImages = conceptArtImages.slice(0, 15)

export default function VideoPreviewPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [backdropIndex] = useState(Math.floor(Math.random() * allImages.length))
  const [isProjectionMode, setIsProjectionMode] = useState(true) // Start in projection mode (music player hidden)
  const [logoIndex, setLogoIndex] = useState(0)
  const [videoStartTime, setVideoStartTime] = useState(Date.now()) // Track when video started
  const [currentAlgorithmIndex, setCurrentAlgorithmIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [p5Time, setP5Time] = useState(0)
  const [videoStartOffset] = useState(() => 
    // Random start points for each video (10-60 seconds in)
    videoClips.map(() => Math.random() * 50 + 10)
  )
  const [floatingElements] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      image: allImages[Math.floor(Math.random() * allImages.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 20, // 12px to 32px
      opacity: 0.05 + Math.random() * 0.15, // 5% to 20%
      rotation: Math.random() * 360,
      speed: 0.1 + Math.random() * 0.3, // Slow movement
      direction: Math.random() * Math.PI * 2
    }))
  )
  
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const p5CanvasRef = useRef<HTMLCanvasElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

  // Auto-start and setup videos
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = 0.2 // Keep video audio very low
      currentVideoRef.current.playbackRate = 0.4 // Much slower video playback
      
      // Set random start point for variety
      const startPoint = videoStartOffset[currentVideoIndex]
      currentVideoRef.current.currentTime = startPoint
      
      currentVideoRef.current.play().then(() => {
        setIsPlaying(true)
        setVideoStartTime(Date.now()) // Reset timer when video starts playing
      }).catch(() => {
        console.log('Autoplay blocked - click to play')
      })
    }
    
    // Preload next video with its start point
    if (nextVideoRef.current) {
      nextVideoRef.current.volume = 0.2
      nextVideoRef.current.playbackRate = 0.4 // Much slower video playback
      const nextStartPoint = videoStartOffset[nextVideoIndex]
      nextVideoRef.current.currentTime = nextStartPoint
      nextVideoRef.current.load()
    }
  }, [currentVideoIndex])

  // Cycle overlay images every 12 seconds (much slower)
  useEffect(() => {
    const overlayInterval = setInterval(() => {
      setCurrentOverlayIndex(prev => (prev + 1) % allImages.length)
    }, 12000)
    
    return () => clearInterval(overlayInterval)
  }, [])

  // Cycle logo corner every 8 seconds (slower)
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setLogoIndex(prev => (prev + 1) % logoImages.length)
    }, 8000)
    
    return () => clearInterval(logoInterval)
  }, [])

  // P5.js Animation System
  useEffect(() => {
    const p5Interval = setInterval(() => {
      setP5Time(prev => prev + 0.02) // Slow time progression
    }, 50)
    
    return () => clearInterval(p5Interval)
  }, [])

  // Cycle through generative algorithms every 15 seconds
  useEffect(() => {
    const algorithmInterval = setInterval(() => {
      setCurrentAlgorithmIndex(prev => (prev + 1) % generativeAlgorithms.length)
      
      // Trigger glitch effect during algorithm transitions
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 1000)
    }, 15000)
    
    return () => clearInterval(algorithmInterval)
  }, [])

  // Random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200 + Math.random() * 800)
      }
    }, 5000)
    
    return () => clearInterval(glitchInterval)
  }, [])

  // Animate floating elements
  useEffect(() => {
    const animationInterval = setInterval(() => {
      floatingElements.forEach(element => {
        element.x += Math.cos(element.direction) * element.speed * 0.3 // Much slower movement
        element.y += Math.sin(element.direction) * element.speed * 0.3
        
        // Wrap around screen
        if (element.x > 100) element.x = -5
        if (element.x < -5) element.x = 100
        if (element.y > 100) element.y = -5
        if (element.y < -5) element.y = 100
        
        // Very rarely change direction
        if (Math.random() < 0.005) {
          element.direction = Math.random() * Math.PI * 2
        }
      })
    }, 500) // Much slower animation updates
    
    return () => clearInterval(animationInterval)
  }, [])

  // P5.js Canvas Rendering
  useEffect(() => {
    const canvas = p5CanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match video container
    canvas.width = 400
    canvas.height = 300

    const algorithm = generativeAlgorithms[currentAlgorithmIndex]
    const renderP5 = () => {
      // Clear with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Apply advanced glitch effects
      if (isGlitching) {
        applyMultipleGlitchEffects(ctx, canvas.width, canvas.height, p5Time, 2)
      }

      // Render generative algorithm
      ctx.strokeStyle = `rgba(255, 255, 255, ${isGlitching ? 0.8 : 0.3})`
      ctx.lineWidth = isGlitching ? 2 : 0.5
      
      // Simplified implementation of the spiral wave pattern
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = 0.5
      
      ctx.beginPath()
      for (let i = 0; i < 2000; i++) {
        const x = i % 200
        const y = Math.floor(i / 43)
        
        // Simplified version of the algorithm
        const k = 4 * Math.cos(x / 29)
        const e = y / 8 - 13
        const d = Math.sqrt(k * k + e * e)
        const q = 3 * Math.sin(k * 2) + 0.3 / (k + 0.1) + Math.sin(y / 25) * k * (9 + 4 * Math.sin(e * 9 - d * 3 + p5Time * 2))
        const c = d - p5Time
        
        const px = (q + 30 * Math.cos(c)) * scale + centerX
        const py = (q * Math.sin(c) + d * 39 - 220) * scale + centerY
        
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
        
        // Add glitch artifacts
        if (isGlitching && Math.random() < 0.01) {
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(px + Math.random() * 20 - 10, py + Math.random() * 20 - 10)
        }
      }
      ctx.stroke()
      
      requestAnimationFrame(renderP5)
    }

    renderP5()
  }, [currentAlgorithmIndex, isGlitching, p5Time])

  // Handle video ended with crossfade to next
  const handleVideoEnded = () => {
    if (isTransitioning) return
    
    // Ensure minimum viewing time of 30 seconds (at 0.4x speed = 12 seconds real time)
    const minViewingTime = 30000 // 30 seconds
    const timeElapsed = Date.now() - videoStartTime
    
    if (timeElapsed < minViewingTime) {
      // Restart the current video if minimum time hasn't passed
      if (currentVideoRef.current) {
        currentVideoRef.current.currentTime = 0
        currentVideoRef.current.play()
      }
      return
    }
    
    setIsTransitioning(true)
    const nextIndex = (currentVideoIndex + 1) % videoClips.length
    const nextNextIndex = (nextIndex + 1) % videoClips.length
    
    // Trigger glitch effect during video transition
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), 2000)
    
    // Start next video and fade
    if (nextVideoRef.current) {
      nextVideoRef.current.playbackRate = 0.4 // Ensure very slow playback
      nextVideoRef.current.currentTime = videoStartOffset[nextIndex] // Set random start point
      nextVideoRef.current.play()
    }
    
    // Update indices after fade
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex)
      setNextVideoIndex(nextNextIndex)
      setIsTransitioning(false)
      setProgress(0)
      setVideoStartTime(Date.now()) // Reset timer for new video
    }, 8000) // Much longer 8 second crossfade
  }

  // Play/pause handler
  const handlePlayPause = () => {
    if (!currentVideoRef.current) return

    if (isPlaying) {
      currentVideoRef.current.pause()
      if (nextVideoRef.current) nextVideoRef.current.pause()
      setIsPlaying(false)
    } else {
      currentVideoRef.current.play().then(() => {
        setIsPlaying(true)
      })
    }
  }

  // Track progress
  const handleTimeUpdate = () => {
    if (currentVideoRef.current) {
      const progress = (currentVideoRef.current.currentTime / currentVideoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  // Handle projection mode - hide music player
  useEffect(() => {
    if (isProjectionMode) {
      document.body.classList.add('projection-mode')
    } else {
      document.body.classList.remove('projection-mode')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('projection-mode')
    }
  }, [isProjectionMode])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Centered Video Container - Smaller for Higher Resolution Feel */}
      <div className="relative w-[85vw] h-[85vh] overflow-hidden rounded-lg border border-white/10">
        {/* Concept Art Backdrop - Always Visible Behind Videos */}
        <div className="absolute inset-0 z-0">
          <Image
            src={allImages[backdropIndex]?.url || conceptArtImages[0]?.url}
            alt="VexVoid Backdrop"
            fill
            className="object-cover opacity-25 blur-lg"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Video Layer 1 - Current Video (Slowed & Dark) */}
        <video
          ref={currentVideoRef}
          key={`current-${currentVideo.id}`}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-8000 filter brightness-[0.4] contrast-125 saturate-75 ${
            isTransitioning ? 'opacity-0 blur-md' : 'opacity-70'
          } ${isGlitching ? 'hue-rotate-180 saturate-200' : ''}`}
          muted={false}
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
          onClick={handlePlayPause}
          style={{ 
            mixBlendMode: 'normal',
            transform: isGlitching ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : 'none'
          }}
        >
          <source src={currentVideo.path} type="video/mp4" />
        </video>

        {/* Video Layer 2 - Next Video (for crossfading, also slowed & dark) */}
        <video
          ref={nextVideoRef}
          key={`next-${nextVideo.id}`}
          className={`absolute inset-0 w-full h-full object-cover z-20 transition-all duration-8000 filter brightness-[0.4] contrast-125 saturate-75 ${
            isTransitioning ? 'opacity-70 blur-md' : 'opacity-0'
          } ${isGlitching ? 'hue-rotate-90 saturate-150' : ''}`}
          muted={false}
          onClick={handlePlayPause}
          style={{ 
            mixBlendMode: 'normal',
            transform: isGlitching ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : 'none'
          }}
        >
          <source src={nextVideo.path} type="video/mp4" />
        </video>

        {/* Fragmented Video Overlays - Cut-up Effect */}
        <div className="absolute inset-0 z-15 pointer-events-none">
          {/* Top Fragment */}
          <div className="absolute top-0 right-0 w-1/3 h-1/4 overflow-hidden opacity-20">
            <video
              className="w-full h-full object-cover filter brightness-[0.2] blur-[2px]"
              muted
              autoPlay
              loop
              style={{ transform: 'scale(1.5) rotate(2deg)', mixBlendMode: 'screen' }}
            >
              <source src={currentVideo.path} type="video/mp4" />
            </video>
          </div>
          
          {/* Bottom Left Fragment */}
          <div className="absolute bottom-10 left-0 w-1/4 h-1/3 overflow-hidden opacity-15">
            <video
              className="w-full h-full object-cover filter brightness-[0.25] blur-[1px]"
              muted
              autoPlay
              loop
              style={{ transform: 'scale(1.8) rotate(-3deg)', mixBlendMode: 'overlay' }}
            >
              <source src={nextVideo.path} type="video/mp4" />
            </video>
          </div>
          
          {/* Center Right Fragment */}
          <div className="absolute top-1/2 right-8 w-1/5 h-1/4 overflow-hidden opacity-10 transform -translate-y-1/2">
            <video
              className="w-full h-full object-cover filter brightness-[0.15] blur-[3px]"
              muted
              autoPlay
              loop
              style={{ transform: 'scale(2) rotate(5deg)', mixBlendMode: 'soft-light' }}
            >
              <source src={currentVideo.path} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Dynamic Floating Art Elements - All Image Types, Moving Slowly */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Large Background Layer - Much Dimmer */}
          <div className="absolute inset-0 opacity-5 transition-opacity duration-5000">
            <Image
              src={allImages[(currentOverlayIndex + 4) % allImages.length].url}
              alt="Art Background"
              fill
              className="object-cover blur-[4px] mix-blend-soft-light"
            />
          </div>
          
          {/* Logo Corner - Top Right, Cycling Through Concept Art */}
          <div className="absolute top-4 right-4 w-32 h-32 opacity-20 transition-all duration-4000 transform rotate-2 z-40">
            <Image
              src={logoImages[logoIndex].url}
              alt="VexVoid Logo"
              fill
              className="object-cover rounded-xl blur-[0.5px] mix-blend-screen border border-white/10"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-xl" />
          </div>
          
          {/* Dynamic Floating Elements - Different Sizes, Moving Around */}
          {floatingElements.map((element, index) => {
            const blendModes = ['screen', 'overlay', 'soft-light', 'multiply', 'difference', 'color-dodge', 'luminosity', 'hard-light', 'color-burn']
            const blendMode = blendModes[index % blendModes.length]
            
            return (
              <div
                key={element.id}
                className="absolute transition-all duration-1000 ease-linear"
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: `${element.size}px`,
                  height: `${element.size}px`,
                  opacity: element.opacity,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: 30 + (index % 5)
                }}
              >
                <Image
                  src={element.image.url}
                  alt="Floating Art"
                  fill
                  className={`object-cover rounded-lg blur-[0.5px]`}
                  style={{ mixBlendMode: blendMode as any }}
                />
              </div>
            )
          })}
          
          {/* Static Corner Elements for Depth */}
          <div className="absolute top-8 left-8 w-24 h-24 opacity-15 transition-all duration-4000 transform rotate-2">
            <Image
              src={landscapeImages[currentOverlayIndex % landscapeImages.length].url}
              alt="Landscape Art"
              fill
              className="object-cover rounded-lg blur-[0.5px] mix-blend-screen"
            />
          </div>
          
          <div className="absolute bottom-12 left-12 w-28 h-28 opacity-18 transition-all duration-4000 transform rotate-1">
            <Image
              src={portraitImages[currentOverlayIndex % portraitImages.length].url}
              alt="Portrait Art"
              fill
              className="object-cover rounded-xl blur-[0.5px] mix-blend-soft-light"
            />
          </div>
          
          <div className="absolute bottom-8 right-8 w-20 h-20 opacity-12 transition-all duration-4000 transform -rotate-3">
            <Image
              src={videoJamImages[currentOverlayIndex % videoJamImages.length].url}
              alt="Video Jam Art"
              fill
              className="object-cover rounded-lg blur-[1px] mix-blend-overlay"
            />
          </div>
        </div>

        {/* P5.js Generative Animation Overlay */}
        <canvas
          ref={p5CanvasRef}
          className={`absolute inset-0 w-full h-full object-cover z-25 pointer-events-none transition-opacity duration-1000 ${
            isGlitching ? 'opacity-80' : 'opacity-40'
          }`}
          style={{ 
            mixBlendMode: isGlitching ? 'difference' : 'screen',
            transform: isGlitching ? `scale(${1 + Math.random() * 0.1})` : 'scale(1)'
          }}
        />
      </div>
      
      {/* Control Buttons - Outside Video Frame, Bottom Left */}
      <div className="absolute bottom-8 left-8 z-50 flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="bg-black hover:bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg transition-all duration-200 border border-white/20"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        {/* Projection Mode Button */}
        <button
          onClick={() => setIsProjectionMode(!isProjectionMode)}
          className="bg-black hover:bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg transition-all duration-200 border border-white/20"
          title={isProjectionMode ? 'Exit Projection Mode' : 'Enter Projection Mode'}
        >
          📽️
        </button>
      </div>
    </div>
  )
} 