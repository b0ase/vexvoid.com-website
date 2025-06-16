'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden cyber-grid-line">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyber-black opacity-70"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <h1 className="text-6xl md:text-8xl font-mono mb-6 cyber-text font-bold tracking-widest">
          V3XV0ID
        </h1>
        <div className="w-32 h-px bg-cyber-white mx-auto mb-8"></div>
        <p className="text-xl md:text-2xl text-cyber-accent mb-12 font-light">
          Digital Musician & Hacker
        </p>
        <div className="space-x-6">
          <a href="#projects" className="cyber-button px-8 py-3 inline-block">
            PROJECTS
          </a>
          <a href="#about" className="cyber-border px-8 py-3 inline-block text-cyber-white">
            ABOUT
          </a>
        </div>
      </motion.div>
    </section>
  )
} 