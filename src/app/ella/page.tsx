'use client'

import { useState, useEffect, useRef } from 'react'
import { conceptArtImages, landscapeImages, portraitImages, streetArtImages } from '../lib/images'

export default function EllaPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Curated selection - best images from all categories (fixed order for SSR)
  const [curatedImages, setCuratedImages] = useState([
    ...conceptArtImages.slice(0, 8),
    ...landscapeImages.slice(0, 6), 
    ...portraitImages.slice(0, 4),
    ...streetArtImages.slice(0, 6)
  ])

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Shuffle images after component mounts to avoid hydration mismatch
  useEffect(() => {
    setCuratedImages(prev => [...prev].sort(() => Math.random() - 0.5))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % curatedImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [curatedImages.length])

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

  const isPortraitImage = (imagePath: string) => {
    return portraitImages.some(img => img.path === imagePath)
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white overflow-hidden">
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/music/Shadows of the Mind Alt 2.mp3" type="audio/mpeg" />
      </audio>

      <div className={`transition-all duration-2000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-screen bg-black overflow-hidden">
          {/* Background ambient images - half opacity */}
          <div className="absolute inset-0">
            {curatedImages.slice(0, 6).map((img, idx) => (
              <div
                key={`bg-${img.path}`}
                className={`absolute inset-0 transition-opacity duration-4000 ${
                  idx === (currentImageIndex % 6) ? 'opacity-50' : 'opacity-20'
                }`}
              >
                <img
                  src={img.path}
                  alt=""
                  className="w-full h-full object-cover filter grayscale blur-sm scale-110"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Central video frame */}
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
            <div className="relative w-full max-w-5xl aspect-video bg-black border border-gray-600 shadow-2xl overflow-hidden">
              {/* Frame border effect */}
              <div className="absolute inset-0 border-2 border-gray-400 opacity-30"></div>
              
              {/* Optimized collage of images inside frame */}
              <div className="relative w-full h-full">
                {/* Main image layer */}
                <div className="absolute inset-0 z-30">
                  {curatedImages.map((img, idx) => {
                    const isActive = idx === currentImageIndex
                    const isPortrait = isPortraitImage(img.path)
                    
                    return (
                      <div
                        key={`main-${img.path}`}
                        className={`absolute inset-0 transition-opacity duration-1500 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {isPortrait ? (
                          <div className="relative w-full h-full">
                            <div 
                              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110 opacity-40"
                              style={{ backgroundImage: `url(${img.path})` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                              <img
                                src={img.path}
                                alt="Visual art"
                                className="max-h-full max-w-full object-contain filter grayscale"
                              />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={img.path}
                            alt="Visual art"
                            className="w-full h-full object-cover filter grayscale"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Blending overlay layers - only 3 for performance */}
                {curatedImages.slice(0, 3).map((img, idx) => {
                  const layerOpacity = idx === (currentImageIndex % 3) ? 0.3 : 0.1
                  
                  return (
                    <div
                      key={`blend-${img.path}`}
                      className="absolute inset-0 transition-opacity duration-2000"
                      style={{
                        opacity: layerOpacity,
                        mixBlendMode: idx === 0 ? 'overlay' : idx === 1 ? 'soft-light' : 'multiply',
                        zIndex: 20 - idx,
                        transform: `scale(${1.02 + (idx * 0.01)}) rotate(${idx - 1}deg)`
                      }}
                    >
                      <img
                        src={img.path}
                        alt=""
                        className="w-full h-full object-cover filter grayscale"
                      />
                    </div>
                  )
                })}
                
                {/* Frame inner shadow */}
                <div className="absolute inset-0 shadow-inner-strong pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 z-30 flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl cyber-text font-light tracking-wider">
                  v3xv0id
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  digital artistry
                </p>
              </div>
              
              <div className="text-right">
                <button
                  onClick={togglePlay}
                  className="cyber-button-minimal px-4 py-2 text-sm"
                >
                  {isPlaying ? '⏸' : '▶'} shadows of the mind alt 2
                </button>
              </div>
            </div>

            <div className="flex justify-center items-end">
              <div className="flex space-x-2">
                {curatedImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      idx === currentImageIndex 
                        ? 'bg-white' 
                        : idx === (currentImageIndex + 1) % curatedImages.length
                        ? 'bg-gray-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cyber-button-minimal {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .cyber-button-minimal:hover {
          background: rgba(0, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.5);
          color: white;
        }
        
        .cyber-text {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .shadow-inner-strong {
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  )
} 