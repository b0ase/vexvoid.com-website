'use client'

import Image from 'next/image'

const conceptArtImages = [
  'download.jpg',
  'download-1.jpg',
  'download-2.jpg',
  'download-3.jpg',
  'download-4.jpg',
  'download-5.jpg',
  'download-6.jpg',
  'download-7.jpg',
  'download-8.jpg',
  'download-9.jpg',
]

export default function ConceptArtGallery() {
  return (
    <section id="visual" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">VISUAL CONCEPTS</h2>
          <div className="w-24 h-px bg-cyber-white mx-auto mb-8"></div>
          <p className="text-center text-cyber-accent max-w-2xl mx-auto leading-relaxed">
            Exploring the evolving visual language of Vex Void through digital art and experimental imagery.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {conceptArtImages.map((img, idx) => (
            <div key={img} className="cyber-card overflow-hidden group cursor-pointer relative">
              <Image
                src={`/images/VexVoid_concept_art/${img}`}
                alt={`Vex Void concept art ${idx + 1}`}
                width={600}
                height={600}
                className="object-cover w-full h-64 filter grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-cyber-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 