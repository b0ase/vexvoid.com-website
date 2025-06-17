'use client'

import { useState, useRef, useEffect } from 'react'
import { initFFmpeg, createVideoFromFrames } from '../../lib/videoEncoder'
import { getAllImagePaths } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'

interface VideoProject {
  id: string
  name: string
  selectedImages: string[]
  selectedMusic: string
  duration: number
  frameDuration: number
  quality: 'low' | 'medium' | 'high'
}

export default function ActualVideoEditor() {
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [ffmpegReady, setFFmpegReady] = useState(false)
  const [initProgress, setInitProgress] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const allImages = getAllImagePaths()
  const allMusic = musicTracks

  // Initialize FFmpeg on mount
  useEffect(() => {
    initializeFFmpeg()
  }, [])

  const initializeFFmpeg = async () => {
    try {
      setInitProgress('Initializing FFmpeg...')
      await initFFmpeg((msg) => setInitProgress(msg))
      setFFmpegReady(true)
      setInitProgress('FFmpeg ready! 🎬')
    } catch (error) {
      console.error('FFmpeg initialization failed:', error)
      setInitProgress('FFmpeg initialization failed')
    }
  }

  const createNewProject = () => {
    const newProject: VideoProject = {
      id: `project-${Date.now()}`,
      name: `VEX VOID Project ${projects.length + 1}`,
      selectedImages: allImages.slice(0, 10), // Default first 10 images
      selectedMusic: allMusic[0]?.filename || '',
      duration: 30, // 30 seconds
      frameDuration: 3, // 3 seconds per image
      quality: 'medium'
    }
    
    setProjects([...projects, newProject])
    setCurrentProject(newProject)
  }

  const updateProject = (updates: Partial<VideoProject>) => {
    if (!currentProject) return
    
    const updated = { ...currentProject, ...updates }
    setCurrentProject(updated)
    setProjects(projects.map(p => p.id === updated.id ? updated : p))
  }

  const generateFrames = async (project: VideoProject): Promise<Blob[]> => {
    const frames: Blob[] = []
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    canvas.width = 1920
    canvas.height = 1080
    
    const framesToGenerate = Math.ceil(project.duration / project.frameDuration)
    
    for (let i = 0; i < framesToGenerate; i++) {
      const imageIndex = i % project.selectedImages.length
      const imagePath = project.selectedImages[imageIndex]
      
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      try {
        // Load and draw image
        const img = await loadImage(imagePath)
        
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        
        // Add VEX VOID overlay effects
        addVexVoidEffects(ctx, canvas.width, canvas.height, i)
        
        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png')
        })
        
        frames.push(blob)
        
        // Update progress
        const frameProgress = (i / framesToGenerate) * 50 // First 50% is frame generation
        setProgress(frameProgress)
        
      } catch (error) {
        console.error(`Failed to process image ${imagePath}:`, error)
        // Add black frame as fallback
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png')
        })
        frames.push(blob)
      }
    }
    
    return frames
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const addVexVoidEffects = (ctx: CanvasRenderingContext2D, width: number, height: number, frameIndex: number) => {
    // Add film grain
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30
      data[i] = Math.max(0, Math.min(255, data[i] + noise))     // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)) // Green  
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)) // Blue
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add vignette
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add scanlines
    ctx.strokeStyle = 'rgba(0,255,255,0.1)'
    ctx.lineWidth = 1
    for (let y = (frameIndex * 2) % 4; y < height; y += 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const loadAudioBlob = async (musicPath: string): Promise<Blob> => {
    const response = await fetch(musicPath)
    return await response.blob()
  }

  const generateVideo = async () => {
    if (!currentProject || !ffmpegReady) return
    
    setIsGenerating(true)
    setProgress(0)
    
    try {
      console.log('🎬 Starting video generation...')
      
      // Generate frames
      const frames = await generateFrames(currentProject)
      console.log(`✓ Generated ${frames.length} frames`)
      
      // Load audio
      let audioBlob: Blob | undefined
      if (currentProject.selectedMusic) {
        try {
          audioBlob = await loadAudioBlob(`/music/${currentProject.selectedMusic}`)
          console.log('✓ Audio loaded')
        } catch (error) {
          console.warn('Failed to load audio, continuing without:', error)
        }
      }
      
      // Create video using FFmpeg
      const fps = Math.ceil(frames.length / currentProject.duration)
      const videoBlob = await createVideoFromFrames(frames, audioBlob, {
        fps,
        width: 1920,
        height: 1080,
        quality: currentProject.quality,
        onProgress: (progress) => {
          setProgress(50 + (progress * 0.5)) // Second 50% is video encoding
        }
      })
      
      console.log('✓ Video created successfully')
      
      // Create object URL for preview
      const videoUrl = URL.createObjectURL(videoBlob)
      setGeneratedVideoUrl(videoUrl)
      
      setProgress(100)
      
    } catch (error) {
      console.error('Video generation failed:', error)
      alert(`Video generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadVideo = () => {
    if (!generatedVideoUrl || !currentProject) return
    
    const a = document.createElement('a')
    a.href = generatedVideoUrl
    a.download = `${currentProject.name.replace(/\s+/g, '_')}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mono mb-8 text-center">
          🎬 V3XV0ID Actual Video Editor
        </h1>
        
        {/* FFmpeg Status */}
        <div className="mb-6 p-4 border border-cyan-400/30 rounded">
          <h3 className="text-lg font-mono mb-2">FFmpeg Status:</h3>
          <p className={ffmpegReady ? 'text-green-400' : 'text-yellow-400'}>
            {initProgress}
          </p>
        </div>

        {/* Project Controls */}
        <div className="mb-6">
          <button
            onClick={createNewProject}
            disabled={!ffmpegReady}
            className="bg-cyan-400 text-black px-6 py-2 rounded font-mono mr-4 disabled:opacity-50"
          >
            Create New Project
          </button>
          
          {projects.length > 0 && (
            <select
              value={currentProject?.id || ''}
              onChange={(e) => setCurrentProject(projects.find(p => p.id === e.target.value) || null)}
              className="bg-black border border-cyan-400 text-cyan-400 px-4 py-2 rounded font-mono"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Project Settings */}
        {currentProject && (
          <div className="mb-6 p-4 border border-cyan-400/30 rounded">
            <h3 className="text-lg font-mono mb-4">Project Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-mono mb-2">Duration (seconds):</label>
                <input
                  type="number"
                  value={currentProject.duration}
                  onChange={(e) => updateProject({ duration: parseInt(e.target.value) })}
                  className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
                  min="5"
                  max="300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono mb-2">Frame Duration (seconds):</label>
                <input
                  type="number"
                  value={currentProject.frameDuration}
                  step="0.5"
                  onChange={(e) => updateProject({ frameDuration: parseFloat(e.target.value) })}
                  className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
                  min="0.5"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono mb-2">Quality:</label>
                <select
                  value={currentProject.quality}
                  onChange={(e) => updateProject({ quality: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
                >
                  <option value="low">Low (Fast)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Slow)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-mono mb-2">Selected Images: {currentProject.selectedImages.length}</label>
              <p className="text-xs text-cyan-400/70 font-mono">
                Using images from all collections. First 10 images selected by default.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-mono mb-2">Background Music:</label>
              <select
                value={currentProject.selectedMusic}
                onChange={(e) => updateProject({ selectedMusic: e.target.value })}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
              >
                <option value="">No Music</option>
                {allMusic.map(track => (
                  <option key={track.filename} value={track.filename}>
                    {track.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Generation Controls */}
        {currentProject && (
          <div className="mb-6">
            <button
              onClick={generateVideo}
              disabled={isGenerating || !ffmpegReady}
              className="bg-green-400 text-black px-6 py-3 rounded font-mono mr-4 text-lg disabled:opacity-50"
            >
              {isGenerating ? `Generating... ${Math.round(progress)}%` : '🎬 Generate Video'}
            </button>
            
            {generatedVideoUrl && (
              <button
                onClick={downloadVideo}
                className="bg-cyan-400 text-black px-6 py-3 rounded font-mono text-lg"
              >
                📥 Download Video
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-6">
            <div className="bg-black border border-cyan-400 rounded p-2">
              <div 
                className="bg-cyan-400 h-4 rounded transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm font-mono mt-2">
              {Math.round(progress)}% - {progress < 50 ? 'Generating frames...' : 'Encoding video...'}
            </p>
          </div>
        )}

        {/* Video Preview */}
        {generatedVideoUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-mono mb-4">Generated Video:</h3>
            <video
              ref={videoRef}
              src={generatedVideoUrl}
              controls
              className="w-full max-w-2xl mx-auto border border-cyan-400 rounded"
            />
          </div>
        )}

        {/* Info */}
        <div className="text-center text-sm font-mono text-cyan-400/70">
          <p>Real video generation powered by FFmpeg.wasm 🎬</p>
          <p>Assets: {allImages.length} images, {allMusic.length} music tracks</p>
        </div>
      </div>
    </div>
  )
} 