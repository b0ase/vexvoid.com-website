'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks } from '../lib/musicLibrary'

// Available video clips for mixing - using Supabase cloud storage
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/videos/${filename}`

const videoClips = [
  {
    id: 'train-rush-1',
    path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'),
    title: 'Train Rush',
    mood: 'urban-energy'
  },
  {
    id: 'train-rush-2',
    path: getVideoUrl('A_train_rushes_past_while_urban_ (1).mp4'),
    title: 'Train Rush Alt',
    mood: 'urban-energy'
  },
  {
    id: 'rain-streets',
    path: getVideoUrl('Heavy_rain_pelts_the_ground__str.mp4'),
    title: 'Rain on Streets',
    mood: 'atmospheric'
  },
  {
    id: 'footsteps',
    path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'),
    title: 'Footsteps Echo',
    mood: 'mysterious'
  },
  {
    id: 'extended',
    path: getVideoUrl('Extended_Video.mp4'),
    title: 'Extended Scene',
    mood: 'cinematic'
  },
  {
    id: 'professional-1',
    path: getVideoUrl('Professional_Mode_Generated_Video.mp4'),
    title: 'Professional Mode',
    mood: 'polished'
  },
  {
    id: 'professional-2',
    path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'),
    title: 'Professional Mode Alt',
    mood: 'polished'
  },
  {
    id: 'professional-3',
    path: getVideoUrl('Professional_Mode_Generated_Video (2).mp4'),
    title: 'Professional Mode 2',
    mood: 'polished'
  }
]

// Curated video sequences for different moods
const videoSequences = {
  'urban-grit': [
    { videoId: 'train-rush-1', startTime: 0, duration: 4 },
    { videoId: 'footsteps', startTime: 0, duration: 3 },
    { videoId: 'rain-streets', startTime: 0, duration: 5 },
    { videoId: 'train-rush-2', startTime: 0, duration: 4 },
    { videoId: 'professional-1', startTime: 0, duration: 6 }
  ],
  'atmospheric': [
    { videoId: 'rain-streets', startTime: 0, duration: 6 },
    { videoId: 'extended', startTime: 0, duration: 8 },
    { videoId: 'footsteps', startTime: 0, duration: 4 },
    { videoId: 'professional-2', startTime: 0, duration: 6 }
  ],
  'cinematic': [
    { videoId: 'extended', startTime: 0, duration: 10 },
    { videoId: 'professional-3', startTime: 0, duration: 8 },
    { videoId: 'train-rush-1', startTime: 0, duration: 6 }
  ]
}

export default function VideoPreviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(musicTracks[0])
  const [selectedSequence, setSelectedSequence] = useState<keyof typeof videoSequences>('urban-grit')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSequence = videoSequences[selectedSequence]
  const currentVideo = currentSequence[currentVideoIndex]
  const videoClip = videoClips.find(clip => clip.id === currentVideo.videoId)

  // Auto-advance to next video when current one ends
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      const nextIndex = (currentVideoIndex + 1) % currentSequence.length
      setCurrentVideoIndex(nextIndex)
    }

    video.addEventListener('ended', handleVideoEnd)
    return () => video.removeEventListener('ended', handleVideoEnd)
  }, [currentVideoIndex, currentSequence.length])

  // Sync video playback with audio
  const handlePlayPause = () => {
    const video = videoRef.current
    const audio = audioRef.current
    
    if (!video || !audio) return

    if (isPlaying) {
      video.pause()
      audio.pause()
    } else {
      video.play()
      audio.play()
    }
    
    setIsPlaying(!isPlaying)
  }

  // Reset sequence when changing track or sequence
  useEffect(() => {
    setCurrentVideoIndex(0)
    setIsPlaying(false)
    if (videoRef.current) videoRef.current.pause()
    if (audioRef.current) audioRef.current.pause()
  }, [selectedTrack, selectedSequence])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold cyber-text mb-2">V3XV0ID Video Mix Preview</h1>
        <p className="text-white/70 text-sm">
          Preview video sequences synced with music tracks before adding to landing page
        </p>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Video Player */}
        <div className="flex-1 relative bg-black">
          <video
            ref={videoRef}
            key={`${videoClip?.path}-${currentVideoIndex}`}
            className="w-full h-full object-cover"
            muted={videoMuted}
            loop={false}
            playsInline
          >
            <source src={videoClip?.path} type="video/mp4" />
          </video>

          {/* Video Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none">
            <div className="absolute top-4 left-4 pointer-events-auto">
              <div className="bg-black/80 px-3 py-2 text-sm">
                <div className="font-bold">{videoClip?.title}</div>
                <div className="text-white/60">
                  {currentVideoIndex + 1} of {currentSequence.length} • {selectedSequence}
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-auto">
              <button
                onClick={() => setVideoMuted(!videoMuted)}
                className="bg-black/80 px-3 py-2 text-sm hover:bg-black/90 transition-colors"
              >
                {videoMuted ? '🔇 VIDEO MUTED' : '🔊 VIDEO AUDIO'}
              </button>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={handlePlayPause}
              className="bg-black/80 hover:bg-black/90 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl transition-all pointer-events-auto"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${((currentVideoIndex + 1) / currentSequence.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-96 bg-black/95 border-l border-white/20 p-6 overflow-y-auto">
          {/* Music Track Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">🎵 MUSIC TRACK</h3>
            <select
              value={selectedTrack.id}
              onChange={(e) => {
                const track = musicTracks.find(t => t.id === e.target.value)
                if (track) setSelectedTrack(track)
              }}
              className="w-full bg-black border border-white/30 text-white p-3 text-sm"
            >
              {musicTracks.slice(0, 20).map(track => (
                <option key={track.id} value={track.id}>
                  {track.title} {track.mood ? `(${track.mood})` : ''}
                </option>
              ))}
            </select>
            
            <div className="mt-3 p-3 bg-white/5 text-xs">
              <div><strong>Selected:</strong> {selectedTrack.title}</div>
              {selectedTrack.mood && <div><strong>Mood:</strong> {selectedTrack.mood}</div>}
            </div>
          </div>

          {/* Video Sequence Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">🎬 VIDEO SEQUENCE</h3>
            <div className="space-y-2">
              {Object.keys(videoSequences).map(sequenceKey => (
                <button
                  key={sequenceKey}
                  onClick={() => setSelectedSequence(sequenceKey as keyof typeof videoSequences)}
                  className={`w-full text-left p-3 border transition-colors ${
                    selectedSequence === sequenceKey
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  <div className="font-semibold capitalize">{sequenceKey.replace('-', ' ')}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {videoSequences[sequenceKey as keyof typeof videoSequences].length} clips
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Sequence Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">📋 SEQUENCE DETAILS</h3>
            <div className="space-y-2">
              {currentSequence.map((clip, index) => {
                const video = videoClips.find(v => v.id === clip.videoId)
                return (
                  <div
                    key={index}
                    className={`p-2 text-xs border-l-2 ${
                      index === currentVideoIndex 
                        ? 'border-cyan-400 bg-cyan-400/10' 
                        : 'border-white/20'
                    }`}
                  >
                    <div className="font-semibold">{index + 1}. {video?.title}</div>
                    <div className="text-white/60">Duration: {clip.duration}s</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">🚀 EXPORT OPTIONS</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 text-sm font-semibold transition-colors">
                ✅ ADD TO HERO SECTION
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 text-sm font-semibold transition-colors">
                💾 SAVE AS PRESET
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 text-sm font-semibold transition-colors">
                🎨 CUSTOMIZE SEQUENCE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      >
        <source src={selectedTrack.path} type="audio/mpeg" />
      </audio>
    </div>
  )
} 