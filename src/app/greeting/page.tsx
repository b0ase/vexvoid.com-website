'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { conceptArtImages } from '../lib/images'

export default function GreetingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % conceptArtImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Show message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.log('Autoplay prevented, user interaction required')
      }
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {conceptArtImages.slice(0, 8).map((img, index) => (
          <div
            key={img.path}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ${
              index === currentImageIndex ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <Image
              src={img.path}
              alt=""
              fill
              className="object-cover filter grayscale contrast-150 brightness-50"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Title */}
          <div className={`transition-all duration-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold cyber-text mb-4">
              v3xv0id
            </h1>
            <div className="w-24 h-px bg-white mx-auto mb-8"></div>
          </div>

          {/* Personal Message */}
          <div className={`transition-all duration-1000 delay-500 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-black/80 border border-white/30 p-8 mb-8">
              <p className="text-xl md:text-2xl mb-6 leading-relaxed">
                Hey! 👋
              </p>
              <p className="text-lg mb-6 text-white/90 leading-relaxed">
                I wanted to share something special with you - this is my latest track 
                <span className="text-cyan-400 font-bold"> "Shadows of the Mind Alt 2"</span> 
                along with my digital art collection.
              </p>
              <p className="text-base text-white/80 leading-relaxed">
                Hope you enjoy this little glimpse into my creative world ✨
              </p>
            </div>
          </div>

          {/* Music Player */}
          <div className={`transition-all duration-1000 delay-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-black/90 border border-white/40 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <div className="text-sm text-white/60 lo-fi-text">NOW PLAYING:</div>
                  <div className="text-lg font-bold text-cyan-400">Shadows of the Mind Alt 2</div>
                  <div className="text-sm text-white/80">v3xv0id</div>
                </div>
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors font-bold"
                >
                  {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                </button>
              </div>
              
              <audio
                ref={audioRef}
                src="/audio/Shadows of the Mind (Alt 2)-v3xv0id.mp3"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className={`transition-all duration-1000 delay-1500 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors font-bold"
              >
                🎵 EXPLORE MORE MUSIC
              </a>
              <a 
                href="/#visual"
                className="border border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors font-bold"
              >
                🎨 VIEW ART GALLERY
              </a>
            </div>
          </div>

          {/* Signature */}
          <div className={`transition-all duration-1000 delay-2000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mt-12 text-center">
              <div className="text-sm text-white/50 lo-fi-text">
                Made with ❤️ by v3xv0id
              </div>
              <div className="text-xs text-white/30 mt-2">
                Digital Music & Visual Art • {new Date().getFullYear()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 