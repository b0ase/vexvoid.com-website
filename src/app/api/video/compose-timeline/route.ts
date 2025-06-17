import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  duration?: number;
  bucket?: string;
}

interface TimelineClip {
  id: string;
  assetId: string;
  trackId: string;
  startTime: number;
  duration: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  transition?: 'cut' | 'fade' | 'dissolve' | 'wipe';
}

interface TimelineTrack {
  id: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  clips: TimelineClip[];
  muted?: boolean;
  volume?: number;
}

interface ProjectSettings {
  title: string;
  duration: number;
  resolution: '1080p' | '720p' | '4K';
  framerate: 30 | 60;
  style: 'slideshow' | 'ken-burns' | 'glitch' | 'fade' | 'cinematic';
  uploadToYouTube: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { tracks, projectSettings, assets } = await request.json() as {
      tracks: TimelineTrack[];
      projectSettings: ProjectSettings;
      assets: Record<string, MediaAsset>;
    };

    console.log('🎬 Starting timeline video composition...');
    console.log(`Project: ${projectSettings.title}`);
    console.log(`Duration: ${projectSettings.duration}s`);
    console.log(`Tracks: ${tracks.length}`);
    console.log(`Total clips: ${tracks.reduce((sum, track) => sum + track.clips.length, 0)}`);

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const outputFilename = `${projectSettings.title.replace(/[^a-zA-Z0-9]/g, '_')}_timeline_${timestamp}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    // Download and prepare assets
    const tempDir = path.join(process.cwd(), 'temp', `timeline_${timestamp}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const localAssets: Record<string, string> = {};

    // Download Supabase assets to local temp directory
    for (const [assetId, asset] of Object.entries(assets)) {
      if (asset.bucket) {
        // This is a Supabase asset, download it
        try {
          const response = await fetch(asset.url);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            const ext = path.extname(asset.name) || (asset.type === 'video' ? '.mp4' : asset.type === 'image' ? '.jpg' : '.mp3');
            const localPath = path.join(tempDir, `${assetId}${ext}`);
            fs.writeFileSync(localPath, Buffer.from(buffer));
            localAssets[assetId] = localPath;
            console.log(`Downloaded: ${asset.name}`);
          }
        } catch (error) {
          console.error(`Failed to download ${asset.name}:`, error);
        }
      } else {
        // Local asset, use directly
        const localPath = path.join(process.cwd(), 'public', asset.url.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          localAssets[assetId] = localPath;
        }
      }
    }

    // Build FFmpeg command for timeline composition
    const ffmpegArgs = await buildTimelineFFmpegCommand(
      tracks,
      projectSettings,
      assets,
      localAssets,
      outputPath
    );

    console.log('🎬 Starting FFmpeg composition...');
    console.log('FFmpeg command:', 'ffmpeg', ffmpegArgs.join(' '));

    // Execute FFmpeg
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      let stderr = '';
      
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
        // Log progress
        if (data.toString().includes('time=')) {
          console.log('FFmpeg progress:', data.toString().trim());
        }
      });
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('✅ FFmpeg composition completed');
          resolve();
        } else {
          console.error('❌ FFmpeg failed with code:', code);
          console.error('FFmpeg stderr:', stderr);
          reject(new Error(`FFmpeg failed with code ${code}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        console.error('❌ FFmpeg spawn error:', error);
        reject(error);
      });
    });

    // Clean up temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up temp directory:', error);
    }

    // Get file stats
    const stats = fs.statSync(outputPath);
    const videoUrl = `/generated/${outputFilename}`;

    console.log('✅ Timeline video composition completed!');
    console.log(`📁 File: ${outputFilename}`);
    console.log(`📊 Size: ${Math.round(stats.size / 1024 / 1024 * 100) / 100} MB`);

    return NextResponse.json({
      success: true,
      videoUrl,
      filename: outputFilename,
      size: stats.size,
      duration: projectSettings.duration,
      tracks: tracks.length,
      clips: tracks.reduce((sum, track) => sum + track.clips.length, 0),
      readyForYouTube: true
    });

  } catch (error) {
    console.error('❌ Timeline composition failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

async function buildTimelineFFmpegCommand(
  tracks: TimelineTrack[],
  projectSettings: ProjectSettings,
  assets: Record<string, MediaAsset>,
  localAssets: Record<string, string>,
  outputPath: string
): Promise<string[]> {
  const args: string[] = [];
  
  // Set overwrite and log level
  args.push('-y', '-loglevel', 'info');
  
  // Collect all unique assets that are actually used
  const usedAssets = new Set<string>();
  tracks.forEach(track => {
    track.clips.forEach(clip => {
      usedAssets.add(clip.assetId);
    });
  });
  
  // Add input files
  const inputMap: Record<string, number> = {};
  let inputIndex = 0;
  
  for (const assetId of Array.from(usedAssets)) {
    const localPath = localAssets[assetId];
    if (localPath && fs.existsSync(localPath)) {
      args.push('-i', localPath);
      inputMap[assetId] = inputIndex;
      inputIndex++;
    }
  }
  
  // If no inputs, create a blank video
  if (inputIndex === 0) {
    args.push('-f', 'lavfi', '-i', `color=black:size=1920x1080:duration=${projectSettings.duration}:rate=30`);
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '23');
    args.push(outputPath);
    return args;
  }
  
  // Build filter complex for timeline composition
  const filterParts: string[] = [];
  const videoTracks = tracks.filter(t => t.type === 'video');
  const imageTracks = tracks.filter(t => t.type === 'image');
  const audioTracks = tracks.filter(t => t.type === 'audio');
  
  // Create base canvas
  filterParts.push(`color=black:size=1920x1080:duration=${projectSettings.duration}:rate=30[base]`);
  
  let currentVideo = '[base]';
  let overlayIndex = 0;
  
  // Process video tracks
  for (const track of videoTracks) {
    for (const clip of track.clips) {
      const inputIdx = inputMap[clip.assetId];
      if (inputIdx !== undefined) {
        const asset = assets[clip.assetId];
        
        // Scale and position video clip
        filterParts.push(
          `[${inputIdx}:v]scale=1920:1080:force_original_aspect_ratio=decrease,` +
          `pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black[v${overlayIndex}]`
        );
        
        // Overlay with timing
        filterParts.push(
          `${currentVideo}[v${overlayIndex}]overlay=0:0:enable='between(t,${clip.startTime},${clip.startTime + clip.duration})'[overlay${overlayIndex}]`
        );
        
        currentVideo = `[overlay${overlayIndex}]`;
        overlayIndex++;
      }
    }
  }
  
  // Process image tracks (similar to video but with duration control)
  for (const track of imageTracks) {
    for (const clip of track.clips) {
      const inputIdx = inputMap[clip.assetId];
      if (inputIdx !== undefined) {
        // Scale image
        filterParts.push(
          `[${inputIdx}:v]scale=1920:1080:force_original_aspect_ratio=decrease,` +
          `pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black[img${overlayIndex}]`
        );
        
        // Overlay with timing
        filterParts.push(
          `${currentVideo}[img${overlayIndex}]overlay=0:0:enable='between(t,${clip.startTime},${clip.startTime + clip.duration})'[overlay${overlayIndex}]`
        );
        
        currentVideo = `[overlay${overlayIndex}]`;
        overlayIndex++;
      }
    }
  }
  
  // Process audio tracks
  const audioInputs: string[] = [];
  let audioIndex = 0;
  
  for (const track of audioTracks) {
    if (track.muted) continue;
    
    for (const clip of track.clips) {
      const inputIdx = inputMap[clip.assetId];
      if (inputIdx !== undefined) {
        const volume = (clip.volume || 1.0) * (track.volume || 1.0);
        
        // Audio with timing and volume
        filterParts.push(
          `[${inputIdx}:a]atrim=0:${clip.duration},asetpts=PTS-STARTPTS,` +
          `adelay=${clip.startTime * 1000}|${clip.startTime * 1000},` +
          `volume=${volume}[a${audioIndex}]`
        );
        
        audioInputs.push(`[a${audioIndex}]`);
        audioIndex++;
      }
    }
  }
  
  // Mix audio tracks
  if (audioInputs.length > 0) {
    filterParts.push(`${audioInputs.join('')}amix=inputs=${audioInputs.length}:duration=longest[audio]`);
  }
  
  // Set final video output
  filterParts.push(`${currentVideo}format=yuv420p[video]`);
  
  // Apply filter complex
  if (filterParts.length > 0) {
    args.push('-filter_complex', filterParts.join(';'));
  }
  
  // Map outputs
  args.push('-map', '[video]');
  if (audioInputs.length > 0) {
    args.push('-map', '[audio]');
  }
  
  // Video encoding settings
  args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '23');
  args.push('-c:a', 'aac', '-b:a', '128k');
  
  // Duration
  args.push('-t', projectSettings.duration.toString());
  
  // Output
  args.push(outputPath);
  
  return args;
} 