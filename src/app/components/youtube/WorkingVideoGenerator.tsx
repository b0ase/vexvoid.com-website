'use client'

import { useState, useRef } from 'react'
import { videoClips } from '../../lib/videos'
import { conceptArtImages } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'

export default function WorkingVideoGenerator() {
  const [videoTitle, setVideoTitle] = useState('V3XV0ID - Cyberpunk Visual Journey | 10 Minute Ambient Music Video')
  const [selectedMusic, setSelectedMusic] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const previewIframeRef = useRef<HTMLIFrameElement>(null)

  const getYouTubeMetadata = () => {
    return {
      title: videoTitle,
      description: `🌆 V3XV0ID - A 10-minute immersive cyberpunk visual experience

Dive into the neon-soaked world of V3XV0ID, where digital art meets ambient soundscapes in a mesmerizing visual journey. This 10-minute music video combines:

✨ Original cyberpunk concept art (${conceptArtImages.length} images)
🎵 Atmospheric electronic music  
🎬 Dynamic video transitions (${videoClips.length} video segments)
🌈 Glitch effects and digital aesthetics
🔮 AI-generated visual elements

Perfect for:
• Study sessions & focus work
• Meditation and relaxation  
• Background ambiance
• Cyberpunk atmosphere
• Digital art inspiration
• Coding sessions
• Creative work
• Sleep aid

🎨 All visuals are original V3XV0ID concept art
🎼 Music composed specifically for this visual experience
🤖 Enhanced with AI-generated elements

This video features seamless transitions between ${videoClips.length} unique video segments, enhanced with ${conceptArtImages.length} pieces of original concept art, creating a constantly evolving visual landscape that never repeats.

Subscribe for more cyberpunk visual experiences and digital art content!

🔗 Links:
• Website: https://v3xv0id.com
• More V3XV0ID content: https://v3xv0id.com/preview

#Cyberpunk #AmbientMusic #DigitalArt #V3XV0ID #MusicVideo #ElectronicMusic #Synthwave #Vaporwave #AIArt #ConceptArt #Futuristic #Neon #Aesthetic #ChillMusic #StudyMusic #BackgroundMusic #LoFi #Ambient #Cinematic #Atmospheric

---
V3XV0ID © 2024 - Original Digital Art & Music Experience
All content created with AI assistance and human curation`,
      
      tags: [
        "cyberpunk", "ambient music", "digital art", "electronic music", 
        "synthwave", "vaporwave", "AI art", "concept art", "futuristic",
        "neon", "aesthetic", "chill music", "study music", "background music",
        "music video", "visual art", "V3XV0ID", "10 minutes", "relaxing",
        "meditation", "atmosphere", "coding music", "work music", "lofi",
        "ambient", "cinematic", "atmospheric", "focus music", "sleep music"
      ]
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const generateVideo = async () => {
    setIsGenerating(true)
    setProgress(0)
    setGeneratedVideoUrl(null)

    try {
      // Step 1: Open preview page in hidden iframe to capture content
      setProgress(10)
      
      // Create a new window/tab with the preview page for recording
      const previewWindow = window.open('/preview', '_blank', 'width=1920,height=1080')
      
      if (!previewWindow) {
        throw new Error('Please allow popups to generate video')
      }

      // Wait for the preview page to load
      await new Promise(resolve => setTimeout(resolve, 3000))
      setProgress(20)

      // Check if browser supports screen capture
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen recording not supported in this browser. Please use Chrome, Firefox, or Safari.')
      }

      // Request screen capture of the preview window
      setProgress(30)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
          frameRate: 30
        },
        audio: true // Capture system audio if available
      })

      setProgress(40)

      // Set up MediaRecorder for high-quality recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 8000000, // 8 Mbps for high quality
        audioBitsPerSecond: 192000   // 192 kbps audio
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
        setGeneratedVideoUrl(url)
        setProgress(100)
        setIsGenerating(false)
        
        // Close the preview window
        if (previewWindow) {
          previewWindow.close()
        }
      }

      // Start recording
      mediaRecorder.start()
      setProgress(50)

      // Record for 10 minutes (600 seconds)
      const recordingDuration = 600000 // 10 minutes in milliseconds
      
      // Update progress during recording
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (50 / (recordingDuration / 1000)) // Increment based on time
          return Math.min(newProgress, 95)
        })
      }, 1000)

      // Stop recording after 10 minutes
      setTimeout(() => {
        clearInterval(progressInterval)
        mediaRecorder.stop()
        stream.getTracks().forEach(track => track.stop())
        setProgress(95)
      }, recordingDuration)

      // Show instructions to user
      alert(`
🎬 Recording Started!

Instructions:
1. A new tab opened with the V3XV0ID preview
2. Select that tab when prompted for screen sharing
3. The recording will automatically stop after 10 minutes
4. Keep the preview tab active and visible during recording
5. Don't minimize or switch away from the preview tab

Recording will complete automatically in 10 minutes...
      `)

    } catch (error) {
      console.error('Video generation failed:', error)
      alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const downloadVideo = () => {
    if (generatedVideoUrl) {
      const a = document.createElement('a')
      a.href = generatedVideoUrl
      a.download = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const generateVideoScript = () => {
    const script = `# V3XV0ID 10-Minute Music Video Production Script

## Video Specifications
- Duration: 10:00 minutes (600 seconds)
- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30 FPS
- Format: MP4 (H.264)
- Segments: 40 x 15-second clips with 2-second crossfades

## Asset Inventory
- Video Clips: ${videoClips.length} available
- Concept Art: ${conceptArtImages.length} images
- Music Tracks: ${musicTracks.length} tracks

## Production Timeline
${videoClips.slice(0, 10).map((clip, index) => 
  `Segment ${index + 1}: ${clip.filename.substring(0, 50)}... (${clip.type})
  - Duration: 15 seconds
  - Start Time: ${(index * 15).toFixed(1)}s
  - Transition: 2-second crossfade`
).join('\n')}

[... continues for all ${videoClips.length} clips]

## Post-Production Effects
1. Color Grading: Brightness 0.7, Contrast 1.2, Saturation 0.9
2. Floating Concept Art Overlays (8 per segment)
3. V3XV0ID Watermark (bottom-right, 60% opacity)
4. Background Concept Art (25% opacity, blurred)

## Audio
- Primary Track: ${musicTracks[0]?.title || 'Select from available tracks'}
- Volume: 70%
- Loop: Yes (for full 10-minute duration)
- Fade In/Out: 2 seconds each

## Export Settings
- Codec: H.264
- Bitrate: 8-12 Mbps (high quality)
- Audio: 192 kbps AAC
- Color Profile: Rec.709`
    return script
  }

  const metadata = getYouTubeMetadata()

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          V3XV0ID YouTube Video Producer
        </h1>
        
        {/* Asset Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-900/30 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-400">{videoClips.length}</h3>
            <p className="text-sm">Video Clips Available</p>
          </div>
          <div className="bg-cyan-900/30 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-cyan-400">{conceptArtImages.length}</h3>
            <p className="text-sm">Concept Art Images</p>
          </div>
          <div className="bg-pink-900/30 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-pink-400">{musicTracks.length}</h3>
            <p className="text-sm">Music Tracks</p>
          </div>
        </div>

        {/* Video Configuration */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Video Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Title:</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Music Track:</label>
              <select
                value={selectedMusic}
                onChange={(e) => setSelectedMusic(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="">Select a music track...</option>
                {musicTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.title} ({track.mood})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Generation */}
        <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 rounded-lg p-6 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">🎬 Generate 10-Minute Video</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click "Generate Video" to open the beautiful preview page</li>
                <li>Select the preview tab when prompted for screen sharing</li>
                <li>The system will record exactly what you see for 10 minutes</li>
                <li>Download the finished video file for YouTube upload</li>
              </ol>
            </div>

            {!isGenerating && !generatedVideoUrl && (
              <button
                onClick={generateVideo}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                🎬 Generate 10-Minute Video
              </button>
            )}

            {isGenerating && (
              <div className="space-y-4">
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-cyan-400">
                  {progress < 30 ? 'Setting up recording...' :
                   progress < 50 ? 'Starting capture...' :
                   progress < 95 ? 'Recording in progress...' :
                   'Finalizing video...'}
                </p>
                <p className="text-center text-sm text-gray-400">
                  {progress}% complete
                </p>
              </div>
            )}

            {generatedVideoUrl && (
              <div className="space-y-4">
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">✅ Video Generated Successfully!</h3>
                  <p className="text-sm text-gray-300">
                    Your 10-minute V3XV0ID video is ready for download and YouTube upload.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={downloadVideo}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    📥 Download Video
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedVideoUrl(null)
                      setProgress(0)
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    🔄 Generate New
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Production Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">Production Instructions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-300">Software Options:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <strong>Adobe Premiere Pro</strong> - Professional editing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <strong>Final Cut Pro</strong> - Mac users
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <strong>DaVinci Resolve</strong> - Free professional option
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <strong>CapCut</strong> - Simple and free
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-300">Step-by-Step:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Import all {videoClips.length} video clips</li>
                <li>Create 15-second segments from each clip</li>
                <li>Add 2-second crossfade transitions</li>
                <li>Layer concept art as floating overlays</li>
                <li>Apply color grading effects</li>
                <li>Add V3XV0ID watermark</li>
                <li>Add background music (loop for 10 minutes)</li>
                <li>Export as 1080p MP4</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Video Assets */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Available Video Assets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {videoClips.map((clip, index) => (
              <div key={index} className="bg-gray-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    clip.type === 'train' ? 'bg-purple-600' :
                    clip.type === 'atmospheric' ? 'bg-blue-600' :
                    clip.type === 'generated' ? 'bg-green-600' :
                    'bg-gray-600'
                  }`}>
                    {clip.type}
                  </span>
                </div>
                <p className="text-sm font-mono truncate" title={clip.filename}>
                  {clip.filename}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Metadata */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">YouTube Upload Metadata</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-400">Title:</h3>
                <button 
                  onClick={() => copyToClipboard(metadata.title, 'Title')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm bg-gray-700 p-3 rounded font-mono">
                {metadata.title}
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-400">Description:</h3>
                <button 
                  onClick={() => copyToClipboard(metadata.description, 'Description')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-gray-700 p-4 rounded whitespace-pre-wrap overflow-auto max-h-80 font-mono">
                {metadata.description}
              </pre>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-400">Tags:</h3>
                <button 
                  onClick={() => copyToClipboard(metadata.tags.join(', '), 'Tags')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs bg-gray-700 p-3 rounded font-mono">
                {metadata.tags.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Production Script */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-orange-400">Production Script</h2>
            <button 
              onClick={() => copyToClipboard(generateVideoScript(), 'Production Script')}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-semibold"
            >
              Copy Full Script
            </button>
          </div>
          
          <pre className="text-xs bg-gray-900 p-4 rounded whitespace-pre-wrap overflow-auto max-h-96 font-mono">
            {generateVideoScript()}
          </pre>
        </div>
      </div>
    </div>
  )
} 