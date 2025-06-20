'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks, MusicTrack } from '../lib/musicLibrary'
import { getTracksByMood } from '../lib/musicLibrary'

export default function AudioPage() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Group tracks by mood for better organization
  const moodCategories = {
    'all': musicTracks,
    'dark-ambient': getTracksByMood('dark-ambient'),
    'atmospheric': getTracksByMood('atmospheric'),
    'ethereal': getTracksByMood('ethereal'),
    'mysterious': getTracksByMood('mysterious'),
    'heavy-dark': getTracksByMood('heavy-dark'),
    'dreamy': getTracksByMood('dreamy'),
    'rhythmic': getTracksByMood('rhythmic'),
    'deep-dark': getTracksByMood('deep-dark')
  }

  const currentTracks = moodCategories[selectedMood as keyof typeof moodCategories] || musicTracks

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      // Auto-play next track
      const currentIndex = currentTracks.findIndex(t => t.id === currentTrack?.id)
      const nextTrack = currentTracks[currentIndex + 1]
      if (nextTrack) {
        playTrack(nextTrack)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack, currentTracks])

  const playTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      setCurrentTrack(track)
      if (audioRef.current) {
        audioRef.current.src = track.supabaseUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const skipTrack = (direction: 'prev' | 'next') => {
    const currentIndex = currentTracks.findIndex(t => t.id === currentTrack?.id)
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    
    if (newIndex < 0) newIndex = currentTracks.length - 1
    if (newIndex >= currentTracks.length) newIndex = 0
    
    playTrack(currentTracks[newIndex])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="border-b border-cyber-gray">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-6xl font-mono cyber-text font-bold mb-4">
            V3XV0ID DISCOGRAPHY
          </h1>
          <div className="w-32 h-px bg-cyber-white"></div>
        </div>
      </div>

      {/* Current Track Player */}
      {currentTrack && (
        <div className="bg-cyber-dark border-b border-cyber-gray">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-mono cyber-text mb-1">{currentTrack.title}</h2>
                <p className="text-cyber-accent text-sm font-mono">
                  {currentTrack.mood?.toUpperCase() || 'EXPERIMENTAL'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => skipTrack('prev')}
                  className="p-2 border border-cyber-white hover:bg-cyber-white hover:text-cyber-black transition-colors"
                >
                  ⏮
                </button>
                <button 
                  onClick={togglePlay}
                  className="p-3 bg-cyber-white text-cyber-black hover:bg-cyber-accent transition-colors font-mono"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button 
                  onClick={() => skipTrack('next')}
                  className="p-2 border border-cyber-white hover:bg-cyber-white hover:text-cyber-black transition-colors"
                >
                  ⏭
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-cyber-gray appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(currentTime / duration) * 100}%, #333333 ${(currentTime / duration) * 100}%, #333333 100%)`
                }}
              />
              <span className="text-sm font-mono">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mood Filter */}
      <div className="border-b border-cyber-gray">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(moodCategories).map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  selectedMood === mood 
                    ? 'bg-cyber-white text-cyber-black' 
                    : 'border border-cyber-white text-cyber-white hover:bg-cyber-white hover:text-cyber-black'
                }`}
              >
                {mood.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-2">
          {currentTracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors group ${
                currentTrack?.id === track.id 
                  ? 'bg-cyber-white/10 border-l-4 border-cyber-white' 
                  : 'hover:bg-cyber-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-cyber-accent font-mono text-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-mono cyber-text group-hover:text-cyber-white transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-cyber-accent text-sm font-mono">
                    {track.mood?.toUpperCase() || 'EXPERIMENTAL'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {currentTrack?.id === track.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyber-white animate-pulse"></div>
                    <span className="text-sm font-mono">
                      {isPlaying ? 'PLAYING' : 'PAUSED'}
                    </span>
                  </div>
                ) : (
                  <button className="opacity-0 group-hover:opacity-100 p-2 border border-cyber-white hover:bg-cyber-white hover:text-cyber-black transition-all">
                    ▶
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 