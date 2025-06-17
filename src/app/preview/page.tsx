'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks } from '../lib/musicLibrary'

// Available video clips for mixing - using Supabase cloud storage (now in subfolder)
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/videos/vex_video_jam_01/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Train Rush',
    duration: 10
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (1).mp4'),
    title: 'Train Rush Alt',
    duration: 8
  },
  {
    id: 'rain-streets',
    path: getVideoUrl('Heavy_rain_pelts_the_ground__str.mp4'),
    title: 'Rain Streets',
    duration: 12
  },
  {
    id: 'footsteps',
    path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'),
    title: 'Footsteps Echo',
    duration: 15
  },
  {
    id: 'extended',
    path: getVideoUrl('Extended_Video.mp4'),
    title: 'Extended Scene',
    duration: 20
  },
  {
    id: 'professional-1',
    path: getVideoUrl('Professional_Mode_Generated_Video.mp4'),
    title: 'Professional Mode',
    duration: 18
  },
  {
    id: 'professional-2',
    path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'),
    title: 'Professional Mode Alt',
    duration: 16
  },
  {
    id: 'professional-3',
    path: getVideoUrl('Professional_Mode_Generated_Video (2).mp4'),
    title: 'Professional Mode 2',
    duration: 22
  }
]

export default function VideoPreviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(musicTracks[0])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout>()
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

  // Set video volumes to be soft under the music
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = 0.15
    }
    if (nextVideoRef.current) {
      nextVideoRef.current.volume = 0.15
    }
  }, [currentVideoIndex, nextVideoIndex])

  // Auto-hide controls after 3 seconds of no mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Handle video transitions with crossfade
  useEffect(() => {
    const currentVid = currentVideoRef.current
    const nextVid = nextVideoRef.current
    
    if (!currentVid || !nextVid) return

    const handleVideoEnd = () => {
      // Start crossfade 1 second before current video ends
      const fadeStartTime = Math.max(0, currentVid.duration - 1)
      
      const checkForFade = () => {
        if (currentVid.currentTime >= fadeStartTime) {
          startCrossfade()
        } else {
          requestAnimationFrame(checkForFade)
        }
      }
      
      checkForFade()
    }

    const startCrossfade = () => {
      // Start next video
      nextVid.currentTime = 0
      nextVid.play()
      
      // Crossfade animation
      nextVid.style.opacity = '0'
      nextVid.style.transition = 'opacity 1s ease-in-out'
      
      // Fade in next video
      setTimeout(() => {
        nextVid.style.opacity = '1'
        currentVid.style.opacity = '0'
      }, 50)
      
      // Switch videos after fade completes
      setTimeout(() => {
        // Swap the video references
        const newCurrentIndex = nextVideoIndex
        const newNextIndex = (nextVideoIndex + 1) % videoClips.length
        
        setCurrentVideoIndex(newCurrentIndex)
        setNextVideoIndex(newNextIndex)
        
        // Reset opacity
        currentVid.style.opacity = '1'
        nextVid.style.opacity = '0'
        currentVid.style.transition = 'none'
        nextVid.style.transition = 'none'
      }, 1000)
    }

    currentVid.addEventListener('timeupdate', handleVideoEnd)
    return () => currentVid.removeEventListener('timeupdate', handleVideoEnd)
  }, [currentVideoIndex, nextVideoIndex])

  // Play/pause handler
  const handlePlayPause = () => {
    const currentVid = currentVideoRef.current
    const audio = audioRef.current
    
    if (!currentVid || !audio) return

    if (isPlaying) {
      currentVid.pause()
      audio.pause()
    } else {
      currentVid.play()
      audio.play()
    }
    
    setIsPlaying(!isPlaying)
  }

  // Track selection handler
  const handleTrackChange = (track: typeof musicTracks[0]) => {
    setSelectedTrack(track)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Click to play/pause
  const handleVideoClick = () => {
    handlePlayPause()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Players - Current and Next for crossfading */}
      <div className="absolute inset-0">
        {/* Current Video */}
        <video
          ref={currentVideoRef}
          key={`current-${currentVideo.id}`}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          muted={false}
          loop={false}
          playsInline
          style={{ 
            opacity: 1,
            zIndex: 1
          }}
          onClick={handleVideoClick}
        >
          <source src={currentVideo.path} type="video/mp4" />
        </video>

        {/* Next Video (for crossfade) */}
        <video
          ref={nextVideoRef}
          key={`next-${nextVideo.id}`}
          className="absolute inset-0 w-full h-full object-cover"
          muted={false}
          loop={false}
          playsInline
          style={{ 
            opacity: 0,
            zIndex: 2
          }}
        >
          <source src={nextVideo.path} type="video/mp4" />
        </video>
      </div>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={selectedTrack.supabaseUrl}
        loop
      />

      {/* Minimal Controls Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 10 }}
      >
        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded">
            <div className="text-sm font-mono text-cyan-400">NOW PLAYING</div>
            <div className="text-lg font-bold">{currentVideo.title}</div>
            <div className="text-sm text-white/70">
              {currentVideoIndex + 1} of {videoClips.length}
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded">
            <div className="text-sm font-mono text-cyan-400">MUSIC</div>
            <div className="text-lg font-bold">{selectedTrack.title}</div>
            <div className="text-sm text-white/70">{selectedTrack.mood || 'V3XV0ID'}</div>
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl transition-all pointer-events-auto"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>

        {/* Bottom Track Selector */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-sm rounded p-4">
            <div className="text-sm font-mono text-cyan-400 mb-2">SELECT TRACK</div>
            <div className="flex gap-2 overflow-x-auto">
              {musicTracks.slice(0, 6).map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(track)}
                  className={`px-3 py-2 text-xs rounded whitespace-nowrap transition-colors ${
                    selectedTrack.id === track.id
                      ? 'bg-cyan-400 text-black'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${((currentVideoIndex + 1) / videoClips.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        video {
          transition: opacity 1s ease-in-out;
        }
      `}</style>
    </div>
  )
} 