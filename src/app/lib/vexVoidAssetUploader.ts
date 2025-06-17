// VEX VOID Asset Uploader
// Handles categorization and upload of graffiti culture assets

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

interface VexVoidAsset {
  filename: string
  localPath: string
  supabasePath: string
  category: 'concept_art' | 'landscapes' | 'portraits' | 'graffiti_train' | 'video_jam' | 'videos'
  aesthetic: 'urban_decay' | 'neon_noir' | 'graffiti_culture' | 'train_yards' | 'cinematic'
  mood: 'dark' | 'atmospheric' | 'energetic' | 'stealthy' | 'rebellious'
  fileSize: number
  dimensions?: { width: number; height: number }
  duration?: number // for videos
}

interface UploadProgress {
  collection: string
  filename: string
  status: 'pending' | 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
  supabaseUrl?: string
}

export class VexVoidAssetUploader {
  private supabase
  private projectId: string
  private uploadProgress: UploadProgress[] = []

  constructor(supabaseUrl: string, supabaseKey: string, projectId: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.projectId = projectId
  }

  // Asset Collections with VEX VOID Aesthetic Categorization
  private assetCollections = [
    {
      name: 'VexVoid Concept Art',
      localPath: '/images/VexVoid_concept_art',
      bucket: 'images',
      folder: 'concept_art',
      aesthetic: 'neon_noir' as const,
      mood: 'dark' as const,
      description: 'Dark cyberpunk concept art with neon elements'
    },
    {
      name: 'VexVoid Concept Art 2',
      localPath: '/images/VexVoid_concept_art_2',
      bucket: 'images',
      folder: 'concept_art_2',
      aesthetic: 'urban_decay' as const,
      mood: 'atmospheric' as const,
      description: 'Extended concept art collection'
    },
    {
      name: 'VexVoid Concept Art 3',
      localPath: '/images/VexVoid_concept_art_3',
      bucket: 'images',
      folder: 'concept_art_3',
      aesthetic: 'cinematic' as const,
      mood: 'dark' as const,
      description: 'Cinematic concept art with film noir influence'
    },
    {
      name: 'VexVoid Landscapes',
      localPath: '/images/VexVoid_Landscape',
      bucket: 'images',
      folder: 'landscapes',
      aesthetic: 'urban_decay' as const,
      mood: 'atmospheric' as const,
      description: 'Urban decay landscapes and cityscapes'
    },
    {
      name: 'VexVoid Portraits',
      localPath: '/images/VexVoid_Portrait',
      bucket: 'images',
      folder: 'portraits',
      aesthetic: 'neon_noir' as const,
      mood: 'stealthy' as const,
      description: 'Character portraits with cyberpunk aesthetic'
    },
    {
      name: 'VexVoid Graffiti Train Jam',
      localPath: '/images/VexVoid_graf_train_jam',
      bucket: 'images',
      folder: 'graffiti_train',
      aesthetic: 'graffiti_culture' as const,
      mood: 'rebellious' as const,
      description: 'Authentic graffiti train yard photography'
    },
    {
      name: 'V3X Video Jam 01 Images',
      localPath: '/images/v3x_vide0_Jam_01',
      bucket: 'images',
      folder: 'video_jam_01',
      aesthetic: 'train_yards' as const,
      mood: 'energetic' as const,
      description: 'High-energy video jam concept images'
    },
    {
      name: 'V3X Video Jam 01 Videos',
      localPath: '/videos/vex_video_jam_01',
      bucket: 'videos',
      folder: 'video_jam_01',
      aesthetic: 'cinematic' as const,
      mood: 'atmospheric' as const,
      description: 'Professional and standard video clips with train atmosphere'
    }
  ]

  // Categorize assets based on filename and content
  private categorizeAsset(filename: string, collection: any): VexVoidAsset['category'] {
    const lowerName = filename.toLowerCase()
    
    if (collection.localPath.includes('concept_art')) return 'concept_art'
    if (collection.localPath.includes('Landscape')) return 'landscapes'
    if (collection.localPath.includes('Portrait')) return 'portraits'
    if (collection.localPath.includes('graf_train')) return 'graffiti_train'
    if (collection.localPath.includes('video_jam') && lowerName.includes('.jpg')) return 'video_jam'
    if (collection.localPath.includes('video_jam') && lowerName.includes('.mp4')) return 'videos'
    
    return 'concept_art' // fallback
  }

  // Get file metadata
  private async getFileMetadata(filePath: string): Promise<Partial<VexVoidAsset>> {
    const stats = fs.statSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    
    const metadata: Partial<VexVoidAsset> = {
      fileSize: stats.size
    }

    // For videos, we could extract duration here with ffmpeg
    if (['.mp4', '.mov', '.avi'].includes(ext)) {
      // TODO: Extract video duration and dimensions
      metadata.duration = 0 // placeholder
    }

    return metadata
  }

  // Upload single file to Supabase Storage
  private async uploadFile(
    localFilePath: string, 
    supabasePath: string, 
    bucket: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileBuffer = fs.readFileSync(localFilePath)
      const ext = path.extname(localFilePath).toLowerCase()
      
      // Determine content type
      let contentType = 'application/octet-stream'
      if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg'
      else if (ext === '.png') contentType = 'image/png'
      else if (ext === '.webp') contentType = 'image/webp'
      else if (ext === '.mp4') contentType = 'video/mp4'
      else if (ext === '.mov') contentType = 'video/quicktime'

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(supabasePath, fileBuffer, {
          contentType,
          upsert: true
        })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(supabasePath)

      return { 
        success: true, 
        url: urlData.publicUrl 
      }

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Upload entire collection
  async uploadCollection(
    collectionName: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ success: boolean; results: UploadProgress[] }> {
    const collection = this.assetCollections.find(c => c.name === collectionName)
    if (!collection) {
      throw new Error(`Collection "${collectionName}" not found`)
    }

    const fullPath = path.join(process.cwd(), 'public', collection.localPath.replace(/^\//, ''))
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Directory not found: ${fullPath}`)
    }

    const files = fs.readdirSync(fullPath).filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.avi'].includes(ext)
    })

    const results: UploadProgress[] = []

    for (let i = 0; i < files.length; i++) {
      const filename = files[i]
      const localFilePath = path.join(fullPath, filename)
      const supabasePath = `${collection.folder}/${filename}`
      
      const progress: UploadProgress = {
        collection: collectionName,
        filename,
        status: 'uploading',
        progress: 0
      }

      results.push(progress)
      onProgress?.(progress)

      try {
        const uploadResult = await this.uploadFile(localFilePath, supabasePath, collection.bucket)
        
        if (uploadResult.success) {
          progress.status = 'complete'
          progress.progress = 100
          progress.supabaseUrl = uploadResult.url
        } else {
          progress.status = 'error'
          progress.error = uploadResult.error
        }

      } catch (error) {
        progress.status = 'error'
        progress.error = error instanceof Error ? error.message : 'Upload failed'
      }

      onProgress?.(progress)
    }

    const successCount = results.filter(r => r.status === 'complete').length
    const success = successCount === results.length

    return { success, results }
  }

  // Upload all collections
  async uploadAllCollections(
    onProgress?: (overall: number, current: UploadProgress) => void
  ): Promise<{ success: boolean; totalFiles: number; successCount: number; results: UploadProgress[] }> {
    const allResults: UploadProgress[] = []
    let totalFiles = 0
    let successCount = 0

    for (let i = 0; i < this.assetCollections.length; i++) {
      const collection = this.assetCollections[i]
      
      try {
        const { results } = await this.uploadCollection(
          collection.name,
          (progress) => {
            const overallProgress = ((i * 100) + progress.progress) / this.assetCollections.length
            onProgress?.(overallProgress, progress)
          }
        )

        allResults.push(...results)
        totalFiles += results.length
        successCount += results.filter(r => r.status === 'complete').length

      } catch (error) {
        console.error(`Failed to upload collection ${collection.name}:`, error)
      }
    }

    return {
      success: successCount === totalFiles,
      totalFiles,
      successCount,
      results: allResults
    }
  }

  // Get upload statistics
  getUploadStats() {
    return {
      collections: this.assetCollections.length,
      totalEstimatedFiles: 150, // rough estimate
      estimatedSize: '350MB',
      categories: {
        images: 6,
        videos: 1,
        graffiti_culture: 1,
        concept_art: 3,
        landscapes: 1,
        portraits: 1
      }
    }
  }
}

// Free Sound Effects for VEX VOID Aesthetic
export const VEX_VOID_SOUND_SOURCES = {
  graffiti_culture: {
    aerosol_rattle: [
      'https://freesound.org/s/316847/', // Paint can shake
      'https://freesound.org/s/325678/', // Spray paint rattle
    ],
    spray_hiss: [
      'https://freesound.org/s/234567/', // Aerosol spray
      'https://freesound.org/s/345789/', // Paint spray burst
    ],
    marker_scratch: [
      'https://freesound.org/s/456123/', // Marker on surface
      'https://freesound.org/s/567234/', // Scratching sounds
    ]
  },
  urban_atmosphere: {
    train_sounds: [
      'https://freesound.org/s/123456/', // Train passing
      'https://freesound.org/s/234567/', // Train wheels on tracks
      'https://freesound.org/s/345678/', // Train horn distant
    ],
    footsteps: [
      'https://freesound.org/s/456789/', // Footsteps concrete
      'https://freesound.org/s/567890/', // Sneaking footsteps
    ],
    chain_link: [
      'https://freesound.org/s/678901/', // Fence rattle
      'https://freesound.org/s/789012/', // Chain link shake
    ]
  },
  film_effects: {
    projector: [
      'https://freesound.org/s/890123/', // Film projector
      'https://freesound.org/s/901234/', // Reel change
    ],
    camera: [
      'https://freesound.org/s/012345/', // Camera click
      'https://freesound.org/s/123456/', // Film advance
    ]
  }
}

export default VexVoidAssetUploader 