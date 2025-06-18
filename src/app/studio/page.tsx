'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import MusicUploader from '../components/MusicUploader'
import VexVoidAI from '../components/ai/VexVoidAI'
import VexVoidSuno from '../components/studio/VexVoidSuno'
import CinematicEditor from '../components/studio/CinematicEditor'
import CanvaEditor from '../components/studio/CanvaEditor'
import TwitterBot from '../components/studio/TwitterBot'
import ActualVideoEditor from '../components/youtube/ActualVideoEditor'
import SimpleVideoGenerator from '../components/youtube/SimpleVideoGenerator'
import TimelineVideoEditor from '../components/studio/TimelineVideoEditor'
// Note: Some components removed/consolidated into studio
// import MusicManager from '../components/studio/MusicManager'
// import AssetManager from '../components/studio/AssetManager'
// import ContentCalendar from '../components/studio/ContentCalendar'
// import AIAgent from '../components/studio/AIAgent'
import { getRandomImages } from '../lib/images'
import { YouTubeClient, generateVideoMetadata, UploadProgress } from '../lib/youtubeClient'

const STUDIO_PASSWORD = 'shadow'

// Complete music track list from /public/music
const AVAILABLE_MUSIC_TRACKS = [
  'Echoes in the Abyss.mp3',
  'Echoes in the Abyss (1).mp3',
  'Echoes in the Dust.mp3', 
  'Echoes in the Dust (1).mp3',
  'Echoes in the Dust (2).mp3',
  'Echoes in the Fog.mp3',
  'Echoes in the Fog (1).mp3',
  'Echoes in the Mist.mp3',
  'Echoes in the Mist (1).mp3',
  'Four Ton Shadow.mp3',
  'Four Ton Shadow (1).mp3',
  'Four Ton Shadow (2).mp3',
  'Four Ton Shadow (3).mp3',
  'Four Ton Shadow (4).mp3',
  'Four Ton Shadow (5).mp3',
  'Four Ton Shadows.mp3',
  'Four Ton Shadows (1).mp3',
  'Midnight Reverie.mp3',
  'Midnight Reverie (1).mp3',
  'Shadow Steps.mp3',
  'Shadow Steps (1).mp3',
  'Shadowed Depths.mp3',
  'Shadowed Depths (1).mp3',
  'Shadowed Whispers.mp3',
  'Shadowed Whispers (1).mp3',
  'Shadows and Silhouettes.mp3',
  'Shadows and Silhouettes (1).mp3',
  'Shadows in the Smoke.mp3',
  'Shadows in the Smoke (1).mp3',
  'Shadows of the Mind.mp3',
  'Shadows of the Mind (1).mp3',
  'Shadows of the Mind (2).mp3',
  'Shadows of the Mind (3).mp3',
  'Shadows of the Past.mp3',
  'Shadows of the Past (1).mp3',
  'Shadows of the Street.mp3',
  'Shadows of the Street (1).mp3',
  'Silent Shadows.mp3',
  'Silent Shadows (1).mp3',
  'Whispering Shadows.mp3',
  'Whispering Shadows (1).mp3',
  'Whispers in the Smoke.mp3',
  'Whispers in the Smoke (1).mp3',
  'Whispers in the Wind.mp3'
]

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
  visualStyle: 'video-composite' | 'professional-mix' | 'train-atmosphere' | 'organic-flow' | 'particles' | 'waveform' | 'veo3'
  duration: number
  resolution: '1080p' | '720p' | '4k'
  compositionMode?: 'layered' | 'montage' | 'blend' | 'glitch'
  audioMix?: 'music-only' | 'subtle-atmosphere' | 'train-interludes' | 'full-mix'
  vexVoidAesthetic?: 'graffiti_culture' | 'train_yards' | 'neon_noir' | 'urban_decay' | 'ninja_jazz'
  filmDamage?: 'none' | 'subtle' | 'moderate' | 'heavy' | 'projection_glitch'
}

// Placeholder components for missing studio components
const MusicManager = () => (
  <div className="border border-white/20 p-4 text-center">
    <p className="text-white/70 text-sm">Music Manager Component - To be implemented</p>
  </div>
)

const AssetManager = () => (
  <div className="space-y-6">
    <div className="bg-black/50 border border-white/20 p-6">
      <h3 className="text-lg font-bold lo-fi-text mb-4">📦 Current Asset Collections</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">VexVoid Concept Art</div>
          <div className="text-white/70">8 images</div>
          <div className="text-white/50">/images/VexVoid_concept_art/</div>
        </div>
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">VexVoid Landscapes</div>
          <div className="text-white/70">19 images</div>
          <div className="text-white/50">/images/VexVoid_Landscape/</div>
        </div>
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">VexVoid Portraits</div>
          <div className="text-white/70">5 images</div>
          <div className="text-white/50">/images/VexVoid_Portrait/</div>
        </div>
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">Graffiti Train Jam</div>
          <div className="text-white/70">80+ images</div>
          <div className="text-white/50">/images/VexVoid_graf_train_jam/</div>
        </div>
        <div className="border border-green-500/20 p-3 bg-green-500/5">
          <div className="font-bold text-green-400">🆕 V3X Video Jam 01</div>
          <div className="text-green-300">31 images</div>
          <div className="text-green-200">/images/v3x_vide0_Jam_01/</div>
        </div>
        <div className="border border-green-500/20 p-3 bg-green-500/5">
          <div className="font-bold text-green-400">🆕 Video Collection</div>
          <div className="text-green-300">33 videos (~250MB)</div>
          <div className="text-green-200">/videos/vex_video_jam_01/</div>
        </div>
      </div>
    </div>

    <div className="bg-black/50 border border-green-500/20 p-6">
      <h3 className="text-lg font-bold lo-fi-text mb-4 text-green-400">🎬 Video Asset Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">Professional Mode</div>
          <div className="text-white/70">17 videos (6-15MB each)</div>
          <div className="text-white/50">High-quality cinematic clips</div>
        </div>
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">Standard Mode</div>
          <div className="text-white/70">8 videos (1-7MB each)</div>
          <div className="text-white/50">Standard quality clips</div>
        </div>
        <div className="border border-white/20 p-3">
          <div className="font-bold text-white">Train/Urban Audio</div>
          <div className="text-white/70">8 videos with sound</div>
          <div className="text-white/50">Atmospheric audio tracks</div>
        </div>
      </div>
    </div>

    <div className="bg-black/50 border border-yellow-500/20 p-6">
      <h3 className="text-lg font-bold lo-fi-text mb-4 text-yellow-400">⚠️ Upload Required</h3>
      <div className="text-yellow-300 text-sm space-y-2">
        <p>• <strong>All assets are currently local</strong> - Need to upload to Supabase Storage</p>
        <p>• <strong>Images:</strong> ~100+ images across 6 collections</p>
        <p>• <strong>Videos:</strong> 33 video clips totaling ~250MB</p>
        <p>• <strong>Next Step:</strong> Use Asset Uploader below to migrate to cloud storage</p>
      </div>
    </div>

    <AssetUploader />
  </div>
)

const AssetUploader = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<any[]>([])
  const [totalProgress, setTotalProgress] = useState(0)

  const assetCollections = [
            { name: 'VexVoid Concept Art', path: '/images/VexVoid_concept_art', bucket: 'v3xv0id-images', folder: 'concept_art' },
        { name: 'VexVoid Concept Art 2', path: '/images/VexVoid_concept_art_2', bucket: 'v3xv0id-images', folder: 'concept_art_2' },
        { name: 'VexVoid Concept Art 3', path: '/images/VexVoid_concept_art_3', bucket: 'v3xv0id-images', folder: 'concept_art_3' },
        { name: 'VexVoid Landscapes', path: '/images/VexVoid_Landscape', bucket: 'v3xv0id-images', folder: 'landscapes' },
        { name: 'VexVoid Portraits', path: '/images/VexVoid_Portrait', bucket: 'v3xv0id-images', folder: 'portraits' },
        { name: 'VexVoid Graffiti Train', path: '/images/VexVoid_graf_train_jam', bucket: 'v3xv0id-images', folder: 'graffiti_train' },
        { name: 'V3X Video Jam Images', path: '/images/v3x_vide0_Jam_01', bucket: 'v3xv0id-images', folder: 'video_jam_01' },
        { name: 'V3X Video Jam Videos', path: '/videos/vex_video_jam_01', bucket: 'v3xv0id-videos', folder: 'vex_video_jam_01' }
  ]

  const startUpload = async () => {
    setIsUploading(true)
    setUploadProgress(assetCollections.map(c => ({ filename: c.name, status: 'pending', progress: 0 })))
    
    let completed = 0
    for (let i = 0; i < assetCollections.length; i++) {
      const collection = assetCollections[i]
      
      setUploadProgress(prev => prev.map((item, index) => 
        index === i ? { ...item, status: 'uploading' } : item
      ))

      try {
        const response = await fetch('/api/assets/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collection)
        })

        if (response.ok) {
          setUploadProgress(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'complete', progress: 100 } : item
          ))
          completed++
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, status: 'error', error: 'Upload failed' } : item
        ))
      }
      
      setTotalProgress((completed / assetCollections.length) * 100)
    }
    
    setIsUploading(false)
  }

  return (
    <div className="bg-black/50 border border-white/20 p-6">
      <h3 className="text-lg font-bold lo-fi-text mb-4">🚀 Asset Upload Manager</h3>
      
      {uploadProgress.length > 0 && (
        <div className="mb-6 space-y-2">
          {uploadProgress.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'complete' ? 'bg-green-500' :
                item.status === 'uploading' ? 'bg-yellow-500 animate-pulse' :
                item.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <div className="flex-1 text-white text-xs lo-fi-text">{item.filename}</div>
              <div className="text-white/70 text-xs">{item.progress}%</div>
            </div>
          ))}
          <div className="w-full bg-gray-700 h-2 mt-4">
            <div className="bg-cyan-400 h-2 transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      )}

      <button
        onClick={startUpload}
        disabled={isUploading}
        className={`w-full py-3 px-4 lo-fi-text font-bold transition-colors ${
          isUploading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
        }`}
      >
        {isUploading ? 'UPLOADING...' : '📦 UPLOAD ALL ASSETS TO SUPABASE'}
      </button>
      
      <p className="text-xs text-white/70 mt-3">
        This will upload ~100+ images and 33 videos (~250MB total) to Supabase Storage
      </p>
    </div>
  )
}

const ContentCalendar = () => (
  <div className="border border-white/20 p-4 text-center">
    <p className="text-white/70 text-sm">Content Calendar Component - To be implemented</p>
  </div>
)

const VideoEditorTabs = () => {
  const [editorTab, setEditorTab] = useState<'timeline' | 'server' | 'browser' | 'cinematic'>('timeline')

  return (
    <div className="space-y-6">
      {/* Video Editor Tab Navigation */}
      <div className="border border-cyan-400/30 rounded-lg p-4">
        <div className="flex space-x-2 mb-4 flex-wrap">
          <button
            onClick={() => setEditorTab('timeline')}
            className={`px-4 py-2 lo-fi-text text-sm transition-colors ${
              editorTab === 'timeline'
                ? 'bg-cyan-400 text-black'
                : 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10'
            }`}
          >
            🎞️ Timeline Editor (NEW)
          </button>
          <button
            onClick={() => setEditorTab('server')}
            className={`px-4 py-2 lo-fi-text text-sm transition-colors ${
              editorTab === 'server'
                ? 'bg-cyan-400 text-black'
                : 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10'
            }`}
          >
            🖥️ Server-Side
          </button>
          <button
            onClick={() => setEditorTab('browser')}
            className={`px-4 py-2 lo-fi-text text-sm transition-colors ${
              editorTab === 'browser'
                ? 'bg-cyan-400 text-black'
                : 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10'
            }`}
          >
            🌐 Browser-Based
          </button>
          <button
            onClick={() => setEditorTab('cinematic')}
            className={`px-4 py-2 lo-fi-text text-sm transition-colors ${
              editorTab === 'cinematic'
                ? 'bg-cyan-400 text-black'
                : 'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10'
            }`}
          >
            🎬 Cinematic Effects
          </button>
        </div>
        
        <div className="text-sm text-cyan-400/70 lo-fi-text">
          {editorTab === 'timeline' && (
            <p>🆕 Professional multi-track timeline editor with Supabase asset browser - 2 video tracks, 2 image tracks, 4 audio tracks</p>
          )}
          {editorTab === 'server' && (
            <p>Uses server-side FFmpeg for reliable, high-quality video generation</p>
          )}
          {editorTab === 'browser' && (
            <p>Experimental browser-based video encoding - may have filesystem errors</p>
          )}
          {editorTab === 'cinematic' && (
            <p>Advanced cinematic effects and post-processing tools</p>
          )}
        </div>
      </div>

      {/* Video Editor Content */}
      <div className="bg-black/30 border border-white/10 rounded-lg">
        {editorTab === 'timeline' && <TimelineVideoEditor />}
        {editorTab === 'server' && <SimpleVideoGenerator />}
        {editorTab === 'browser' && <ActualVideoEditor />}
        {editorTab === 'cinematic' && <CinematicEditor />}
      </div>
    </div>
  )
}



export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'music' | 'suno' | 'youtube' | 'assets' | 'calendar' | 'ai' | 'editor' | 'twitter'>('music')

  // Handle URL tab parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab && ['music', 'suno', 'youtube', 'assets', 'calendar', 'ai', 'editor', 'twitter'].includes(tab)) {
      setActiveTab(tab as any)
    }
  }, [])
  const [videos, setVideos] = useState([])
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [isYouTubeAuthenticated, setIsYouTubeAuthenticated] = useState(false)
  const [generatorMode, setGeneratorMode] = useState<'test' | 'simple' | 'enhanced' | 'public' | 'advanced'>('test')
  
  // YouTube Integration State
  const [youtubeClient] = useState(() => new YouTubeClient())
  const [channelInfo, setChannelInfo] = useState<any>(null)
  const [authError, setAuthError] = useState<string>('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [credentialsConfigured, setCredentialsConfigured] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Video Generation State
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    audioFile: AVAILABLE_MUSIC_TRACKS[0],
    musicTitle: 'Echoes in the Abyss',
    visualStyle: 'organic-flow',
    duration: 180,
    resolution: '1080p'
  })
  
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: 'audio-analysis', name: 'Audio Analysis', status: 'pending', progress: 0 },
    { id: 'visual-generation', name: 'Visual Generation', status: 'pending', progress: 0 },
    { id: 'video-composition', name: 'Video Composition', status: 'pending', progress: 0 },
    { id: 'youtube-upload', name: 'YouTube Upload', status: 'pending', progress: 0 }
  ])

  useEffect(() => {
    const savedAuth = localStorage.getItem('v3xv0id_studio_auth')
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
    
    // Check YouTube credentials and auth status
    checkYouTubeCredentialsAndAuth()
  }, [])

  const checkYouTubeCredentialsAndAuth = async () => {
    setIsCheckingAuth(true)
    setAuthError('')
    
    try {
      // Check if credentials are configured
      const response = await fetch('/api/youtube/auth')
      const data = await response.json()
      
      if (!response.ok) {
        if (data.error?.includes('credentials not configured')) {
          setCredentialsConfigured(false)
          setAuthError('YouTube API credentials not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local')
        } else {
          setAuthError(`Setup error: ${data.error}`)
        }
        setIsCheckingAuth(false)
        return
      }
      
      setCredentialsConfigured(true)
      
      // Check if user is already authenticated
      const isAuth = await youtubeClient.checkAuth()
      if (isAuth) {
        setIsYouTubeAuthenticated(true)
        loadChannelInfo()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthError(`Connection error: ${error}`)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const loadChannelInfo = async () => {
    try {
      const info = await youtubeClient.getChannelInfo()
      setChannelInfo(info)
    } catch (error) {
      console.error('Failed to load channel info:', error)
      setAuthError(`Failed to load channel info: ${error}`)
    }
  }

  const authenticateWithYouTube = async () => {
    try {
      setAuthError('')
      const authUrl = await youtubeClient.getAuthUrl()
      // Open in popup window
      const popup = window.open(authUrl, 'youtube-auth', 'width=600,height=600')
      
      // Listen for popup to close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          // Re-check auth status
          setTimeout(() => {
            checkYouTubeCredentialsAndAuth()
          }, 1000)
        }
      }, 1000)
    } catch (error) {
      console.error('Authentication failed:', error)
      setAuthError(`Failed to start authentication: ${error}`)
    }
  }

  const updateStep = (stepId: string, status: GenerationStep['status'], progress: number, details?: string) => {
    setGenerationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress, details }
        : step
    ))
  }

  const generateVideo = async () => {
    if (!isYouTubeAuthenticated) {
      setAuthError('Please authenticate with YouTube first')
      return
    }
    
    setIsGenerating(true)
    setGenerationSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })))
    
    try {
      // Step 1: Audio Analysis
      updateStep('audio-analysis', 'processing', 0, 'Loading audio file...')
      const audioData = await analyzeAudio(videoConfig.audioFile)
      updateStep('audio-analysis', 'complete', 100, `BPM: ${audioData.bpm}, Duration: ${audioData.duration}s`)
      
      // Step 2: Visual Generation
      updateStep('visual-generation', 'processing', 0, `Generating ${videoConfig.visualStyle} visuals...`)
      const visualData = await generateVisuals(videoConfig.visualStyle, audioData)
      updateStep('visual-generation', 'complete', 100, 'Visuals generated successfully')
      
      // Step 3: Video Composition (FFmpeg)
      updateStep('video-composition', 'processing', 0, 'Composing video with FFmpeg...')
      const videoBlob = await composeVideoWithFFmpeg(visualData, audioData)
      updateStep('video-composition', 'complete', 100, 'Video composition complete')
      
      // Step 4: YouTube Upload
      updateStep('youtube-upload', 'processing', 0, 'Uploading to YouTube...')
      const videoId = await uploadToYouTube(videoBlob)
      updateStep('youtube-upload', 'complete', 100, `Uploaded: ${videoId}`)
      
      setGeneratedVideos(prev => [...prev, videoId])
      
    } catch (error) {
      console.error('Video generation failed:', error)
      setAuthError(`Video generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeAudio = async (audioFile: string) => {
    // Real audio analysis implementation
    const audioContext = new AudioContext()
    const response = await fetch(`/music/${audioFile}`)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Analyze audio for BPM, key, etc.
    return {
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      bpm: 128, // Would be detected via beat detection
      key: 'A minor',
      energy: 0.8,
      danceability: 0.7
    }
  }

  const generateVisuals = async (style: string, audioData: any) => {
    if (style === 'veo3') {
      // Use Veo3 API for AI video generation
      const response = await fetch('/api/veo3/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Abstract cyberpunk music video, ${audioData.bpm} BPM, dark aesthetic, flowing particles, ${audioData.duration} seconds`,
          duration: audioData.duration,
          style: 'cinematic'
        })
      })
      
      if (!response.ok) {
        throw new Error('Veo3 generation failed')
      }
      
      return await response.json()
    } else {
      // Generate with custom algorithms
      return {
        style,
        frames: Math.floor(audioData.duration * 30), // 30 FPS
        audioData
      }
    }
  }

  const composeVideoWithFFmpeg = async (visualData: any, audioData: any) => {
    // This would call a server-side FFmpeg API
    const response = await fetch('/api/video/compose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioFile: videoConfig.audioFile,
        visualData,
        audioData,
        resolution: videoConfig.resolution
      })
    })
    
    if (!response.ok) {
      throw new Error('Video composition failed')
    }
    
    return await response.blob()
  }

  const uploadToYouTube = async (videoBlob: Blob) => {
    const metadata = generateVideoMetadata(videoConfig.visualStyle, videoConfig.musicTitle, videoConfig.duration)
    
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      
      formData.append('video', videoBlob)
      formData.append('metadata', JSON.stringify(metadata))
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setUploadProgress(progress)
          updateStep('youtube-upload', 'processing', progress, `Uploading: ${Math.round(progress)}%`)
        }
      }
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.videoId)
        } else {
          reject(new Error('Upload failed'))
        }
      }
      
      xhr.onerror = () => reject(new Error('Upload failed'))
      
      xhr.open('POST', '/api/youtube/upload')
      xhr.send(formData)
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === STUDIO_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('v3xv0id_studio_auth', 'authenticated')
      setPassword('')
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('v3xv0id_studio_auth')
  }

  // Mock video data using random concept art images
  const randomThumbnails = getRandomImages(8)
  const mockVideos = [
    {
      id: 'echoes-abyss-1',
      title: 'Echoes in the Abyss - Visual Mix',
      thumbnail: randomThumbnails[0]?.path || '/images/VexVoid_concept_art/download.jpg',
      duration: '2:24',
      views: '1.2K',
      uploadDate: '2 days ago'
    },
    {
      id: 'shadowed-depths-1',
      title: 'Shadowed Depths - Generative Visuals',
      thumbnail: randomThumbnails[1]?.path || '/images/VexVoid_concept_art/download-1.jpg',
      duration: '4:06',
      views: '856',
      uploadDate: '1 week ago'
    },
    {
      id: 'midnight-reverie-1',
      title: 'Midnight Reverie - Atmospheric Journey',
      thumbnail: randomThumbnails[2]?.path || '/images/VexVoid_concept_art_2/download.jpg',
      duration: '6:18',
      views: '2.1K',
      uploadDate: '3 days ago'
    },
    {
      id: 'whispers-smoke-1',
      title: 'Whispers in the Smoke - Dark Ambient',
      thumbnail: randomThumbnails[3]?.path || '/images/VexVoid_concept_art_3/download.jpg',
      duration: '5:24',
      views: '1.8K',
      uploadDate: '5 days ago'
    }
  ]

  const handleVideoGenerated = (videoId: string) => {
    setGeneratedVideos(prev => [...prev, videoId])
    console.log('New video generated:', videoId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-cyber-white lo-fi-text">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="bg-black/90 border border-white p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white lo-fi-text mb-2">V3XV0ID STUDIO</h1>
            <p className="text-white/70 text-sm lo-fi-text">Access restricted</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm lo-fi-text mb-2">
                Enter Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white p-2 text-white lo-fi-text focus:outline-none focus:border-cyan-400"
                placeholder="Password required..."
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-white text-black py-2 px-4 lo-fi-text hover:bg-gray-200 transition-colors"
            >
              ACCESS STUDIO
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      <div className="border-b border-white/20 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold lo-fi-text">V3XV0ID STUDIO</h1>
            <p className="text-white/70 text-sm lo-fi-text">Content Creation & Management</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="text-white/70 hover:text-white lo-fi-text text-sm"
            >
              ← Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm lo-fi-text"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('music')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'music'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🎵 MUSIC
          </button>
          <button
            onClick={() => setActiveTab('suno')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'suno'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🎵 SUNO
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'youtube'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🎬 YOUTUBE
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'assets'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            📁 ASSETS
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'calendar'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            📅 CALENDAR
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'ai'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🤖 AI AGENT
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'editor'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🎥 EDITOR
          </button>
          <button
            onClick={() => setActiveTab('twitter')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'twitter'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🐦 TWITTER
          </button>
        </div>

        {/* Music Tab */}
        {activeTab === 'music' && (
          <div className="space-y-6">
            <div className="bg-black/50 border border-white/20 p-6">
              <h2 className="text-xl font-bold lo-fi-text mb-4">🎵 Music Management</h2>
              <p className="text-white/70 text-sm lo-fi-text mb-4">
                Upload and manage V3XV0ID music tracks in Supabase Storage.
              </p>
              <MusicUploader />
            </div>
            
            <div className="bg-black/50 border border-white/20 p-6">
              <h2 className="text-xl font-bold lo-fi-text mb-4">🎧 Music Library</h2>
              <MusicManager />
            </div>
          </div>
        )}

        {/* Suno Tab - AUTOMATED VEX VOID MUSIC GENERATION */}
        {activeTab === 'suno' && (
          <VexVoidSuno />
        )}

        {/* YouTube Tab - COMPLETELY REDESIGNED */}
        {activeTab === 'youtube' && (
          <div className="space-y-6">
            {/* Channel Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="border border-white/20 p-3">
                <div className="text-sm md:text-base lo-fi-text">{AVAILABLE_MUSIC_TRACKS.length}</div>
                <div className="text-xs text-white/70">TRACKS</div>
              </div>
              <div className="border border-white/20 p-3">
                <div className="text-sm md:text-base lo-fi-text">{12 + generatedVideos.length}</div>
                <div className="text-xs text-white/70">VIDEOS</div>
              </div>
              <div className="border border-white/20 p-3">
                <div className="text-sm md:text-base lo-fi-text">2.1K</div>
                <div className="text-xs text-white/70">SUBSCRIBERS</div>
              </div>
              <div className="border border-white/20 p-3">
                <div className="text-sm md:text-base lo-fi-text">15.3K</div>
                <div className="text-xs text-white/70">VIEWS</div>
              </div>
            </div>

            {/* YouTube Authentication */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">🔐 YouTube Authentication</h3>
              
              {!credentialsConfigured ? (
                <div className="border border-red-500/50 bg-red-500/10 p-4 mb-4">
                  <h4 className="text-red-400 font-bold text-sm mb-2">CREDENTIALS NOT CONFIGURED</h4>
                  <p className="text-red-300 text-xs mb-2">
                    Please add your Google Cloud Console credentials to .env.local:
                  </p>
                  <pre className="bg-black p-2 text-xs text-white/70 mb-2">
{`GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret`}
                  </pre>
                  <p className="text-red-300 text-xs">
                    Make sure to add both http://localhost:3000/api/youtube/callback and http://localhost:3001/api/youtube/callback to your OAuth redirect URIs.
                  </p>
                </div>
              ) : isCheckingAuth ? (
                <div className="text-white/70 text-sm">Checking authentication status...</div>
              ) : isYouTubeAuthenticated ? (
                <div className="border border-green-500/50 bg-green-500/10 p-4">
                  <h4 className="text-green-400 font-bold text-sm mb-2">✅ AUTHENTICATED</h4>
                  {channelInfo && (
                    <div className="text-green-300 text-xs">
                      <p>Channel: {channelInfo.snippet?.title}</p>
                      <p>Subscribers: {channelInfo.statistics?.subscriberCount}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={authenticateWithYouTube}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 lo-fi-text mb-4"
                  >
                    🔗 Connect to YouTube
                  </button>
                  {authError && (
                    <div className="text-red-400 text-xs mt-2">{authError}</div>
                  )}
                </div>
              )}
            </div>

            {/* Video Generation Configuration */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">🎬 Video Generation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Music Selection */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Select Track:</label>
                  <select
                    value={videoConfig.audioFile}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      audioFile: e.target.value,
                      musicTitle: e.target.value.replace('.mp3', '').replace(/\s*\(\d+\)$/, '')
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    {AVAILABLE_MUSIC_TRACKS.map(track => (
                      <option key={track} value={track}>{track}</option>
                    ))}
                  </select>
                </div>

                {/* Visual Style */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Visual Style:</label>
                  <select
                    value={videoConfig.visualStyle}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      visualStyle: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="video-composite">🎬 Video Composite (Real Footage)</option>
                    <option value="professional-mix">🎭 Professional Mix (High Quality)</option>
                    <option value="train-atmosphere">🚂 Train Atmosphere (With Audio)</option>
                    <option value="organic-flow">🌊 Organic Flow (Custom Algorithm)</option>
                    <option value="particles">✨ Particle System</option>
                    <option value="waveform">📊 Audio Waveform</option>
                    <option value="veo3">🤖 Veo3 AI Generation</option>
                  </select>
                </div>

                {/* Composition Mode */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Composition Mode:</label>
                  <select
                    value={videoConfig.compositionMode || 'layered'}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      compositionMode: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="layered">🎭 Layered (Video + Image Overlays)</option>
                    <option value="montage">🎬 Montage (Quick Cuts)</option>
                    <option value="blend">🌈 Blend (Smooth Transitions)</option>
                    <option value="glitch">⚡ Glitch (Digital Corruption)</option>
                  </select>
                </div>

                {/* Audio Mix */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Audio Mix:</label>
                  <select
                    value={videoConfig.audioMix || 'music-only'}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      audioMix: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="music-only">🎵 Music Only</option>
                    <option value="subtle-atmosphere">🌫️ Subtle Atmosphere (10% ambient)</option>
                    <option value="train-interludes">🚂 Train Interludes (20% ambient)</option>
                    <option value="full-mix">🎭 Full Mix (50% ambient)</option>
                  </select>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Resolution:</label>
                  <select
                    value={videoConfig.resolution}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      resolution: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="4k">4K (Ultra HD) - Experimental</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Duration (seconds):</label>
                  <input
                    type="number"
                    value={videoConfig.duration}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      duration: parseInt(e.target.value, 10) || 180
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                    min="30"
                    max="600"
                  />
                </div>

                {/* Enhanced VEX VOID Aesthetic Controls */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">VEX VOID Aesthetic:</label>
                  <select
                    value={videoConfig.vexVoidAesthetic || 'graffiti_culture'}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      vexVoidAesthetic: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="graffiti_culture">🎨 Graffiti Culture (Aerosol + Tags)</option>
                    <option value="train_yards">🚂 Train Yards (Urban + Steel)</option>
                    <option value="neon_noir">🌃 Neon Noir (Dark + Cinematic)</option>
                    <option value="urban_decay">🏚️ Urban Decay (Atmospheric + Gritty)</option>
                    <option value="ninja_jazz">🥷 Ninja Jazz (Stealthy + Cool)</option>
                  </select>
                </div>

                {/* Film Damage Effects */}
                <div>
                  <label className="block text-white text-sm lo-fi-text mb-2">Film Damage:</label>
                  <select
                    value={videoConfig.filmDamage || 'subtle'}
                    onChange={(e) => setVideoConfig(prev => ({
                      ...prev,
                      filmDamage: e.target.value as any
                    }))}
                    className="w-full bg-black border border-white/20 text-white p-2 lo-fi-text text-xs"
                  >
                    <option value="none">None</option>
                    <option value="subtle">🎞️ Subtle (Light Scratches)</option>
                    <option value="moderate">🔥 Moderate (Light Leaks + Burns)</option>
                    <option value="heavy">💥 Heavy (Police Chase Damage)</option>
                    <option value="projection_glitch">📽️ Projection Glitch (Reel Changes)</option>
                  </select>
                </div>
              </div>

              {/* Style Preview */}
              <div className="mb-6 bg-black/30 border border-white/10 p-4">
                <h4 className="text-white font-bold text-sm mb-3">Style Preview:</h4>
                <div className="text-white/70 text-xs">
                  {videoConfig.visualStyle === 'video-composite' && (
                    <div>
                      <p><strong>Video Composite:</strong> Uses your real video footage as base layer</p>
                      <p>• Base: Professional/Standard mode videos</p>
                      <p>• Overlay: Concept art, landscapes, portraits</p>
                      <p>• Effects: Color grading, transitions, particle overlays</p>
                    </div>
                  )}
                  {videoConfig.visualStyle === 'professional-mix' && (
                    <div>
                      <p><strong>Professional Mix:</strong> High-quality cinematic composition</p>
                      <p>• Uses 17 professional mode videos (6-15MB each)</p>
                      <p>• Advanced color grading and effects</p>
                      <p>• Smooth transitions synchronized to music</p>
                    </div>
                  )}
                  {videoConfig.visualStyle === 'train-atmosphere' && (
                    <div>
                      <p><strong>Train Atmosphere:</strong> Urban graffiti aesthetic with ambient audio</p>
                      <p>• Train footage with graffiti overlays</p>
                      <p>• Atmospheric train sounds as interludes</p>
                      <p>• Street art and urban landscape integration</p>
                    </div>
                  )}
                  {videoConfig.visualStyle === 'veo3' && (
                    <div>
                      <p><strong>Veo3 AI:</strong> AI-generated video with V3XV0ID aesthetic</p>
                      <p>• Prompts based on music characteristics</p>
                      <p>• Style transfer to match V3XV0ID brand</p>
                      <p>• Hybrid: AI video + real asset overlays</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="mb-6">
                  <h4 className="text-white font-bold text-sm mb-4">Generation Progress:</h4>
                  <div className="space-y-3">
                    {generationSteps.map(step => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          step.status === 'complete' ? 'bg-green-500' :
                          step.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                          step.status === 'error' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm lo-fi-text">{step.name}</span>
                            <span className="text-white/70 text-xs">{step.progress}%</span>
                          </div>
                          {step.details && (
                            <div className="text-white/50 text-xs mt-1">{step.details}</div>
                          )}
                          {step.status === 'processing' && (
                            <div className="w-full bg-gray-700 h-1 mt-2">
                              <div 
                                className="bg-cyan-400 h-1 transition-all duration-300"
                                style={{ width: `${step.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateVideo}
                disabled={!isYouTubeAuthenticated || isGenerating}
                className={`w-full py-3 px-4 lo-fi-text font-bold transition-colors ${
                  !isYouTubeAuthenticated || isGenerating
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                {isGenerating ? 'GENERATING VIDEO...' : '🎬 GENERATE & UPLOAD VIDEO'}
              </button>

              {!isYouTubeAuthenticated && (
                <p className="text-red-400 text-xs mt-2 text-center">
                  Please authenticate with YouTube first
                </p>
              )}
            </div>

            {/* Generated Videos */}
            {generatedVideos.length > 0 && (
              <div className="bg-black/50 border border-white/20 p-6">
                <h3 className="text-lg font-bold lo-fi-text mb-4">✅ Recently Generated Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedVideos.map((videoId, index) => (
                    <div key={videoId} className="border border-white/20 p-3">
                      <div className="text-white text-sm lo-fi-text">Video #{index + 1}</div>
                      <div className="text-white/70 text-xs">ID: {videoId}</div>
                      <a 
                        href={`https://youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-xs"
                      >
                        View on YouTube →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Development Notes */}
            <div className="bg-black/50 border border-yellow-500/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4 text-yellow-400">⚠️ Development Status</h3>
              <div className="text-yellow-300 text-sm space-y-2">
                <p>• <strong>CRITICAL:</strong> Video generation is currently placeholder - needs real FFmpeg integration</p>
                <p>• <strong>TODO:</strong> Implement server-side video composition API at /api/video/compose</p>
                <p>• <strong>TODO:</strong> Develop mathematical basis for organic flow algorithm</p>
                <p>• <strong>TODO:</strong> Implement real particle physics system</p>
                <p>• <strong>TODO:</strong> Add beat detection and audio-visual synchronization</p>
                <p>• <strong>TODO:</strong> Complete Veo3 integration with second GCP account</p>
              </div>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">📁 Asset Management</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Manage images, concept art, and visual assets for video generation.
            </p>
            <AssetManager />
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">📅 Content Calendar</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Schedule and track your content publishing pipeline.
            </p>
            <ContentCalendar />
          </div>
        )}

        {/* AI Agent Tab */}
        {activeTab === 'ai' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🤖 V3XV0ID AI Agent</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Automated content creation, editing, and publishing system.
            </p>
            <VexVoidAI />
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🎥 Video Editor</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Complete video editing and generation suite with server-side and browser-based options.
            </p>
            
            <VideoEditorTabs />
          </div>
        )}

        {/* Twitter Bot Tab */}
        {activeTab === 'twitter' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🐦 Twitter Bot</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Automated V3XV0ID content posting to Twitter/X platform.
            </p>
            <TwitterBot />
          </div>
        )}
      </div>
    </div>
  )
} 