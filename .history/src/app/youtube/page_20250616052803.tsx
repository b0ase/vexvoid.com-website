'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function YouTubePage() {
  const [videos, setVideos] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock video data - will be replaced with YouTube API
  const mockVideos = [
    {
      id: 'echoes-abyss-1',
      title: 'Echoes in the Abyss - Visual Mix',
      thumbnail: '/images/VexVoid_concept_art/download.jpg',
      duration: '3:42',
      views: '1.2K',
      uploadDate: '2 days ago'
    },
    {
      id: 'shadowed-depths-1',
      title: 'Shadowed Depths - Generative Visuals',
      thumbnail: '/images/VexVoid_concept_art/download-1.jpg',
      duration: '4:15',
      views: '856',
      uploadDate: '1 week ago'
    }
  ]

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
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="border border-white/20 p-3">
            <div className="text-sm md:text-base cyber-text">12</div>
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

        {/* Video Generation Tools */}
        <div className="border border-white/20 p-4 mb-8">
          <h2 className="text-sm md:text-base cyber-text mb-4">GENERATIVE VIDEO TOOLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border border-white/10 p-3">
              <h3 className="text-xs cyber-text mb-2">AUDIO VISUALIZER</h3>
              <p className="text-[10px] text-white/70 mb-2">Generate reactive visuals from audio waveforms</p>
              <button className="bg-white text-black px-2 py-1 text-xs lo-fi-text">
                GENERATE
              </button>
            </div>
            
            <div className="border border-white/10 p-3">
              <h3 className="text-xs cyber-text mb-2">CONCEPT ART ANIMATOR</h3>
              <p className="text-[10px] text-white/70 mb-2">Animate concept art with particle effects</p>
              <button className="bg-white text-black px-2 py-1 text-xs lo-fi-text">
                ANIMATE
              </button>
            </div>
            
            <div className="border border-white/10 p-3">
              <h3 className="text-xs cyber-text mb-2">GLITCH EFFECTS</h3>
              <p className="text-[10px] text-white/70 mb-2">Add cyberpunk glitch transitions</p>
              <button className="bg-white text-black px-2 py-1 text-xs lo-fi-text">
                GLITCH
              </button>
            </div>
            
            <div className="border border-white/10 p-3">
              <h3 className="text-xs cyber-text mb-2">AUTO UPLOAD</h3>
              <p className="text-[10px] text-white/70 mb-2">Composite and upload to YouTube</p>
              <button className="border border-white text-white px-2 py-1 text-xs lo-fi-text">
                UPLOAD
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="mb-8">
          <h2 className="text-sm md:text-base cyber-text mb-4">LATEST VIDEOS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockVideos.map((video) => (
              <div key={video.id} className="border border-white/20 overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover filter grayscale"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1 text-xs">
                    {video.duration}
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

        {/* Upload Workflow */}
        <div className="border border-white/20 p-4">
          <h2 className="text-sm md:text-base cyber-text mb-4">AUTOMATED WORKFLOW</h2>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500"></div>
              <span>1. Audio Analysis Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500"></div>
              <span>2. Concept Art Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500"></div>
              <span>3. Generating Visuals...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500"></div>
              <span>4. Video Composition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500"></div>
              <span>5. YouTube Upload</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 