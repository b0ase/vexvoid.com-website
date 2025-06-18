'use client'

import { useState } from 'react'
import { videoClips } from '../../lib/videos'
import { conceptArtImages } from '../../lib/images'
import { musicTracks } from '../../lib/musicLibrary'

export default function SimplifiedVideoGenerator() {
  const [showMetadata, setShowMetadata] = useState(true)

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
      ],
      
      category: "Music",
      privacy: "public",
      language: "English",
      captions: "None",
      thumbnail: "Custom thumbnail using V3XV0ID concept art with neon effects",
      
      socialMedia: {
        twitter: `🌆 New 10-minute V3XV0ID cyberpunk visual journey is live! 

Perfect for:
✨ Studying & focus work
🎵 Background ambiance  
💻 Coding sessions
🧘 Meditation & relaxation

Featuring original AI-enhanced cyberpunk art & atmospheric electronic music

#Cyberpunk #AmbientMusic #V3XV0ID #StudyMusic`,
        
        instagram: `✨ 10-minute cyberpunk visual journey now available! 

Dive into the neon-soaked world of V3XV0ID 🌆

🎵 Atmospheric electronic music
🎨 Original cyberpunk concept art  
🌈 AI-enhanced visual effects
💫 Perfect for study & relaxation

Link in bio! 

#V3XV0ID #Cyberpunk #DigitalArt #MusicVideo #AmbientMusic #StudyMusic #AIArt #Synthwave #Futuristic #Neon`,
        
        reddit: {
          title: "I created a 10-minute cyberpunk ambient music video with original AI-enhanced art - V3XV0ID Visual Journey",
          subreddits: [
            "cyberpunk", 
            "ambientmusic", 
            "digitalart", 
            "synthwave", 
            "vaporwave", 
            "MusicVideos", 
            "futureporn",
            "WeAreTheMusicMakers",
            "ElectronicMusic",
            "StudyMusic",
            "chillmusic",
            "AIart"
          ],
          description: `Hey everyone! I just finished a 10-minute cyberpunk visual journey that combines original concept art with atmospheric electronic music.

**What it includes:**
- ${videoClips.length} unique video segments with seamless transitions
- ${conceptArtImages.length} pieces of original concept art
- AI-enhanced visual effects and glitch aesthetics
- Custom ambient electronic soundtrack
- Perfect for studying, coding, or just vibing

The whole thing was created using a combination of AI tools and manual curation to create something that feels both futuristic and immersive. Each segment flows into the next with crossfade transitions, and there are floating concept art overlays that create depth and movement.

Would love to hear what you think! It's designed to be something you can put on in the background while working or studying.`
        },

        tiktok: {
          caption: `Cyberpunk visual journey ✨ 10 minutes of pure aesthetic vibes 🌆 

#cyberpunk #ambientmusic #digitalart #v3xv0id #aesthetic #synthwave #futuristic #neon #aiart #studymusic #chillvibes #atmospheric`,
          hashtags: ["cyberpunk", "ambientmusic", "digitalart", "aesthetic", "synthwave", "futuristic", "neon", "aiart", "studymusic", "chillvibes"]
        }
      },

      seoOptimization: {
        primaryKeywords: ["cyberpunk music video", "ambient electronic music", "study music", "background music", "digital art"],
        secondaryKeywords: ["synthwave", "vaporwave", "AI art", "concept art", "atmospheric music", "coding music"],
        targetAudience: ["Students", "Developers", "Digital artists", "Cyberpunk enthusiasts", "Ambient music lovers"],
        uploadTiming: "Best times: Tuesday-Thursday, 2-4 PM EST (when study/work content performs well)",
        thumbnailTips: [
          "Use high contrast neon colors (purple, cyan, pink)",
          "Include 'V3XV0ID' branding prominently", 
          "Add '10 MIN' or duration indicator",
          "Use cyberpunk aesthetic elements",
          "Ensure text is readable on mobile"
        ]
      },

      monetization: {
        contentID: "Ensure all music is original or properly licensed",
        copyrightFree: "All visual content is original, music should be original composition",
        adsPlacement: "Mid-roll ads at 3min and 7min marks for 10+ minute videos",
        sponsorship: "Could work well for coding tools, productivity apps, or gaming peripherals"
      }
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const metadata = getYouTubeMetadata()

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          V3XV0ID - 10 Minute YouTube Music Video
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Specs */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Video Specifications</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-mono">10:00 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span className="font-mono">1920x1080 (Full HD)</span>
              </div>
              <div className="flex justify-between">
                <span>Frame Rate:</span>
                <span className="font-mono">30 FPS</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-mono">MP4 (H.264)</span>
              </div>
              <div className="flex justify-between">
                <span>Video Segments:</span>
                <span className="font-mono">{videoClips.length} clips</span>
              </div>
              <div className="flex justify-between">
                <span>Concept Art:</span>
                <span className="font-mono">{conceptArtImages.length} images</span>
              </div>
              <div className="flex justify-between">
                <span>Music Tracks:</span>
                <span className="font-mono">{musicTracks.length} available</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <h3 className="font-semibold mb-2">Content Features:</h3>
              <ul className="text-sm space-y-1">
                <li>• Seamless 15-second video segments</li>
                <li>• 2-second crossfade transitions</li>
                <li>• Floating concept art overlays</li>
                <li>• Dynamic backdrop rotation</li>
                <li>• Consistent V3XV0ID branding</li>
                <li>• Atmospheric color grading</li>
              </ul>
            </div>
          </div>

          {/* Production Notes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Production Instructions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Manual Video Creation:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Use video editing software (Premiere Pro, Final Cut, DaVinci Resolve)</li>
                  <li>Import all {videoClips.length} video clips from Supabase</li>
                  <li>Create 15-second segments from each clip (random start points)</li>
                  <li>Add 2-second crossfade transitions between segments</li>
                  <li>Layer concept art as floating overlays with blur/opacity effects</li>
                  <li>Add atmospheric color grading (brightness 0.7, contrast 1.2)</li>
                  <li>Include V3XV0ID watermark in bottom-right corner</li>
                  <li>Add ambient electronic music track (loop as needed)</li>
                  <li>Export as 1080p MP4, 30fps, high bitrate</li>
                </ol>
              </div>
              
              <div className="p-3 bg-yellow-900/30 rounded">
                <h4 className="font-semibold text-yellow-400">Browser Limitations:</h4>
                <p className="text-xs">The automated generator may have performance issues in browsers. Manual creation in professional video editing software is recommended for best results.</p>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Metadata */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">YouTube Upload Metadata</h2>
          
          <div className="space-y-6">
            {/* Title */}
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
            
            {/* Description */}
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
            
            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-400">Tags (comma-separated):</h3>
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

        {/* Social Media Promotion */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Social Media Promotion</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Twitter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-400">Twitter/X Post:</h3>
                <button 
                  onClick={() => copyToClipboard(metadata.socialMedia.twitter, 'Twitter post')}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm bg-gray-700 p-3 rounded">
                {metadata.socialMedia.twitter}
              </p>
            </div>
            
            {/* Instagram */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-pink-400">Instagram Post:</h3>
                <button 
                  onClick={() => copyToClipboard(metadata.socialMedia.instagram, 'Instagram post')}
                  className="text-xs bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm bg-gray-700 p-3 rounded">
                {metadata.socialMedia.instagram}
              </p>
            </div>
            
            {/* Reddit */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-orange-400">Reddit Post:</h3>
                <button 
                  onClick={() => copyToClipboard(`${metadata.socialMedia.reddit.title}\n\n${metadata.socialMedia.reddit.description}`, 'Reddit post')}
                  className="text-xs bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-700 p-3 rounded space-y-2">
                <p className="text-sm font-semibold">{metadata.socialMedia.reddit.title}</p>
                <p className="text-xs whitespace-pre-wrap">{metadata.socialMedia.reddit.description}</p>
                <p className="text-xs text-gray-400">
                  Suggested subreddits: {metadata.socialMedia.reddit.subreddits.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Strategy */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">SEO & Upload Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-yellow-400 mb-3">Optimization Tips:</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Upload Timing:</strong> {metadata.seoOptimization.uploadTiming}</li>
                <li><strong>Target Audience:</strong> {metadata.seoOptimization.targetAudience.join(', ')}</li>
                <li><strong>Primary Keywords:</strong> {metadata.seoOptimization.primaryKeywords.join(', ')}</li>
                <li><strong>Secondary Keywords:</strong> {metadata.seoOptimization.secondaryKeywords.join(', ')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-yellow-400 mb-3">Thumbnail Guidelines:</h3>
              <ul className="text-sm space-y-1">
                {metadata.seoOptimization.thumbnailTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-900/30 rounded">
            <h4 className="font-semibold text-green-400 mb-2">Monetization Notes:</h4>
            <ul className="text-sm space-y-1">
              <li>• {metadata.monetization.contentID}</li>
              <li>• {metadata.monetization.copyrightFree}</li>
              <li>• {metadata.monetization.adsPlacement}</li>
              <li>• Sponsorship opportunities: {metadata.monetization.sponsorship}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 