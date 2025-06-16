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
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-mono mb-4 text-center neon-text">Vex Void Concept Art</h2>
        <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
          Explore the evolving visual world of Vex Void. These concept artworks capture the cyberpunk, digital, and experimental spirit of the project.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {conceptArtImages.map((img, idx) => (
            <div key={img} className="rounded-lg overflow-hidden shadow-lg bg-darker-bg">
              <Image
                src={`/images/VexVoid_concept_art/${img}`}
                alt={`Vex Void concept art ${idx + 1}`}
                width={600}
                height={600}
                className="object-cover w-full h-72 hover:scale-105 transition-transform duration-300"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 