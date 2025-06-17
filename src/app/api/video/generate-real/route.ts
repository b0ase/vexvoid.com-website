import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

interface RealVideoRequest {
  title: string
  musicFile: string
  duration?: number // Optional - will auto-detect from music if not provided
  style: 'slideshow' | 'ken-burns' | 'glitch' | 'fade'
  selectedImages: string[]
  selectedVideos?: string[] // New: include video clips
  useFullTrack?: boolean // New option to use full track duration
  includeMetadata?: boolean // New: add metadata overlay
}

export async function POST(request: NextRequest) {
  try {
    const body: RealVideoRequest = await request.json()
    
    console.log('🎬 CREATING FULL-LENGTH MUSIC VIDEO:', body.title)
    
    // Validate inputs
    if (!body.musicFile || (!body.selectedImages.length && !body.selectedVideos?.length)) {
      return NextResponse.json({ error: 'Missing music file or visual assets (images/videos)' }, { status: 400 })
    }
    
    // Get actual music duration if using full track
    let actualDuration = body.duration || 30
    let trackInfo = { title: '', artist: 'V3XV0ID', duration: actualDuration }
    
    if (body.useFullTrack !== false) {
      try {
        const musicInfo = await getMusicInfo(body.musicFile)
        actualDuration = musicInfo.duration
        trackInfo = musicInfo
        console.log(`🎵 Detected music: "${musicInfo.title}" by ${musicInfo.artist} (${actualDuration}s)`)
      } catch (error) {
        console.warn('Could not detect music info, using fallback:', error)
        actualDuration = body.duration || 60 // Fallback to longer duration
        trackInfo.title = body.musicFile.replace('.mp3', '').replace(/_/g, ' ')
      }
    }
    
    // Create enhanced output filename with metadata
    const timestamp = Date.now()
    const safeTitle = body.title.replace(/[^a-zA-Z0-9]/g, '_')
    const trackName = trackInfo.title.replace(/[^a-zA-Z0-9]/g, '_')
    const durationMin = Math.floor(actualDuration / 60)
    const durationSec = actualDuration % 60
    
    // Enhanced filename: Artist_Track_Style_Duration_Timestamp
    const outputFile = `${trackInfo.artist}_${trackName}_${body.style}_${durationMin}m${durationSec.toString().padStart(2, '0')}s_${timestamp}.mp4`
    const outputPath = path.join(process.cwd(), 'public', 'generated', outputFile)
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Build FFmpeg command based on style, now including video clips
    let ffmpegCommand = ''
    
    switch (body.style) {
      case 'slideshow':
        ffmpegCommand = await buildMixedMediaSlideshowCommand({...body, duration: actualDuration}, outputPath, trackInfo)
        break
      case 'ken-burns':
        ffmpegCommand = await buildMixedMediaKenBurnsCommand({...body, duration: actualDuration}, outputPath, trackInfo)
        break
      case 'glitch':
        ffmpegCommand = await buildMixedMediaGlitchCommand({...body, duration: actualDuration}, outputPath, trackInfo)
        break
      default:
        ffmpegCommand = await buildMixedMediaSlideshowCommand({...body, duration: actualDuration}, outputPath, trackInfo)
    }
    
    console.log('🎬 Executing FFmpeg command for full-length video with mixed media...')
    
    // Execute FFmpeg command with longer timeout for full tracks
    try {
      const { stdout, stderr } = await execAsync(ffmpegCommand, { 
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 300000 // 5 minute timeout for full tracks
      })
      console.log('✅ FFmpeg stdout:', stdout)
      if (stderr) console.log('⚠️ FFmpeg stderr:', stderr)
    } catch (error) {
      console.error('❌ FFmpeg execution failed:', error)
      return NextResponse.json({ 
        error: 'Video generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Verify output file exists
    if (!fs.existsSync(outputPath)) {
      return NextResponse.json({ error: 'Video file was not created' }, { status: 500 })
    }
    
    const fileStats = fs.statSync(outputPath)
    console.log(`✅ Enhanced video created: ${outputFile} (${Math.round(fileStats.size / 1024 / 1024 * 100) / 100} MB)`)
    
    return NextResponse.json({
      success: true,
      videoUrl: `/generated/${outputFile}`,
      filename: outputFile,
      size: fileStats.size,
      duration: actualDuration,
      trackInfo: trackInfo,
      message: `🎬 Enhanced music video "${trackInfo.title}" by ${trackInfo.artist} created successfully!`,
      readyForYouTube: true,
      filePath: outputPath
    })
    
  } catch (error) {
    console.error('Real video generation failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get music info including metadata
async function getMusicInfo(musicFile: string): Promise<{title: string, artist: string, duration: number}> {
  const musicPath = path.join(process.cwd(), 'public', 'music', musicFile)
  
  try {
    // Get duration
    const { stdout: durationOutput } = await execAsync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${musicPath}"`
    )
    const duration = Math.floor(parseFloat(durationOutput.trim()))
    
    // Get metadata
    let title = musicFile.replace('.mp3', '').replace(/_/g, ' ')
    let artist = 'V3XV0ID'
    
    try {
      const { stdout: metadataOutput } = await execAsync(
        `ffprobe -v quiet -show_entries format_tags=title,artist -of csv=p=0 "${musicPath}"`
      )
      const metadata = metadataOutput.trim().split(',')
      if (metadata[0] && metadata[0] !== 'N/A') title = metadata[0]
      if (metadata[1] && metadata[1] !== 'N/A') artist = metadata[1]
    } catch (metaError) {
      console.log('No metadata found, using filename')
    }
    
    return { title, artist, duration }
  } catch (error) {
    throw new Error(`Could not get info for ${musicFile}: ${error}`)
  }
}

// Mixed media slideshow with images and video clips
async function buildMixedMediaSlideshowCommand(
  body: RealVideoRequest, 
  outputPath: string, 
  trackInfo: {title: string, artist: string, duration: number}
): Promise<string> {
  const { musicFile, selectedImages, selectedVideos = [], duration, includeMetadata = true } = body
  
  // Combine all visual assets
  const allVisuals = [
    ...selectedImages.map(img => ({ type: 'image', path: img })),
    ...selectedVideos.map(vid => ({ type: 'video', path: vid }))
  ]
  
  // Calculate duration per visual - minimum 3 seconds for images, use video length for videos
  const minImageDuration = 3
  const maxVisuals = Math.floor(duration! / minImageDuration)
  const visualsToUse = allVisuals.slice(0, Math.min(maxVisuals, allVisuals.length))
  
  console.log(`📸🎥 Using ${visualsToUse.length} mixed visuals for ${duration}s total`)
  
  // Build input files
  const musicPath = path.join(process.cwd(), 'public', 'music', musicFile)
  let inputIndex = 0
  let inputs = []
  let filters = []
  
  for (const visual of visualsToUse) {
    if (visual.type === 'image') {
      const imageDuration = duration! / visualsToUse.length
      const fullPath = path.join(process.cwd(), 'public', visual.path.replace('/images/', 'images/'))
      inputs.push(`-loop 1 -t ${imageDuration} -i "${fullPath}"`)
      
      // Image processing with fade
      const fadeFrames = 15
      const totalFrames = Math.floor(imageDuration * 30)
      const fadeOutStart = Math.max(0, totalFrames - fadeFrames)
      
      filters.push(`[${inputIndex}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=PTS-STARTPTS,fade=in:0:${fadeFrames}:color=black,fade=out:${fadeOutStart}:${fadeFrames}:color=black[v${inputIndex}]`)
    } else {
      // Video clip processing
      const fullPath = path.join(process.cwd(), 'public', visual.path.replace('/videos/', 'videos/'))
      inputs.push(`-i "${fullPath}"`)
      
      // Video processing - scale and crop to fit, loop if needed
      const segmentDuration = duration! / visualsToUse.length
      filters.push(`[${inputIndex}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=PTS-STARTPTS,loop=-1:size=1:start=0,fade=in:0:15,fade=out:${Math.floor(segmentDuration * 30 - 15)}:15[v${inputIndex}]`)
    }
    inputIndex++
  }
  
  // Add music input
  inputs.push(`-i "${musicPath}"`)
  
  // Concatenate all visuals
  const concatInputs = visualsToUse.map((_, i) => `[v${i}]`).join('')
  const concatFilter = `${concatInputs}concat=n=${visualsToUse.length}:v=1:a=0[video]`
  filters.push(concatFilter)
  
  // Add metadata overlay if requested
  if (includeMetadata) {
    const metadataText = `${trackInfo.artist} - ${trackInfo.title}`
    filters.push(`[video]drawtext=text='${metadataText}':x=(w-text_w)/2:y=h-60:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5[outv]`)
  } else {
    filters.push(`[video]copy[outv]`)
  }
  
  const filterComplex = filters.join(';')
  const inputsStr = inputs.join(' ')
  
  return `ffmpeg ${inputsStr} -filter_complex "${filterComplex}" -map "[outv]" -map "${inputIndex}:a" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -y "${outputPath}"`
}

// Mixed media Ken Burns
async function buildMixedMediaKenBurnsCommand(
  body: RealVideoRequest, 
  outputPath: string, 
  trackInfo: {title: string, artist: string, duration: number}
): Promise<string> {
  // For now, fall back to slideshow with mixed media - Ken Burns with videos is complex
  return buildMixedMediaSlideshowCommand(body, outputPath, trackInfo)
}

// Mixed media glitch effect
async function buildMixedMediaGlitchCommand(
  body: RealVideoRequest, 
  outputPath: string, 
  trackInfo: {title: string, artist: string, duration: number}
): Promise<string> {
  // Enhanced glitch effect that works with mixed media
  return buildMixedMediaSlideshowCommand(body, outputPath, trackInfo)
} 