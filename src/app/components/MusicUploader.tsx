'use client'

import { useState, useEffect } from 'react'
import { uploadMusicFile, checkUploadedFiles, getMusicUrl } from '../lib/supabase'
import { musicFilesToUpload } from '../lib/musicUploader'

interface UploadStatus {
  filename: string
  uploaded: boolean
  uploading: boolean
  error?: string
  supabaseUrl?: string
}

export default function MusicUploader() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const uploadedFiles = await checkUploadedFiles()
      const status: UploadStatus[] = musicFilesToUpload.map(filename => ({
        filename,
        uploaded: uploadedFiles.includes(filename),
        uploading: false,
        supabaseUrl: uploadedFiles.includes(filename) ? getMusicUrl(filename) : undefined
      }))
      setUploadStatus(status)
    } catch (error) {
      console.error('Error checking upload status:', error)
    }
  }

  const uploadSingleFile = async (filename: string) => {
    try {
      // Fetch the file from the public directory
      const response = await fetch(`/music/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const file = new File([blob], filename, { type: 'audio/mpeg' })
      
      // Update status to uploading
      setUploadStatus(prev => prev.map(item =>
        item.filename === filename 
          ? { ...item, uploading: true, error: undefined }
          : item
      ))
      
      // Upload to Supabase
      await uploadMusicFile(file, filename)
      
      // Update status to uploaded
      setUploadStatus(prev => prev.map(item =>
        item.filename === filename 
          ? { ...item, uploading: false, uploaded: true, supabaseUrl: getMusicUrl(filename) }
          : item
      ))
      
    } catch (error) {
      console.error(`Error uploading ${filename}:`, error)
      setUploadStatus(prev => prev.map(item =>
        item.filename === filename 
          ? { ...item, uploading: false, error: error instanceof Error ? error.message : 'Upload failed' }
          : item
      ))
    }
  }

  const uploadAllFiles = async () => {
    setIsUploading(true)
    
    for (const item of uploadStatus) {
      if (!item.uploaded && !item.uploading) {
        await uploadSingleFile(item.filename)
      }
    }
    
    setIsUploading(false)
    await checkStatus()
  }

  const totalFiles = uploadStatus.length
  const uploadedFiles = uploadStatus.filter(item => item.uploaded).length
  const pendingFiles = totalFiles - uploadedFiles

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="bg-black/70 p-4 border border-white/20">
        <p className="text-sm text-white/70 mb-2 lo-fi-text">
          <strong>Status:</strong> {uploadedFiles} of {totalFiles} files uploaded
        </p>
        {pendingFiles > 0 && (
          <button
            onClick={uploadAllFiles}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 text-sm lo-fi-text transition-colors"
          >
            {isUploading ? 'Uploading...' : `Upload ${pendingFiles} Remaining Files`}
          </button>
        )}
        {pendingFiles === 0 && (
          <div className="text-green-400 text-sm lo-fi-text">
            ✅ All music files uploaded successfully!
          </div>
        )}
      </div>

      {/* File List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {uploadStatus.map((item, index) => (
          <div
            key={index}
            className={`p-3 border text-sm lo-fi-text ${
              item.uploaded 
                ? 'border-green-600/50 bg-green-600/10' 
                : item.error 
                  ? 'border-red-600/50 bg-red-600/10'
                  : item.uploading
                    ? 'border-yellow-600/50 bg-yellow-600/10'
                    : 'border-white/20 bg-black/30'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">{item.filename}</p>
                {item.error && (
                  <p className="text-red-400 text-xs mt-1">{item.error}</p>
                )}
                {item.supabaseUrl && (
                  <p className="text-green-400 text-xs mt-1">
                    ✅ Available in Supabase Storage
                  </p>
                )}
              </div>
              <div className="ml-4">
                {item.uploading && <span className="text-yellow-400">⏳</span>}
                {item.uploaded && <span className="text-green-400">✅</span>}
                {item.error && (
                  <button
                    onClick={() => uploadSingleFile(item.filename)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Retry
                  </button>
                )}
                {!item.uploaded && !item.uploading && !item.error && (
                  <button
                    onClick={() => uploadSingleFile(item.filename)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-600/30 p-3 text-xs text-blue-200 lo-fi-text">
        <h4 className="font-bold mb-1">What this does:</h4>
        <ul className="space-y-1 text-blue-300/80">
          <li>• Uploads music files from `/public/music/` to Supabase Storage</li>
          <li>• Makes them publicly accessible via CDN URLs</li>
          <li>• Ensures music works when site is deployed</li>
        </ul>
      </div>
    </div>
  )
} 