'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { 
  getConceptArtImages, 
  getAllCloudImages 
} from '../lib/supabaseImages'
import { generativeAlgorithms } from '../lib/generativeAlgorithms'

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

export default function ImmersiveVideoHero() {
  // Initialize image arrays safely
  const [allImages] = useState(() => getAllCloudImages())
  const [logoImages] = useState(() => getConceptArtImages().slice(0, 15))

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0)
  const [backdropIndex] = useState(() => Math.floor(Math.random() * Math.max(1, getAllCloudImages().length)))
  const [logoIndex, setLogoIndex] = useState(0)
  const [currentAlgorithmIndex, setCurrentAlgorithmIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [p5Time, setP5Time] = useState(0)
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

  // Auto-start and setup videos
  useEffect(() => {
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
      }).catch(() => {
        console.log('Autoplay blocked')
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
  }, [currentVideoIndex])

  // Auto-play on component mount
  useEffect(() => {
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
  }, [])

  // Cycle overlay images every 12 seconds
  useEffect(() => {
    const overlayInterval = setInterval(() => {
      setCurrentOverlayIndex(prev => (prev + 1) % allImages.length)
    }, 12000)
    
    return () => clearInterval(overlayInterval)
  }, [])

  // Cycle logo corner every 8 seconds
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setLogoIndex(prev => (prev + 1) % logoImages.length)
    }, 8000)
    
    return () => clearInterval(logoInterval)
  }, [])

  // P5.js Animation System
  useEffect(() => {
    const p5Interval = setInterval(() => {
      setP5Time(prev => prev + 0.05)
    }, 30)
    
    return () => clearInterval(p5Interval)
  }, [])

  // Simulated Beat Detection
  useEffect(() => {
    const beatInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 800)
    
    return () => clearInterval(beatInterval)
  }, [])

  // Algorithm switching every 20 seconds
  useEffect(() => {
    const algorithmInterval = setInterval(() => {
      setCurrentAlgorithmIndex(prev => (prev + 1) % generativeAlgorithms.length)
    }, 20000)
    
    return () => clearInterval(algorithmInterval)
  }, [])

  // Video transition every 8 seconds
  useEffect(() => {
    const videoInterval = setInterval(() => {
      handleVideoTransition()
    }, 8000)
    
    return () => clearInterval(videoInterval)
  }, [currentVideoIndex])

  // P5.js Rendering
  useEffect(() => {
    const canvas = p5CanvasRef.current
    if (!canvas) return

    const renderP5 = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const numElements = 50 + Math.sin(p5Time * 0.1) * 30
      
      for (let i = 0; i < numElements; i++) {
        const x = canvas.width * 0.5 + Math.cos(p5Time * 0.05 + i * 0.1) * (100 + i * 3)
        const y = canvas.height * 0.5 + Math.sin(p5Time * 0.03 + i * 0.15) * (100 + i * 2)
        
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(p5Time * 0.02 + i * 0.1)
        
        if (isGlitching) {
          ctx.fillStyle = `rgba(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()}, 0.3)`
        } else {
          ctx.fillStyle = `rgba(100, 255, 200, ${0.1 + Math.sin(p5Time + i) * 0.05})`
        }
        
        ctx.fillRect(-2, -2, 4, 4)
        ctx.restore()
      }
    }

    renderP5()
    const p5AnimationFrame = requestAnimationFrame(() => renderP5())
    
    return () => cancelAnimationFrame(p5AnimationFrame)
  }, [p5Time, currentAlgorithmIndex, isGlitching])

  const handleVideoTransition = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    
    const newVideoIndex = (currentVideoIndex + 1) % videoClips.length
    const newNextIndex = (newVideoIndex + 1) % videoClips.length
    
    setCurrentVideoIndex(newVideoIndex)
    setNextVideoIndex(newNextIndex)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 2000)
  }

  const handleVideoEnded = () => {
    handleVideoTransition()
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Concept Art */}
      {allImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          <Image
            src={allImages[backdropIndex]?.url || ''}
            alt="V3XV0ID Backdrop"
            fill
            className="object-cover opacity-25 blur-sm"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Main Video Layer */}
      <div className="absolute inset-0 z-10">
        <video
          ref={currentVideoRef}
          src={currentVideo?.path}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
            isTransitioning ? 'opacity-0' : 'opacity-70'
          }`}
          loop={false}
          muted
          playsInline
          onEnded={handleVideoEnded}
          style={{
            filter: `brightness(0.7) contrast(1.2) saturate(0.9)`
          }}
        />
        
        <video
          ref={nextVideoRef}
          src={nextVideo?.path}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          loop={false}
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* P5.js Generative Layer */}
      <canvas
        ref={p5CanvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.6
        }}
      />

      {/* Floating Concept Art Elements */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              opacity: element.opacity,
              transform: `rotate(${element.rotation}deg)`,
              mixBlendMode: ['screen', 'overlay', 'soft-light', 'multiply'][Math.floor(Math.random() * 4)] as any
            }}
          >
            <Image
              src={element.image?.url || ''}
              alt=""
              fill
              className="object-contain rounded-sm"
              sizes="32px"
            />
          </div>
        ))}
      </div>

      {/* Fragmented Video Overlays */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div 
          className="absolute top-10 right-10 w-32 h-24 opacity-30 rounded"
          style={{ transform: 'rotate(5deg)' }}
        >
          <video
            src={videoClips[(currentVideoIndex + 2) % videoClips.length]?.path}
            className="w-full h-full object-cover rounded"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div 
          className="absolute bottom-20 left-16 w-24 h-18 opacity-20 rounded"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <video
            src={videoClips[(currentVideoIndex + 3) % videoClips.length]?.path}
            className="w-full h-full object-cover rounded"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      {/* Central Overlay Image */}
      {allImages.length > 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="relative transition-all duration-1000"
            style={{
              width: '200px',
              height: '200px',
              opacity: 0.15,
              mixBlendMode: 'overlay'
            }}
          >
            <Image
              src={allImages[currentOverlayIndex]?.url || ''}
              alt="V3XV0ID Overlay"
              fill
              className="object-contain"
              sizes="200px"
            />
          </div>
        </div>
      )}

      {/* V3XV0ID Watermark */}
      {logoImages.length > 0 && (
        <div className="absolute bottom-8 right-8 z-60 pointer-events-none">
          <div className="relative w-16 h-16 opacity-60">
            <Image
              src={logoImages[logoIndex]?.url || ''}
              alt="V3XV0ID"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </div>
      )}

      {/* Hero Text Content */}
      <div className="absolute inset-0 z-70 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            V3XV0ID
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200">
            Digital Art • Music • Visual Experiences
          </p>

          <div className="space-y-6">
            <div className="text-lg text-gray-300">
              Immersive cyberpunk aesthetics meet generative art
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-80 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 z-80 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
    </div>
  )
} 