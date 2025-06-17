'use client'

import { useState, useEffect } from 'react'
import { 
  getConceptArtImages,
  getAllStreetArtImages,
  getLandscapeImages,
  getPortraitImages
} from '../lib/supabaseImages'

type VisualCategory = 'concept' | 'street' | 'landscape' | 'portrait' | 'animated'

interface VisualTab {
  id: VisualCategory
  label: string
  description: string
  count: number
}

const visualTabs: VisualTab[] = [
  {
    id: 'concept',
    label: 'CONCEPT ART',
    description: 'Digital concept art exploring the V3XV0ID aesthetic',
    count: getConceptArtImages().length
  },
  {
    id: 'street',
    label: 'STREET ART',
    description: 'Graffiti, train jams, and urban exploration photography',
    count: getAllStreetArtImages().length
  },
  {
    id: 'landscape',
    label: 'LANDSCAPES',
    description: 'Atmospheric landscapes and environmental scenes',
    count: getLandscapeImages().length
  },
  {
    id: 'portrait',
    label: 'PORTRAITS',
    description: 'Character studies and portrait photography',
    count: getPortraitImages().length
  },
  {
    id: 'animated',
    label: 'ANIMATED PATTERNS',
    description: 'Geometric patterns and mathematical visualizations',
    count: 0 // Placeholder
  }
]

// Curated selections - pick diverse, representative images
const getCuratedConceptArt = () => {
  // Pick 12 diverse images from concept art
  return getConceptArtImages().slice(0, 12)
}

const getCuratedStreetArt = () => {
  // Mix of graffiti and street photos - pick every 8th to get variety
  return getAllStreetArtImages().filter((_: any, idx: number) => idx % 8 === 0 || idx < 6).slice(0, 16)
}

const getCuratedLandscapes = () => {
  // Pick 12 diverse landscapes
  return getLandscapeImages().slice(0, 12)
}

const getCuratedPortraits = () => {
  // All portraits since there are only 4
  return getPortraitImages()
}

export default function VisualGallery() {
  const [activeTab, setActiveTab] = useState<VisualCategory>('street')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const maxIndex = getCurrentCollection().length - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [activeTab])

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeTab])

  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'concept': return getCuratedConceptArt()
      case 'street': return getCuratedStreetArt()
      case 'landscape': return getCuratedLandscapes()
      case 'portrait': return getCuratedPortraits()
      default: return []
    }
  }

  const renderRotatingGallery = () => {
    const collection = getCurrentCollection()
    if (collection.length === 0) return null

    // Determine aspect ratio based on active tab
    const getAspectRatio = () => {
      switch (activeTab) {
        case 'portrait': return 'aspect-[3/4]' // Portrait aspect ratio
        case 'landscape': return 'aspect-video' // Landscape aspect ratio
        case 'street': return 'aspect-video' // Most street art is landscape
        default: return 'aspect-square' // Square for concept art
      }
    }

    return (
      <>
        {/* Main rotating display */}
        <div className="relative mb-12">
          <div className={`${getAspectRatio()} max-w-4xl mx-auto relative overflow-hidden cyber-card`}>
            {collection.map((img, idx) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${activeTab} ${idx + 1}`}
                  className="w-full h-full object-cover filter grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs lo-fi-text opacity-70">
                    {idx + 1} / {collection.length}
                  </div>
                  <div className="text-sm font-mono">
                    {activeTab.toUpperCase()} #{idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-6 gap-2">
            {collection.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'bg-cyber-white' 
                    : 'bg-cyber-gray hover:bg-cyber-accent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail grid - smaller selection */}
        <div className={`grid gap-4 max-w-4xl mx-auto ${
          activeTab === 'portrait' ? 'grid-cols-4 md:grid-cols-8' : 'grid-cols-3 md:grid-cols-6'
        }`}>
          {collection.map((img, idx) => (
            <button
              key={img.url}
              onClick={() => setCurrentImageIndex(idx)}
              className={`cyber-card overflow-hidden group cursor-pointer relative transition-all duration-300 ${
                activeTab === 'portrait' ? 'aspect-[3/4]' : 
                activeTab === 'landscape' ? 'aspect-video' :
                activeTab === 'street' ? 'aspect-video' : 'aspect-square'
              } ${idx === currentImageIndex ? 'ring-2 ring-cyber-white' : ''}`}
            >
              <img
                src={img.url}
                alt={`${activeTab} thumbnail ${idx + 1}`}
                className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-cyber-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Collection info */}
        <div className="mt-12 text-center">
          <div className="cyber-card p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-2xl font-mono cyber-text">{collection.length}</div>
                <div className="text-xs text-cyber-accent lo-fi-text">CURATED SELECTION</div>
              </div>
              <div>
                <div className="text-2xl font-mono cyber-text">
                  {activeTab === 'concept' ? getConceptArtImages().length :
                   activeTab === 'street' ? getAllStreetArtImages().length :
                   activeTab === 'landscape' ? getLandscapeImages().length :
                   activeTab === 'portrait' ? getPortraitImages().length : 0}
                </div>
                <div className="text-xs text-cyber-accent lo-fi-text">TOTAL COLLECTION</div>
              </div>
            </div>
            <div className="text-xs text-white/50 mt-4">
              Showing curated highlights • Auto-rotating every 4 seconds
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderPlaceholderContent = (category: VisualCategory) => (
    <div className="text-center py-24">
      <div className="cyber-card p-12 max-w-2xl mx-auto">
        <div className="w-16 h-16 border-2 border-dashed border-cyber-accent mx-auto mb-6 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyber-accent animate-pulse"></div>
        </div>
        <h3 className="text-xl font-mono cyber-text mb-4">COMING SOON</h3>
        <p className="text-cyber-accent leading-relaxed mb-6">
          {visualTabs.find(tab => tab.id === category)?.description}
        </p>
        <div className="text-xs text-white/50 lo-fi-text">
          This section will be populated with mathematical visualizations and geometric patterns
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'concept':
      case 'street':
      case 'landscape':
      case 'portrait':
        return renderRotatingGallery()
      default:
        return renderPlaceholderContent(activeTab)
    }
  }

  const activeTabData = visualTabs.find(tab => tab.id === activeTab)

  return (
    <section id="visual" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">VISUAL ARCHIVE</h2>
          <div className="w-24 h-px bg-cyber-white mx-auto mb-8"></div>
          <p className="text-center text-cyber-accent max-w-2xl mx-auto leading-relaxed">
            Exploring the evolving visual language of V3XV0ID through multiple mediums and artistic expressions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {visualTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-mono transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-cyber-white text-cyber-black'
                    : 'border border-cyber-gray text-cyber-accent hover:border-cyber-white hover:text-cyber-white'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 opacity-70">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Active Tab Description */}
          {activeTabData && (
            <div className="text-center">
              <p className="text-sm text-cyber-accent max-w-xl mx-auto">
                {activeTabData.description}
                {activeTabData.count > 0 && (
                  <span className="block text-xs mt-2 opacity-70">
                    {activeTabData.count} items in collection
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </section>
  )
} 