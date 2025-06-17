'use client'

import { useState } from 'react'
import { getAllImagePaths } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'
import { getAllVideoPaths, getCuratedVideoSelection, getVideoDisplayName, videoClips } from '../../lib/videos'

interface VideoRequest {
  selectedImages: string[]
  selectedVideos: string[]
  selectedMusic: string
  duration: number
  style: 'slideshow' | 'ken-burns' | 'glitch' | 'fade'
  title: string
  useFullTrack: boolean
  uploadToYouTube: boolean
  includeMetadata: boolean
  videoMood: 'urban' | 'atmospheric' | 'dynamic' | 'mixed'
}

export default function SimpleVideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [youTubeUrl, setYouTubeUrl] = useState<string | null>(null)
  const [projectConfig, setProjectConfig] = useState<VideoRequest>({
    selectedImages: getAllImagePaths().slice(0, 6),
    selectedVideos: getCuratedVideoSelection('mixed').map(v => v.path).slice(0, 4),
    selectedMusic: musicTracks[0]?.filename || '',
    duration: 30,
    style: 'slideshow',
    title: 'V3XV0ID Music Video',
    useFullTrack: true,
    uploadToYouTube: false,
    includeMetadata: true,
    videoMood: 'mixed'
  })

  const allImages = getAllImagePaths()
  const allVideos = getAllVideoPaths()
  const allMusic = musicTracks

  // Update video selection when mood changes
  const handleMoodChange = (mood: 'urban' | 'atmospheric' | 'dynamic' | 'mixed') => {
    const curatedVideos = getCuratedVideoSelection(mood).map(v => v.path)
    setProjectConfig({
      ...projectConfig,
      videoMood: mood,
      selectedVideos: curatedVideos.slice(0, 4)
    })
  }

  const generateVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    setGeneratedVideoUrl(null)
    setYouTubeUrl(null)

    try {
      console.log('🎬 Starting ENHANCED video generation with mixed media...')
      
      // Call our enhanced server-side video generation API
      const response = await fetch('/api/video/generate-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectConfig.title,
          musicFile: projectConfig.selectedMusic,
          duration: projectConfig.useFullTrack ? undefined : projectConfig.duration,
          style: projectConfig.style,
          selectedImages: projectConfig.selectedImages,
          selectedVideos: projectConfig.selectedVideos,
          useFullTrack: projectConfig.useFullTrack,
          includeMetadata: projectConfig.includeMetadata
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Enhanced video created:', result)
        setGeneratedVideoUrl(result.videoUrl)
        
        const durationText = projectConfig.useFullTrack ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : `${result.duration}s`
        
        let successMessage = `🎬 SUCCESS! Enhanced music video created!\n\n`
        successMessage += `🎵 Track: "${result.trackInfo?.title || 'Unknown'}" by ${result.trackInfo?.artist || 'V3XV0ID'}\n`
        successMessage += `⏱️ Duration: ${durationText}\n`
        successMessage += `🎨 Style: ${projectConfig.style}\n`
        successMessage += `📁 File: ${result.filename}\n`
        successMessage += `📊 Size: ${Math.round(result.size / 1024 / 1024 * 100) / 100} MB\n`
        successMessage += `🖼️ Images: ${projectConfig.selectedImages.length} • 🎥 Videos: ${projectConfig.selectedVideos.length}\n`
        successMessage += `🏷️ Metadata: ${projectConfig.includeMetadata ? 'Included' : 'None'}`
        
        // Upload to YouTube if requested
        if (projectConfig.uploadToYouTube && result.readyForYouTube) {
          try {
            console.log('📺 Uploading to YouTube...')
            setProgress(50)
            
            const trackTitle = result.trackInfo?.title || projectConfig.selectedMusic.replace('.mp3', '')
            const description = `V3XV0ID - "${trackTitle}"\n\nExperimental music video featuring mixed media composition with ${projectConfig.selectedImages.length} images and ${projectConfig.selectedVideos.length} video clips.\n\nStyle: ${projectConfig.style}\nMood: ${projectConfig.videoMood}\nDuration: ${durationText}\n\n#V3XV0ID #NinjaJazz #ExperimentalMusic #DigitalArt #Cyberpunk`
            
            const uploadResponse = await fetch('/api/youtube/upload-video', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                videoPath: result.videoUrl,
                title: `V3XV0ID - ${trackTitle}`,
                description: description,
                tags: ['v3xv0id', 'ninja jazz', 'experimental music', 'digital art', 'cyberpunk', 'music video'],
                privacy: 'unlisted'
              })
            })
            
            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json()
              setYouTubeUrl(uploadResult.videoUrl)
              successMessage += `\n\n📺 UPLOADED TO YOUTUBE!\n${uploadResult.videoUrl}`
            } else {
              const uploadError = await uploadResponse.json()
              successMessage += `\n\n⚠️ YouTube upload failed: ${uploadError.error}`
            }
          } catch (uploadError) {
            console.error('YouTube upload error:', uploadError)
            successMessage += `\n\n⚠️ YouTube upload failed: ${uploadError}`
          }
        }
        
        setProgress(100)
        alert(successMessage)
        
      } else {
        throw new Error(result.error || 'Unknown error')
      }

    } catch (error) {
      console.error('Enhanced video generation failed:', error)
      alert(`❌ Video generation failed: ${error}`)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const createVideoFromCLI = async () => {
    setIsGenerating(true)
    try {
      console.log('🎬 Creating video using CLI FFmpeg...')
      
      // This would call a CLI endpoint
      const response = await fetch('/api/video/cli-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectConfig)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.videoPath) {
          setGeneratedVideoUrl(result.videoPath)
        }
      }
      
    } catch (error) {
      console.error('CLI video generation failed:', error)
      alert(`CLI video generation is not set up yet. This would use server-side FFmpeg to create real videos.`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono mb-4">🎬 V3XV0ID Enhanced Video Studio</h1>
          <p className="text-cyan-400/70">Professional mixed-media video generation with metadata and video clips</p>
        </div>

        {/* Project Configuration */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-mono mb-6">Project Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Settings */}
            <div>
              <label className="block text-sm font-mono mb-2">Video Title:</label>
              <input
                type="text"
                value={projectConfig.title}
                onChange={(e) => setProjectConfig({...projectConfig, title: e.target.value})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-mono mb-2">Duration (seconds):</label>
              <input
                type="number"
                value={projectConfig.duration}
                onChange={(e) => setProjectConfig({...projectConfig, duration: parseInt(e.target.value)})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
                min="5"
                max="300"
                disabled={projectConfig.useFullTrack}
              />
            </div>
            
            <div>
              <label className="block text-sm font-mono mb-2">Visual Style:</label>
              <select
                value={projectConfig.style}
                onChange={(e) => setProjectConfig({...projectConfig, style: e.target.value as any})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
              >
                <option value="slideshow">Mixed Slideshow</option>
                <option value="ken-burns">Ken Burns + Motion</option>
                <option value="glitch">Glitch Effect</option>
                <option value="fade">Cross Fade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-mono mb-2">Background Music:</label>
              <select
                value={projectConfig.selectedMusic}
                onChange={(e) => setProjectConfig({...projectConfig, selectedMusic: e.target.value})}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
              >
                <option value="">No Music</option>
                {allMusic.map(track => (
                  <option key={track.filename} value={track.filename}>
                    {track.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono mb-2">Video Mood:</label>
              <select
                value={projectConfig.videoMood}
                onChange={(e) => handleMoodChange(e.target.value as any)}
                className="w-full bg-black border border-cyan-400 text-cyan-400 px-3 py-2 rounded font-mono"
              >
                <option value="mixed">Mixed Content</option>
                <option value="urban">Urban/Train Focus</option>
                <option value="atmospheric">Atmospheric</option>
                <option value="dynamic">Dynamic/Generated</option>
              </select>
            </div>

            {/* Enhanced Options */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectConfig.useFullTrack}
                  onChange={(e) => setProjectConfig({...projectConfig, useFullTrack: e.target.checked})}
                  className="text-cyan-400"
                />
                <span className="text-sm font-mono">Use Full Track Length</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectConfig.includeMetadata}
                  onChange={(e) => setProjectConfig({...projectConfig, includeMetadata: e.target.checked})}
                  className="text-cyan-400"
                />
                <span className="text-sm font-mono">Include Track Metadata</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectConfig.uploadToYouTube}
                  onChange={(e) => setProjectConfig({...projectConfig, uploadToYouTube: e.target.checked})}
                  className="text-cyan-400"
                />
                <span className="text-sm font-mono">Auto-Upload to YouTube</span>
              </label>
            </div>
          </div>
        </div>

        {/* Mixed Asset Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Images */}
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6">
            <h2 className="text-xl font-mono mb-4">Images ({projectConfig.selectedImages.length})</h2>
            <p className="text-sm text-cyan-400/70 mb-4">
              Using {projectConfig.selectedImages.length} images from {allImages.length} total
            </p>
            
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {projectConfig.selectedImages.slice(0, 12).map((imagePath, index) => (
                <div key={index} className="relative">
                  <img
                    src={imagePath}
                    alt={`Image ${index + 1}`}
                    className="w-full h-16 object-cover border border-cyan-400/30 rounded"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-cyan-400 text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6">
            <h2 className="text-xl font-mono mb-4">Video Clips ({projectConfig.selectedVideos.length})</h2>
            <p className="text-sm text-cyan-400/70 mb-4">
              Using {projectConfig.selectedVideos.length} clips • Mood: {projectConfig.videoMood}
            </p>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projectConfig.selectedVideos.slice(0, 8).map((videoPath, index) => {
                const clip = videoClips.find(v => v.path === videoPath)
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-black/30 rounded border border-cyan-400/20">
                    <div className="bg-cyan-400/20 text-cyan-400 text-xs px-2 py-1 rounded font-mono">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-mono">{clip ? getVideoDisplayName(clip) : 'Unknown'}</div>
                      <div className="text-xs text-cyan-400/50">{clip?.type || 'video'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Generation Controls */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-mono mb-4">Generate Enhanced Video</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generateVideo}
              disabled={isGenerating}
              className="flex-1 bg-cyan-400 text-black px-6 py-3 rounded font-mono font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50"
            >
              {isGenerating ? `Generating... ${Math.round(progress)}%` : '🎬 Generate Mixed Media Video'}
            </button>
            
            <button
              onClick={createVideoFromCLI}
              disabled={isGenerating}
              className="flex-1 bg-green-400 text-black px-6 py-3 rounded font-mono font-bold hover:bg-green-300 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Processing...' : '⚡ CLI Generate (Legacy)'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-cyan-400/70">
            <p>• <strong>Mixed Media:</strong> Combines images and video clips with enhanced metadata</p>
            <p>• <strong>Smart Naming:</strong> Artist_Track_Style_Duration_Timestamp format</p>
            <p>• <strong>Mood Selection:</strong> Curates video clips based on chosen aesthetic</p>
          </div>
        </div>

        {/* Progress Bar */}
        {isGenerating && progress > 0 && (
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-4 mb-6">
            <div className="bg-black border border-cyan-400 rounded p-2">
              <div 
                className="bg-cyan-400 h-4 rounded transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm font-mono mt-2">
              {Math.round(progress)}% - Processing mixed media composition...
            </p>
          </div>
        )}

        {/* Video Preview */}
        {generatedVideoUrl && (
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6">
            <h2 className="text-2xl font-mono mb-4">Generated Video</h2>
            <video
              src={generatedVideoUrl}
              controls
              className="w-full max-w-4xl mx-auto border border-cyan-400 rounded"
            />
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = generatedVideoUrl
                  a.download = `${projectConfig.title.replace(/\s+/g, '_')}.mp4`
                  a.click()
                }}
                className="bg-cyan-400 text-black px-6 py-2 rounded font-mono hover:bg-cyan-300 transition-colors"
              >
                📥 Download Video
              </button>
            </div>
          </div>
        )}

        {/* YouTube URL */}
        {youTubeUrl && (
          <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6">
            <h2 className="text-2xl font-mono mb-4">YouTube Video</h2>
            <p className="text-sm text-cyan-400/70 mb-4">
              Your enhanced video has been successfully uploaded to YouTube!
            </p>
            <p className="text-sm text-cyan-400/70">
              <strong>YouTube URL:</strong> {youTubeUrl}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="text-center text-sm font-mono text-cyan-400/50 mt-8">
          <p>V3XV0ID Enhanced Video Studio - Mixed Media Processing</p>
          <p>Assets: {allImages.length} images • {allVideos.length} video clips • {allMusic.length} music tracks</p>
        </div>
      </div>
    </div>
  )
} 