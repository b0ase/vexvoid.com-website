'use client'

import { useState } from 'react'

export default function TestVideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setLogs([])
    
    try {
      addLog('Starting test video generation...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addLog('Loading audio file...')
      await new Promise(resolve => setTimeout(resolve, 800))
      
      addLog('Analyzing audio properties...')
      await new Promise(resolve => setTimeout(resolve, 600))
      
      addLog('Generating visual patterns...')
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      addLog('Compositing video...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addLog('✓ Test video generated successfully!')
      
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-yellow-600/20 border border-yellow-600/50 p-4">
        <p className="text-yellow-200 text-sm lo-fi-text">
          ⚠ Test mode - Simulates video generation process without creating actual files
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 lo-fi-text transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Test Video'}
      </button>

      {logs.length > 0 && (
        <div className="bg-black border border-white/20 p-4 max-h-64 overflow-y-auto">
          <h4 className="text-sm lo-fi-text mb-2">Generation Log:</h4>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-xs text-green-400 font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 