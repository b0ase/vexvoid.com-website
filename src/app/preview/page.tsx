'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks } from '../lib/musicLibrary'
import { useMusicPlayer } from '../lib/musicPlayerContext'

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
  const { hideGlobalPlayer, showGlobalPlayer } = useMusicPlayer()
  const [selectedTrack, setSelectedTrack] = useState(musicTracks[0])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout>()
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const currentVideo = videoClips[currentVideoIndex]
  const nextVideo = videoClips[nextVideoIndex]

  // Set video volumes and preload next video
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.volume = 0.15
      currentVideoRef.current.load() // Ensure video is loaded
    }
    if (nextVideoRef.current) {
      nextVideoRef.current.volume = 0.15
      nextVideoRef.current.load() // Preload next video
    }
  }, [currentVideoIndex, nextVideoIndex])

  // Auto-start the preview after component mounts
  useEffect(() => {
    const startPreview = () => {
      const currentVid = currentVideoRef.current
      const audio = audioRef.current
      
      if (currentVid && audio && !hasStarted) {
        // Small delay to ensure everything is loaded
        setTimeout(() => {
          currentVid.play().then(() => {
            audio.play().then(() => {
              setIsPlaying(true)
              setHasStarted(true)
            }).catch(() => {
              // Audio autoplay blocked - user will need to click
              console.log('Audio autoplay blocked - user interaction required')
            })
          }).catch(() => {
            // Video autoplay blocked
            console.log('Video autoplay blocked - user interaction required')
          })
        }, 1000)
      }
    }

    startPreview()
  }, [hasStarted])

  // Hide global music player when preview loads, show when leaving
  useEffect(() => {
    hideGlobalPlayer()
    return () => {
      showGlobalPlayer()
    }
  }, [hideGlobalPlayer, showGlobalPlayer])

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

  // Handle video transitions with crossfade - continuous loop
  useEffect(() => {
    const currentVid = currentVideoRef.current
    const nextVid = nextVideoRef.current
    
    if (!currentVid || !nextVid) return

    const handleVideoEnd = () => {
      console.log(`Video ${currentVideoIndex} ended, switching to ${nextVideoIndex}`)
      
      // Prepare next video
      nextVid.currentTime = 0
      nextVid.style.opacity = '0'
      nextVid.style.transition = 'opacity 1s ease-in-out'
      
      // Start next video
      nextVid.play().then(() => {
        console.log(`Next video ${nextVideoIndex} started playing`)
        
        // Crossfade
        setTimeout(() => {
          nextVid.style.opacity = '1'
          currentVid.style.opacity = '0'
        }, 50)
        
        // Switch video indices after fade
        setTimeout(() => {
          const newCurrentIndex = nextVideoIndex
          const newNextIndex = (nextVideoIndex + 1) % videoClips.length
          
          console.log(`Switching indices: current ${newCurrentIndex}, next ${newNextIndex}`)
          
          setCurrentVideoIndex(newCurrentIndex)
          setNextVideoIndex(newNextIndex)
          
          // Reset styles
          currentVid.style.opacity = '1'
          nextVid.style.opacity = '0'
          currentVid.style.transition = 'none'
          nextVid.style.transition = 'none'
        }, 1000)
      }).catch(error => {
        console.error('Failed to play next video:', error)
      })
    }

    // Listen for video end
    currentVid.addEventListener('ended', handleVideoEnd)
    
    return () => {
      currentVid.removeEventListener('ended', handleVideoEnd)
    }
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
    // Don't pause - just switch tracks seamlessly
    if (audioRef.current && isPlaying) {
      // Keep playing the new track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
        }
      }, 100)
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
          preload="auto"
          style={{ 
            opacity: 1,
            zIndex: 1
          }}
          onClick={handleVideoClick}
          onLoadedData={() => console.log(`Current video ${currentVideoIndex} loaded`)}
          onEnded={() => console.log(`Current video ${currentVideoIndex} ended event`)}
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
          preload="auto"
          style={{ 
            opacity: 0,
            zIndex: 2
          }}
          onLoadedData={() => console.log(`Next video ${nextVideoIndex} loaded`)}
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



        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-sm rounded p-4">
            {/* Play/Pause Control */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black rounded-full w-10 h-10 flex items-center justify-center text-lg transition-all"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="text-sm">
                  <div className="text-cyan-400 font-mono">PREVIEW CONTROLS</div>
                  <div className="text-white/70 text-xs">
                    {isPlaying ? 'Playing continuous loop' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Track Selector */}
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