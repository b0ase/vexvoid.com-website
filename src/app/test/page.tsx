'use client'

import { useState } from 'react'
import { conceptArtImages } from '../lib/images'

export default function TestPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [audioStatus, setAudioStatus] = useState<string>('Not started')

  const testAudio = () => {
    const audio = new Audio('/music/Echoes in the Abyss.mp3')
    setAudioStatus('Loading...')
    
    audio.onloadeddata = () => {
      setAudioStatus('Loaded successfully')
      audio.play().then(() => {
        setAudioStatus('Playing')
        setTimeout(() => {
          audio.pause()
          setAudioStatus('Test complete')
        }, 3000)
      }).catch(err => {
        setAudioStatus(`Play failed: ${err.message}`)
      })
    }
    
    audio.onerror = (err) => {
      setAudioStatus(`Load failed: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8">V3XV0ID Asset Test Page</h1>
      
      {/* Audio Test */}
      <div className="mb-8 border border-white/20 p-4">
        <h2 className="text-lg mb-4">Audio Test</h2>
        <button 
          onClick={testAudio}
          className="bg-white text-black px-4 py-2 mr-4"
        >
          Test Audio
        </button>
        <span>Status: {audioStatus}</span>
      </div>

      {/* Image Test */}
      <div className="mb-8 border border-white/20 p-4">
        <h2 className="text-lg mb-4">Image Test ({conceptArtImages.length} total)</h2>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
            className="bg-white text-black px-4 py-2"
            disabled={currentImage === 0}
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentImage(Math.min(conceptArtImages.length - 1, currentImage + 1))}
            className="bg-white text-black px-4 py-2"
            disabled={currentImage === conceptArtImages.length - 1}
          >
            Next
          </button>
          <span className="text-white py-2">
            Image {currentImage + 1} of {conceptArtImages.length}
          </span>
        </div>
        
        <div className="border border-white/20 p-4">
          <p className="mb-2">Path: {conceptArtImages[currentImage]?.path}</p>
          <p className="mb-4">Directory: {conceptArtImages[currentImage]?.directory}</p>
          
          <img 
            src={conceptArtImages[currentImage]?.path}
            alt={`Test image ${currentImage + 1}`}
            className="max-w-md max-h-64 object-contain border border-white/20"
            onLoad={() => console.log('Image loaded:', conceptArtImages[currentImage]?.path)}
            onError={(e) => {
              console.error('Image failed:', conceptArtImages[currentImage]?.path)
              e.currentTarget.style.border = '2px solid red'
            }}
          />
        </div>
      </div>

      {/* File System Check */}
      <div className="border border-white/20 p-4">
        <h2 className="text-lg mb-4">Quick File Check</h2>
        <div className="space-y-2 text-sm">
          <div>Total images configured: {conceptArtImages.length}</div>
          <div>First image: {conceptArtImages[0]?.path}</div>
          <div>Last image: {conceptArtImages[conceptArtImages.length - 1]?.path}</div>
        </div>
      </div>
    </div>
  )
} 