'use client'

import { useState, useEffect } from 'react'
import { VideoGenerator, VideoGenerationConfig, GenerationStep } from '../../lib/videoGenerator'

interface VideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void
}

export default function VideoGeneratorComponent({ onVideoGenerated }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<GenerationStep[]>([])
  const [config, setConfig] = useState<VideoGenerationConfig>({
    audioFile: '/music/Echoes in the Abyss.mp3',
    conceptArt: [
      '/images/VexVoid_concept_art/download.jpg',
      '/images/VexVoid_concept_art/download-1.jpg',
      '/images/VexVoid_concept_art/download-2.jpg'
    ],
    title: 'Echoes in the Abyss - Generative Visuals',
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

  return (
    <div className="border border-white/20 p-4">
      <h2 className="text-sm md:text-base cyber-text mb-4">VIDEO GENERATOR</h2>
      
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs cyber-text mb-1">AUDIO FILE</label>
          <select 
            value={config.audioFile}
            onChange={(e) => setConfig({...config, audioFile: e.target.value})}
            className="w-full bg-black border border-white/20 text-white text-xs p-1"
            disabled={isGenerating}
          >
            <option value="/music/Echoes in the Abyss.mp3">Echoes in the Abyss</option>
            <option value="/music/Shadowed Depths.mp3">Shadowed Depths</option>
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
        <h3 className="text-xs cyber-text mb-2">STYLE PREVIEW</h3>
        <div className="grid grid-cols-2 gap-2">
          {config.conceptArt.slice(0, 4).map((art, index) => (
            <div key={index} className="aspect-square border border-white/10 overflow-hidden">
              <img 
                src={art} 
                alt={`Concept art ${index + 1}`}
                className="w-full h-full object-cover filter grayscale opacity-70"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/70 mt-2">
          Visual style: {config.visualStyle.toUpperCase()} | 
          Duration: ~{config.audioFile.includes('Echoes') ? '3:42' : '4:15'}
        </p>
      </div>
    </div>
  )
} 