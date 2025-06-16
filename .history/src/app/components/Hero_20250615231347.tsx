'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toTimeString().split(' ')[0])
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center relative scan-lines">
      {/* Pure Grid Background */}
      <div className="absolute inset-0 cyber-grid-line"></div>

      {/* Content */}
      <div className="text-center z-10 px-4 cyber-card p-8 md:p-16">
        <div className="mb-4 text-xs lo-fi-text">
          {time}
        </div>
        
        <h1 className="text-6xl md:text-8xl cyber-text mb-8">
          V3XV0ID
        </h1>
        
        <div className="border-t-2 border-white w-32 mx-auto mb-8"></div>
        
        <p className="text-sm cyber-text mb-12">
          DIGITAL MUSICIAN & HACKER
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-lg mx-auto">
          <a href="#audio" className="cyber-button p-4 block text-xs">AUDIO</a>
          <a href="#visual" className="cyber-border p-4 block text-xs text-white">VISUAL</a>
          <a href="#projects" className="cyber-border p-4 block text-xs text-white">PROJECTS</a>
        </div>
        
        <div className="mt-8 text-xs lo-fi-text">
          [TERMINAL READY]
        </div>
      </div>
    </section>
  )
} 