'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { conceptArtImages, getRandomImages, getAllImagePaths } from '../lib/images'

// Use all available images for backgrounds
const backgroundImages = getAllImagePaths()

// Get random selection for floating elements
const floatingImages = getRandomImages(16)
const cornerImages = conceptArtImages.slice(0, 4)

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000) // Slower transitions

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Multiple Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((imgPath, index) => (
          <div
            key={imgPath}
            className={`absolute inset-0 transition-opacity duration-[3000ms] ${
              index === currentImageIndex ? 'opacity-60' : 'opacity-0'
            }`}
          >
            <Image
              src={imgPath}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover filter grayscale contrast-150 brightness-75"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Floating Image Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingImages.slice(0, 12).map((img, index) => (
          <div
            key={`floating-${img.path}`}
            className="absolute opacity-30 border border-white/20"
            style={{
              width: `${80 + (index % 3) * 40}px`,
              height: `${80 + (index % 3) * 40}px`,
              left: `${5 + (index % 4) * 22}%`,
              top: `${10 + (index % 3) * 25}%`,
              transform: `rotate(${(index % 2) * 15 - 7.5}deg)`,
            }}
          >
            <Image
              src={img.path}
              alt=""
              fill
              className="object-cover filter grayscale"
            />
          </div>
        ))}
      </div>

      {/* More Floating Images */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingImages.slice(12, 16).map((img, index) => (
          <div
            key={`extra-${img.path}`}
            className="absolute opacity-20 border border-white/10"
            style={{
              width: `${60 + (index % 2) * 30}px`,
              height: `${60 + (index % 2) * 30}px`,
              right: `${5 + (index % 3) * 20}%`,
              bottom: `${10 + (index % 2) * 30}%`,
              transform: `rotate(${(index % 2) * -20 + 10}deg)`,
            }}
          >
            <Image
              src={img.path}
              alt=""
              fill
              className="object-cover filter grayscale brightness-50"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Tiny Content */}
      <div className="text-center z-10 px-4">
        <h1 className="text-base md:text-lg cyber-text mb-1">
          V3XV0ID
        </h1>
        
        <div className="w-8 h-px bg-white mx-auto mb-1"></div>
        
        <p className="text-xs md:text-sm text-white mb-2 lo-fi-text">
          DIGITAL MUSICIAN & HACKER
        </p>
        
        <div className="flex justify-center gap-1 text-[10px] md:text-xs">
          <a href="#audio" className="bg-white text-black px-2 py-1 lo-fi-text">AUDIO</a>
          <a href="#visual" className="border border-white text-white px-2 py-1 lo-fi-text">VISUAL</a>
          <a href="/youtube" className="border border-white text-white px-2 py-1 lo-fi-text">YOUTUBE</a>
          <a href="#projects" className="border border-white text-white px-2 py-1 lo-fi-text">PROJ</a>
        </div>
      </div>

      {/* Corner Images */}
      <div className="absolute top-4 left-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[0].path}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[1].path}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[2].path}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[3].path}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
    </section>
  )
} 