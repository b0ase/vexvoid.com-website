'use client'

import { useState, useRef, useEffect } from 'react'

const tracks = [
  // Echoes Series
  { title: 'Echoes in the Abyss', file: '/music/Echoes in the Abyss.mp3' },
  { title: 'Echoes in the Abyss (Alt)', file: '/music/Echoes in the Abyss (1).mp3' },
  { title: 'Echoes in the Dust', file: '/music/Echoes in the Dust.mp3' },
  { title: 'Echoes in the Dust (Alt)', file: '/music/Echoes in the Dust (1).mp3' },
  { title: 'Echoes in the Fog', file: '/music/Echoes in the Fog.mp3' },
  { title: 'Echoes in the Fog (Alt)', file: '/music/Echoes in the Fog (1).mp3' },
  { title: 'Echoes in the Mist', file: '/music/Echoes in the Mist.mp3' },
  { title: 'Echoes in the Mist (Alt)', file: '/music/Echoes in the Mist (1).mp3' },
  
  // Shadows Series
  { title: 'Shadows of the Mind', file: '/music/Shadows of the Mind.mp3' },
  { title: 'Shadows of the Mind (Alt)', file: '/music/Shadows of the Mind (1).mp3' },
  { title: 'Shadows of the Mind (Extended)', file: '/music/Shadows of the Mind (2).mp3' },
  { title: 'Shadows of the Mind (Final)', file: '/music/Shadows of the Mind (3).mp3' },
  { title: 'Shadows and Silhouettes', file: '/music/Shadows and Silhouettes.mp3' },
  { title: 'Shadows and Silhouettes (Alt)', file: '/music/Shadows and Silhouettes (1).mp3' },
  { title: 'Shadows in the Smoke', file: '/music/Shadows in the Smoke.mp3' },
  { title: 'Shadows in the Smoke (Alt)', file: '/music/Shadows in the Smoke (1).mp3' },
  
  // Shadowed Series
  { title: 'Shadowed Depths', file: '/music/Shadowed Depths.mp3' },
  { title: 'Shadowed Depths (Alt)', file: '/music/Shadowed Depths (1).mp3' },
  { title: 'Shadowed Whispers', file: '/music/Shadowed Whispers.mp3' },
  { title: 'Shadowed Whispers (Alt)', file: '/music/Shadowed Whispers (1).mp3' },
  
  // Whispers & Midnight Series
  { title: 'Whispers in the Smoke', file: '/music/Whispers in the Smoke.mp3' },
  { title: 'Whispers in the Smoke (Alt)', file: '/music/Whispers in the Smoke (1).mp3' },
  { title: 'Midnight Reverie', file: '/music/Midnight Reverie.mp3' },
  { title: 'Midnight Reverie (Alt)', file: '/music/Midnight Reverie (1).mp3' }
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Remove auto-play attempt - let user initiate
  useEffect(() => {
    // Just prepare the audio element, don't auto-play
    if (audioRef.current) {
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
        setHasStarted(true)
        setAutoplayBlocked(false)
        setIsLoading(false)
      } catch (error) {
        console.log('Play failed:', error)
        setAutoplayBlocked(true)
        setIsLoading(false)
      }
    }
  }

  const handleTrackEnd = () => {
    const nextTrack = (currentTrack + 1) % tracks.length
    setCurrentTrack(nextTrack)
    // Don't auto-play next track, let user control
    setIsPlaying(false)
  }

  const handleLoadedData = () => {
    setIsLoading(false)
    // Only auto-play if user has already started playing
    if (isPlaying && hasStarted && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
        setAutoplayBlocked(true)
      })
    }
  }

  const handleLoadStart = () => {
    setIsLoading(true)
  }

  const handleError = (e: any) => {
    console.error('Audio error:', e)
    setIsLoading(false)
    setIsPlaying(false)
  }

  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
    setIsPlaying(false) // Stop current playback
    setIsLoading(true)
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length
    setCurrentTrack(next)
    setIsPlaying(false) // Stop current playback
    setIsLoading(true)
  }

  const prevTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1
    setCurrentTrack(prev)
    setIsPlaying(false) // Stop current playback
    setIsLoading(true)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        src={tracks[currentTrack].file}
        onEnded={handleTrackEnd}
        onLoadedData={handleLoadedData}
        onLoadStart={handleLoadStart}
        onError={handleError}
        preload="metadata"
      />
      
      {/* Main Control Panel */}
      <div className="bg-black/90 border border-white p-2 space-y-2">
        {/* Primary Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevTrack}
            className="text-white p-1 text-xs lo-fi-text hover:bg-white hover:text-black transition-colors"
            title="Previous Track"
            disabled={isLoading}
          >
            ⏮
          </button>
          
          <button
            onClick={togglePlay}
            className="text-white p-2 text-sm lo-fi-text hover:bg-white hover:text-black transition-colors"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : (isPlaying ? '⏸' : '▶')}
          </button>
          
          <button
            onClick={nextTrack}
            className="text-white p-1 text-xs lo-fi-text hover:bg-white hover:text-black transition-colors"
            title="Next Track"
            disabled={isLoading}
          >
            ⏭
          </button>
          
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="text-white p-1 text-xs lo-fi-text hover:bg-white hover:text-black transition-colors"
            title="Show Playlist"
          >
            ♫
          </button>
        </div>
        
        {/* Prominent NEXT Button */}
        <div className="border-t border-white/20 pt-2">
          <button
            onClick={nextTrack}
            className="w-full bg-white text-black px-3 py-1 text-xs lo-fi-text hover:bg-gray-200 transition-colors font-bold"
            title="Skip to Next Track"
            disabled={isLoading}
          >
            {isLoading ? 'LOADING...' : 'NEXT TRACK →'}
          </button>
        </div>

        {/* Status Messages */}
        {autoplayBlocked && !hasStarted && (
          <div className="text-[8px] text-yellow-400 border-t border-yellow-400/20 pt-1">
            ⚠ Click PLAY to start music
          </div>
        )}
      </div>
      
      {/* Now Playing Info */}
      {(isPlaying || hasStarted) && (
        <div className="absolute top-full mt-2 right-0 bg-black/90 border border-white p-2 text-[8px] text-white lo-fi-text whitespace-nowrap">
          <div className="font-bold">
            {isPlaying ? 'NOW PLAYING:' : 'PAUSED:'}
          </div>
          <div>{tracks[currentTrack].title}</div>
          <div className="text-white/70">Track {currentTrack + 1} of {tracks.length}</div>
        </div>
      )}
      
      {/* Playlist */}
      {showPlaylist && (
        <div className="absolute top-full mt-2 right-0 bg-black/90 border border-white p-2 text-[8px] text-white lo-fi-text max-h-64 overflow-y-auto w-64">
          <div className="font-bold mb-2 border-b border-white/30 pb-1 flex items-center justify-between">
            <span>V3XV0ID ATMOSPHERIC</span>
            <span>({tracks.length} tracks)</span>
          </div>
          {tracks.map((track, index) => (
            <div
              key={index}
              onClick={() => selectTrack(index)}
              className={`cursor-pointer hover:bg-white/20 p-1 rounded transition-colors ${
                index === currentTrack ? 'bg-white/30 font-bold' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{index + 1}. {track.title}</span>
                {index === currentTrack && isPlaying && (
                  <span className="text-green-400">♪</span>
                )}
                {index === currentTrack && isLoading && (
                  <span className="text-yellow-400">⏳</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 