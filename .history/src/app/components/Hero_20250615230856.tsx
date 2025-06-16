'use client'

import { motion } from 'framer-motion'
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
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex ? 'opacity-25' : 'opacity-0'
            }`}
          >
            <Image
              src={`/images/VexVoid_concept_art/${img}`}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover filter grayscale contrast-125"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 cyber-grid-line opacity-30"></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/85 via-cyber-black/70 to-cyber-black/95"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-retro mb-6 cyber-text font-bold tracking-widest lo-fi-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          data-text="V3XV0ID"
        >
          V3XV0ID
        </motion.h1>
        
        <motion.div 
          className="w-32 h-px bg-cyber-white mx-auto mb-8 opacity-80"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        ></motion.div>
        
        <motion.p 
          className="text-xl md:text-2xl text-cyber-accent mb-12 font-retro lo-fi-text tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          DIGITAL MUSICIAN & HACKER
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <a href="#audio" className="cyber-button px-6 py-3 inline-block text-sm md:text-base lo-fi-text">
            AUDIO
          </a>
          <a href="#visual" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base lo-fi-text">
            VISUAL
          </a>
          <a href="#projects" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base lo-fi-text">
            PROJECTS
          </a>
          <a href="#about" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base lo-fi-text">
            ABOUT
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Image Collage */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundImages.slice(0, 5).map((img, index) => (
          <motion.div
            key={`floating-${img}`}
            className="absolute w-16 h-16 md:w-24 md:h-24 opacity-15 border border-cyber-gray/20"
            style={{
              left: `${15 + index * 15}%`,
              top: `${20 + (index % 2) * 40}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            <Image
              src={`/images/VexVoid_concept_art/${img}`}
              alt=""
              fill
              className="object-cover filter grayscale contrast-125"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
} 