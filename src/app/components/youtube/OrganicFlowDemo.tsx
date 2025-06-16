'use client'

import { useEffect, useRef } from 'react'

interface OrganicFlowDemoProps {
  width: number
  height: number
}

export default function OrganicFlowDemo({ width, height }: OrganicFlowDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // Draw flowing particles
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(time * 0.01 + i * 0.1) * width * 0.3) + width * 0.5
        const y = (Math.cos(time * 0.008 + i * 0.15) * height * 0.3) + height * 0.5
        
        ctx.fillStyle = `hsl(${(time + i * 10) % 360}, 70%, 50%)`
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      time++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [width, height])

  return (
    <div className="border border-white/20">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
      />
    </div>
  )
} 