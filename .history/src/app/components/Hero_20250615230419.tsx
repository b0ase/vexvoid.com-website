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
              index === currentImageIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <Image
              src={`/images/VexVoid_concept_art/${img}`}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover filter grayscale"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 cyber-grid-line opacity-20"></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/80 via-cyber-black/60 to-cyber-black/90"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-mono mb-6 cyber-text font-bold tracking-widest"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          V3XV0ID
        </motion.h1>
        
        <motion.div 
          className="w-32 h-px bg-cyber-white mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        ></motion.div>
        
        <motion.p 
          className="text-xl md:text-2xl text-cyber-accent mb-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Digital Musician & Hacker
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <a href="#audio" className="cyber-button px-6 py-3 inline-block text-sm md:text-base">
            AUDIO
          </a>
          <a href="#visual" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base">
            VISUAL
          </a>
          <a href="#projects" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base">
            PROJECTS
          </a>
          <a href="#about" className="cyber-border px-6 py-3 inline-block text-cyber-white text-sm md:text-base">
            ABOUT
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Image Collage */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundImages.slice(0, 5).map((img, index) => (
          <motion.div
            key={`floating-${img}`}
            className="absolute w-20 h-20 md:w-32 md:h-32 opacity-10"
            style={{
              left: `${15 + index * 15}%`,
              top: `${20 + (index % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            <Image
              src={`/images/VexVoid_concept_art/${img}`}
              alt=""
              fill
              className="object-cover filter grayscale border border-cyber-gray/30"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
} 