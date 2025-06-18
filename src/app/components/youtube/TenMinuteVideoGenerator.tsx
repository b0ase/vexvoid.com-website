'use client'

import { useState, useRef, useEffect } from 'react'
import { videoClips } from '../../lib/videos'
import { conceptArtImages } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'

export default function TenMinuteVideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('')
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Video configuration
  const VIDEO_DURATION = 600 // 10 minutes in seconds
  const VIDEO_WIDTH = 1920
  const VIDEO_HEIGHT = 1080
  const FPS = 30
  const SEGMENT_DURATION = 15 // Each video clip plays for 15 seconds
  const CROSSFADE_DURATION = 2 // 2 second crossfade between clips

  const generateTenMinuteVideo = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    setProgress(0)
    setCurrentPhase('Initializing video generation...')

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      canvas.width = VIDEO_WIDTH
      canvas.height = VIDEO_HEIGHT

      // Setup MediaRecorder for video capture
      const stream = canvas.captureStream(FPS)
      
      // Add audio track if available
      if (musicTracks.length > 0 && audioRef.current) {
        const audioContext = new AudioContext()
        const source = audioContext.createMediaElementSource(audioRef.current)
        const dest = audioContext.createMediaStreamDestination()
        source.connect(dest)
        source.connect(audioContext.destination)
        
        // Add audio track to video stream
        const audioTrack = dest.stream.getAudioTracks()[0]
        if (audioTrack) {
          stream.addTrack(audioTrack)
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 5000000, // 5 Mbps for high quality
        audioBitsPerSecond: 128000   // 128 kbps audio
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setGeneratedVideo(url)
        setCurrentPhase('Video generation complete!')
        setProgress(100)
      }

      // Start recording
      mediaRecorder.start()
      
      // Start background music
      if (audioRef.current && musicTracks.length > 0) {
        audioRef.current.volume = 0.7
        audioRef.current.loop = true
        audioRef.current.play()
      }

      // Generate video frames
      const totalFrames = VIDEO_DURATION * FPS
      const segmentsNeeded = Math.ceil(VIDEO_DURATION / SEGMENT_DURATION)
      
      setCurrentPhase('Rendering video segments...')

      for (let segment = 0; segment < segmentsNeeded; segment++) {
        const videoIndex = segment % videoClips.length
        const currentVideo = videoClips[videoIndex]
        const nextVideo = videoClips[(segment + 1) % videoClips.length]
        
        setCurrentPhase(`Rendering segment ${segment + 1}/${segmentsNeeded}: ${currentVideo.filename}`)
        
        // Load current video
        const video = document.createElement('video')
        video.src = currentVideo.path
        video.muted = true
        video.currentTime = Math.random() * 30 // Random start point
        
        await new Promise((resolve) => {
          video.onloadeddata = resolve
        })

        // Render frames for this segment
        const segmentFrames = SEGMENT_DURATION * FPS
        const segmentStartFrame = segment * segmentFrames
        
        for (let frame = 0; frame < segmentFrames; frame++) {
          const currentFrame = segmentStartFrame + frame
          const timeInSegment = frame / FPS
          
          // Update video time
          video.currentTime = (video.currentTime + 1/FPS) % video.duration
          
          // Clear canvas
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
          
          // Draw concept art backdrop
          if (conceptArtImages.length > 0) {
            const backdropIndex = Math.floor((segment * 3) % conceptArtImages.length)
            const backdrop = new Image()
            backdrop.src = conceptArtImages[backdropIndex].path
            
            ctx.globalAlpha = 0.3
            ctx.filter = 'blur(8px)'
            ctx.drawImage(backdrop, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
            ctx.filter = 'none'
            ctx.globalAlpha = 1
          }
          
          // Draw main video with effects
          ctx.globalAlpha = 0.8
          ctx.filter = 'brightness(0.7) contrast(1.2) saturate(0.9)'
          
          // Calculate crossfade if near segment end
          const timeToEnd = SEGMENT_DURATION - timeInSegment
          if (timeToEnd < CROSSFADE_DURATION) {
            const fadeAlpha = timeToEnd / CROSSFADE_DURATION
            ctx.globalAlpha = fadeAlpha * 0.8
          }
          
          ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
          ctx.filter = 'none'
          ctx.globalAlpha = 1
          
          // Add floating concept art overlays
          for (let i = 0; i < 8; i++) {
            if (conceptArtImages.length > 0) {
              const imgIndex = (segment * 8 + i) % conceptArtImages.length
              const overlay = new Image()
              overlay.src = conceptArtImages[imgIndex].path
              
              const size = 40 + (i * 10)
              const x = (Math.sin(currentFrame * 0.01 + i) * 200) + (VIDEO_WIDTH / 2)
              const y = (Math.cos(currentFrame * 0.008 + i) * 150) + (VIDEO_HEIGHT / 2)
              
              ctx.globalAlpha = 0.1 + (Math.sin(currentFrame * 0.02 + i) * 0.05)
              ctx.filter = 'blur(2px)'
              ctx.drawImage(overlay, x - size/2, y - size/2, size, size)
              ctx.filter = 'none'
              ctx.globalAlpha = 1
            }
          }
          
          // Add V3XV0ID branding
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.font = '24px monospace'
          ctx.textAlign = 'right'
          ctx.fillText('V3XV0ID', VIDEO_WIDTH - 40, VIDEO_HEIGHT - 40)
          
          // Update progress
          const overallProgress = (currentFrame / totalFrames) * 100
          setProgress(Math.min(overallProgress, 95))
          
          // Small delay to prevent blocking
          if (frame % 30 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1))
          }
        }
      }
      
      // Stop recording
      setTimeout(() => {
        mediaRecorder.stop()
        if (audioRef.current) {
          audioRef.current.pause()
        }
      }, 1000)
      
    } catch (error) {
      console.error('Error generating video:', error)
      setCurrentPhase('Error generating video')
      setIsGenerating(false)
    }
  }

  const downloadVideo = () => {
    if (generatedVideo) {
      const a = document.createElement('a')
      a.href = generatedVideo
      a.download = 'vexvoid-10min-music-video.webm'
      a.click()
    }
  }

  const getYouTubeMetadata = () => {
    return {
      title: "V3XV0ID - Cyberpunk Visual Journey | 10 Minute Ambient Music Video",
      description: `🌆 V3XV0ID - A 10-minute immersive cyberpunk visual experience

Dive into the neon-soaked world of V3XV0ID, where digital art meets ambient soundscapes in a mesmerizing visual journey. This 10-minute music video combines:

✨ Original cyberpunk concept art
🎵 Atmospheric electronic music
🎬 Dynamic video transitions
🌈 Glitch effects and digital aesthetics
🔮 AI-generated visual elements

Perfect for:
• Study sessions
• Meditation and relaxation  
• Background ambiance
• Cyberpunk atmosphere
• Digital art inspiration
• Coding sessions

🎨 All visuals are original V3XV0ID concept art
🎼 Music composed specifically for this visual experience
🤖 Enhanced with AI-generated elements

Subscribe for more cyberpunk visual experiences and digital art content!

#Cyberpunk #AmbientMusic #DigitalArt #V3XV0ID #MusicVideo #ElectronicMusic #Synthwave #Vaporwave #AIArt #ConceptArt #Futuristic #Neon #Aesthetic #ChillMusic #StudyMusic #BackgroundMusic

---
V3XV0ID © 2024 - Original Digital Art & Music Experience`,
      
      tags: [
        "cyberpunk", "ambient music", "digital art", "electronic music", 
        "synthwave", "vaporwave", "AI art", "concept art", "futuristic",
        "neon", "aesthetic", "chill music", "study music", "background music",
        "music video", "visual art", "V3XV0ID", "10 minutes", "relaxing",
        "meditation", "atmosphere", "coding music", "work music"
      ],
      
      category: "Music",
      privacy: "public",
      thumbnail: "Use the concept art with neon effects",
      
      socialMedia: {
        twitter: "🌆 New 10-minute V3XV0ID cyberpunk visual journey is live! Perfect for studying, coding, or just vibing to some futuristic aesthetics ✨🎵 #Cyberpunk #AmbientMusic #V3XV0ID",
        
        instagram: "✨ 10-minute cyberpunk visual journey now available! Dive into the neon-soaked world of V3XV0ID 🌆🎵 Link in bio! #V3XV0ID #Cyberpunk #DigitalArt #MusicVideo",
        
        reddit: {
          title: "I created a 10-minute cyberpunk ambient music video with original art - V3XV0ID Visual Journey",
          subreddits: ["cyberpunk", "ambientmusic", "digitalart", "synthwave", "vaporwave", "MusicVideos", "futureporn"]
        }
      }
    }
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          V3XV0ID - 10 Minute Music Video Generator
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Video Specifications</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Duration: 10 minutes</div>
            <div>Resolution: 1920x1080 (Full HD)</div>
            <div>Frame Rate: 30 FPS</div>
            <div>Format: WebM (VP9 + Opus)</div>
            <div>Video Bitrate: 5 Mbps</div>
            <div>Audio Bitrate: 128 kbps</div>
            <div>Video Clips: {videoClips.length} available</div>
            <div>Concept Art: {conceptArtImages.length} images</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={generateTenMinuteVideo}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            {isGenerating ? 'Generating Video...' : 'Generate 10-Minute Video'}
          </button>
        </div>

        {isGenerating && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-300">{currentPhase}</div>
          </div>
        )}

        {generatedVideo && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Generated Video</h3>
            <video 
              controls 
              className="w-full rounded-lg mb-4"
              src={generatedVideo}
            />
            <button
              onClick={downloadVideo}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Download Video
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">YouTube Upload Metadata</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-400">Title:</h4>
              <p className="text-sm bg-gray-700 p-2 rounded">
                {getYouTubeMetadata().title}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-400">Description:</h4>
              <pre className="text-xs bg-gray-700 p-3 rounded whitespace-pre-wrap overflow-auto max-h-64">
                {getYouTubeMetadata().description}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-400">Tags:</h4>
              <p className="text-sm bg-gray-700 p-2 rounded">
                {getYouTubeMetadata().tags.join(', ')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-400">Social Media Posts:</h4>
              <div className="space-y-2">
                <div>
                  <strong>Twitter:</strong>
                  <p className="text-sm bg-gray-700 p-2 rounded">
                    {getYouTubeMetadata().socialMedia.twitter}
                  </p>
                </div>
                <div>
                  <strong>Instagram:</strong>
                  <p className="text-sm bg-gray-700 p-2 rounded">
                    {getYouTubeMetadata().socialMedia.instagram}
                  </p>
                </div>
                <div>
                  <strong>Reddit Title:</strong>
                  <p className="text-sm bg-gray-700 p-2 rounded">
                    {getYouTubeMetadata().socialMedia.reddit.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden elements for video generation */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
        />
        
        <video ref={videoRef} style={{ display: 'none' }} />
        
        {musicTracks.length > 0 && (
          <audio 
            ref={audioRef} 
            src={musicTracks[0].url} 
            style={{ display: 'none' }}
          />
        )}
      </div>
    </div>
  )
} 