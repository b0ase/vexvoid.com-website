'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getAllImagePaths } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'
import { getAllVideoPaths } from '../../lib/videos'

interface MediaAsset {
  id: string
  name: string
  type: 'video' | 'image' | 'audio'
  url: string
  duration?: number
  thumbnail?: string
  bucket?: string
  folder?: string
  size?: number
}

interface TimelineClip {
  id: string
  assetId: string
  trackId: string
  startTime: number
  duration: number
  volume?: number
  fadeIn?: number
  fadeOut?: number
  transition?: 'cut' | 'fade' | 'dissolve' | 'wipe'
  effects?: string[]
}

interface TimelineTrack {
  id: string
  type: 'video' | 'image' | 'audio'
  name: string
  clips: TimelineClip[]
  muted?: boolean
  volume?: number
  solo?: boolean
  locked?: boolean
}

interface ProjectSettings {
  title: string
  duration: number
  resolution: '1080p' | '720p' | '4K'
  framerate: 30 | 60
  style: 'slideshow' | 'ken-burns' | 'glitch' | 'fade' | 'cinematic'
  uploadToYouTube: boolean
}

export default function TimelineVideoEditor() {
  const [supabaseAssets, setSupabaseAssets] = useState<MediaAsset[]>([])
  const [localAssets, setLocalAssets] = useState<MediaAsset[]>([])
  const [allAssets, setAllAssets] = useState<MediaAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)
  const [assetFilter, setAssetFilter] = useState<'all' | 'video' | 'image' | 'audio'>('all')
  const [assetSource, setAssetSource] = useState<'all' | 'supabase' | 'local'>('all')
  
  const [timeline, setTimeline] = useState<TimelineTrack[]>([
    { id: 'video1', type: 'video', name: 'Video Track 1', clips: [], volume: 1.0 },
    { id: 'video2', type: 'video', name: 'Video Track 2', clips: [], volume: 1.0 },
    { id: 'images1', type: 'image', name: 'Image Track 1', clips: [], volume: 1.0 },
    { id: 'images2', type: 'image', name: 'Image Track 2', clips: [], volume: 1.0 },
    { id: 'music1', type: 'audio', name: 'Music L/R', clips: [], volume: 0.8 },
    { id: 'music2', type: 'audio', name: 'Music Stereo', clips: [], volume: 0.8 },
    { id: 'sfx1', type: 'audio', name: 'SFX L/R', clips: [], volume: 0.6 },
    { id: 'sfx2', type: 'audio', name: 'SFX Stereo', clips: [], volume: 0.6 }
  ])
  
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    title: 'V3XV0ID Timeline Project',
    duration: 180,
    resolution: '1080p',
    framerate: 30,
    style: 'cinematic',
    uploadToYouTube: false
  })
  
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  
  const timelineRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      // Load Supabase assets
      await loadSupabaseAssets()
      
      // Load local assets
      loadLocalAssets()
    } catch (error) {
      console.error('Failed to load assets:', error)
    }
  }

  const loadSupabaseAssets = async () => {
    try {
      const assets: MediaAsset[] = []
      
      // Load from images bucket
      const { data: imageFiles } = await supabase.storage
        .from('images')
        .list('', { limit: 100 })
      
      if (imageFiles) {
        for (const file of imageFiles) {
          if (file.name && !file.name.includes('.emptyFolderPlaceholder')) {
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(file.name)
            
            assets.push({
              id: `sb-img-${file.name}`,
              name: file.name,
              type: 'image',
              url: urlData.publicUrl,
              bucket: 'images',
              size: file.metadata?.size
            })
          }
        }
      }
      
      // Load from videos bucket
      const { data: videoFiles } = await supabase.storage
        .from('videos')
        .list('', { limit: 100 })
      
      if (videoFiles) {
        for (const file of videoFiles) {
          if (file.name && !file.name.includes('.emptyFolderPlaceholder')) {
            const { data: urlData } = supabase.storage
              .from('videos')
              .getPublicUrl(file.name)
            
            assets.push({
              id: `sb-vid-${file.name}`,
              name: file.name,
              type: 'video',
              url: urlData.publicUrl,
              bucket: 'videos',
              duration: 30, // Default, would need metadata
              size: file.metadata?.size
            })
          }
        }
      }
      
      // Load from audio bucket
      const { data: audioFiles } = await supabase.storage
        .from('v3xv0id-music')
        .list('', { limit: 100 })
      
      if (audioFiles) {
        for (const file of audioFiles) {
          if (file.name && file.name.endsWith('.mp3')) {
            const { data: urlData } = supabase.storage
              .from('v3xv0id-music')
              .getPublicUrl(file.name)
            
            assets.push({
              id: `sb-aud-${file.name}`,
              name: file.name,
              type: 'audio',
              url: urlData.publicUrl,
              bucket: 'v3xv0id-music',
              duration: 180, // Default, would need metadata
              size: file.metadata?.size
            })
          }
        }
      }
      
      setSupabaseAssets(assets)
      console.log(`Loaded ${assets.length} Supabase assets`)
      
    } catch (error) {
      console.error('Failed to load Supabase assets:', error)
    }
  }

  const loadLocalAssets = () => {
    const assets: MediaAsset[] = []
    
    // Local images
    getAllImagePaths().forEach((path, index) => {
      assets.push({
        id: `local-img-${index}`,
        name: path.split('/').pop() || `image-${index}`,
        type: 'image',
        url: path,
        duration: 5
      })
    })
    
    // Local videos
    getAllVideoPaths().forEach((path, index) => {
      assets.push({
        id: `local-vid-${index}`,
        name: path.split('/').pop() || `video-${index}`,
        type: 'video',
        url: path,
        duration: 15
      })
    })
    
    // Local music
    musicTracks.forEach((track, index) => {
      assets.push({
        id: `local-aud-${index}`,
        name: track.filename,
        type: 'audio',
        url: `/music/${track.filename}`,
        duration: track.duration || 180
      })
    })
    
    setLocalAssets(assets)
    console.log(`Loaded ${assets.length} local assets`)
  }

  useEffect(() => {
    // Combine and filter assets
    let combined = []
    
    if (assetSource === 'all') {
      combined = [...supabaseAssets, ...localAssets]
    } else if (assetSource === 'supabase') {
      combined = supabaseAssets
    } else {
      combined = localAssets
    }
    
    if (assetFilter !== 'all') {
      combined = combined.filter(asset => asset.type === assetFilter)
    }
    
    setAllAssets(combined)
  }, [supabaseAssets, localAssets, assetFilter, assetSource])

  const addClipToTrack = (asset: MediaAsset, trackId: string, startTime?: number) => {
    const track = timeline.find(t => t.id === trackId)
    if (!track) return
    
    // Check if asset type matches track type
    if (asset.type !== track.type) {
      alert(`Cannot add ${asset.type} to ${track.type} track`)
      return
    }
    
    const clipStartTime = startTime ?? currentTime
    const clipDuration = asset.duration || 5
    
    const newClip: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assetId: asset.id,
      trackId: trackId,
      startTime: clipStartTime,
      duration: clipDuration,
      volume: track.type === 'audio' ? 1.0 : undefined,
      transition: 'fade'
    }
    
    const updatedTimeline = timeline.map(t => {
      if (t.id === trackId) {
        return { ...t, clips: [...t.clips, newClip] }
      }
      return t
    })
    
    setTimeline(updatedTimeline)
  }

  const removeClip = (clipId: string) => {
    const updatedTimeline = timeline.map(track => ({
      ...track,
      clips: track.clips.filter(clip => clip.id !== clipId)
    }))
    setTimeline(updatedTimeline)
  }

  const updateTrackVolume = (trackId: string, volume: number) => {
    const updatedTimeline = timeline.map(track => {
      if (track.id === trackId) {
        return { ...track, volume }
      }
      return track
    })
    setTimeline(updatedTimeline)
  }

  const toggleTrackMute = (trackId: string) => {
    const updatedTimeline = timeline.map(track => {
      if (track.id === trackId) {
        return { ...track, muted: !track.muted }
      }
      return track
    })
    setTimeline(updatedTimeline)
  }

  const generateVideo = async () => {
    setIsGenerating(true)
    setGeneratedVideoUrl(null)
    
    try {
      console.log('🎬 Generating video from timeline...')
      
      // Prepare timeline data for server
      const timelineData = {
        tracks: timeline,
        projectSettings,
        assets: allAssets.reduce((acc, asset) => {
          acc[asset.id] = asset
          return acc
        }, {} as Record<string, MediaAsset>)
      }
      
      const response = await fetch('/api/video/compose-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timelineData)
      })
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedVideoUrl(result.videoUrl)
        
        // Upload to YouTube if requested
        if (projectSettings.uploadToYouTube) {
          const uploadResponse = await fetch('/api/youtube/upload-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoPath: result.videoUrl,
              title: projectSettings.title,
              description: `V3XV0ID Timeline Project - ${projectSettings.style} style composition`,
              tags: ['v3xv0id', 'timeline', 'video editing', 'ninja jazz'],
              privacy: 'unlisted'
            })
          })
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            alert(`✅ Video generated and uploaded to YouTube!\n${uploadResult.videoUrl}`)
          }
        } else {
          alert(`✅ Video generated successfully!\nDuration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`)
        }
      } else {
        throw new Error(result.error || 'Unknown error')
      }
      
    } catch (error) {
      console.error('Video generation failed:', error)
      alert(`❌ Video generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getClipColor = (trackType: string) => {
    switch (trackType) {
      case 'video': return 'bg-blue-500'
      case 'image': return 'bg-green-500'
      case 'audio': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-mono mb-2">🎬 V3XV0ID Timeline Editor</h1>
          <p className="text-cyan-400/70">Professional multi-track video editing with Supabase assets</p>
        </div>

        {/* Project Settings */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-4">
          <h3 className="text-lg font-mono mb-4">⚙️ Project Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-mono mb-2">Title:</label>
              <input
                type="text"
                value={projectSettings.title}
                onChange={(e) => setProjectSettings({...projectSettings, title: e.target.value})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-mono mb-2">Duration (s):</label>
              <input
                type="number"
                value={projectSettings.duration}
                onChange={(e) => setProjectSettings({...projectSettings, duration: parseInt(e.target.value)})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono text-sm"
                min="10"
                max="600"
              />
            </div>
            <div>
              <label className="block text-sm font-mono mb-2">Resolution:</label>
              <select
                value={projectSettings.resolution}
                onChange={(e) => setProjectSettings({...projectSettings, resolution: e.target.value as any})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono text-sm"
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p Full HD</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-mono mb-2">Style:</label>
              <select
                value={projectSettings.style}
                onChange={(e) => setProjectSettings({...projectSettings, style: e.target.value as any})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono text-sm"
              >
                <option value="cinematic">Cinematic</option>
                <option value="slideshow">Slideshow</option>
                <option value="ken-burns">Ken Burns</option>
                <option value="glitch">Glitch</option>
                <option value="fade">Fade</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={projectSettings.uploadToYouTube}
                onChange={(e) => setProjectSettings({...projectSettings, uploadToYouTube: e.target.checked})}
                className="text-cyan-400"
              />
              <span className="text-sm font-mono">📺 Upload to YouTube</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Asset Browser */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-4">
              <h3 className="text-lg font-mono mb-4">📁 Asset Browser</h3>
              
              {/* Asset Filters */}
              <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAssetSource('all')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetSource === 'all' ? 'bg-cyan-400 text-black' : 'border border-cyan-400 text-cyan-400'
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setAssetSource('supabase')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetSource === 'supabase' ? 'bg-cyan-400 text-black' : 'border border-cyan-400 text-cyan-400'
                    }`}
                  >
                    SUPABASE ({supabaseAssets.length})
                  </button>
                  <button
                    onClick={() => setAssetSource('local')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetSource === 'local' ? 'bg-cyan-400 text-black' : 'border border-cyan-400 text-cyan-400'
                    }`}
                  >
                    LOCAL ({localAssets.length})
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAssetFilter('all')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetFilter === 'all' ? 'bg-white text-black' : 'border border-white/30 text-white'
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setAssetFilter('video')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetFilter === 'video' ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'
                    }`}
                  >
                    🎬 VIDEO
                  </button>
                  <button
                    onClick={() => setAssetFilter('image')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetFilter === 'image' ? 'bg-green-500 text-white' : 'border border-green-500 text-green-500'
                    }`}
                  >
                    🖼️ IMAGE
                  </button>
                  <button
                    onClick={() => setAssetFilter('audio')}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      assetFilter === 'audio' ? 'bg-yellow-500 text-black' : 'border border-yellow-500 text-yellow-500'
                    }`}
                  >
                    🎵 AUDIO
                  </button>
                </div>
              </div>
              
              {/* Asset List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {allAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedAsset?.id === asset.id
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                        asset.type === 'video' ? 'bg-blue-500' :
                        asset.type === 'image' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {asset.type === 'video' ? '🎬' : asset.type === 'image' ? '🖼️' : '🎵'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono truncate">{asset.name}</div>
                        <div className="text-xs text-white/50">
                          {asset.duration ? formatTime(asset.duration) : 'N/A'}
                          {asset.bucket && ` • ${asset.bucket}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedAsset && (
                <div className="mt-4 p-3 border border-cyan-400/30 rounded">
                  <h4 className="text-sm font-mono mb-2">Selected Asset:</h4>
                  <div className="text-xs space-y-1">
                    <div><strong>Name:</strong> {selectedAsset.name}</div>
                    <div><strong>Type:</strong> {selectedAsset.type}</div>
                    <div><strong>Duration:</strong> {selectedAsset.duration ? formatTime(selectedAsset.duration) : 'N/A'}</div>
                    {selectedAsset.size && <div><strong>Size:</strong> {Math.round(selectedAsset.size / 1024)} KB</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono">🎞️ Timeline</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(projectSettings.duration)}
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1 bg-cyan-400 text-black font-mono text-sm rounded"
                  >
                    {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
                  </button>
                </div>
              </div>
              
              {/* Timeline Tracks */}
              <div className="space-y-2" ref={timelineRef}>
                {timeline.map(track => (
                  <div key={track.id} className="border border-white/20 rounded">
                    {/* Track Header */}
                    <div className="flex items-center gap-3 p-3 bg-black/30">
                      <div className={`w-3 h-3 rounded-full ${
                        track.type === 'video' ? 'bg-blue-500' :
                        track.type === 'image' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 text-sm font-mono">{track.name}</div>
                      
                      {track.type === 'audio' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTrackMute(track.id)}
                            className={`px-2 py-1 text-xs font-mono rounded ${
                              track.muted ? 'bg-red-500 text-white' : 'border border-white/30 text-white'
                            }`}
                          >
                            {track.muted ? '🔇' : '🔊'}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={track.volume || 0}
                            onChange={(e) => updateTrackVolume(track.id, parseFloat(e.target.value))}
                            className="w-16"
                          />
                          <span className="text-xs font-mono w-8">{Math.round((track.volume || 0) * 100)}%</span>
                        </div>
                      )}
                      
                      {selectedAsset && selectedAsset.type === track.type && (
                        <button
                          onClick={() => addClipToTrack(selectedAsset, track.id)}
                          className="px-2 py-1 bg-cyan-400 text-black text-xs font-mono rounded"
                        >
                          + ADD
                        </button>
                      )}
                    </div>
                    
                    {/* Track Timeline */}
                    <div className="relative h-16 bg-black/50 border-t border-white/10">
                      {/* Time ruler */}
                      <div className="absolute top-0 left-0 right-0 h-4 border-b border-white/10">
                        {Array.from({ length: Math.ceil(projectSettings.duration / 10) }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-xs text-white/50 font-mono"
                            style={{ left: `${(i * 10 / projectSettings.duration) * 100}%` }}
                          >
                            {formatTime(i * 10)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Clips */}
                      <div className="relative mt-4 h-12">
                        {track.clips.map(clip => {
                          const asset = allAssets.find(a => a.id === clip.assetId)
                          const leftPercent = (clip.startTime / projectSettings.duration) * 100
                          const widthPercent = (clip.duration / projectSettings.duration) * 100
                          
                          return (
                            <div
                              key={clip.id}
                              className={`absolute h-10 rounded flex items-center px-2 cursor-pointer ${getClipColor(track.type)} ${getClipColor(track.type)}/80 border border-white/20`}
                              style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`
                              }}
                              onClick={() => removeClip(clip.id)}
                              title={`${asset?.name} - Click to remove`}
                            >
                              <div className="text-xs font-mono text-white truncate">
                                {asset?.name || 'Unknown'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Playhead */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                        style={{ left: `${(currentTime / projectSettings.duration) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Timeline Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTime(0)}
                    className="px-3 py-1 border border-white/30 text-white text-sm font-mono rounded"
                  >
                    ⏮️ START
                  </button>
                  <input
                    type="range"
                    min="0"
                    max={projectSettings.duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => setCurrentTime(projectSettings.duration)}
                    className="px-3 py-1 border border-white/30 text-white text-sm font-mono rounded"
                  >
                    END ⏭️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Video */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6">
          <h3 className="text-lg font-mono mb-4">🚀 Generate Video</h3>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-cyan-400/70">
              Timeline contains {timeline.reduce((sum, track) => sum + track.clips.length, 0)} clips across {timeline.length} tracks
            </div>
            
            <button
              onClick={generateVideo}
              disabled={isGenerating || timeline.every(track => track.clips.length === 0)}
              className={`px-6 py-3 font-mono font-bold rounded transition-colors ${
                isGenerating || timeline.every(track => track.clips.length === 0)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-400 hover:bg-cyan-500 text-black'
              }`}
            >
              {isGenerating ? '🎬 GENERATING...' : '🎬 GENERATE VIDEO'}
            </button>
          </div>
          
          {generatedVideoUrl && (
            <div className="mt-4 p-4 border border-green-500/30 rounded bg-green-500/10">
              <h4 className="text-sm font-mono mb-2">✅ Video Generated Successfully!</h4>
              <div className="flex items-center gap-4">
                <a
                  href={generatedVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white font-mono text-sm rounded"
                >
                  📥 DOWNLOAD VIDEO
                </a>
                <div className="text-xs text-green-400">
                  {generatedVideoUrl}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
