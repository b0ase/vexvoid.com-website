'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  getConceptArtImages,
  getAllStreetArtImages,
  getLandscapeImages,
  getPortraitImages,
  getVideoJamImages,
  getAllCloudImages
} from '../lib/supabaseImages'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'
import { applyGlitchEffect, getRandomGlitchEffect, applyMultipleGlitchEffects } from '../lib/glitchEffects'
import Image from 'next/image'

type VisualCategory = 'video' | 'concept' | 'street' | 'landscape' | 'portrait' | 'animated'

interface VisualTab {
  id: VisualCategory
  label: string
  description: string
  count: number
}

// Available video clips - using v3xv0id-videos bucket
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/v3xv0id-videos/vex_video_jam_01/${filename}`

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
  return getConceptArtImages().slice(0, 12)
}

const getCuratedStreetArt = () => {
  return getAllStreetArtImages().filter((_: any, idx: number) => idx % 8 === 0 || idx < 6).slice(0, 16)
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
  const [videoJamImages] = useState(() => getVideoJamImages())
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
  const [floatingElements] = useState(() => {
    const images = getAllCloudImages()
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      image: images[Math.floor(Math.random() * Math.max(1, images.length))],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 20,
      opacity: 0.05 + Math.random() * 0.15,
      rotation: Math.random() * 360,
      speed: 0.1 + Math.random() * 0.3,
      direction: Math.random() * Math.PI * 2
    }))
  })
  
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const p5CanvasRef = useRef<HTMLCanvasElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

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

  // EXACT same video management as preview
  useEffect(() => {
    if (activeTab !== 'video') return
    
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = 0
      currentVideoRef.current.playbackRate = 0.4
      currentVideoRef.current.setAttribute('playsinline', 'true')
      currentVideoRef.current.setAttribute('webkit-playsinline', 'true')
      currentVideoRef.current.muted = true
      
      const startPoint = videoStartOffset[currentVideoIndex]
      currentVideoRef.current.currentTime = startPoint
      
      currentVideoRef.current.play().then(() => {
        setIsPlaying(true)
        setVideoStartTime(Date.now())
      }).catch(() => {
        console.log('Autoplay blocked - will try again on user interaction')
        setTimeout(() => {
          if (currentVideoRef.current) {
            currentVideoRef.current.play().catch(() => {
              console.log('Second autoplay attempt failed')
            })
          }
        }, 1000)
      })
    }
    
    if (nextVideoRef.current) {
      nextVideoRef.current.volume = 0
      nextVideoRef.current.playbackRate = 0.4
      nextVideoRef.current.setAttribute('playsinline', 'true')
      nextVideoRef.current.setAttribute('webkit-playsinline', 'true')
      nextVideoRef.current.muted = true
      
      const nextStartPoint = videoStartOffset[nextVideoIndex]
      nextVideoRef.current.currentTime = nextStartPoint
      nextVideoRef.current.load()
    }
  }, [activeTab, currentVideoIndex])

  // Auto-play on component mount
  useEffect(() => {
    if (activeTab !== 'video') return
    
    const timer = setTimeout(() => {
      if (currentVideoRef.current && !isPlaying) {
        currentVideoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          console.log('Initial autoplay blocked')
        })
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [activeTab])

  // EXACT same effect cycles as preview
  useEffect(() => {
    if (activeTab !== 'video') return
    
    const overlayInterval = setInterval(() => {
      setCurrentOverlayIndex(prev => (prev + 1) % allImages.length)
    }, 12000)
    
    return () => clearInterval(overlayInterval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const logoInterval = setInterval(() => {
      setLogoIndex(prev => (prev + 1) % logoImages.length)
    }, 8000)
    
    return () => clearInterval(logoInterval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const p5Interval = setInterval(() => {
      setP5Time(prev => prev + 0.05)
    }, 30)
    
    return () => clearInterval(p5Interval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const beatInterval = setInterval(() => {
      setBeatCounter(prev => prev + 1)
      setLastBeatTime(Date.now())
      
      const shouldGlitch = Math.random() < 0.2
      if (shouldGlitch) {
        setIsGlitching(true)
        setGlitchIntensity(0.05 + Math.random() * 0.1)
        
        const glitchDuration = 30 + Math.random() * 70
        setTimeout(() => setIsGlitching(false), glitchDuration)
      }
    }, 800 + Math.random() * 600)
    
    return () => clearInterval(beatInterval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const algorithmInterval = setInterval(() => {
      setCurrentAlgorithmIndex(prev => (prev + 1) % generativeAlgorithms.length)
      
      setIsGlitching(true)
      setGlitchIntensity(0.1 + Math.random() * 0.1)
      setTimeout(() => setIsGlitching(false), 150)
    }, 20000)
    
    return () => clearInterval(algorithmInterval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const glitchBurstInterval = setInterval(() => {
      if (Math.random() < 0.03) {
        setIsGlitching(true)
        setGlitchIntensity(0.05 + Math.random() * 0.1)
        setTimeout(() => setIsGlitching(false), 20 + Math.random() * 40)
      }
    }, 5000)
    
    return () => clearInterval(glitchBurstInterval)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'video') return
    
    const animationInterval = setInterval(() => {
      floatingElements.forEach(element => {
        element.x += Math.cos(element.direction) * element.speed * 0.3
        element.y += Math.sin(element.direction) * element.speed * 0.3
        
        if (element.x > 100) element.x = -5
        if (element.x < -5) element.x = 100
        if (element.y > 100) element.y = -5
        if (element.y < -5) element.y = 100
        
        if (Math.random() < 0.005) {
          element.direction = Math.random() * Math.PI * 2
        }
      })
    }, 500)
    
    return () => clearInterval(animationInterval)
  }, [activeTab])

  // P5.js Canvas Rendering - EXACT same as preview
  useEffect(() => {
    if (activeTab !== 'video') return
    
    const canvas = p5CanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 300

    const algorithm = generativeAlgorithms[currentAlgorithmIndex]
    const renderP5 = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (isGlitching) {
        const currentIntensity = glitchIntensity * (0.8 + Math.random() * 0.4)
        applyMultipleGlitchEffects(ctx, canvas.width, canvas.height, p5Time, Math.floor(currentIntensity * 3) + 1)
      }

      const baseOpacity = isGlitching ? 0.9 : 0.4
      const strokeOpacity = baseOpacity * (0.7 + Math.random() * 0.3)
      ctx.strokeStyle = `rgba(255, 255, 255, ${strokeOpacity})`
      ctx.lineWidth = isGlitching ? 1.5 + glitchIntensity : 0.5
      
      if (Math.random() < 0.3) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${strokeOpacity * 0.8})`
      }
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = isGlitching ? 0.6 + glitchIntensity * 0.3 : 0.5
      const timeMultiplier = isGlitching ? 3 : 1
      
      ctx.beginPath()
      for (let i = 0; i < (isGlitching ? 3000 : 2000); i++) {
        const x = i % 200
        const y = Math.floor(i / 43)
        
        const k = 4 * Math.cos(x / 29) * (isGlitching ? 1 + Math.sin(p5Time * 10) * 0.3 : 1)
        const e = y / 8 - 13
        const d = Math.sqrt(k * k + e * e)
        const q = 3 * Math.sin(k * 2) + 0.3 / (k + 0.1) + Math.sin(y / 25) * k * (9 + 4 * Math.sin(e * 9 - d * 3 + p5Time * 2 * timeMultiplier))
        const c = d - p5Time * timeMultiplier
        
        let px = (q + 30 * Math.cos(c)) * scale + centerX
        let py = (q * Math.sin(c) + d * 39 - 220) * scale + centerY
        
        if (isGlitching) {
          px += (Math.random() - 0.5) * glitchIntensity * 20
          py += (Math.random() - 0.5) * glitchIntensity * 20
        }
        
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
        
        if (isGlitching && Math.random() < 0.02) {
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(
            px + (Math.random() - 0.5) * 50, 
            py + (Math.random() - 0.5) * 50
          )
        }
      }
      ctx.stroke()
      
      requestAnimationFrame(renderP5)
    }

    renderP5()
  }, [activeTab, currentAlgorithmIndex, isGlitching, p5Time, glitchIntensity])

  // Handle video ended - EXACT same as preview
  const handleVideoEnded = () => {
    if (isTransitioning) return
    
    const minViewingTime = 30000
    const timeElapsed = Date.now() - videoStartTime
    
    if (timeElapsed < minViewingTime) {
      if (currentVideoRef.current) {
        currentVideoRef.current.currentTime = 0
        currentVideoRef.current.play()
      }
      return
    }
    
    setIsTransitioning(true)
    const nextIndex = (currentVideoIndex + 1) % videoClips.length
    const nextNextIndex = (nextIndex + 1) % videoClips.length
    
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), 2000)
    
    if (nextVideoRef.current) {
      nextVideoRef.current.playbackRate = 0.4
      nextVideoRef.current.currentTime = videoStartOffset[nextIndex]
      nextVideoRef.current.play()
    }
    
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex)
      setNextVideoIndex(nextNextIndex)
      setIsTransitioning(false)
      setProgress(0)
      setVideoStartTime(Date.now())
    }, 8000)
  }

  const handlePlayPause = () => {
    if (!currentVideoRef.current) return

    if (isPlaying) {
      currentVideoRef.current.pause()
      if (nextVideoRef.current) nextVideoRef.current.pause()
      setIsPlaying(false)
    } else {
      currentVideoRef.current.play().then(() => {
        setIsPlaying(true)
      })
    }
  }

  const handleTimeUpdate = () => {
    if (currentVideoRef.current) {
      const progress = (currentVideoRef.current.currentTime / currentVideoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'concept': return getCuratedConceptArt()
      case 'street': return getCuratedStreetArt()
      case 'landscape': return getCuratedLandscapes()
      case 'portrait': return getCuratedPortraits()
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
            className={`absolute inset-0 w-full h-full object-cover z-20 transition-all duration-8000 filter brightness-[0.4] contrast-125 saturate-75 ${
              isTransitioning ? 'opacity-70 blur-md' : 'opacity-0'
            } ${isGlitching ? 'hue-rotate-90 saturate-150' : ''}`}
            muted={true}
            playsInline={true}
            webkit-playsinline="true"
            onClick={handlePlayPause}
            style={{ 
              mixBlendMode: 'normal',
              transform: isGlitching ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : 'none'
            }}
          >
            <source src={nextVideo.path} type="video/mp4" />
          </video>

          {/* Fragmented Video Overlays */}
          <div className="absolute inset-0 z-15 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/3 h-1/4 overflow-hidden opacity-20">
              <video
                className="w-full h-full object-cover filter brightness-[0.2] blur-[2px]"
                muted={true}
                playsInline={true}
                webkit-playsinline="true"
                autoPlay
                loop
                style={{ transform: 'scale(1.5) rotate(2deg)', mixBlendMode: 'screen' }}
              >
                <source src={currentVideo.path} type="video/mp4" />
              </video>
            </div>
            
            <div className="absolute bottom-10 left-0 w-1/4 h-1/3 overflow-hidden opacity-15">
              <video
                className="w-full h-full object-cover filter brightness-[0.25] blur-[1px]"
                muted={true}
                playsInline={true}
                webkit-playsinline="true"
                autoPlay
                loop
                style={{ transform: 'scale(1.8) rotate(-3deg)', mixBlendMode: 'overlay' }}
              >
                <source src={nextVideo.path} type="video/mp4" />
              </video>
            </div>
            
            <div className="absolute top-1/2 right-8 w-1/5 h-1/4 overflow-hidden opacity-10 transform -translate-y-1/2">
              <video
                className="w-full h-full object-cover filter brightness-[0.15] blur-[3px]"
                muted={true}
                playsInline={true}
                webkit-playsinline="true"
                autoPlay
                loop
                style={{ transform: 'scale(2) rotate(5deg)', mixBlendMode: 'soft-light' }}
              >
                <source src={currentVideo.path} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Dynamic Floating Art Elements */}
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
            
            {floatingElements.map((element, index) => {
              const blendModes = ['screen', 'overlay', 'soft-light', 'multiply', 'difference', 'color-dodge', 'luminosity', 'hard-light', 'color-burn']
              const blendMode = blendModes[index % blendModes.length]
              
              return (
                <div
                  key={element.id}
                  className="absolute transition-all duration-1000 ease-linear"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    width: `${element.size}px`,
                    height: `${element.size}px`,
                    opacity: element.opacity,
                    transform: `rotate(${element.rotation}deg)`,
                    zIndex: 30 + (index % 5)
                  }}
                >
                  {element.image && (
                    <Image
                      src={element.image.url}
                      alt="Floating Art"
                      fill
                      className={`object-cover rounded-lg blur-[0.5px]`}
                      style={{ mixBlendMode: blendMode as any }}
                    />
                  )}
                </div>
              )
            })}
            
            <div className="absolute top-8 left-8 w-24 h-24 opacity-15 transition-all duration-4000 transform rotate-2">
              {landscapeImages[currentOverlayIndex % landscapeImages.length] && (
                <Image
                  src={landscapeImages[currentOverlayIndex % landscapeImages.length].url}
                  alt="Landscape Art"
                  fill
                  className="object-cover rounded-lg blur-[0.5px] mix-blend-screen"
                />
              )}
            </div>
            
            <div className="absolute bottom-12 left-12 w-28 h-28 opacity-18 transition-all duration-4000 transform rotate-1">
              {portraitImages[currentOverlayIndex % portraitImages.length] && (
                <Image
                  src={portraitImages[currentOverlayIndex % portraitImages.length].url}
                  alt="Portrait Art"
                  fill
                  className="object-cover rounded-xl blur-[0.5px] mix-blend-soft-light"
                />
              )}
            </div>
            
            <div className="absolute bottom-8 right-8 w-20 h-20 opacity-12 transition-all duration-4000 transform -rotate-3">
              {videoJamImages[currentOverlayIndex % videoJamImages.length] && (
                <Image
                  src={videoJamImages[currentOverlayIndex % videoJamImages.length].url}
                  alt="Video Jam Art"
                  fill
                  className="object-cover rounded-lg blur-[1px] mix-blend-overlay"
                />
              )}
            </div>
          </div>

          {/* P5.js Generative Animation Overlay */}
          <canvas
            ref={p5CanvasRef}
            className={`absolute inset-0 w-full h-full object-cover z-25 pointer-events-none transition-opacity duration-1000 ${
              isGlitching ? 'opacity-20' : 'opacity-10'
            }`}
            style={{ 
              mixBlendMode: isGlitching ? 'difference' : 'screen',
              transform: isGlitching ? `scale(${1 + Math.random() * 0.05})` : 'scale(1)'
            }}
          />
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
        case 'street': return 'aspect-video'
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