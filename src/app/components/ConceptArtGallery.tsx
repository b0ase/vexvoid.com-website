'use client'

import { conceptArtImages, totalImageCount } from '../lib/images'

export default function ConceptArtGallery() {
  return (
    <section id="visual" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">VISUAL CONCEPTS</h2>
          <div className="w-24 h-px bg-cyber-white mx-auto mb-8"></div>
          <p className="text-center text-cyber-accent max-w-2xl mx-auto leading-relaxed">
            Exploring the evolving visual language of V3XV0ID through digital art and experimental imagery.
            <span className="block text-xs mt-2 opacity-70">
              {totalImageCount} concept art pieces across multiple collections
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {conceptArtImages.map((img, idx) => (
            <div key={img.path} className="cyber-card overflow-hidden group cursor-pointer relative">
              <img
                src={img.path}
                alt={`V3XV0ID concept art ${idx + 1} from ${img.directory}`}
                className="object-cover w-full h-64 filter grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                loading={idx < 10 ? "eager" : "lazy"}
                onError={(e) => {
                  console.error('Image failed to load:', img.path)
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-cyber-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 text-[8px] text-white/60 lo-fi-text opacity-0 group-hover:opacity-100 transition-opacity">
                {img.directory.replace('VexVoid_concept_art', 'SET')} #{img.filename.replace('download', '').replace('.jpg', '') || '1'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Collection Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="cyber-card p-4">
              <div className="text-2xl font-mono cyber-text">8</div>
              <div className="text-xs text-cyber-accent lo-fi-text">SET 1 IMAGES</div>
            </div>
            <div className="cyber-card p-4">
              <div className="text-2xl font-mono cyber-text">9</div>
              <div className="text-xs text-cyber-accent lo-fi-text">SET 2 IMAGES</div>
            </div>
            <div className="cyber-card p-4">
              <div className="text-2xl font-mono cyber-text">18</div>
              <div className="text-xs text-cyber-accent lo-fi-text">SET 3 IMAGES</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 