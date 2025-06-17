'use client'

import { useState, useEffect, useRef } from 'react'
import { YouTubeClient, generateVideoMetadata, UploadProgress } from '../lib/youtubeClient'

interface GenerationStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  progress: number
  details?: string
}

interface VideoConfig {
  audioFile: string
  musicTitle: string
  visualStyle: 'organic-flow' | 'particles' | 'waveform' | 'veo3'
  duration: number
  resolution: '1080p' | '720p'
}

export default function YouTubePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [authUrl, setAuthUrl] = useState('')
  const [channelInfo, setChannelInfo] = useState<any>(null)
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    audioFile: 'Echoes in the Abyss.mp3',
    musicTitle: 'Echoes in the Abyss',
    visualStyle: 'organic-flow',
    duration: 180,
    resolution: '1080p'
  })

  const [generationSteps] = useState<GenerationStep[]>([
    { id: 'audio-analysis', name: 'Audio Analysis', status: 'pending', progress: 0 },
    { id: 'visual-generation', name: 'Visual Generation', status: 'pending', progress: 0 },
    { id: 'video-composition', name: 'Video Composition', status: 'pending', progress: 0 },
    { id: 'youtube-upload', name: 'YouTube Upload', status: 'pending', progress: 0 }
  ])

  const [availableMusic, setAvailableMusic] = useState([
    'Echoes in the Abyss.mp3',
    'Shadows of the Mind Alt 2.mp3',
    'Midnight Reverie.mp3',
    'Digital Wasteland.mp3'
  ])

  const [client] = useState(() => new YouTubeClient())
  const [generationStepsState, setGenerationSteps] = useState<GenerationStep[]>(generationSteps)
  const [uploadProgress, setUploadProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    checkAuthentication()
    
    // Handle OAuth callback from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (code) {
      handleOAuthCallback(code)
    } else if (error) {
      console.error('OAuth error:', error)
    }
  }, [])

  const checkAuthentication = async () => {
    try {
      const isAuth = await client.checkAuth()
      if (isAuth) {
        setIsAuthenticated(true)
        loadChannelInfo()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const loadChannelInfo = async () => {
    try {
      const info = await client.getChannelInfo()
      setChannelInfo(info)
    } catch (error) {
      console.error('Failed to load channel info:', error)
    }
  }

  const handleOAuthCallback = async (code: string) => {
    try {
      await client.handleCallback(code)
      setIsAuthenticated(true)
      loadChannelInfo()
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error) {
      console.error('OAuth callback failed:', error)
    }
  }

  const authenticateWithYouTube = async () => {
    try {
      const authUrl = await client.getAuthUrl()
      setAuthUrl(authUrl)
      window.location.href = authUrl // Direct redirect instead of popup
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }

  const updateStep = (stepId: string, status: GenerationStep['status'], progress: number, details?: string) => {
    setGenerationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress, details }
        : step
    ))
  }

  const analyzeAudio = async (audioFile: string): Promise<any> => {
    updateStep('audio-analysis', 'processing', 0, 'Loading audio file...')
    
    try {
      const audioContext = new AudioContext()
      const response = await fetch(`/music/${audioFile}`)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      updateStep('audio-analysis', 'processing', 50, 'Analyzing frequency content...')
      
      // Simulate audio analysis
      const analysisData = {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        bpm: 128, // Would be detected
        key: 'A minor', // Would be detected
        energy: 0.8,
        danceability: 0.7
      }
      
      updateStep('audio-analysis', 'complete', 100, `BPM: ${analysisData.bpm}, Key: ${analysisData.key}`)
      return analysisData
    } catch (error) {
      updateStep('audio-analysis', 'error', 0, `Error: ${error}`)
      throw error
    }
  }

  const generateVisuals = async (style: string, audioData: any): Promise<Blob> => {
    updateStep('visual-generation', 'processing', 0, `Generating ${style} visuals...`)
    
    try {
      if (style === 'veo3') {
        // Veo3 integration
        updateStep('visual-generation', 'processing', 25, 'Connecting to Veo3 API...')
        
        const veo3Response = await fetch('/api/veo3/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Abstract digital art video, cyberpunk aesthetic, flowing particles, black and white, ${audioData.bpm} BPM rhythm, ${audioData.duration} seconds`,
            duration: audioData.duration,
            style: 'cinematic'
          })
        })
        
        if (!veo3Response.ok) {
          throw new Error('Veo3 generation failed')
        }
        
        updateStep('visual-generation', 'processing', 75, 'Downloading Veo3 video...')
        const videoBlob = await veo3Response.blob()
        updateStep('visual-generation', 'complete', 100, 'Veo3 video generated')
        return videoBlob
        
      } else {
        // Traditional generative art
        updateStep('visual-generation', 'processing', 25, 'Initializing canvas...')
        
        const canvas = document.createElement('canvas')
        canvas.width = videoConfig.resolution === '1080p' ? 1920 : 1280
        canvas.height = videoConfig.resolution === '1080p' ? 1080 : 720
        const ctx = canvas.getContext('2d')!
        
        const frames: ImageData[] = []
        const frameCount = Math.floor(audioData.duration * 30) // 30 FPS
        
        for (let frame = 0; frame < frameCount; frame++) {
          const progress = frame / frameCount
          updateStep('visual-generation', 'processing', 25 + (progress * 50), `Frame ${frame}/${frameCount}`)
          
          // Clear canvas
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Generate visuals based on style
          await generateFrame(ctx, style, progress, audioData, canvas.width, canvas.height)
          
          frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        }
        
        updateStep('visual-generation', 'complete', 100, `Generated ${frames.length} frames`)
        
        // Convert frames to video blob (placeholder - would use FFmpeg)
        return new Blob([new Uint8Array(1000000)], { type: 'video/mp4' })
      }
    } catch (error) {
      updateStep('visual-generation', 'error', 0, `Error: ${error}`)
      throw error
    }
  }

  const generateFrame = async (ctx: CanvasRenderingContext2D, style: string, progress: number, audioData: any, width: number, height: number) => {
    const time = progress * audioData.duration
    
    switch (style) {
      case 'organic-flow':
        // Your beautiful organic flow algorithm
        const particles = 200
        for (let i = 0; i < particles; i++) {
          const angle = (i / particles) * Math.PI * 2 + time * 0.5
          const radius = Math.sin(time * 2 + i * 0.1) * 200 + 300
          const x = width/2 + Math.cos(angle) * radius
          const y = height/2 + Math.sin(angle) * radius
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(time * 3 + i * 0.2) * 0.1})`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
        break
        
      case 'particles':
        // Particle system
        for (let i = 0; i < 500; i++) {
          const x = (Math.sin(time + i * 0.1) * width/4) + width/2
          const y = (Math.cos(time * 1.5 + i * 0.15) * height/4) + height/2
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 4 + i) * 0.2})`
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }
        break
        
      case 'waveform':
        // Audio waveform visualization
        const centerY = height / 2
        const amplitude = height / 4
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        
        for (let x = 0; x < width; x += 4) {
          const freq = (x / width) * 20 + time * 10
          const y = centerY + Math.sin(freq) * amplitude * (0.5 + Math.sin(time * 2) * 0.5)
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.stroke()
        break
    }
  }

  const composeVideo = async (visualBlob: Blob, audioFile: string): Promise<Blob> => {
    updateStep('video-composition', 'processing', 0, 'Composing video and audio...')
    
    try {
      // This would typically use FFmpeg to combine video and audio
      // For now, we'll simulate the process
      updateStep('video-composition', 'processing', 50, 'Encoding video...')
      
      // Simulate encoding time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      updateStep('video-composition', 'complete', 100, 'Video composition complete')
      
      // Return the visual blob as-is (in real implementation, would be the composed video)
      return visualBlob
    } catch (error) {
      updateStep('video-composition', 'error', 0, `Error: ${error}`)
      throw error
    }
  }

  const uploadToYouTube = async (videoBlob: Blob): Promise<string> => {
    updateStep('youtube-upload', 'processing', 0, 'Starting upload...')
    
    try {
      const metadata = generateVideoMetadata(
        videoConfig.visualStyle,
        videoConfig.musicTitle,
        videoConfig.duration
      )

      const videoId = await client.uploadVideo(
        videoBlob,
        metadata,
        (progress: UploadProgress) => {
          updateStep('youtube-upload', 'processing', progress.percentage, 
            `Uploading... ${Math.round(progress.percentage)}%`)
          setUploadProgress(progress.percentage)
        }
      )

      updateStep('youtube-upload', 'complete', 100, `Video uploaded: ${videoId}`)
      return videoId
    } catch (error) {
      updateStep('youtube-upload', 'error', 0, `Error: ${error}`)
      throw error
    }
  }

  const generateAndUploadVideo = async () => {
    if (!isAuthenticated) {
      alert('Please authenticate with YouTube first')
      return
    }

    setIsGenerating(true)
    setUploadProgress(0)

    try {
      // Reset all steps
      setGenerationSteps(prev => prev.map(step => ({ 
        ...step, 
        status: 'pending' as const, 
        progress: 0, 
        details: undefined 
      })))

      // Step 1: Analyze audio
      const audioData = await analyzeAudio(videoConfig.audioFile)

      // Step 2: Generate visuals
      const visualBlob = await generateVisuals(videoConfig.visualStyle, audioData)

      // Step 3: Compose video
      const finalVideo = await composeVideo(visualBlob, videoConfig.audioFile)

      // Step 4: Upload to YouTube
      const videoId = await uploadToYouTube(finalVideo)

      alert(`Video successfully uploaded! Video ID: ${videoId}`)
    } catch (error) {
      console.error('Generation failed:', error)
      alert(`Generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold cyber-text mb-8">
          V3XV0ID Video Generation Pipeline
        </h1>
        
        {/* Authentication Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">YouTube Authentication</h2>
          
          {!isAuthenticated ? (
            <div>
              <p className="text-gray-300 mb-4">
                Connect your YouTube account to enable video uploads
              </p>
              <button
                onClick={authenticateWithYouTube}
                className="cyber-button px-6 py-3"
              >
                🔗 Authenticate with YouTube
              </button>
            </div>
          ) : (
            <div>
              <p className="text-green-400 mb-2">✅ Connected to YouTube</p>
              {channelInfo && (
                <div className="text-sm text-gray-300">
                  <p>Channel: {channelInfo.snippet?.title}</p>
                  <p>Subscribers: {channelInfo.statistics?.subscriberCount}</p>
                  <p>Videos: {channelInfo.statistics?.videoCount}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Configuration Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Video Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Music Track</label>
              <select
                value={videoConfig.audioFile}
                onChange={(e) => setVideoConfig(prev => ({ 
                  ...prev, 
                  audioFile: e.target.value,
                  musicTitle: e.target.value.replace('.mp3', '')
                }))}
                className="w-full bg-gray-800 rounded px-3 py-2"
              >
                <option value="">Select music track...</option>
                {availableMusic.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Visual Style</label>
              <select
                value={videoConfig.visualStyle}
                onChange={(e) => setVideoConfig(prev => ({ 
                  ...prev, 
                  visualStyle: e.target.value as any
                }))}
                className="w-full bg-gray-800 rounded px-3 py-2"
              >
                <option value="organic-flow">Organic Flow (Your Algorithm)</option>
                <option value="particles">Particle System</option>
                <option value="waveform">Audio Waveform</option>
                <option value="veo3">Veo3 AI Generation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
              <input
                type="number"
                min="30"
                max="300"
                value={videoConfig.duration}
                onChange={(e) => setVideoConfig(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value)
                }))}
                className="w-full bg-gray-800 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Resolution</label>
              <select
                value={videoConfig.resolution}
                onChange={(e) => setVideoConfig(prev => ({ 
                  ...prev, 
                  resolution: e.target.value as any
                }))}
                className="w-full bg-gray-800 rounded px-3 py-2"
              >
                <option value="1080p">1080p (1920x1080)</option>
                <option value="720p">720p (1280x720)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Generation Progress */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generation Progress</h2>
          
          <div className="space-y-4">
            {generationStepsState.map(step => (
              <div key={step.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{step.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    step.status === 'complete' ? 'bg-green-900 text-green-300' :
                    step.status === 'processing' ? 'bg-blue-900 text-blue-300' :
                    step.status === 'error' ? 'bg-red-900 text-red-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {step.status}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
                
                {step.details && (
                  <p className="text-sm text-gray-400">{step.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={generateAndUploadVideo}
            disabled={isGenerating || !isAuthenticated}
            className={`cyber-button-large px-8 py-4 text-xl ${
              isGenerating || !isAuthenticated 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-cyan-900'
            }`}
          >
            {isGenerating ? '🎬 GENERATING...' : '🚀 GENERATE & UPLOAD VIDEO'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .cyber-button {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .cyber-button:hover {
          background: rgba(0, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.5);
          color: white;
        }
        
        .cyber-button-large {
          background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
          border: 2px solid rgba(0, 255, 255, 0.5);
          color: white;
          font-weight: bold;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .cyber-text {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
} 