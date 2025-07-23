'use client'

import { useState, useEffect, useRef } from 'react'
import { conceptArtImages, landscapeImages, portraitImages } from '../lib/images'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import { applyGlitchEffect, getRandomGlitchEffect, applyMultipleGlitchEffects } from '../lib/glitchEffects'
import Image from 'next/image'
import SocialLinks from './SocialLinks'
import { videoClips } from '../lib/videos'

// Convert local image arrays to match the expected format
const getConceptArtImages = () => conceptArtImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getLandscapeImages = () => landscapeImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getPortraitImages = () => portraitImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))

// Using centralized video management from videos.ts

export default function VideoHero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Use first few video clips for hero rotation
  const heroVideos = videoClips.slice(0, 6)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      // Move to next video when current one ends
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length)
    }

    const handleVideoLoad = () => {
      setIsLoading(false)
    }

    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('loadeddata', handleVideoLoad)

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('loadeddata', handleVideoLoad)
    }
  }, [heroVideos.length])

  useEffect(() => {
    // Preload next video
    if (videoRef.current) {
      videoRef.current.src = heroVideos[currentVideoIndex]?.path || ''
      videoRef.current.load()
    }
  }, [currentVideoIndex, heroVideos])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4)' }}
      >
        <source src={heroVideos[currentVideoIndex]?.path} type="video/mp4" />
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading V3XV0ID...</div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            V3XV0ID
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200">
            Digital Art • Music • Visual Experiences
          </p>

          <div className="space-y-6">
            <div className="text-lg text-gray-300">
              Immersive cyberpunk aesthetics meet generative art
            </div>
            
            {/* Video Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {heroVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentVideoIndex
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Current Video Info */}
            <div className="text-sm text-gray-400 mt-4">
              {heroVideos[currentVideoIndex]?.filename?.replace('.mp4', '').replace(/_/g, ' ') || 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
    </div>
  )
} 