'use client'

import { useState } from 'react'

interface BatchGeneratorProps {
  onBatchComplete: (count: number) => void
}

export default function BatchGenerator({ onBatchComplete }: BatchGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchSize, setBatchSize] = useState(3)
  const [progress, setProgress] = useState(0)

  const handleBatchGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    
    try {
      for (let i = 0; i < batchSize; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProgress(((i + 1) / batchSize) * 100)
      }
      
      onBatchComplete(batchSize)
    } catch (error) {
      console.error('Batch generation failed:', error)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm lo-fi-text mb-2">
          Batch Size:
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={batchSize}
          onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
          className="w-20 bg-black border border-white/30 text-white p-2 lo-fi-text"
          disabled={isGenerating}
        />
      </div>

      <button
        onClick={handleBatchGenerate}
        disabled={isGenerating}
        className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white px-4 py-2 lo-fi-text transition-colors"
      >
        {isGenerating ? `Generating... (${Math.round(progress)}%)` : `Generate ${batchSize} Videos`}
      </button>

      {isGenerating && (
        <div className="bg-orange-600/20 border border-orange-600/50 p-4">
          <div className="flex items-center gap-2">
            <div className="w-full bg-black border border-white/30 h-2">
              <div 
                className="bg-orange-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-orange-400 text-sm lo-fi-text">{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  )
} 