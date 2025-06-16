'use client'

import { useState, useRef, useEffect } from 'react'

const tracks = [
  {
    title: 'Echoes in the Abyss',
    file: '/music/Echoes in the Abyss.mp3'
  },
  {
    title: 'Shadowed Depths',
    file: '/music/Shadowed Depths.mp3'
  }
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Auto-play on component mount
  useEffect(() => {
    const startMusic = async () => {
      if (audioRef.current && !hasStarted) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
          setHasStarted(true)
        } catch (error) {
          // Auto-play blocked, user will need to click
          console.log('Auto-play blocked')
        }
      }
    }

    // Small delay to ensure component is mounted
    const timer = setTimeout(startMusic, 1000)
    return () => clearTimeout(timer)
  }, [hasStarted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setHasStarted(true)
      } catch (error) {
        console.log('Play failed')
      }
    }
  }

  const handleTrackEnd = () => {
    const nextTrack = (currentTrack + 1) % tracks.length
    setCurrentTrack(nextTrack)
    // Audio will auto-play next track due to onLoadedData
  }

  const handleLoadedData = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.log)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        src={tracks[currentTrack].file}
        onEnded={handleTrackEnd}
        onLoadedData={handleLoadedData}
        preload="auto"
      />
      
      <button
        onClick={togglePlay}
        className="bg-black/80 border border-white text-white p-2 text-xs lo-fi-text hover:bg-white hover:text-black transition-colors"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      
      {isPlaying && (
        <div className="absolute top-12 right-0 bg-black/90 border border-white p-2 text-[8px] text-white lo-fi-text whitespace-nowrap">
          {tracks[currentTrack].title}
        </div>
      )}
    </div>
  )
} 