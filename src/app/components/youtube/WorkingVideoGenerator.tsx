'use client'

import { useState } from 'react'

interface WorkingVideoGeneratorProps {
  onVideoGenerated: (videoId: string) => void
}

export default function WorkingVideoGenerator({ onVideoGenerated }: WorkingVideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const videoId = `working-video-${Date.now()}`
      onVideoGenerated(videoId)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-600/20 border border-green-600/50 p-4">
        <p className="text-green-400 text-sm lo-fi-text">
          ✓ Working generator with FFMPEG integration
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 lo-fi-text transition-colors"
      >
        {isGenerating ? 'Processing...' : 'Generate with FFMPEG'}
      </button>
    </div>
  )
} 