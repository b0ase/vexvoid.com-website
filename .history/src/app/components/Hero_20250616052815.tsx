'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const backgroundImages = [
  'download.jpg',
  'download-1.jpg',
  'download-2.jpg',
  'download-3.jpg',
  'download-4.jpg',
  'download-5.jpg',
  'download-6.jpg',
  'download-7.jpg',
  'download-8.jpg',
  'download-9.jpg',
]

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
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-[3000ms] ${
              index === currentImageIndex ? 'opacity-60' : 'opacity-0'
            }`}
          >
            <Image
              src={`/images/VexVoid_concept_art/${img}`}
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
        {backgroundImages.map((img, index) => (
          <div
            key={`floating-${img}`}
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
              src={`/images/VexVoid_concept_art/${img}`}
              alt=""
              fill
              className="object-cover filter grayscale"
            />
          </div>
        ))}
      </div>

      {/* More Floating Images */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundImages.slice(0, 6).map((img, index) => (
          <div
            key={`extra-${img}`}
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
              src={`/images/VexVoid_concept_art/${img}`}
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
          src="/images/VexVoid_concept_art/download.jpg"
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 opacity-40">
        <Image
          src="/images/VexVoid_concept_art/download-1.jpg"
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 opacity-40">
        <Image
          src="/images/VexVoid_concept_art/download-2.jpg"
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 opacity-40">
        <Image
          src="/images/VexVoid_concept_art/download-3.jpg"
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
    </section>
  )
} 