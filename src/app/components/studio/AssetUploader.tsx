'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UploadProgress {
  filename: string
  status: 'pending' | 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
}

export default function AssetUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [totalProgress, setTotalProgress] = useState(0)
  const supabase = createClientComponentClient()

  // Asset collections to upload
  const assetCollections = [
    {
      name: 'VexVoid Concept Art',
      path: '/images/VexVoid_concept_art',
      bucket: 'images',
      folder: 'concept_art'
    },
    {
      name: 'VexVoid Concept Art 2',
      path: '/images/VexVoid_concept_art_2',
      bucket: 'images',
      folder: 'concept_art_2'
    },
    {
      name: 'VexVoid Concept Art 3',
      path: '/images/VexVoid_concept_art_3',
      bucket: 'images',
      folder: 'concept_art_3'
    },
    {
      name: 'VexVoid Landscapes',
      path: '/images/VexVoid_Landscape',
      bucket: 'images',
      folder: 'landscapes'
    },
    {
      name: 'VexVoid Portraits',
      path: '/images/VexVoid_Portrait',
      bucket: 'images',
      folder: 'portraits'
    },
    {
      name: 'VexVoid Graffiti Train Jam',
      path: '/images/VexVoid_graf_train_jam',
      bucket: 'images',
      folder: 'graffiti_train'
    },
    {
      name: 'V3X Video Jam 01 Images',
      path: '/images/v3x_vide0_Jam_01',
      bucket: 'images',
      folder: 'video_jam_01'
    },
    {
      name: 'V3X Video Jam 01 Videos',
      path: '/videos/vex_video_jam_01',
      bucket: 'videos',
      folder: 'video_jam_01'
    }
  ]

  const uploadAssetCollection = async (collection: any) => {
    try {
      // This would need to be implemented server-side
      // as we can't directly access the file system from the browser
      const response = await fetch('/api/assets/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collection.name,
          localPath: collection.path,
          bucket: collection.bucket,
          folder: collection.folder
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to upload ${collection.name}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  const startUpload = async () => {
    setIsUploading(true)
    setUploadProgress([])
    setTotalProgress(0)

    const progress: UploadProgress[] = assetCollections.map(collection => ({
      filename: collection.name,
      status: 'pending',
      progress: 0
    }))
    setUploadProgress(progress)

    let completed = 0
    for (let i = 0; i < assetCollections.length; i++) {
      const collection = assetCollections[i]
      
      // Update status to uploading
      setUploadProgress(prev => prev.map((item, index) => 
        index === i ? { ...item, status: 'uploading' } : item
      ))

      try {
        await uploadAssetCollection(collection)
        
        // Update status to complete
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, status: 'complete', progress: 100 } : item
        ))
        
        completed++
        setTotalProgress((completed / assetCollections.length) * 100)
        
      } catch (error) {
        // Update status to error
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed'
          } : item
        ))
      }
    }

    setIsUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/50 border border-white/20 p-6">
        <h3 className="text-lg font-bold lo-fi-text mb-4">📦 Asset Upload Manager</h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-bold lo-fi-text mb-3">Asset Collections Ready for Upload:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {assetCollections.map((collection, index) => (
              <div key={index} className="border border-white/20 p-3">
                <div className="font-bold text-white">{collection.name}</div>
                <div className="text-white/70">→ {collection.bucket}/{collection.folder}</div>
                <div className="text-white/50">{collection.path}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold lo-fi-text mb-3">Upload Progress:</h4>
            <div className="space-y-2">
              {uploadProgress.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'complete' ? 'bg-green-500' :
                    item.status === 'uploading' ? 'bg-yellow-500 animate-pulse' :
                    item.status === 'error' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-white text-xs lo-fi-text">{item.filename}</div>
                    {item.error && (
                      <div className="text-red-400 text-xs">{item.error}</div>
                    )}
                  </div>
                  <div className="text-white/70 text-xs">{item.progress}%</div>
                </div>
              ))}
            </div>
            
            {/* Total Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Total Progress</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2">
                <div 
                  className="bg-cyan-400 h-2 transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={startUpload}
          disabled={isUploading}
          className={`w-full py-3 px-4 lo-fi-text font-bold transition-colors ${
            isUploading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
        >
          {isUploading ? 'UPLOADING ASSETS...' : '🚀 UPLOAD ALL ASSETS TO SUPABASE'}
        </button>

        {/* Info */}
        <div className="mt-4 text-xs text-white/70">
          <p>This will upload all images and videos to Supabase Storage buckets.</p>
          <p>Total estimated size: ~300MB (31 images + 33 videos)</p>
        </div>
      </div>

      {/* Asset Statistics */}
      <div className="bg-black/50 border border-white/20 p-6">
        <h3 className="text-lg font-bold lo-fi-text mb-4">📊 Asset Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="border border-white/20 p-3">
            <div className="text-lg lo-fi-text">31</div>
            <div className="text-xs text-white/70">New Images</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-lg lo-fi-text">33</div>
            <div className="text-xs text-white/70">Video Clips</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-lg lo-fi-text">~250MB</div>
            <div className="text-xs text-white/70">Video Content</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="text-lg lo-fi-text">8</div>
            <div className="text-xs text-white/70">Collections</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-white/70 space-y-1">
          <p>• Professional Mode Videos: 17 clips (6-15MB each)</p>
          <p>• Standard Mode Videos: 8 clips (1-7MB each)</p>
          <p>• Train/Urban Atmosphere: 8 clips with audio</p>
          <p>• V3X Video Jam Images: 31 concept images</p>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-black/50 border border-yellow-500/20 p-6">
        <h3 className="text-lg font-bold lo-fi-text mb-4 text-yellow-400">💡 Video Composition Ideas</h3>
        
        <div className="text-yellow-300 text-sm space-y-3">
          <div>
            <strong>🎬 Layered Composition:</strong>
            <p className="text-xs text-yellow-200 mt-1">
              Use Professional Mode videos as base layer, overlay concept art, add particle effects
            </p>
          </div>
          
          <div>
            <strong>🎵 Audio-Visual Sync:</strong>
            <p className="text-xs text-yellow-200 mt-1">
              Match video clip tempo to music BPM, use train sounds as atmospheric interludes
            </p>
          </div>
          
          <div>
            <strong>🎨 Style Mixing:</strong>
            <p className="text-xs text-yellow-200 mt-1">
              Blend graffiti train footage with landscapes, superimpose portraits for dramatic effect
            </p>
          </div>
          
          <div>
            <strong>⚡ Dynamic Editing:</strong>
            <p className="text-xs text-yellow-200 mt-1">
              Quick cuts between Standard/Professional modes, glitch transitions, color grading
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 