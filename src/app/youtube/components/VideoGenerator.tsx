'use client'

import { useState, useEffect } from 'react'
import { VideoGenerator, VideoGenerationConfig, GenerationStep } from '../../lib/videoGenerator'
import { conceptArtImages, getRandomImages } from '../../lib/images'

// All available music tracks
const musicTracks = [
  { title: 'Echoes in the Abyss', file: '/music/Echoes in the Abyss.mp3', duration: '2:24' },
  { title: 'Echoes in the Abyss (Alt)', file: '/music/Echoes in the Abyss (1).mp3', duration: '2:24' },
  { title: 'Echoes in the Dust', file: '/music/Echoes in the Dust.mp3', duration: '4:36' },
  { title: 'Echoes in the Dust (Alt)', file: '/music/Echoes in the Dust (1).mp3', duration: '4:18' },
  { title: 'Echoes in the Fog', file: '/music/Echoes in the Fog.mp3', duration: '4:00' },
  { title: 'Echoes in the Fog (Alt)', file: '/music/Echoes in the Fog (1).mp3', duration: '3:00' },
  { title: 'Echoes in the Mist', file: '/music/Echoes in the Mist.mp3', duration: '4:30' },
  { title: 'Echoes in the Mist (Alt)', file: '/music/Echoes in the Mist (1).mp3', duration: '5:18' },
  { title: 'Shadows of the Mind', file: '/music/Shadows of the Mind.mp3', duration: '4:12' },
  { title: 'Shadows of the Mind (Alt)', file: '/music/Shadows of the Mind (1).mp3', duration: '4:18' },
  { title: 'Shadows of the Mind (Extended)', file: '/music/Shadows of the Mind (2).mp3', duration: '4:48' },
  { title: 'Shadows of the Mind (Final)', file: '/music/Shadows of the Mind (3).mp3', duration: '4:36' },
  { title: 'Shadows and Silhouettes', file: '/music/Shadows and Silhouettes.mp3', duration: '4:36' },
  { title: 'Shadows and Silhouettes (Alt)', file: '/music/Shadows and Silhouettes (1).mp3', duration: '5:30' },
  { title: 'Shadows in the Smoke', file: '/music/Shadows in the Smoke.mp3', duration: '6:48' },
  { title: 'Shadows in the Smoke (Alt)', file: '/music/Shadows in the Smoke (1).mp3', duration: '3:54' },
  { title: 'Shadowed Depths', file: '/music/Shadowed Depths.mp3', duration: '4:06' },
  { title: 'Shadowed Depths (Alt)', file: '/music/Shadowed Depths (1).mp3', duration: '3:24' },
  { title: 'Shadowed Whispers', file: '/music/Shadowed Whispers.mp3', duration: '5:12' },
  { title: 'Shadowed Whispers (Alt)', file: '/music/Shadowed Whispers (1).mp3', duration: '4:36' },
  { title: 'Whispers in the Smoke', file: '/music/Whispers in the Smoke.mp3', duration: '5:24' },
  { title: 'Whispers in the Smoke (Alt)', file: '/music/Whispers in the Smoke (1).mp3', duration: '5:48' },
  { title: 'Midnight Reverie', file: '/music/Midnight Reverie.mp3', duration: '6:18' },
  { title: 'Midnight Reverie (Alt)', file: '/music/Midnight Reverie (1).mp3', duration: '5:36' }
]

interface VideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void
}

export default function VideoGeneratorComponent({ onVideoGenerated }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<GenerationStep[]>([])
  const [selectedImages, setSelectedImages] = useState(getRandomImages(6))
  const [config, setConfig] = useState<VideoGenerationConfig>({
    audioFile: musicTracks[0].file,
    conceptArt: selectedImages.slice(0, 3).map(img => img.path),
    title: `${musicTracks[0].title} - Generative Visuals`,
    description: 'AI-generated visuals synchronized to V3XV0ID music. Dark electronic soundscapes meet procedural art.',
    tags: ['electronic', 'generative art', 'cyberpunk', 'v3xv0id', 'dark ambient'],
    visualStyle: 'particles'
  })

  const generator = new VideoGenerator()

  useEffect(() => {
    const handleProgress = (event: CustomEvent) => {
      setSteps(event.detail.steps)
    }

    window.addEventListener('videoGenerationProgress', handleProgress as EventListener)
    return () => {
      window.removeEventListener('videoGenerationProgress', handleProgress as EventListener)
    }
  }, [])

  const handleAudioChange = (audioFile: string) => {
    const track = musicTracks.find(t => t.file === audioFile)
    if (track) {
      setConfig({
        ...config,
        audioFile,
        title: `${track.title} - Generative Visuals`
      })
    }
  }

  const shuffleImages = () => {
    const newImages = getRandomImages(6)
    setSelectedImages(newImages)
    setConfig({
      ...config,
      conceptArt: newImages.slice(0, 3).map(img => img.path)
    })
  }

  const handleGenerate = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setSteps(generator.getSteps())

    try {
      const videoId = await generator.generateVideo(config)
      console.log('Video generated successfully:', videoId)
      onVideoGenerated?.(videoId)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500'
      case 'processing': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const selectedTrack = musicTracks.find(t => t.file === config.audioFile)

  return (
    <div className="border border-white/20 p-4">
      <h2 className="text-sm md:text-base cyber-text mb-4">VIDEO GENERATOR</h2>
      
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs cyber-text mb-1">AUDIO TRACK ({musicTracks.length} available)</label>
          <select 
            value={config.audioFile}
            onChange={(e) => handleAudioChange(e.target.value)}
            className="w-full bg-black border border-white/20 text-white text-xs p-1"
            disabled={isGenerating}
          >
            {musicTracks.map((track, index) => (
              <option key={track.file} value={track.file}>
                {track.title} ({track.duration})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs cyber-text mb-1">VISUAL STYLE</label>
          <select 
            value={config.visualStyle}
            onChange={(e) => setConfig({...config, visualStyle: e.target.value as any})}
            className="w-full bg-black border border-white/20 text-white text-xs p-1"
            disabled={isGenerating}
          >
            <option value="particles">Particle System</option>
            <option value="glitch">Glitch Effects</option>
            <option value="waveform">Waveform Visual</option>
            <option value="abstract">Abstract Shapes</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs cyber-text mb-1">VIDEO TITLE</label>
          <input 
            type="text"
            value={config.title}
            onChange={(e) => setConfig({...config, title: e.target.value})}
            className="w-full bg-black border border-white/20 text-white text-xs p-1"
            disabled={isGenerating}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs cyber-text mb-1">DESCRIPTION</label>
          <textarea 
            value={config.description}
            onChange={(e) => setConfig({...config, description: e.target.value})}
            className="w-full bg-black border border-white/20 text-white text-xs p-1 h-16 resize-none"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Generation Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-2 text-xs cyber-text transition-colors ${
            isGenerating 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE VIDEO'}
        </button>
      </div>

      {/* Progress Tracking */}
      {(isGenerating || steps.some(s => s.status === 'complete')) && (
        <div className="space-y-3">
          <h3 className="text-xs cyber-text mb-2">GENERATION PROGRESS</h3>
          
          {steps.map((step, index) => (
            <div key={step.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getStatusColor(step.status)}`}></div>
                  <span className="text-xs">{step.name}</span>
                </div>
                <span className="text-xs text-white/70">{step.progress}%</span>
              </div>
              
              {step.status === 'processing' && (
                <div className="w-full bg-gray-700 h-1">
                  <div 
                    className="bg-yellow-500 h-1 transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Style Preview */}
      <div className="mt-6 border-t border-white/20 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs cyber-text">CONCEPT ART PREVIEW ({conceptArtImages.length} total)</h3>
          <button
            onClick={shuffleImages}
            disabled={isGenerating}
            className="text-xs border border-white/20 px-2 py-1 hover:bg-white/10 transition-colors"
          >
            SHUFFLE
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {selectedImages.slice(0, 6).map((img, index) => (
            <div key={img.path} className="aspect-square border border-white/10 overflow-hidden">
              <img 
                src={img.path} 
                alt={`Concept art from ${img.directory}`}
                className="w-full h-full object-cover filter grayscale opacity-70"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/70 mt-2">
          Track: {selectedTrack?.title} ({selectedTrack?.duration}) | 
          Style: {config.visualStyle.toUpperCase()} | 
          Images: {selectedImages.length} selected from {conceptArtImages.length} total
        </p>
      </div>
    </div>
  )
} 