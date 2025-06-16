'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const backgroundImages = [
  'download.jpg',
  'download-1.jpg',
  'download-2.jpg',
  'download-3.jpg',
  'download-4.jpg',
]

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6000) // Slower transitions

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden scan-lines">
      {/* Single Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`/images/VexVoid_concept_art/${backgroundImages[currentImageIndex]}`}
          alt="Background"
          fill
          className="object-cover filter grayscale opacity-20"
          priority
        />
      </div>

      {/* Harsh Grid Overlay */}
      <div className="absolute inset-0 cyber-grid-line"></div>

      {/* Solid Black Overlay */}
      <div className="absolute inset-0 bg-cyber-black/80"></div>

      {/* Content */}
      <div className="text-center z-10 px-4">
        <h1 className="text-7xl md:text-9xl font-retro mb-8 cyber-text lo-fi-text">
          V3XV0ID
        </h1>
        
        <div className="w-48 h-px bg-cyber-white mx-auto mb-8"></div>
        
        <p className="text-lg md:text-xl text-cyber-white mb-16 font-retro lo-fi-text">
          DIGITAL MUSICIAN & HACKER
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 max-w-md mx-auto">
          <a href="#audio" className="cyber-button px-8 py-4 block lo-fi-text border-2 border-cyber-white">
            AUDIO
          </a>
          <a href="#visual" className="cyber-border px-8 py-4 block text-cyber-white lo-fi-text border-2">
            VISUAL
          </a>
          <a href="#projects" className="cyber-border px-8 py-4 block text-cyber-white lo-fi-text border-2">
            PROJECTS
          </a>
        </div>
      </div>
    </section>
  )
} 