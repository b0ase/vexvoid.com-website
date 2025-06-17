'use client'

import { useState, useRef, useEffect } from 'react'

// Available video clips - using Supabase cloud storage
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/videos/vex_video_jam_01/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Train Rush'
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (1).mp4'),
    title: 'Train Rush Alt'
  },
  {
    id: 'rain-streets',
    path: getVideoUrl('Heavy_rain_pelts_the_ground__str.mp4'),
    title: 'Rain Streets'
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
    id: 'professional-3',
    path: getVideoUrl('Professional_Mode_Generated_Video (2).mp4'),
    title: 'Professional Mode 2'
  }
]

export default function VideoPreviewPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentVideo = videoClips[currentVideoIndex]

  // Set video volume and auto-start
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.2 // Keep video audio low
    }
    
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          console.log('Autoplay blocked - click to play')
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentVideoIndex])

  // Handle video end - go to next video
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videoClips.length
    setCurrentVideoIndex(nextIndex)
  }

  // Play/pause handler
  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Simple Video Player */}
      <video
        ref={videoRef}
        key={currentVideo.id}
        className="w-full h-screen object-cover"
        muted={false}
        onEnded={handleVideoEnd}
        onClick={handlePlayPause}
      >
        <source src={currentVideo.path} type="video/mp4" />
      </video>

      {/* Simple Info Overlay */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded">
        <div className="text-sm text-cyan-400">NOW PLAYING</div>
        <div className="text-lg font-bold">{currentVideo.title}</div>
        <div className="text-sm text-white/70">
          {currentVideoIndex + 1} of {videoClips.length}
        </div>
      </div>

      {/* Simple Play/Pause Button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-cyan-400 hover:bg-cyan-300 text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl"
          >
            ▶
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${((currentVideoIndex + 1) / videoClips.length) * 100}%` }}
        />
      </div>
    </div>
  )
} 