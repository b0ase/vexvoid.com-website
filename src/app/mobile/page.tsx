'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// Import video and image data
import { videoClips } from '../lib/videos'
import { conceptArtImages } from '../lib/images'

export default function MobilePreviewPage() {
  // Video state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoStartTime, setVideoStartTime] = useState(Date.now())
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Video refs
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)

  // Concept art state
  const [backdropIndex, setBackdropIndex] = useState(0)
  const [floatingImages, setFloatingImages] = useState<any[]>([])

  // Video duration and start points
  const videoDuration = 15000 // 15 seconds per video
  const transitionDuration = 4000 // 4 second crossfade

  // Random start points for each video (0-30 seconds)
  const videoStartOffset = videoClips.map(() => Math.random() * 30)

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

  // Initialize floating concept art images
  useEffect(() => {
    if (conceptArtImages.length > 0) {
      const generateFloatingImages = () => {
        return Array.from({ length: 12 }, (_, i) => ({
          id: i,
          imageIndex: Math.floor(Math.random() * conceptArtImages.length),
          size: Math.random() * 14 + 14, // 14-28px
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.13 + 0.05, // 5-18% opacity
          blur: Math.random() * 1.5 + 0.5, // 0.5-2px blur
          rotation: Math.random() * 360,
          animationDuration: Math.random() * 2 + 4, // 4-6 seconds
          blendMode: [
            'screen', 'overlay', 'soft-light', 'multiply', 'difference',
            'color-dodge', 'luminosity', 'hard-light', 'color-burn'
          ][Math.floor(Math.random() * 9)]
        }))
      }
      setFloatingImages(generateFloatingImages())
    }
  }, [])

  // Auto-play logic when video loads
  useEffect(() => {
    if (currentVideoRef.current) {
      const video = currentVideoRef.current
      const startPoint = videoStartOffset[currentVideoIndex]
      
      console.log('Setting up video:', currentVideoIndex, 'start point:', startPoint)
      
      // Set initial properties
      video.currentTime = startPoint
      video.muted = true // Always start muted for autoplay
      video.volume = 0
      video.playbackRate = 0.6
      
      // Add mobile-specific attributes
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('playsinline', 'true')
      video.setAttribute('muted', 'true')
      video.setAttribute('autoplay', 'true')
      
      // Try multiple autoplay strategies
      const tryAutoplay = async () => {
        try {
          console.log('Attempting autoplay...')
          await video.play()
          setIsPlaying(true)
          setVideoStartTime(Date.now())
          console.log('Autoplay successful')
        } catch (error) {
          console.log('Autoplay failed, will require user interaction:', error)
          setIsPlaying(false)
          setHasUserInteracted(false)
          
          // For iOS, try a different approach
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            console.log('iOS detected, trying iOS-specific autoplay')
            video.load() // Reload the video
            setTimeout(async () => {
              try {
                video.currentTime = startPoint
                await video.play()
                setIsPlaying(true)
                setVideoStartTime(Date.now())
                console.log('iOS autoplay successful on retry')
              } catch (iosError) {
                console.log('iOS autoplay also failed:', iosError)
              }
            }, 100)
          }
        }
      }
      
      // Try autoplay immediately and after a short delay
      tryAutoplay()
      setTimeout(tryAutoplay, 500)
    }
  }, [currentVideoIndex, nextVideoIndex])

  // Global event listeners for user interaction
  useEffect(() => {
    const handleGlobalInteraction = (e: Event) => {
      if (!hasUserInteracted || !isPlaying) {
        console.log('Global interaction detected:', e.type)
        handleUserInteraction(e)
      }
    }

    // Add multiple event listeners
    document.addEventListener('click', handleGlobalInteraction)
    document.addEventListener('touchstart', handleGlobalInteraction)
    document.addEventListener('touchend', handleGlobalInteraction)
    document.addEventListener('mousedown', handleGlobalInteraction)
    document.addEventListener('pointerdown', handleGlobalInteraction)

    // iOS Safari specific: try autoplay on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasUserInteracted && !isPlaying) {
        console.log('Page became visible, trying autoplay...')
        setTimeout(() => {
          if (currentVideoRef.current) {
            currentVideoRef.current.play().catch(console.log)
          }
        }, 100)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('click', handleGlobalInteraction)
      document.removeEventListener('touchstart', handleGlobalInteraction)
      document.removeEventListener('touchend', handleGlobalInteraction)
      document.removeEventListener('mousedown', handleGlobalInteraction)
      document.removeEventListener('pointerdown', handleGlobalInteraction)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [hasUserInteracted, isPlaying, currentVideoIndex])

  // Video transition logic
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - videoStartTime
      
      if (elapsed >= videoDuration - transitionDuration && !isTransitioning) {
        // Start crossfade transition
        setIsTransitioning(true)
        
        // Start next video
        if (nextVideoRef.current) {
          nextVideoRef.current.play()
        }
        
        // Complete transition after crossfade
        setTimeout(() => {
          setCurrentVideoIndex(nextVideoIndex)
          setNextVideoIndex((nextVideoIndex + 1) % videoClips.length)
          setIsTransitioning(false)
          setVideoStartTime(Date.now())
          
          // Update concept art
          setBackdropIndex(Math.floor(Math.random() * conceptArtImages.length))
          
          // Regenerate floating images periodically
          if (Math.random() < 0.3) {
            setFloatingImages(prev => prev.map(img => ({
              ...img,
              imageIndex: Math.floor(Math.random() * conceptArtImages.length),
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: Math.random() * 0.13 + 0.05,
              rotation: Math.random() * 360,
              blendMode: [
                'screen', 'overlay', 'soft-light', 'multiply', 'difference',
                'color-dodge', 'luminosity', 'hard-light', 'color-burn'
              ][Math.floor(Math.random() * 9)]
            })))
          }
        }, transitionDuration)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [videoStartTime, isTransitioning, nextVideoIndex, videoDuration, transitionDuration])

  // Handle video ended
  const handleVideoEnded = () => {
    if (!isTransitioning) {
      setCurrentVideoIndex(nextVideoIndex)
      setNextVideoIndex((nextVideoIndex + 1) % videoClips.length)
      setVideoStartTime(Date.now())
    }
  }

  // Try to play on any user interaction
  const handleUserInteraction = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('User interaction detected:', e.type)
    
    if (!hasUserInteracted || !isPlaying) {
      console.log('Attempting to start video - hasUserInteracted:', hasUserInteracted, 'isPlaying:', isPlaying)
      
      if (currentVideoRef.current) {
        const video = currentVideoRef.current
        const startPoint = videoStartOffset[currentVideoIndex]
        
        // Force reset video properties for iOS
        video.muted = true
        video.volume = 0
        video.currentTime = startPoint
        video.playbackRate = 0.6
        
        console.log('Calling play() on video...')
        
        // Multiple retry strategy for iOS Safari
        const playVideo = async (attempt = 1) => {
          try {
            await video.play()
            setIsPlaying(true)
            setHasUserInteracted(true)
            setVideoStartTime(Date.now())
            console.log(`Video started successfully via user interaction (attempt ${attempt})`)
          } catch (error) {
            console.log(`Play failed on attempt ${attempt}:`, error)
            
            if (attempt < 5) {
              // Try different approaches on each attempt
              if (attempt === 2) {
                video.load() // Reload video
                video.currentTime = startPoint
              } else if (attempt === 3) {
                // Try without setting currentTime first
                video.currentTime = 0
              } else if (attempt === 4) {
                // Force reload from source
                video.src = currentVideo.path
                video.load()
              }
              
              setTimeout(() => playVideo(attempt + 1), 100 * attempt)
            } else {
              console.log('All play attempts failed')
            }
          }
        }
        
        playVideo()
      }
    } else {
      console.log('Video already playing and user has interacted')
    }
  }

  if (!currentVideo || conceptArtImages.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-sm">Loading VexVoid...</div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden mobile-preview-page"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onTouchEnd={handleUserInteraction}
      onMouseDown={handleUserInteraction}
      onPointerDown={handleUserInteraction}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Concept Art Backdrop */}
      {conceptArtImages[backdropIndex] && (
        <div className="absolute inset-0 z-0">
          <Image
            src={conceptArtImages[backdropIndex].path}
            alt="VexVoid Backdrop"
            fill
            className="object-cover opacity-25 blur-lg"
            priority
          />
        </div>
      )}

      {/* Video Container - Full Screen */}
      <div className="relative w-full h-full">
        {/* Current Video */}
        <video
          ref={currentVideoRef}
          key={`current-${currentVideo.filename}`}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-4000 filter brightness-[0.4] contrast-125 saturate-75 ${
            isTransitioning ? 'opacity-0 blur-md' : 'opacity-70'
          }`}
          muted={true}
          autoPlay={true}
          playsInline={true}
          webkit-playsinline="true"
          controls={false}
          preload="auto"
          onEnded={handleVideoEnded}
          style={{ mixBlendMode: 'normal' }}
        >
          <source src={currentVideo.path} type="video/mp4" />
        </video>

        {/* Next Video (for crossfade) */}
        <video
          ref={nextVideoRef}
          key={`next-${nextVideo.filename}`}
          className={`absolute inset-0 w-full h-full object-cover z-20 transition-all duration-4000 filter brightness-[0.4] contrast-125 saturate-75 ${
            isTransitioning ? 'opacity-70' : 'opacity-0'
          }`}
          muted={true}
          autoPlay={true}
          playsInline={true}
          webkit-playsinline="true"
          controls={false}
          preload="auto"
          style={{ mixBlendMode: 'normal' }}
        >
          <source src={nextVideo.path} type="video/mp4" />
        </video>
      </div>

      {/* Floating Concept Art Overlays */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {floatingImages.map((img) => (
          conceptArtImages[img.imageIndex] && (
            <div
              key={img.id}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${img.x}%`,
                top: `${img.y}%`,
                width: `${img.size}px`,
                height: `${img.size}px`,
                opacity: img.opacity,
                filter: `blur(${img.blur}px)`,
                transform: `rotate(${img.rotation}deg)`,
                mixBlendMode: img.blendMode as any,
                animationDuration: `${img.animationDuration}s`
              }}
            >
              <Image
                src={conceptArtImages[img.imageIndex].path}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          )
        ))}
      </div>

      {/* Subtle VexVoid Branding - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-40 text-white/60 text-xs font-mono">
        V3XV0ID
      </div>

      {/* Tap to Play Hint (only shows if not playing) */}
      {(!isPlaying || !hasUserInteracted) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="text-white/80 text-sm font-mono animate-pulse">
            TAP TO PLAY
          </div>
        </div>
      )}
    </div>
  )
} 