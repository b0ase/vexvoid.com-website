'use client'

import { useState, useRef, useEffect } from 'react'

const tracks = [
  {
    id: 1,
    title: 'Echoes in the Abyss',
    src: '/music/Echoes in the Abyss.mp3',
    duration: '3:42'
  },
  {
    id: 2,
    title: 'Shadowed Depths',
    src: '/music/Shadowed Depths.mp3',
    duration: '4:18'
  }
]

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const selectTrack = (trackIndex: number) => {
    setCurrentTrack(trackIndex)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <section className="py-24 px-4 bg-cyber-dark border-t border-cyber-gray">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">AUDIO</h2>
          <div className="w-24 h-px bg-cyber-white mx-auto mb-8"></div>
          <p className="text-center text-cyber-accent max-w-2xl mx-auto leading-relaxed">
            Experimental electronic compositions exploring the depths of digital sound.
          </p>
        </div>

        <div className="cyber-card p-8">
          {/* Current Track Display */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-mono cyber-text font-bold">
                  {tracks[currentTrack].title.toUpperCase()}
                </h3>
                <p className="text-cyber-accent font-mono text-sm mt-1">V3XV0ID</p>
              </div>
              <div className="text-cyber-accent font-mono text-sm">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-px bg-cyber-light relative">
                <div 
                  className="h-px bg-cyber-white transition-all duration-100"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div 
                  className="absolute top-0 w-2 h-2 bg-cyber-white transform -translate-y-1/2 transition-all duration-100"
                  style={{ left: `${progressPercentage}%`, marginLeft: '-4px' }}
                />
              </div>
            </div>

            {/* Play/Pause Control */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayPause}
                className="cyber-button px-12 py-3 text-lg font-mono tracking-wider"
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
            </div>
          </div>

          {/* Track List */}
          <div className="border-t border-cyber-gray pt-8">
            <h4 className="text-lg font-mono cyber-text mb-4">TRACKLIST</h4>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-200 ${
                    currentTrack === index 
                      ? 'bg-cyber-light text-cyber-white' 
                      : 'hover:bg-cyber-gray text-cyber-accent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-1 h-1 bg-cyber-white mr-4"></div>
                    <span className="font-mono text-sm tracking-wide">
                      {track.title.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-cyber-accent">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <audio
            ref={audioRef}
            src={tracks[currentTrack].src}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </section>
  )
} 