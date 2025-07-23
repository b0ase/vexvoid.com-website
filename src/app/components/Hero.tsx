'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { conceptArtImages, getAllImagePaths } from '../lib/images'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import SocialLinks from './SocialLinks'
import Link from 'next/link'

// Convert local image arrays to match the expected format
const getConceptArtImages = () => conceptArtImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getAllCloudImages = () => getConceptArtImages()

// Use all available images for backgrounds
const allImages = getAllCloudImages()
const backgroundImages = allImages.map(img => img.url)

// Get random selection for floating elements
const floatingImages = allImages.slice(0, 16)
const cornerImages = getConceptArtImages().slice(0, 4)

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
            key={`floating-${img.url}`}
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
              src={img.url}
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
            key={`extra-${img.url}`}
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
              src={img.url}
              alt=""
              fill
              className="object-cover filter grayscale brightness-50"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Main Content - Medium Size */}
      <div className="text-center z-10 px-4">
        <h1 className="text-xl md:text-2xl cyber-text mb-2 font-bold">
          v3xv0id
        </h1>
        
        <div className="w-16 h-px bg-white mx-auto mb-6"></div>
        
        <div className="flex justify-center gap-2 text-xs md:text-sm flex-wrap mb-4">
          <a href="/audio" className="border border-white text-white px-3 py-1.5 lo-fi-text hover:bg-white hover:text-black transition-colors">AUDIO</a>
          <a href="#visual" className="border border-white text-white px-3 py-1.5 lo-fi-text hover:bg-white hover:text-black transition-colors">VISUAL</a>
          <a href="/studio" className="border border-white text-white px-3 py-1.5 lo-fi-text hover:bg-white hover:text-black transition-colors">STUDIO</a>
          <a href="https://b0ase.github.io/vexvoid-AV-client/" target="_blank" rel="noopener noreferrer" className="border border-white text-white px-3 py-1.5 lo-fi-text hover:bg-white hover:text-black transition-colors">DOWNLOAD</a>
          <a href="/token" className="border border-white text-white px-3 py-1.5 lo-fi-text hover:bg-white hover:text-black transition-colors">$V3X</a>
        </div>

        {/* Social Links - Under buttons */}
        <div>
          <SocialLinks />
        </div>
      </div>

      {/* Corner Images */}
      <div className="absolute top-4 left-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[0].url}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[1].url}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[2].url}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 opacity-40">
        <Image
          src={cornerImages[3].url}
          alt=""
          fill
          className="object-cover filter grayscale border border-white/30"
        />
      </div>
    </section>
  )
} 