import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

interface VideoCompositionRequest {
  audioFile: string
  visualStyle: 'video-composite' | 'professional-mix' | 'train-atmosphere' | 'organic-flow' | 'particles' | 'waveform' | 'veo3'
  duration: number
  resolution: '1080p' | '720p' | '4k'
  compositionMode?: 'layered' | 'montage' | 'blend' | 'glitch'
  audioMix?: 'music-only' | 'subtle-atmosphere' | 'train-interludes' | 'full-mix'
  musicTitle: string
}

interface AssetCollection {
  videos: {
    professional: string[]
    standard: string[]
    trainAudio: string[]
    special: string[]
  }
  images: {
    conceptArt: string[]
    landscapes: string[]
    portraits: string[]
    graffiti: string[]
    videoJam: string[]
  }
}

// Asset inventory - This would ideally come from Supabase once uploaded
const getAvailableAssets = (): AssetCollection => {
  const videosPath = path.join(process.cwd(), 'public/videos/vex_video_jam_01')
  const imagesPath = path.join(process.cwd(), 'public/images')
  
  let videoFiles: string[] = []
  let imageCollections: any = {}
  
  try {
    // Get video files
    if (fs.existsSync(videosPath)) {
      videoFiles = fs.readdirSync(videosPath).filter(file => file.endsWith('.mp4'))
    }
    
    // Get image collections
    const imageDirectories = [
      'VexVoid_concept_art',
      'VexVoid_Landscape', 
      'VexVoid_Portrait',
      'VexVoid_graf_train_jam',
      'v3x_vide0_Jam_01'
    ]
    
    for (const dir of imageDirectories) {
      const dirPath = path.join(imagesPath, dir)
      if (fs.existsSync(dirPath)) {
        imageCollections[dir] = fs.readdirSync(dirPath)
          .filter(file => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase()))
      }
    }
  } catch (error) {
    console.error('Error reading asset directories:', error)
  }
  
  return {
    videos: {
      professional: videoFiles.filter(f => f.includes('Professional_Mode')),
      standard: videoFiles.filter(f => f.includes('Standard_Mode')),
      trainAudio: videoFiles.filter(f => f.includes('train') || f.includes('A_train')),
      special: videoFiles.filter(f => f.includes('Extended') || f.includes('Footsteps') || f.includes('Heavy_rain'))
    },
    images: {
      conceptArt: imageCollections['VexVoid_concept_art'] || [],
      landscapes: imageCollections['VexVoid_Landscape'] || [],
      portraits: imageCollections['VexVoid_Portrait'] || [],
      graffiti: imageCollections['VexVoid_graf_train_jam'] || [],
      videoJam: imageCollections['v3x_vide0_Jam_01'] || []
    }
  }
}

const selectAssetsForComposition = (
  assets: AssetCollection, 
  style: string, 
  duration: number
): { videos: string[], images: string[], audioTracks: string[] } => {
  const selected = {
    videos: [] as string[],
    images: [] as string[],
    audioTracks: [] as string[]
  }
  
  switch (style) {
    case 'video-composite':
      // Mix of professional and standard videos
      selected.videos = [
        ...assets.videos.professional.slice(0, 3),
        ...assets.videos.standard.slice(0, 2)
      ]
      selected.images = [
        ...assets.images.conceptArt.slice(0, 5),
        ...assets.images.videoJam.slice(0, 3)
      ]
      break
      
    case 'professional-mix':
      // High-quality professional videos only
      selected.videos = assets.videos.professional.slice(0, 5)
      selected.images = [
        ...assets.images.landscapes.slice(0, 4),
        ...assets.images.portraits.slice(0, 2)
      ]
      break
      
    case 'train-atmosphere':
      // Train videos with graffiti imagery
      selected.videos = [
        ...assets.videos.trainAudio.slice(0, 3),
        ...assets.videos.professional.slice(0, 2)
      ]
      selected.images = [
        ...assets.images.graffiti.slice(0, 8),
        ...assets.images.videoJam.slice(0, 4)
      ]
      selected.audioTracks = assets.videos.trainAudio.slice(0, 2) // For ambient mixing
      break
      
    case 'organic-flow':
      // Smooth flowing composition
      selected.videos = [
        ...assets.videos.standard.slice(0, 3),
        ...assets.videos.special.slice(0, 1)
      ]
      selected.images = [
        ...assets.images.landscapes.slice(0, 6),
        ...assets.images.conceptArt.slice(0, 3)
      ]
      break
      
    default:
      // Fallback selection
      selected.videos = assets.videos.professional.slice(0, 2)
      selected.images = assets.images.conceptArt.slice(0, 3)
  }
  
  return selected
}

const generateCompositionPlan = (
  request: VideoCompositionRequest,
  selectedAssets: { videos: string[], images: string[], audioTracks: string[] }
) => {
  const { duration, compositionMode, audioMix } = request
  
  // Calculate timing for video segments
  const videoSegmentDuration = duration / selectedAssets.videos.length
  const imageOverlayDuration = 2 // seconds per image overlay
  
  const plan = {
    totalDuration: duration,
    videoSegments: selectedAssets.videos.map((video, index) => ({
      file: video,
      startTime: index * videoSegmentDuration,
      duration: videoSegmentDuration,
      effects: getEffectsForMode(compositionMode || 'layered', index)
    })),
    imageOverlays: selectedAssets.images.map((image, index) => ({
      file: image,
      startTime: (index * imageOverlayDuration) % duration,
      duration: imageOverlayDuration,
      opacity: 0.3 + (Math.random() * 0.4), // 0.3-0.7 opacity
      position: getRandomPosition(),
      blendMode: getBlendModeForStyle(request.visualStyle)
    })),
    audioMix: {
      musicVolume: 1.0,
      ambientVolume: getAmbientVolumeForMix(audioMix || 'music-only'),
      ambientTracks: selectedAssets.audioTracks
    },
    transitions: generateTransitions(selectedAssets.videos.length, compositionMode || 'layered')
  }
  
  return plan
}

const getEffectsForMode = (mode: string, segmentIndex: number) => {
  switch (mode) {
    case 'glitch':
      return ['glitch_effect', 'digital_noise', 'color_shift']
    case 'blend':
      return ['smooth_fade', 'color_grade']
    case 'montage':
      return segmentIndex % 2 === 0 ? ['quick_cut', 'zoom_in'] : ['quick_cut', 'zoom_out']
    default: // layered
      return ['color_grade', 'subtle_vignette']
  }
}

const getRandomPosition = () => ({
  x: Math.random() * 0.6 + 0.2, // 20%-80% of screen width
  y: Math.random() * 0.6 + 0.2, // 20%-80% of screen height
  scale: Math.random() * 0.5 + 0.5 // 50%-100% scale
})

const getBlendModeForStyle = (style: string) => {
  const blendModes = {
    'video-composite': 'overlay',
    'professional-mix': 'soft_light',
    'train-atmosphere': 'multiply',
    'organic-flow': 'screen'
  }
  return blendModes[style as keyof typeof blendModes] || 'overlay'
}

const getAmbientVolumeForMix = (mix: string) => {
  const volumes = {
    'music-only': 0.0,
    'subtle-atmosphere': 0.1,
    'train-interludes': 0.2,
    'full-mix': 0.5
  }
  return volumes[mix as keyof typeof volumes] || 0.0
}

const generateTransitions = (segmentCount: number, mode: string) => {
  const transitions = []
  
  for (let i = 0; i < segmentCount - 1; i++) {
    let transitionType = 'fade'
    
    switch (mode) {
      case 'montage':
        transitionType = Math.random() > 0.5 ? 'cut' : 'quick_fade'
        break
      case 'glitch':
        transitionType = Math.random() > 0.7 ? 'glitch_transition' : 'digital_wipe'
        break
      case 'blend':
        transitionType = 'crossfade'
        break
      default:
        transitionType = 'fade'
    }
    
    transitions.push({
      type: transitionType,
      duration: mode === 'montage' ? 0.1 : 0.5,
      position: i + 1
    })
  }
  
  return transitions
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoCompositionRequest = await request.json()
    
    console.log('🎬 Starting video composition:', {
      audioFile: body.audioFile,
      visualStyle: body.visualStyle,
      duration: body.duration,
      resolution: body.resolution,
      compositionMode: body.compositionMode,
      audioMix: body.audioMix
    })
    
    // Get available assets
    const availableAssets = getAvailableAssets()
    
    console.log('📦 Available assets:', {
      professionalVideos: availableAssets.videos.professional.length,
      standardVideos: availableAssets.videos.standard.length,
      trainVideos: availableAssets.videos.trainAudio.length,
      conceptArt: availableAssets.images.conceptArt.length,
      landscapes: availableAssets.images.landscapes.length,
      videoJamImages: availableAssets.images.videoJam.length
    })
    
    // Select assets based on style
    const selectedAssets = selectAssetsForComposition(
      availableAssets,
      body.visualStyle,
      body.duration
    )
    
    console.log('🎯 Selected assets:', {
      videos: selectedAssets.videos.length,
      images: selectedAssets.images.length,
      audioTracks: selectedAssets.audioTracks.length
    })
    
    // Generate composition plan
    const compositionPlan = generateCompositionPlan(body, selectedAssets)
    
    console.log('📋 Composition plan generated:', {
      videoSegments: compositionPlan.videoSegments.length,
      imageOverlays: compositionPlan.imageOverlays.length,
      transitions: compositionPlan.transitions.length,
      ambientVolume: compositionPlan.audioMix.ambientVolume
    })
    
    // TODO: Implement actual FFmpeg video composition
    // For now, simulate the process
    
    const simulatedSteps = [
      { step: 'asset_preparation', progress: 10, message: 'Preparing video assets...' },
      { step: 'audio_analysis', progress: 25, message: 'Analyzing audio track...' },
      { step: 'video_layering', progress: 45, message: 'Layering video segments...' },
      { step: 'image_overlay', progress: 65, message: 'Adding image overlays...' },
      { step: 'audio_mixing', progress: 80, message: 'Mixing audio tracks...' },
      { step: 'final_render', progress: 95, message: 'Rendering final video...' },
      { step: 'complete', progress: 100, message: 'Video composition complete!' }
    ]
    
    return NextResponse.json({
      success: true,
      message: 'Video composition plan generated',
      compositionPlan,
      selectedAssets,
      availableAssets: {
        totalVideos: Object.values(availableAssets.videos).flat().length,
        totalImages: Object.values(availableAssets.images).flat().length
      },
      processingSteps: simulatedSteps,
      note: 'This is currently a simulation. Real FFmpeg integration needed for actual video composition.',
      recommendations: {
        uploadAssets: 'Upload all assets to Supabase Storage for production use',
        implementFFmpeg: 'Integrate FFmpeg for real video composition',
        optimizeAssets: 'Consider generating thumbnails and multiple quality versions'
      }
    })
    
  } catch (error) {
    console.error('Video composition failed:', error)
    return NextResponse.json(
      { 
        error: 'Video composition failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 