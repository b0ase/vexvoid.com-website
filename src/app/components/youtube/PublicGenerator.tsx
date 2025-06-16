'use client'

import { useState } from 'react'

interface PublicGeneratorProps {
  onVideoGenerated: (videoId: string) => void
}

export default function PublicGenerator({ onVideoGenerated }: PublicGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const videoId = `public-safe-${Date.now()}`
      onVideoGenerated(videoId)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-600/20 border border-blue-600/50 p-4">
        <p className="text-blue-400 text-sm lo-fi-text">
          🛡️ Brand-safe generator for public content
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white px-4 py-2 lo-fi-text transition-colors"
      >
        {isGenerating ? 'Creating...' : 'Generate Public Video'}
      </button>
    </div>
  )
} 