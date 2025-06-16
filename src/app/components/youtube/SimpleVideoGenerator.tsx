'use client'

import { useState } from 'react'

interface SimpleVideoGeneratorProps {
  onVideoGenerated: (videoId: string) => void
}

export default function SimpleVideoGenerator({ onVideoGenerated }: SimpleVideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState('')

  const tracks = [
    'Echoes in the Abyss',
    'Shadowed Depths', 
    'Midnight Reverie',
    'Whispers in the Smoke'
  ]

  const handleGenerate = async () => {
    if (!selectedTrack) {
      alert('Please select a track')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate video generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const videoId = `${selectedTrack.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      onVideoGenerated(videoId)
      
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm lo-fi-text mb-2">
          Select Track:
        </label>
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="w-full bg-black border border-white/30 text-white p-2 lo-fi-text"
        >
          <option value="">Choose a track...</option>
          {tracks.map(track => (
            <option key={track} value={track}>{track}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !selectedTrack}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 lo-fi-text transition-colors"
      >
        {isGenerating ? 'Generating Video...' : 'Generate Video'}
      </button>

      {isGenerating && (
        <div className="bg-blue-600/20 border border-blue-600/50 p-4">
          <p className="text-blue-400 text-sm lo-fi-text">
            🎬 Generating video for "{selectedTrack}"...
          </p>
        </div>
      )}
    </div>
  )
} 