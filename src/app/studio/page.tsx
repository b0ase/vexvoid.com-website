'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import MusicUploader from '../components/MusicUploader'
import VideoGeneratorComponent from '../components/youtube/VideoGenerator'
import OrganicFlowDemo from '../components/youtube/OrganicFlowDemo'
import EnhancedVideoGenerator from '../components/youtube/EnhancedVideoGenerator'
import BatchGenerator from '../components/youtube/BatchGenerator'
import YouTubeAuth from '../components/youtube/YouTubeAuth'
import PublicGenerator from '../components/youtube/PublicGenerator'
import SimpleVideoGenerator from '../components/youtube/SimpleVideoGenerator'
import TestVideoGenerator from '../components/youtube/TestVideoGenerator'
import WorkingVideoGenerator from '../components/youtube/WorkingVideoGenerator'
import AdvancedVideoGenerator from '../components/youtube/AdvancedVideoGenerator'
import { getRandomImages } from '../lib/images'

const STUDIO_PASSWORD = 'shadow'

export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'music' | 'youtube'>('music')
  const [videos, setVideos] = useState([])
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [isYouTubeAuthenticated, setIsYouTubeAuthenticated] = useState(false)
  const [generatorMode, setGeneratorMode] = useState<'test' | 'simple' | 'enhanced' | 'public' | 'advanced'>('test')

  useEffect(() => {
    const savedAuth = localStorage.getItem('v3xv0id_studio_auth')
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

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
        <div className="flex gap-2 mb-6">
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
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2 lo-fi-text transition-colors ${
              activeTab === 'youtube'
                ? 'bg-white text-black' 
                : 'bg-black/50 border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            🎬 YOUTUBE
          </button>
        </div>

        {/* Music Tab */}
        {activeTab === 'music' && (
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🎵 Music Management</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Upload and manage V3XV0ID music tracks in Supabase Storage.
            </p>
            <MusicUploader />
          </div>
        )}

        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div className="space-y-6">
            {/* Channel Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="border border-white/20 p-3">
                <div className="text-sm md:text-base lo-fi-text">{24 + generatedVideos.length}</div>
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
              <h3 className="text-lg font-bold lo-fi-text mb-4">YouTube Authentication</h3>
              <YouTubeAuth onAuthChange={setIsYouTubeAuthenticated} />
            </div>

            {/* Generator Mode Toggle */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">Video Generator</h3>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setGeneratorMode('test')}
                  className={`px-3 py-2 text-xs lo-fi-text border transition-colors ${
                    generatorMode === 'test'
                      ? 'border-white bg-white text-black' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  TEST (DEBUG)
                </button>
                <button
                  onClick={() => setGeneratorMode('simple')}
                  className={`px-3 py-2 text-xs lo-fi-text border transition-colors ${
                    generatorMode === 'simple'
                      ? 'border-white bg-white text-black' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  SIMPLE (WORKING)
                </button>
                <button
                  onClick={() => setGeneratorMode('enhanced')}
                  className={`px-3 py-2 text-xs lo-fi-text border transition-colors ${
                    generatorMode === 'enhanced'
                      ? 'border-white bg-white text-black' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  WORKING (FFMPEG)
                </button>
                <button
                  onClick={() => setGeneratorMode('public')}
                  className={`px-3 py-2 text-xs lo-fi-text border transition-colors ${
                    generatorMode === 'public'
                      ? 'border-white bg-white text-black' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  PUBLIC (BRAND SAFE)
                </button>
                <button
                  onClick={() => setGeneratorMode('advanced')}
                  className={`px-3 py-2 text-xs lo-fi-text border transition-colors ${
                    generatorMode === 'advanced'
                      ? 'border-white bg-white text-black' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  ADVANCED (P5.JS)
                </button>
              </div>

              {/* Video Generator - Different Modes */}
              <div>
                {generatorMode === 'test' && (
                  <TestVideoGenerator />
                )}
                {generatorMode === 'simple' && (
                  <SimpleVideoGenerator onVideoGenerated={handleVideoGenerated} />
                )}
                {generatorMode === 'enhanced' && (
                  <WorkingVideoGenerator onVideoGenerated={handleVideoGenerated} />
                )}
                {generatorMode === 'public' && (
                  <PublicGenerator onVideoGenerated={handleVideoGenerated} />
                )}
                {generatorMode === 'advanced' && (
                  <AdvancedVideoGenerator />
                )}
              </div>
            </div>

            {/* Live Art Preview */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">Live Generative Art Preview</h3>
              <OrganicFlowDemo width={400} height={400} />
            </div>

            {/* Batch Generator */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">Batch Generator</h3>
              <BatchGenerator onBatchComplete={(count) => {
                console.log(`Batch complete: ${count} videos generated`);
                setGeneratedVideos(prev => [...prev, ...Array(count).fill(0).map((_, i) => `batch-${Date.now()}-${i}`)]);
              }} />
            </div>

            {/* Generated Videos Alert */}
            {generatedVideos.length > 0 && (
              <div className="border border-green-500/50 bg-green-500/10 p-4">
                <h3 className="text-xs lo-fi-text text-green-400 mb-2">RECENTLY GENERATED</h3>
                <div className="space-y-1">
                  {generatedVideos.map((videoId, index) => (
                    <div key={videoId} className="text-xs text-green-300">
                      ✓ Video {videoId} generated successfully
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Grid */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">Latest Videos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                  <div key={video.id} className="border border-white/20 overflow-hidden hover:border-white/40 transition-colors">
                    <div className="relative aspect-video">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 px-1 text-xs">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="text-xs lo-fi-text mb-1 line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="text-[10px] text-white/70">
                        {video.views} views • {video.uploadDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Info */}
            <div className="bg-black/50 border border-white/20 p-6">
              <h3 className="text-lg font-bold lo-fi-text mb-4">Automated Workflow</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm lo-fi-text mb-2">GENERATION PIPELINE</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>1. Audio Analysis (BPM, Frequency, Beats)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>2. Concept Art Processing (Colors, Textures)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>3. Generative Visual Creation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>4. Video Composition & Encoding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>5. YouTube Upload & Metadata</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm lo-fi-text mb-2">VISUAL STYLES</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500"></div>
                      <span>Particle Systems - Audio-reactive emission</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500"></div>
                      <span>Glitch Effects - Digital corruption aesthetics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500"></div>
                      <span>Waveform Visuals - Real-time audio display</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500"></div>
                      <span>Abstract Shapes - Procedural geometry</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 