'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import VideoGeneratorComponent from './components/VideoGenerator'
import OrganicFlowDemo from './components/OrganicFlowDemo'
import EnhancedVideoGenerator from './components/EnhancedVideoGenerator'
import BatchGenerator from './components/BatchGenerator'
import YouTubeAuth from './components/YouTubeAuth'
import PublicGenerator from './components/PublicGenerator'
import SimpleVideoGenerator from './components/SimpleVideoGenerator'
import TestVideoGenerator from './components/TestVideoGenerator'
import { getRandomImages } from '../lib/images'

export default function YouTubePage() {
  const [videos, setVideos] = useState([])
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [isYouTubeAuthenticated, setIsYouTubeAuthenticated] = useState(false)
  const [showPublicGenerator, setShowPublicGenerator] = useState(false)
  const [generatorMode, setGeneratorMode] = useState<'test' | 'simple' | 'enhanced' | 'public'>('test')

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
    },
    {
      id: 'shadows-mind-1',
      title: 'Shadows of the Mind - Extended Mix',
      thumbnail: randomThumbnails[4]?.path || '/images/VexVoid_concept_art_3/download-10.jpg',
      duration: '4:48',
      views: '943',
      uploadDate: '1 week ago'
    },
    {
      id: 'echoes-mist-1',
      title: 'Echoes in the Mist - Generative Art',
      thumbnail: randomThumbnails[5]?.path || '/images/VexVoid_concept_art_2/download-5.jpg',
      duration: '5:18',
      views: '1.5K',
      uploadDate: '4 days ago'
    },
    {
      id: 'echoes-fog-1',
      title: 'Echoes in the Fog - Minimal Mix',
      thumbnail: randomThumbnails[6]?.path || '/images/VexVoid_concept_art_3/download-15.jpg',
      duration: '4:00',
      views: '1.3K',
      uploadDate: '6 days ago'
    },
    {
      id: 'shadowed-whispers-1',
      title: 'Shadowed Whispers - Deep Ambient',
      thumbnail: randomThumbnails[7]?.path || '/images/VexVoid_concept_art_2/download-7.jpg',
      duration: '5:12',
      views: '2.4K',
      uploadDate: '1 day ago'
    }
  ]

  const handleVideoGenerated = (videoId: string) => {
    setGeneratedVideos(prev => [...prev, videoId])
    console.log('New video generated:', videoId)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg md:text-xl cyber-text mb-2">V3XV0ID YOUTUBE</h1>
          <p className="text-xs md:text-sm text-white/70">GENERATIVE VISUALS + MUSIC</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Channel Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8 text-center">
          <div className="border border-white/20 p-3">
            <div className="text-sm md:text-base cyber-text">{24 + generatedVideos.length}</div>
            <div className="text-xs text-white/70">TRACKS</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-sm md:text-base cyber-text">{12 + generatedVideos.length}</div>
            <div className="text-xs text-white/70">VIDEOS</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-sm md:text-base cyber-text">2.1K</div>
            <div className="text-xs text-white/70">SUBSCRIBERS</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-sm md:text-base cyber-text">15.3K</div>
            <div className="text-xs text-white/70">VIEWS</div>
          </div>
        </div>

        {/* YouTube Authentication */}
        <div className="mb-8">
          <YouTubeAuth onAuthChange={setIsYouTubeAuthenticated} />
        </div>

        {/* Generator Mode Toggle */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setGeneratorMode('test')}
            className={`px-3 py-2 text-xs font-mono border transition-colors ${
              generatorMode === 'test'
                ? 'border-white bg-white text-black' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            TEST (DEBUG)
          </button>
          <button
            onClick={() => setGeneratorMode('simple')}
            className={`px-3 py-2 text-xs font-mono border transition-colors ${
              generatorMode === 'simple'
                ? 'border-white bg-white text-black' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            SIMPLE (WORKING)
          </button>
          <button
            onClick={() => setGeneratorMode('enhanced')}
            className={`px-3 py-2 text-xs font-mono border transition-colors ${
              generatorMode === 'enhanced'
                ? 'border-white bg-white text-black' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            ENHANCED (FFMPEG)
          </button>
          <button
            onClick={() => setGeneratorMode('public')}
            className={`px-3 py-2 text-xs font-mono border transition-colors ${
              generatorMode === 'public'
                ? 'border-white bg-white text-black' 
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            PUBLIC (BRAND SAFE)
          </button>
        </div>

        {/* Video Generator - Different Modes */}
        <div className="mb-8">
          {generatorMode === 'test' && (
            <TestVideoGenerator />
          )}
          {generatorMode === 'simple' && (
            <SimpleVideoGenerator onVideoGenerated={handleVideoGenerated} />
          )}
          {generatorMode === 'enhanced' && (
            <EnhancedVideoGenerator onVideoGenerated={handleVideoGenerated} />
          )}
          {generatorMode === 'public' && (
            <PublicGenerator onVideoGenerated={handleVideoGenerated} />
          )}
        </div>

        {/* Live Art Preview */}
        <div className="mb-8">
          <h2 className="text-sm md:text-base cyber-text mb-4">LIVE GENERATIVE ART PREVIEW</h2>
          <OrganicFlowDemo width={400} height={400} />
        </div>

        {/* Batch Generator */}
        <div className="mb-8">
          <BatchGenerator onBatchComplete={(count) => {
            console.log(`Batch complete: ${count} videos generated`);
            // Update generated videos count
            setGeneratedVideos(prev => [...prev, ...Array(count).fill(0).map((_, i) => `batch-${Date.now()}-${i}`)]);
          }} />
        </div>

        {/* Generated Videos Alert */}
        {generatedVideos.length > 0 && (
          <div className="border border-green-500/50 bg-green-500/10 p-4 mb-8">
            <h3 className="text-xs cyber-text text-green-400 mb-2">RECENTLY GENERATED</h3>
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
        <div className="mb-8">
          <h2 className="text-sm md:text-base cyber-text mb-4">LATEST VIDEOS</h2>
          
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
                  <h3 className="text-xs cyber-text mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="text-[10px] text-white/70">
                    {video.views} views • {video.uploadDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Info */}
        <div className="border border-white/20 p-4">
          <h2 className="text-sm md:text-base cyber-text mb-4">AUTOMATED WORKFLOW</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs cyber-text mb-2">GENERATION PIPELINE</h3>
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
              <h3 className="text-xs cyber-text mb-2">VISUAL STYLES</h3>
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
    </div>
  )
} 