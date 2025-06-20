'use client'

import { useState } from 'react'
import { musicTracks, MusicTrack } from '../lib/musicLibrary'
import { getTracksByMood } from '../lib/musicLibrary'
import { useMusicPlayer } from '../lib/musicPlayerContext'

export default function AudioPage() {
  const [selectedMood, setSelectedMood] = useState<string>('all')
  
  // Use the global music player context
  const {
    isPlaying,
    currentTrack: currentTrackIndex,
    selectTrack
  } = useMusicPlayer()

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
  const currentTrackData = musicTracks[currentTrackIndex]

  // Helper to find the track index in the full musicTracks array
  const getTrackIndex = (track: MusicTrack) => {
    return musicTracks.findIndex(t => t.id === track.id)
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      {/* Header */}
      <div className="border-b border-cyber-gray">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-6xl font-mono cyber-text font-bold mb-4">
            V3XV0ID DISCOGRAPHY
          </h1>
          <div className="w-32 h-px bg-cyber-white"></div>
          <p className="text-cyber-accent mt-4 font-mono text-sm">
            Click any track to play through the global music player (top right)
          </p>
        </div>
      </div>

      {/* Now Playing Indicator */}
      {currentTrackData && (
        <div className="bg-cyber-dark/50 border-b border-cyber-gray/50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-white animate-pulse"></div>
                <span className="font-mono text-cyber-accent">
                  {isPlaying ? 'NOW PLAYING:' : 'PAUSED:'}
                </span>
              </div>
              <span className="font-mono cyber-text">
                {currentTrackData.title}
              </span>
              <span className="font-mono text-cyber-accent text-xs">
                ({currentTrackData.mood?.toUpperCase() || 'EXPERIMENTAL'})
              </span>
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
                {mood.toUpperCase().replace('-', ' ')} ({moodCategories[mood as keyof typeof moodCategories].length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-2">
          {currentTracks.map((track, index) => {
            const globalIndex = getTrackIndex(track)
            const isCurrentTrack = globalIndex === currentTrackIndex
            
            return (
              <div
                key={track.id}
                onClick={() => selectTrack(globalIndex)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors group ${
                  isCurrentTrack 
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
                  {isCurrentTrack ? (
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
            )
          })}
        </div>
      </div>
    </div>
  )
} 