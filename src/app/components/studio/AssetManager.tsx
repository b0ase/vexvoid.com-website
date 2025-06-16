'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { allImages, conceptArtImages, streetArtImages, landscapeImages, portraitImages } from '../../lib/images'

// Create a unified interface for the AssetManager
interface ImageAsset {
  id: string
  name: string
  path: string
  category: string
}

interface AssetManagerProps {}

export default function AssetManager({}: AssetManagerProps) {
  const [images, setImages] = useState<ImageAsset[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = () => {
    // Convert the existing image structure to our unified interface
    const convertedImages: ImageAsset[] = [
      ...conceptArtImages.map((img, index) => ({
        id: `concept-${index}`,
        name: img.filename,
        path: img.path,
        category: 'concept art'
      })),
      ...streetArtImages.map((img, index) => ({
        id: `street-${index}`,
        name: img.filename,
        path: img.path,
        category: 'street art'
      })),
      ...landscapeImages.map((img, index) => ({
        id: `landscape-${index}`,
        name: img.filename,
        path: img.path,
        category: 'landscapes'
      })),
      ...portraitImages.map((img, index) => ({
        id: `portrait-${index}`,
        name: img.filename,
        path: img.path,
        category: 'portraits'
      }))
    ]
    setImages(convertedImages)
  }

  const categories = Array.from(new Set(images.map(img => img.category)))
  
  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const selectAll = () => {
    setSelectedImages(filteredImages.map(img => img.id))
  }

  const clearSelection = () => {
    setSelectedImages([])
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Simulate upload progress
        const progress = ((i + 1) / files.length) * 100
        setUploadProgress(progress)
        
        // Here you would implement actual file upload to Supabase
        console.log(`Uploading ${file.name}...`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
      }
      
      // Refresh images after upload
      loadImages()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const exportSelectedImages = () => {
    const selected = images.filter(img => selectedImages.includes(img.id))
    const exportData = {
      timestamp: new Date().toISOString(),
      count: selected.length,
      images: selected.map(img => ({
        id: img.id,
        name: img.name,
        path: img.path,
        category: img.category
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `v3xv0id-assets-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text">{images.length}</div>
          <div className="text-xs text-white/70">TOTAL ASSETS</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text">{categories.length}</div>
          <div className="text-xs text-white/70">CATEGORIES</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text text-blue-400">{selectedImages.length}</div>
          <div className="text-xs text-white/70">SELECTED</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text text-green-400">{filteredImages.length}</div>
          <div className="text-xs text-white/70">FILTERED</div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="border border-white/20 p-4">
        <h3 className="text-sm lo-fi-text mb-3">📤 Upload New Assets</h3>
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="text-xs text-white/70">Uploading... {Math.round(uploadProgress)}%</div>
            <div className="w-full h-2 bg-black border border-white/20">
              <div 
                className="h-full bg-blue-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="text-xs text-white/70 file:bg-white file:text-black file:border-0 file:px-3 file:py-1 file:text-xs file:lo-fi-text"
            />
            <span className="text-xs text-white/50">Supports: JPG, PNG, GIF, WebP</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              selectedCategory === 'all'
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            ALL ({images.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
                selectedCategory === category
                  ? 'border-cyan-400 bg-cyan-400 text-black'
                  : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
              }`}
            >
              {category.toUpperCase()} ({images.filter(img => img.category === category).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* View Mode */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              viewMode === 'grid'
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            GRID
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              viewMode === 'list'
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            LIST
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      {selectedImages.length > 0 && (
        <div className="border border-blue-500/50 bg-blue-500/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm lo-fi-text text-blue-400">
              {selectedImages.length} assets selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={exportSelectedImages}
                className="px-3 py-1 text-xs lo-fi-text border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-colors"
              >
                EXPORT SELECTION
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <button
          onClick={selectAll}
          className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          SELECT ALL ({filteredImages.length})
        </button>
        <button
          onClick={clearSelection}
          className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          CLEAR SELECTION
        </button>
      </div>

      {/* Image Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`border cursor-pointer transition-colors ${
                selectedImages.includes(image.id)
                  ? 'border-blue-400 bg-blue-400/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => toggleImageSelection(image.id)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.path}
                  alt={image.name}
                  fill
                  className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                />
                {selectedImages.includes(image.id) && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-400 border border-white flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs lo-fi-text truncate">{image.name}</div>
                <div className="text-[10px] text-white/50">{image.category}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`border p-3 cursor-pointer transition-colors flex items-center gap-4 ${
                selectedImages.includes(image.id)
                  ? 'border-blue-400 bg-blue-400/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => toggleImageSelection(image.id)}
            >
              <div className="relative w-16 h-16">
                <Image
                  src={image.path}
                  alt={image.name}
                  fill
                  className="object-cover filter grayscale"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm lo-fi-text">{image.name}</div>
                <div className="text-xs text-white/70">{image.category}</div>
                <div className="text-xs text-white/50">{image.path}</div>
              </div>
              {selectedImages.includes(image.id) && (
                <div className="w-6 h-6 bg-blue-400 border border-white flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p className="text-sm lo-fi-text">No assets found matching your criteria</p>
        </div>
      )}
    </div>
  )
} 