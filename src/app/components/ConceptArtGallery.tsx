'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  conceptArtImages,
  landscapeImages,
  portraitImages,
  getAllImagePaths
} from '../lib/images'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import { applyGlitchEffect, getRandomGlitchEffect, applyMultipleGlitchEffects } from '../lib/glitchEffects'
import Image from 'next/image'

// Convert local image arrays to match the expected format
const getConceptArtImages = () => conceptArtImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getLandscapeImages = () => landscapeImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getPortraitImages = () => portraitImages.map(img => ({ url: img.path, filename: img.filename, directory: img.directory }))
const getAllCloudImages = () => [...getConceptArtImages(), ...getLandscapeImages(), ...getPortraitImages()]

type VisualCategory = 'video' | 'concept' | 'landscape' | 'portrait' | 'animated'

interface VisualTab {
  id: VisualCategory
  label: string
  description: string
  count: number
}

// Available video clips - using v3xv0id-videos bucket
// Removed Supabase URL - using local images instead
// Video URLs are not available locally - using placeholder
const getVideoUrl = (filename: string) => `/videos/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Train Rush'
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (2).mp4'),
    title: 'Train Rush 2'
  },
  {
    id: 'train-rush-3',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (3).mp4'),
    title: 'Train Rush 3'
  },
  {
    id: 'footsteps',
    path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'),
    title: 'Footsteps Echo'
  },
  {
    id: 'extended',
    path: getVideoUrl('Extended_Video.mp4'),
    title: 'Extended Scene'
  },
  {
    id: 'professional-1',
    path: getVideoUrl('Professional_Mode_Generated_Video.mp4'),
    title: 'Professional Mode'
  },
  {
    id: 'professional-2',
    path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'),
    title: 'Professional Mode Alt'
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
    label: 'VIDEO EXPERIENCE',
    description: 'Immersive V3XV0ID visual journey with layered videos and generative art',
    count: videoClips.length
  },
  {
    id: 'concept',
    label: 'CONCEPT ART',
    description: 'Digital concept art exploring the V3XV0ID aesthetic',
    count: getConceptArtImages().length
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
  return getConceptArtImages().slice(0, 12)
}

const getCuratedLandscapes = () => {
  return getLandscapeImages().slice(0, 12)
}

const getCuratedPortraits = () => {
  return getPortraitImages()
}

export default function VisualGallery() {
  const [activeTab, setActiveTab] = useState<VisualCategory>('video') // Default to video
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Video experience state - EXACT same as preview
  const [conceptArtImages] = useState(() => getConceptArtImages())
  const [landscapeImages] = useState(() => getLandscapeImages())
  const [portraitImages] = useState(() => getPortraitImages())
  const [allImages] = useState(() => getAllCloudImages())
  const [logoImages] = useState(() => getConceptArtImages().slice(0, 15))

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [backdropIndex] = useState(() => Math.floor(Math.random() * Math.max(1, getAllCloudImages().length)))
  const [logoIndex, setLogoIndex] = useState(0)
  const [videoStartTime, setVideoStartTime] = useState(Date.now())
  const [currentAlgorithmIndex, setCurrentAlgorithmIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [p5Time, setP5Time] = useState(0)
  const [beatCounter, setBeatCounter] = useState(0)
  const [lastBeatTime, setLastBeatTime] = useState(0)
  const [glitchIntensity, setGlitchIntensity] = useState(0.5)
  const [videoStartOffset] = useState(() => 
    videoClips.map(() => Math.random() * 50 + 10)
  )

  // Video refs
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

  // Video experience effects
  useEffect(() => {
    if (activeTab !== 'video') return

    const interval = setInterval(() => {
      setP5Time(prev => prev + 0.016)
      setBeatCounter(prev => prev + 1)
      
      // Beat-based effects
      if (beatCounter % 60 === 0) { // Every ~1 second
        setGlitchIntensity(Math.random() * 0.8 + 0.2)
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
      
      // Algorithm cycling
      if (beatCounter % 120 === 0) { // Every ~2 seconds
        setCurrentAlgorithmIndex(prev => (prev + 1) % generativeAlgorithms.length)
      }
      
      // Logo cycling
      if (beatCounter % 180 === 0) { // Every ~3 seconds
        setLogoIndex(prev => (prev + 1) % logoImages.length)
      }
      
      // Overlay cycling
      if (beatCounter % 240 === 0) { // Every ~4 seconds
        setCurrentOverlayIndex(prev => (prev + 1) % allImages.length)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [activeTab, beatCounter, logoImages.length, allImages.length])

  // Video transition logic
  useEffect(() => {
    if (activeTab !== 'video') return

    const handleVideoEnd = () => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentVideoIndex(prev => (prev + 1) % videoClips.length)
        setNextVideoIndex(prev => (prev + 1) % videoClips.length)
        setIsTransitioning(false)
      }, 1000)
    }

    const currentVideo = currentVideoRef.current
    if (currentVideo) {
      currentVideo.addEventListener('ended', handleVideoEnd)
      return () => currentVideo.removeEventListener('ended', handleVideoEnd)
    }
  }, [activeTab])

  // P5.js generative art
  const renderP5 = () => {
    if (activeTab !== 'video') return null

    const algorithm = generativeAlgorithms[currentAlgorithmIndex]
    if (!algorithm) return null

    return (
      <div className="absolute inset-0 z-20 pointer-events-none opacity-30">
        <div 
          className="w-full h-full"
          style={{
            background: `radial-gradient(circle at ${50 + Math.sin(p5Time) * 20}% ${50 + Math.cos(p5Time) * 20}%, rgba(255,255,255,${0.1 + glitchIntensity * 0.2}) 0%, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        />
      </div>
    )
  }

  // Video controls
  const handleVideoEnded = () => {
    setCurrentVideoIndex(prev => (prev + 1) % videoClips.length)
    setNextVideoIndex(prev => (prev + 1) % videoClips.length)
  }

  const handlePlayPause = () => {
    if (!hasUserInteracted) setHasUserInteracted(true)
    
    if (currentVideoRef.current) {
      if (isPlaying) {
        currentVideoRef.current.pause()
      } else {
        currentVideoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (currentVideoRef.current) {
      const progress = (currentVideoRef.current.currentTime / currentVideoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  // Gallery logic
  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'concept': return getConceptArtImages()
      case 'landscape': return getLandscapeImages()
      case 'portrait': return getPortraitImages()
      default: return []
    }
  }

  // EXACT same immersive video experience as preview
  const renderVideoExperience = () => {
    return (
      <div className="relative w-full h-[70vh] bg-black text-white overflow-hidden flex items-center justify-center rounded-lg border border-white/10">
        {/* Centered Video Container */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Concept Art Backdrop */}
          <div className="absolute inset-0 z-0">
            {allImages[backdropIndex] && (
              <Image
                src={allImages[backdropIndex].url}
                alt="VexVoid Backdrop"
                fill
                className="object-cover opacity-25 blur-lg"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Video Layer 1 - Current Video */}
          <video
            ref={currentVideoRef}
            key={`current-${currentVideo.id}`}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-8000 filter brightness-[0.4] contrast-125 saturate-75 ${
              isTransitioning ? 'opacity-0 blur-md' : 'opacity-70'
            } ${isGlitching ? 'hue-rotate-180 saturate-200' : ''}`}
            muted={true}
            playsInline={true}
            webkit-playsinline="true"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
            onClick={handlePlayPause}
            style={{ 
              mixBlendMode: 'normal',
              transform: isGlitching ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : 'none'
            }}
          >
            <source src={currentVideo.path} type="video/mp4" />
          </video>

          {/* Video Layer 2 - Next Video */}
          <video
            ref={nextVideoRef}
            key={`next-${nextVideo.id}`}
            className={`absolute inset-0 w-full h-full object-cover z-5 transition-all duration-8000 filter brightness-[0.3] contrast-150 saturate-50 ${
              isTransitioning ? 'opacity-70' : 'opacity-0'
            }`}
            muted={true}
            playsInline={true}
            webkit-playsinline="true"
            style={{ mixBlendMode: 'multiply' }}
          >
            <source src={nextVideo.path} type="video/mp4" />
          </video>

          {/* Generative Art Layer */}
          {renderP5()}

          {/* Overlay Images Layer */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="absolute inset-0 opacity-5 transition-opacity duration-5000">
              {allImages[(currentOverlayIndex + 4) % allImages.length] && (
                <Image
                  src={allImages[(currentOverlayIndex + 4) % allImages.length].url}
                  alt="Art Background"
                  fill
                  className="object-cover blur-[4px] mix-blend-soft-light"
                />
              )}
            </div>
            
            <div className="absolute top-4 right-4 w-32 h-32 opacity-20 transition-all duration-4000 transform rotate-2 z-40">
              {logoImages[logoIndex] && (
                <Image
                  src={logoImages[logoIndex].url}
                  alt="VexVoid Logo"
                  fill
                  className="object-cover rounded-xl blur-[0.5px] mix-blend-screen border border-white/10"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-xl" />
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 z-50">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="text-white text-sm">
                {currentVideoIndex + 1} / {videoClips.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-50">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderRotatingGallery = () => {
    const collection = getCurrentCollection()
    if (collection.length === 0) return null

    const getAspectRatio = () => {
      switch (activeTab) {
        case 'portrait': return 'aspect-[3/4]'
        case 'landscape': return 'aspect-video'
        default: return 'aspect-square'
      }
    }

    return (
      <>
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

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? collection.length - 1 : prev - 1)}
              className="bg-cyber-white/20 text-cyber-white px-4 py-2 hover:bg-cyber-white/30 transition-colors"
            >
              ← PREV
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev + 1) % collection.length)}
              className="bg-cyber-white/20 text-cyber-white px-4 py-2 hover:bg-cyber-white/30 transition-colors"
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className={`grid gap-4 max-w-4xl mx-auto ${
          activeTab === 'portrait' ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-3 md:grid-cols-6'
        }`}>
          {collection.map((img, idx) => (
            <button
              key={img.url}
              onClick={() => setCurrentImageIndex(idx)}
              className={`cyber-card overflow-hidden group cursor-pointer relative transition-all duration-300 ${
                activeTab === 'portrait' ? 'aspect-[3/4]' : 
                activeTab === 'landscape' ? 'aspect-video' : 'aspect-square'
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
      return renderVideoExperience()
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

        <div className="text-center mb-12">
          <p className="text-cyber-accent text-sm">
            {visualTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {renderTabContent()}
      </div>
    </section>
  )
}