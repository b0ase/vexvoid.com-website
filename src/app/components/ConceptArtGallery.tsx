'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  getConceptArtImages,
  getAllStreetArtImages,
  getLandscapeImages,
  getPortraitImages,
  getAllCloudImages
} from '../lib/supabaseImages'

type VisualCategory = 'video' | 'concept' | 'street' | 'landscape' | 'portrait' | 'animated'

interface VisualTab {
  id: VisualCategory
  label: string
  description: string
  count: number
}

// Available video clips for the video preview
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/videos/vex_video_jam_01/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Urban Train Rush'
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (2).mp4'),
    title: 'Graffiti Train'
  },
  {
    id: 'train-rush-3',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (3).mp4'),
    title: 'Night Train'
  },
  {
    id: 'footsteps',
    path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'),
    title: 'Street Echoes'
  },
  {
    id: 'extended',
    path: getVideoUrl('Extended_Video.mp4'),
    title: 'Extended Vision'
  },
  {
    id: 'professional-1',
    path: getVideoUrl('Professional_Mode_Generated_Video.mp4'),
    title: 'Professional'
  },
  {
    id: 'professional-2',
    path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'),
    title: 'Pro Alt'
  },
  {
    id: 'standard-1',
    path: getVideoUrl('Standard_Mode_Generated_Video (1).mp4'),
    title: 'Standard Mode'
  }
]

const visualTabs: VisualTab[] = [
  {
    id: 'video',
    label: 'VIDEO PREVIEW',
    description: 'Live video experience with dynamic visuals',
    count: videoClips.length
  },
  {
    id: 'concept',
    label: 'CONCEPT ART',
    description: 'Digital concept art exploring the V3XV0ID aesthetic',
    count: getConceptArtImages().length
  },
  {
    id: 'street',
    label: 'STREET ART',
    description: 'Graffiti, train jams, and urban exploration photography',
    count: getAllStreetArtImages().length
  },
  {
    id: 'landscape',
    label: 'LANDSCAPES',
    description: 'Atmospheric landscapes and environmental scenes',
    count: getLandscapeImages().length
  },
  {
    id: 'portrait',
    label: 'PORTRAITS',
    description: 'Character studies and portrait photography',
    count: getPortraitImages().length
  },
  {
    id: 'animated',
    label: 'ANIMATED PATTERNS',
    description: 'Geometric patterns and mathematical visualizations',
    count: 0 // Placeholder
  }
]

// Curated selections - pick diverse, representative images
const getCuratedConceptArt = () => {
  // Pick 12 diverse images from concept art
  return getConceptArtImages().slice(0, 12)
}

const getCuratedStreetArt = () => {
  // Mix of graffiti and street photos - pick every 8th to get variety
  return getAllStreetArtImages().filter((_: any, idx: number) => idx % 8 === 0 || idx < 6).slice(0, 16)
}

const getCuratedLandscapes = () => {
  // Pick 12 diverse landscapes
  return getLandscapeImages().slice(0, 12)
}

const getCuratedPortraits = () => {
  // All portraits since there are only 4
  return getPortraitImages()
}

export default function VisualGallery() {
  const [activeTab, setActiveTab] = useState<VisualCategory>('video') // Default to video
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Video preview state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [overlayImages] = useState(() => getAllCloudImages().slice(0, 12))
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-rotate images every 4 seconds (for non-video tabs)
  useEffect(() => {
    if (activeTab === 'video') return
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const maxIndex = getCurrentCollection().length - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [activeTab])

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeTab])

  // Video management
  useEffect(() => {
    if (activeTab === 'video' && videoRef.current) {
      videoRef.current.volume = 0 // Mute video
      videoRef.current.playbackRate = 0.6 // Slower playback
      videoRef.current.muted = true
      
      // Auto-play video
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true)
      }).catch(() => {
        console.log('Video autoplay blocked')
      })
    }
  }, [activeTab, currentVideoIndex])

  // Cycle overlay images for video
  useEffect(() => {
    if (activeTab !== 'video') return
    
    const overlayInterval = setInterval(() => {
      setCurrentOverlayIndex(prev => (prev + 1) % overlayImages.length)
    }, 8000)
    
    return () => clearInterval(overlayInterval)
  }, [activeTab])

  // Auto-cycle videos
  useEffect(() => {
    if (activeTab !== 'video') return
    
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videoClips.length)
    }, 15000) // Change video every 15 seconds
    
    return () => clearInterval(videoInterval)
  }, [activeTab])

  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'concept': return getCuratedConceptArt()
      case 'street': return getCuratedStreetArt()
      case 'landscape': return getCuratedLandscapes()
      case 'portrait': return getCuratedPortraits()
      default: return []
    }
  }

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play()
        setIsVideoPlaying(true)
      }
    }
  }

  const renderVideoPreview = () => {
    const currentVideo = videoClips[currentVideoIndex]
    const currentOverlay = overlayImages[currentOverlayIndex]
    
    return (
      <div className="relative">
        {/* Main video display */}
        <div className="aspect-video max-w-4xl mx-auto relative overflow-hidden cyber-card mb-8">
          <video
            ref={videoRef}
            src={currentVideo.path}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            onEnded={() => {
              setCurrentVideoIndex(prev => (prev + 1) % videoClips.length)
            }}
          />
          
          {/* Overlay image */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-30 border border-white/20">
            <img
              src={currentOverlay.url}
              alt="Overlay"
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
          
          {/* Video info overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xs lo-fi-text opacity-70">
              VIDEO {currentVideoIndex + 1} / {videoClips.length}
            </div>
            <div className="text-sm font-mono">
              {currentVideo.title}
            </div>
          </div>
          
          {/* Play/pause button */}
          <button
            onClick={handleVideoPlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="bg-black/50 rounded-full p-4">
              <div className="text-white text-2xl">
                {isVideoPlaying ? '⏸️' : '▶️'}
              </div>
            </div>
          </button>
        </div>

        {/* Video navigation */}
        <div className="flex justify-center mt-6 gap-2">
          {videoClips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentVideoIndex(idx)}
              className={`w-2 h-2 transition-all duration-300 ${
                idx === currentVideoIndex 
                  ? 'bg-cyber-white' 
                  : 'bg-cyber-gray hover:bg-cyber-accent'
              }`}
            />
          ))}
        </div>

        {/* Video collection info */}
        <div className="mt-12 text-center">
          <div className="cyber-card p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-2xl font-mono cyber-text">{videoClips.length}</div>
                <div className="text-xs text-cyber-accent lo-fi-text">VIDEO CLIPS</div>
              </div>
              <div>
                <div className="text-2xl font-mono cyber-text">10:00</div>
                <div className="text-xs text-cyber-accent lo-fi-text">TOTAL RUNTIME</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-cyber-accent">
              Experience the full V3XV0ID visual journey with atmospheric video clips, 
              concept art overlays, and ambient soundscapes.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRotatingGallery = () => {
    const collection = getCurrentCollection()
    if (collection.length === 0) return null

    // Determine aspect ratio based on active tab
    const getAspectRatio = () => {
      switch (activeTab) {
        case 'portrait': return 'aspect-[3/4]' // Portrait aspect ratio
        case 'landscape': return 'aspect-video' // Landscape aspect ratio
        case 'street': return 'aspect-video' // Most street art is landscape
        default: return 'aspect-square' // Square for concept art
      }
    }

    return (
      <>
        {/* Main rotating display */}
        <div className="relative mb-12">
          <div className={`${getAspectRatio()} max-w-4xl mx-auto relative overflow-hidden cyber-card`}>
            {collection.map((img, idx) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${activeTab} ${idx + 1}`}
                  className="w-full h-full object-cover filter grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs lo-fi-text opacity-70">
                    {idx + 1} / {collection.length}
                  </div>
                  <div className="text-sm font-mono">
                    {activeTab.toUpperCase()} #{idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-6 gap-2">
            {collection.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'bg-cyber-white' 
                    : 'bg-cyber-gray hover:bg-cyber-accent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail grid - smaller selection */}
        <div className={`grid gap-4 max-w-4xl mx-auto ${
          activeTab === 'portrait' ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-3 md:grid-cols-6'
        }`}>
          {collection.map((img, idx) => (
            <button
              key={img.url}
              onClick={() => setCurrentImageIndex(idx)}
              className={`cyber-card overflow-hidden group cursor-pointer relative transition-all duration-300 ${
                activeTab === 'portrait' ? 'aspect-[3/4]' : 
                activeTab === 'landscape' ? 'aspect-video' :
                activeTab === 'street' ? 'aspect-video' : 'aspect-square'
              } ${idx === currentImageIndex ? 'ring-2 ring-cyber-white' : ''}`}
            >
              <img
                src={img.url}
                alt={`${activeTab} thumbnail ${idx + 1}`}
                className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-cyber-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Collection info */}
        <div className="mt-12 text-center">
          <div className="cyber-card p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-2xl font-mono cyber-text">{collection.length}</div>
                <div className="text-xs text-cyber-accent lo-fi-text">CURATED SELECTION</div>
              </div>
              <div>
                <div className="text-2xl font-mono cyber-text">
                  {activeTab === 'concept' ? getConceptArtImages().length :
                   activeTab === 'street' ? getAllStreetArtImages().length :
                   activeTab === 'landscape' ? getLandscapeImages().length :
                   activeTab === 'portrait' ? getPortraitImages().length : 0}
                </div>
                <div className="text-xs text-cyber-accent lo-fi-text">TOTAL COLLECTION</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderPlaceholderContent = (category: VisualCategory) => (
    <div className="text-center py-24">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-xl font-mono cyber-text mb-4">
        {category.toUpperCase()} - COMING SOON
      </h3>
      <p className="text-cyber-accent max-w-md mx-auto">
        This visual category is currently under development. 
        Check back soon for new content additions.
      </p>
    </div>
  )

  const renderTabContent = () => {
    if (activeTab === 'video') {
      return renderVideoPreview()
    } else if (activeTab === 'animated') {
      return renderPlaceholderContent(activeTab)
    } else {
      return renderRotatingGallery()
    }
  }

  return (
    <section id="visual" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">VISUALS</h2>
          <div className="w-24 h-px bg-cyber-white mx-auto mb-8"></div>
          <p className="text-cyber-accent max-w-2xl mx-auto text-lg">
            Immersive visual experiences spanning video art, concept designs, street photography, 
            and digital landscapes that define the V3XV0ID aesthetic.
          </p>
        </div>

        {/* Visual Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {visualTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-mono transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-cyber-white text-cyber-black'
                  : 'bg-transparent text-cyber-white border border-cyber-gray hover:border-cyber-white'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="text-center mb-12">
          <p className="text-cyber-accent text-sm">
            {visualTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </section>
  )
} 