'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks } from '../lib/musicLibrary'
import { getMusicUrl } from '../lib/supabase'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize with random track
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * musicTracks.length)
    setCurrentTrack(randomIndex)
  }, [])

  // Get current track URL dynamically
  const getCurrentTrackUrl = () => {
    const track = musicTracks[currentTrack]
    return getMusicUrl(track.filename) || track.path
  }

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const newUrl = getCurrentTrackUrl()
      console.log('Loading track:', musicTracks[currentTrack].title, 'from:', newUrl)
      audioRef.current.src = newUrl
      audioRef.current.load()
    }
  }, [currentTrack])

  const togglePlay = async () => {
    if (!audioRef.current) return
    setIsLoading(true)

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsLoading(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Play failed:', error)
        setIsLoading(false)
      }
    }
  }

  const getRandomTrack = () => {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * musicTracks.length)
    } while (randomIndex === currentTrack && musicTracks.length > 1)
    return randomIndex
  }

  const handleTrackEnd = () => {
    if (autoPlay) {
      const nextIndex = getRandomTrack()
      setCurrentTrack(nextIndex)
      // Keep playing
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    } else {
      setIsPlaying(false)
    }
  }

  const nextTrack = () => {
    const nextIndex = autoPlay ? getRandomTrack() : (currentTrack + 1) % musicTracks.length
    setCurrentTrack(nextIndex)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const prevTrack = () => {
    const prevIndex = autoPlay ? getRandomTrack() : (currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1)
    setCurrentTrack(prevIndex)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
  }

  const handleError = (e: any) => {
    console.error('Audio error:', e)
    // Try fallback to local file if Supabase fails
    if (audioRef.current && audioRef.current.src.includes('supabase')) {
      const track = musicTracks[currentTrack]
      console.log('Trying fallback to local file:', track.path)
      audioRef.current.src = track.path
      audioRef.current.load()
    } else {
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const currentTrackTitle = musicTracks[currentTrack]?.title || 'Loading...'

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onLoadedData={handleLoadedData}
        onLoadStart={handleLoadStart}
        onError={handleError}
        preload="metadata"
      />
      
      {/* Compact Player Box - Medium Size */}
      <div className="bg-black/95 border border-white p-3 text-white lo-fi-text w-72">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-bold">V3XV0ID MUSIC</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`text-[10px] px-1.5 py-0.5 border transition-colors ${
                autoPlay 
                  ? 'border-green-400 text-green-400' 
                  : 'border-white/30 text-white/50'
              }`}
              title="Auto-play mode"
            >
              {autoPlay ? 'RAND' : 'SEQ'}
            </button>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-xs hover:text-cyan-400 transition-colors"
              title="Show playlist"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Now Playing */}
        <div className="mb-2">
          <div className="text-[10px] text-white/60 mb-1">
            {isPlaying ? 'NOW PLAYING:' : 'PAUSED:'}
          </div>
          <div className="text-xs font-medium truncate" title={currentTrackTitle}>
            {currentTrackTitle}
          </div>
          <div className="text-[10px] text-white/50 mt-1">
            Track {currentTrack + 1} of {musicTracks.length} • {autoPlay ? 'Random' : 'Sequential'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevTrack}
              className="text-sm hover:text-cyan-400 transition-colors"
              title="Previous track"
            >
              ⏮
            </button>
            
            <button
              onClick={togglePlay}
              className="text-base hover:text-cyan-400 transition-colors mx-1"
              disabled={isLoading}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? '⏳' : (isPlaying ? '⏸' : '▶')}
            </button>
            
            <button
              onClick={nextTrack}
              className="text-sm hover:text-cyan-400 transition-colors"
              title="Next track"
            >
              ⏭
            </button>
          </div>

          <div className="text-[10px] text-white/50">
            ATMOSPHERIC • ELECTRONIC
          </div>
        </div>

        {/* Playlist Dropdown */}
        {showPlaylist && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-[10px] text-white/60 mb-2 border-b border-white/20 pb-1">
                SELECT TRACK ({musicTracks.length} available)
              </div>
              {musicTracks.map((track, index) => (
                <div
                  key={index}
                  onClick={() => selectTrack(index)}
                  className={`cursor-pointer text-xs p-1.5 hover:bg-white/10 transition-colors ${
                    index === currentTrack ? 'bg-white/20 text-cyan-400' : 'text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{index + 1}. {track.title}</span>
                    {index === currentTrack && (
                      <span className="text-cyan-400 ml-2 text-xs">
                        {isPlaying ? '♪' : '▫'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 