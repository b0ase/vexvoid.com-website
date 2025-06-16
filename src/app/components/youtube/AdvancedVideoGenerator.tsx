'use client'

import { useState, useRef, useEffect } from 'react'
import { generativeAlgorithms, GenerativeAlgorithm, generateP5Code } from '../../lib/generativeAlgorithms'
import { getAllImagePaths } from '../../lib/images'
import { musicTracks, MusicTrack } from '../../lib/musicLibrary'

interface VideoComposition {
  id: string
  name: string
  images: string[]
  music: string
  algorithm?: GenerativeAlgorithm
  settings: {
    duration: number
    imageTransitionTime: number
    algorithmOpacity: number
    imageBlurAmount: number
    algorithmBlendMode: string
  }
}

export default function AdvancedVideoGenerator() {
  const [compositions, setCompositions] = useState<VideoComposition[]>([])
  const [currentComposition, setCurrentComposition] = useState<VideoComposition | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'images' | 'algorithm' | 'composite'>('composite')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const p5CanvasRef = useRef<HTMLCanvasElement>(null)
  
  const allImages = getAllImagePaths()
  const allMusic = musicTracks

  // Create new composition
  const createComposition = () => {
    const newComposition: VideoComposition = {
      id: `comp-${Date.now()}`,
      name: `Composition ${compositions.length + 1}`,
      images: allImages.slice(0, 5), // Default to first 5 images
      music: allMusic[0]?.filename || '',
      algorithm: generativeAlgorithms[0],
      settings: {
        duration: 60, // 60 seconds
        imageTransitionTime: 3, // 3 seconds per image
        algorithmOpacity: 0.7,
        imageBlurAmount: 2,
        algorithmBlendMode: 'multiply'
      }
    }
    setCompositions([...compositions, newComposition])
    setCurrentComposition(newComposition)
  }

  // Update composition
  const updateComposition = (updates: Partial<VideoComposition>) => {
    if (!currentComposition) return
    
    const updated = { ...currentComposition, ...updates }
    setCurrentComposition(updated)
    setCompositions(compositions.map(comp => 
      comp.id === updated.id ? updated : comp
    ))
  }

  // Preview generation
  const generatePreview = async () => {
    if (!currentComposition || !canvasRef.current) return
    
    setIsGenerating(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      // Set canvas size
      canvas.width = 1920
      canvas.height = 1080

      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (previewMode === 'images' || previewMode === 'composite') {
        // Load and composite images with blur effect
        const imagePromises = currentComposition.images.slice(0, 3).map(async (imagePath, index) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = imagePath
          })
        })

        const images = await Promise.all(imagePromises)
        
        // Apply blur and composite images
        images.forEach((img, index) => {
          ctx.save()
          ctx.globalAlpha = 0.6 - (index * 0.15)
          ctx.filter = `blur(${currentComposition.settings.imageBlurAmount}px)`
          
          // Scale and center image
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
          const x = (canvas.width - img.width * scale) / 2
          const y = (canvas.height - img.height * scale) / 2
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
          ctx.restore()
        })
      }

      // Generate p5.js algorithm overlay
      if ((previewMode === 'algorithm' || previewMode === 'composite') && currentComposition.algorithm) {
        await generateAlgorithmOverlay(currentComposition.algorithm)
      }

    } catch (error) {
      console.error('Preview generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate p5.js algorithm overlay
  const generateAlgorithmOverlay = async (algorithm: GenerativeAlgorithm) => {
    if (!p5CanvasRef.current || !canvasRef.current) return

    const p5Canvas = p5CanvasRef.current
    const mainCanvas = canvasRef.current
    const mainCtx = mainCanvas.getContext('2d')
    if (!mainCtx) return

    // Create p5.js code
    const p5Code = generateP5Code(algorithm)
    
    // Note: In a real implementation, you'd need to execute the p5.js code
    // For now, we'll create a placeholder pattern
    const p5Ctx = p5Canvas.getContext('2d')
    if (!p5Ctx) return

    p5Canvas.width = 400
    p5Canvas.height = 400
    
    // Create a simple animated pattern as placeholder
    p5Ctx.fillStyle = '#000000'
    p5Ctx.fillRect(0, 0, 400, 400)
    p5Ctx.strokeStyle = `rgba(255, 255, 255, ${currentComposition?.settings.algorithmOpacity || 0.7})`
    
    // Simple spiral pattern as placeholder
    const centerX = 200
    const centerY = 200
    const time = Date.now() * 0.001
    
    for (let i = 0; i < 1000; i++) {
      const angle = i * 0.1 + time
      const radius = i * 0.1
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      p5Ctx.beginPath()
      p5Ctx.arc(x, y, 1, 0, Math.PI * 2)
      p5Ctx.stroke()
    }

    // Composite onto main canvas
    if (previewMode === 'composite') {
      mainCtx.save()
      mainCtx.globalAlpha = currentComposition?.settings.algorithmOpacity || 0.7
      mainCtx.globalCompositeOperation = currentComposition?.settings.algorithmBlendMode as GlobalCompositeOperation || 'multiply'
      
      // Scale p5 canvas to fit main canvas
      mainCtx.drawImage(p5Canvas, 0, 0, mainCanvas.width, mainCanvas.height)
      mainCtx.restore()
    } else if (previewMode === 'algorithm') {
      mainCtx.drawImage(p5Canvas, 0, 0, mainCanvas.width, mainCanvas.height)
    }
  }

  // Generate final video
  const generateVideo = async () => {
    if (!currentComposition) return
    
    setIsGenerating(true)
    
    try {
      // In a real implementation, this would:
      // 1. Create video frames by compositing images with blur transitions
      // 2. Render p5.js algorithm frames
      // 3. Composite algorithm over images
      // 4. Sync with audio
      // 5. Export as video file
      
      console.log('Generating video with composition:', currentComposition)
      
      // Placeholder for actual video generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert('Video generation complete! (This is a placeholder - actual implementation would export video file)')
      
    } catch (error) {
      console.error('Video generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (currentComposition) {
      generatePreview()
    }
  }, [currentComposition, previewMode])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-mono cyber-text">ADVANCED VIDEO COMPOSER</h3>
        <button
          onClick={createComposition}
          className="bg-cyber-white text-cyber-black px-4 py-2 font-mono hover:bg-gray-200 transition-colors"
        >
          NEW COMPOSITION
        </button>
      </div>

      {/* Composition List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compositions.map(comp => (
          <div
            key={comp.id}
            onClick={() => setCurrentComposition(comp)}
            className={`cyber-card p-4 cursor-pointer transition-colors ${
              currentComposition?.id === comp.id ? 'border-cyber-white' : ''
            }`}
          >
            <h4 className="font-mono cyber-text mb-2">{comp.name}</h4>
            <p className="text-sm text-cyber-accent">
              {comp.images.length} images • {comp.algorithm?.name || 'No algorithm'}
            </p>
          </div>
        ))}
      </div>

      {currentComposition && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono cyber-text mb-2">COMPOSITION NAME</label>
              <input
                type="text"
                value={currentComposition.name}
                onChange={(e) => updateComposition({ name: e.target.value })}
                className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-mono cyber-text mb-2">GENERATIVE ALGORITHM</label>
              <select
                value={currentComposition.algorithm?.id || ''}
                onChange={(e) => {
                  const algorithm = generativeAlgorithms.find(a => a.id === e.target.value)
                  updateComposition({ algorithm })
                }}
                className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
              >
                <option value="">None</option>
                {generativeAlgorithms.map(algo => (
                  <option key={algo.id} value={algo.id}>{algo.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono cyber-text mb-2">MUSIC TRACK</label>
              <select
                value={currentComposition.music}
                onChange={(e) => updateComposition({ music: e.target.value })}
                className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
              >
                {allMusic.map((track: MusicTrack) => (
                  <option key={track.filename} value={track.filename}>{track.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono cyber-text mb-2">DURATION (s)</label>
                <input
                  type="number"
                  value={currentComposition.settings.duration}
                  onChange={(e) => updateComposition({
                    settings: { ...currentComposition.settings, duration: parseInt(e.target.value) }
                  })}
                  className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-mono cyber-text mb-2">TRANSITION (s)</label>
                <input
                  type="number"
                  value={currentComposition.settings.imageTransitionTime}
                  onChange={(e) => updateComposition({
                    settings: { ...currentComposition.settings, imageTransitionTime: parseInt(e.target.value) }
                  })}
                  className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono cyber-text mb-2">ALGORITHM OPACITY</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentComposition.settings.algorithmOpacity}
                  onChange={(e) => updateComposition({
                    settings: { ...currentComposition.settings, algorithmOpacity: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-cyber-accent">{currentComposition.settings.algorithmOpacity}</span>
              </div>
              <div>
                <label className="block text-sm font-mono cyber-text mb-2">IMAGE BLUR</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={currentComposition.settings.imageBlurAmount}
                  onChange={(e) => updateComposition({
                    settings: { ...currentComposition.settings, imageBlurAmount: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-cyber-accent">{currentComposition.settings.imageBlurAmount}px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono cyber-text mb-2">BLEND MODE</label>
              <select
                value={currentComposition.settings.algorithmBlendMode}
                onChange={(e) => updateComposition({
                  settings: { ...currentComposition.settings, algorithmBlendMode: e.target.value }
                })}
                className="w-full bg-cyber-dark border border-cyber-gray px-3 py-2 text-cyber-white font-mono"
              >
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
                <option value="color-dodge">Color Dodge</option>
                <option value="color-burn">Color Burn</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode('images')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  previewMode === 'images' ? 'bg-cyber-white text-cyber-black' : 'border border-cyber-gray text-cyber-white'
                }`}
              >
                IMAGES
              </button>
              <button
                onClick={() => setPreviewMode('algorithm')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  previewMode === 'algorithm' ? 'bg-cyber-white text-cyber-black' : 'border border-cyber-gray text-cyber-white'
                }`}
              >
                ALGORITHM
              </button>
              <button
                onClick={() => setPreviewMode('composite')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  previewMode === 'composite' ? 'bg-cyber-white text-cyber-black' : 'border border-cyber-gray text-cyber-white'
                }`}
              >
                COMPOSITE
              </button>
            </div>

            <button
              onClick={generateVideo}
              disabled={isGenerating}
              className="w-full bg-cyber-white text-cyber-black py-3 font-mono hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'GENERATING...' : 'GENERATE VIDEO'}
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h4 className="font-mono cyber-text">PREVIEW</h4>
            <div className="relative bg-cyber-dark border border-cyber-gray">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-96 object-contain"
                style={{ aspectRatio: '16/9' }}
              />
              <canvas
                ref={p5CanvasRef}
                className="hidden"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-cyber-white font-mono">GENERATING...</div>
                </div>
              )}
            </div>

            {currentComposition.algorithm && (
              <div className="bg-cyber-dark border border-cyber-gray p-4">
                <h5 className="font-mono cyber-text mb-2">{currentComposition.algorithm.name}</h5>
                <p className="text-sm text-cyber-accent mb-2">{currentComposition.algorithm.description}</p>
                <pre className="text-xs text-cyber-accent bg-cyber-black p-2 overflow-x-auto">
                  {currentComposition.algorithm.code}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 