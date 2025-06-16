'use client'

import { useState, useEffect, useRef } from 'react'
import { musicTracks, getAudioUrl, MusicTrack } from '../../lib/musicLibrary'
import { checkUploadedFiles } from '../../lib/supabase'

interface MusicManagerProps {}

export default function MusicManager({}: MusicManagerProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'local'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadTracks()
    checkUploaded()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setCurrentlyPlaying(null)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentlyPlaying])

  const loadTracks = async () => {
    setTracks(musicTracks)
  }

  const checkUploaded = async () => {
    try {
      const uploaded = await checkUploadedFiles()
      setUploadedFiles(uploaded)
    } catch (error) {
      console.error('Error checking uploaded files:', error)
    }
  }

  const playTrack = (track: MusicTrack) => {
    const audio = audioRef.current
    if (!audio) return

    if (currentlyPlaying === track.id) {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
      return
    }

    audio.src = getAudioUrl(track)
    audio.volume = volume
    setCurrentlyPlaying(track.id)
    audio.play().catch(error => {
      console.error('Error playing audio:', error)
      setCurrentlyPlaying(null)
    })
  }

  const stopTrack = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setCurrentlyPlaying(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.mood?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'uploaded') {
      return matchesSearch && uploadedFiles.includes(track.filename)
    } else if (filter === 'local') {
      return matchesSearch && !uploadedFiles.includes(track.filename)
    }
    return matchesSearch
  })

  const currentTrack = tracks.find(t => t.id === currentlyPlaying)

  return (
    <div className="space-y-6">
      {/* Audio Element */}
      <audio ref={audioRef} />

      {/* Controls & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text">{tracks.length}</div>
          <div className="text-xs text-white/70">TOTAL TRACKS</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text text-green-400">{uploadedFiles.length}</div>
          <div className="text-xs text-white/70">UPLOADED</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text text-yellow-400">{tracks.length - uploadedFiles.length}</div>
          <div className="text-xs text-white/70">LOCAL ONLY</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text text-blue-400">{currentlyPlaying ? '1' : '0'}</div>
          <div className="text-xs text-white/70">PLAYING</div>
        </div>
      </div>

      {/* Current Track Player */}
      {currentTrack && (
        <div className="border border-cyan-500/50 bg-cyan-500/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm lo-fi-text text-cyan-400">{currentTrack.title}</h3>
              <p className="text-xs text-cyan-300">{currentTrack.mood}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={stopTrack}
                className="w-8 h-8 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors flex items-center justify-center"
              >
                ⏹
              </button>
              <div className="text-xs text-cyan-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-black/50 border border-cyan-500/30">
              <div 
                className="h-full bg-cyan-400 transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filter === 'all'
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            ALL ({tracks.length})
          </button>
          <button
            onClick={() => setFilter('uploaded')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filter === 'uploaded'
                ? 'border-green-400 bg-green-400 text-black'
                : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
            }`}
          >
            UPLOADED ({uploadedFiles.length})
          </button>
          <button
            onClick={() => setFilter('local')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filter === 'local'
                ? 'border-yellow-400 bg-yellow-400 text-black'
                : 'border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            LOCAL ({tracks.length - uploadedFiles.length})
          </button>
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTracks.map((track) => {
          const isUploaded = uploadedFiles.includes(track.filename)
          const isPlaying = currentlyPlaying === track.id
          
          return (
            <div
              key={track.id}
              className={`border p-3 transition-colors ${
                isPlaying
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : isUploaded
                    ? 'border-green-600/50 bg-green-600/5 hover:bg-green-600/10'
                    : 'border-white/20 bg-black/30 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm lo-fi-text">{track.title}</h4>
                    {isUploaded && (
                      <span className="text-xs text-green-400">☁️</span>
                    )}
                    {isPlaying && (
                      <span className="text-xs text-cyan-400 animate-pulse">♪</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/70 mt-1">
                    <span>{track.mood}</span>
                    <span>{track.filename}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playTrack(track)}
                    className={`w-8 h-8 border text-xs transition-colors flex items-center justify-center ${
                      isPlaying
                        ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
                        : isUploaded
                          ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                          : 'border-white/50 text-white/70 hover:bg-white hover:text-black'
                    }`}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  
                  {!isUploaded && (
                    <span className="text-xs text-yellow-400">LOCAL</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p className="text-sm lo-fi-text">No tracks found matching your criteria</p>
        </div>
      )}
    </div>
  )
} 