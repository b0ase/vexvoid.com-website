'use client'

import { useState, useRef, useEffect } from 'react'
import { musicTracks } from '../../lib/musicLibrary'
import { getMusicUrl } from '../../lib/supabase'
import { generateFrames, artPatterns, type ArtPatternName } from '../../lib/generativeArt'
import { createVideoFromFrames, createTestVideo, type VideoEncodingOptions } from '../../lib/videoEncoder'

interface WorkingVideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void
}

export default function WorkingVideoGenerator({ onVideoGenerated }: WorkingVideoGeneratorProps) {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState<ArtPatternName>('organicFlow')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(10) // seconds
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [includeAudio, setIncludeAudio] = useState(true)

  const patternNames = Object.keys(artPatterns) as ArtPatternName[]

  const generateVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    setStatus('Starting video generation...')
    setGeneratedVideoUrl(null)

    try {
      const track = musicTracks[selectedTrack]
      
      setStatus('Generating art frames...')
      setProgress(5)

      // Generate frames using the selected pattern
      const frames = await generateFrames(selectedPattern, {
        width: 800,
        height: 600,
        duration: duration,
        frameRate: 30,
        backgroundColor: '#000000',
        strokeColor: '#ffffff',
        strokeWeight: 1
      })

      setProgress(30)
      setStatus('Loading audio...')

      let audioBlob: Blob | undefined = undefined
      
      if (includeAudio) {
        try {
          // Try to get audio from Supabase first, then fallback to local
          const audioUrl = getMusicUrl(track.filename) || track.path
          const audioResponse = await fetch(audioUrl)
          if (audioResponse.ok) {
            audioBlob = await audioResponse.blob()
            setStatus('Audio loaded successfully')
          } else {
            setStatus('Audio load failed, creating video without audio')
            setIncludeAudio(false)
          }
        } catch (error) {
          console.error('Audio loading error:', error)
          setStatus('Audio load failed, creating video without audio')
        }
      }

      setProgress(40)
      setStatus('Encoding video with FFmpeg...')

      // Create video using FFmpeg
      const videoBlob = await createVideoFromFrames(frames, audioBlob, {
        fps: 30,
        width: 800,
        height: 600,
        quality: quality,
        onProgress: (encodingProgress) => {
          // Map encoding progress to overall progress (40-95%)
          const overallProgress = 40 + (encodingProgress / 100) * 55
          setProgress(overallProgress)
          setStatus(`Encoding video... ${Math.round(encodingProgress)}%`)
        }
      })

      setProgress(95)
      setStatus('Creating download link...')

      // Create download URL
      const videoUrl = URL.createObjectURL(videoBlob)
      setGeneratedVideoUrl(videoUrl)

      setProgress(100)
      setStatus('Video generated successfully!')

      // Notify parent component
      if (onVideoGenerated) {
        onVideoGenerated(`${track.id}-${selectedPattern}-${Date.now()}`)
      }

    } catch (error) {
      console.error('Video generation error:', error)
      setStatus(`Error: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateTestVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    setStatus('Generating test video...')
    setGeneratedVideoUrl(null)

    try {
      const videoBlob = await createTestVideo(5, (testProgress) => {
        setProgress(testProgress)
        setStatus(`Creating test video... ${Math.round(testProgress)}%`)
      })

      const videoUrl = URL.createObjectURL(videoBlob)
      setGeneratedVideoUrl(videoUrl)
      setStatus('Test video generated successfully!')

    } catch (error) {
      console.error('Test video generation error:', error)
      setStatus(`Test video error: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadVideo = () => {
    if (generatedVideoUrl) {
      const track = musicTracks[selectedTrack]
      const link = document.createElement('a')
      link.href = generatedVideoUrl
      link.download = `${track.title}-${selectedPattern}-V3XV0ID.mp4`
      link.click()
    }
  }

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (generatedVideoUrl) {
        URL.revokeObjectURL(generatedVideoUrl)
      }
    }
  }, [generatedVideoUrl])

  return (
    <div className="bg-black/90 border border-white/30 p-4 text-white lo-fi-text">
      <h2 className="text-lg font-bold cyber-text mb-4">WORKING VIDEO GENERATOR</h2>
      
      {/* Track Selection */}
      <div className="mb-4">
        <label className="block text-xs text-white/60 mb-2">SELECT TRACK</label>
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(Number(e.target.value))}
          className="w-full bg-black border border-white/30 text-white p-2 text-xs"
          disabled={isGenerating}
        >
          {musicTracks.map((track, index) => (
            <option key={track.id} value={index}>
              {track.title}
            </option>
          ))}
        </select>
      </div>

      {/* Pattern Selection */}
      <div className="mb-4">
        <label className="block text-xs text-white/60 mb-2">VISUAL PATTERN</label>
        <select
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value as ArtPatternName)}
          className="w-full bg-black border border-white/30 text-white p-2 text-xs"
          disabled={isGenerating}
        >
          {patternNames.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block text-xs text-white/60 mb-2">DURATION (SECONDS)</label>
        <input
          type="range"
          min="5"
          max="30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full"
          disabled={isGenerating}
        />
        <div className="text-xs text-white/60 mt-1">{duration} seconds</div>
      </div>

      {/* Quality */}
      <div className="mb-4">
        <label className="block text-xs text-white/60 mb-2">QUALITY</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
          className="w-full bg-black border border-white/30 text-white p-2 text-xs"
          disabled={isGenerating}
        >
          <option value="low">LOW (FAST)</option>
          <option value="medium">MEDIUM</option>
          <option value="high">HIGH (SLOW)</option>
        </select>
      </div>

      {/* Include Audio */}
      <div className="mb-4">
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={includeAudio}
            onChange={(e) => setIncludeAudio(e.target.checked)}
            className="mr-2"
            disabled={isGenerating}
          />
          INCLUDE AUDIO
        </label>
      </div>

      {/* Progress */}
      {isGenerating && (
        <div className="mb-4">
          <div className="text-xs text-white/60 mb-2">{status}</div>
          <div className="w-full bg-white/20 h-2">
            <div 
              className="bg-cyan-400 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-white/60 mt-1">{Math.round(progress)}%</div>
        </div>
      )}

      {/* Generate Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={generateVideo}
          disabled={isGenerating}
          className="flex-1 bg-white text-black py-2 px-4 text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE VIDEO'}
        </button>
        
        <button
          onClick={generateTestVideo}
          disabled={isGenerating}
          className="bg-cyan-600 text-white py-2 px-4 text-xs font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          TEST
        </button>
      </div>

      {/* Download */}
      {generatedVideoUrl && (
        <div className="mb-4">
          <button
            onClick={downloadVideo}
            className="w-full bg-green-600 text-white py-2 px-4 text-xs font-bold hover:bg-green-700 transition-colors"
          >
            DOWNLOAD MP4
          </button>
          
          {/* Video Preview */}
          <div className="mt-4">
            <video
              src={generatedVideoUrl}
              controls
              className="w-full max-w-md border border-white/30"
              style={{ maxHeight: '300px' }}
            >
              Your browser does not support video playback.
            </video>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 border border-green-500/50 bg-green-500/10">
        <div className="text-xs text-green-400">
          ✅ This generator uses FFmpeg.wasm to create real MP4 videos with your selected music and generative art patterns.
          The first run may take longer as FFmpeg initializes.
        </div>
      </div>
    </div>
  )
} 