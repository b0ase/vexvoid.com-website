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

  // Auto-start and setup videos
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = 0 // Completely muted
      currentVideoRef.current.playbackRate = 0.6 // Slower playback for mobile
      
      // Mobile-specific attributes
      currentVideoRef.current.setAttribute('playsinline', 'true')
      currentVideoRef.current.setAttribute('webkit-playsinline', 'true')
      currentVideoRef.current.muted = true
      
      // Set random start point
      const startPoint = videoStartOffset[currentVideoIndex]
      currentVideoRef.current.currentTime = startPoint
      
      // Try auto-play video
      currentVideoRef.current.play().then(() => {
        setIsPlaying(true)
        setHasUserInteracted(true)
        setVideoStartTime(Date.now())
        console.log('Autoplay successful')
      }).catch((error) => {
        console.log('Autoplay blocked - waiting for user interaction:', error)
        setIsPlaying(false)
        setHasUserInteracted(false)
      })
    }
    
    // Preload next video
    if (nextVideoRef.current) {
      nextVideoRef.current.volume = 0
      nextVideoRef.current.playbackRate = 0.6
      nextVideoRef.current.setAttribute('playsinline', 'true')
      nextVideoRef.current.setAttribute('webkit-playsinline', 'true')
      nextVideoRef.current.muted = true
      const nextStartPoint = videoStartOffset[nextVideoIndex]
      nextVideoRef.current.currentTime = nextStartPoint
    }
  }, [currentVideoIndex, nextVideoIndex])

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
  const handleUserInteraction = () => {
    if (!hasUserInteracted || !isPlaying) {
      if (currentVideoRef.current) {
        // Reset video time to ensure it starts from the right point
        const startPoint = videoStartOffset[currentVideoIndex]
        currentVideoRef.current.currentTime = startPoint
        
        currentVideoRef.current.play().then(() => {
          setIsPlaying(true)
          setHasUserInteracted(true)
          setVideoStartTime(Date.now())
          console.log('Video started via user interaction')
        }).catch((error) => {
          console.log('Play failed even with user interaction:', error)
          // Try again after a short delay
          setTimeout(() => {
            if (currentVideoRef.current) {
              currentVideoRef.current.play().then(() => {
                setIsPlaying(true)
                setHasUserInteracted(true)
                setVideoStartTime(Date.now())
              }).catch(console.log)
            }
          }, 100)
        })
      }
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
          playsInline={true}
          webkit-playsinline="true"
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
          playsInline={true}
          webkit-playsinline="true"
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