'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-darker-bg opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <h1 className="text-6xl md:text-8xl font-mono mb-6 neon-text">
          V3XV0ID
        </h1>
        <p className="text-xl md:text-2xl text-neon-blue mb-8">
          Digital Musician & Hacker
        </p>
        <div className="space-x-4">
          <a href="#projects" className="nav-link px-6 py-3 neon-border inline-block">
            Projects
          </a>
          <a href="#about" className="nav-link px-6 py-3 neon-border inline-block">
            About
          </a>
        </div>
      </motion.div>
    </section>
  )
} 