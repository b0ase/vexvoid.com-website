'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { conceptArtImages, landscapeImages, portraitImages } from '../lib/images'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import { applyGlitchEffect, getRandomGlitchEffect, applyMultipleGlitchEffects } from '../lib/glitchEffects'

// Convert local image arrays to match the expected format
const getConceptArtImages = () => conceptArtImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getLandscapeImages = () => landscapeImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getPortraitImages = () => portraitImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getAllCloudImages = () => [...getConceptArtImages(), ...getLandscapeImages(), ...getPortraitImages()]

export default function EllaPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get all images for the experience
  const [allImages] = useState(() => getAllCloudImages())
  const [conceptImages] = useState(() => getConceptArtImages())
  const [displayImages] = useState(() => {
    const combined = [...getAllCloudImages()]
    return combined.slice(0, 20) // Limit for performance
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
      setIsLoaded(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Image cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [displayImages.length])

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const currentImage = displayImages[currentImageIndex]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/music/Shadows of the Mind Alt 2.mp3" type="audio/mpeg" />
      </audio>

      {/* Dynamic Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Main rotating background */}
        {displayImages.slice(0, 6).map((img, idx) => (
          <div
            key={`bg-${img.url}`}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              idx === (currentImageIndex % 6) ? 'opacity-30' : 'opacity-10'
            }`}
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px) scale(1.1)`
            }}
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover filter grayscale blur-lg"
              priority={idx === 0}
            />
          </div>
        ))}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/20" />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {conceptImages.slice(0, 8).map((img, idx) => (
          <div
            key={`float-${img.url}`}
            className="absolute opacity-20 transition-all duration-3000"
            style={{
              left: `${15 + (idx % 4) * 20}%`,
              top: `${10 + (idx % 3) * 25}%`,
              width: `${60 + (idx % 3) * 20}px`,
              height: `${60 + (idx % 3) * 20}px`,
              transform: `
                translate(${(mousePosition.x - 50) * (0.05 + idx * 0.01)}px, ${(mousePosition.y - 50) * (0.05 + idx * 0.01)}px) 
                rotate(${(Date.now() / 100 + idx * 45) % 360}deg)
              `,
              animationDelay: `${idx * 0.5}s`
            }}
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover rounded-lg filter grayscale border border-white/10"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-20 min-h-screen flex flex-col transition-all duration-1500 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header */}
        <header className="p-8 flex justify-between items-start">
          <div className="space-y-2">
                         <h1 className="text-4xl md:text-6xl font-light tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200">
               ella
             </h1>
            <p className="text-sm text-gray-400 font-mono">
              v3xv0id visual experience
            </p>
          </div>
          
          <button
            onClick={togglePlay}
            className="group bg-white/5 border border-white/20 rounded-full px-6 py-3 text-sm font-mono 
                     hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-md"
          >
            <span className="text-cyan-400">{isPlaying ? '⏸' : '▶'}</span>
            <span className="ml-2 text-gray-300 group-hover:text-white">
              {isPlaying ? 'PAUSE' : 'PLAY'} AUDIO
            </span>
          </button>
        </header>

        {/* Central Gallery */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative max-w-4xl w-full">
            
            {/* Main Image Display */}
            <div className="relative aspect-video bg-black/50 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm">
              {currentImage && (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage.url}
                    alt="V3XV0ID Visual"
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
                    priority
                  />
                  
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Image info */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xs font-mono opacity-70 mb-1">
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                    <div className="text-sm font-light">
                      V3XV0ID VISUAL #{String(currentImageIndex + 1).padStart(3, '0')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center mt-8 space-x-1">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 transition-all duration-500 ${
                    idx === currentImageIndex 
                      ? 'w-8 bg-white' 
                      : idx === (currentImageIndex + 1) % displayImages.length
                      ? 'w-4 bg-gray-500'
                      : 'w-2 bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div className="space-y-1">
              <div className="text-2xl font-light text-cyan-400">{allImages.length}</div>
              <div className="text-xs font-mono text-gray-500">TOTAL VISUALS</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-light text-purple-400">{conceptImages.length}</div>
              <div className="text-xs font-mono text-gray-500">CONCEPT ART</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-light text-white">
                {Math.floor((currentImageIndex / displayImages.length) * 100)}%
              </div>
              <div className="text-xs font-mono text-gray-500">PROGRESS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-500/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-500/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30 rounded-br-lg" />
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
} 