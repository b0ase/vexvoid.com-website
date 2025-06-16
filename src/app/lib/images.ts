// Centralized image configuration for V3XV0ID concept art
export interface ConceptArtImage {
  path: string
  filename: string
  directory: 'VexVoid_concept_art' | 'VexVoid_concept_art_2' | 'VexVoid_concept_art_3'
}

// All available concept art images (verified to exist)
export const conceptArtImages: ConceptArtImage[] = [
  // VexVoid_concept_art (8 images) - missing download-5.jpg
  { path: '/images/VexVoid_concept_art/download.jpg', filename: 'download.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-1.jpg', filename: 'download-1.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-2.jpg', filename: 'download-2.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-3.jpg', filename: 'download-3.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-4.jpg', filename: 'download-4.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_concept_art' },
  { path: '/images/VexVoid_concept_art/download-8.jpg', filename: 'download-8.jpg', directory: 'VexVoid_concept_art' },
  
  // VexVoid_concept_art_2 (9 images) - missing download-8.jpg
  { path: '/images/VexVoid_concept_art_2/download.jpg', filename: 'download.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-1.jpg', filename: 'download-1.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-2.jpg', filename: 'download-2.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-3.jpg', filename: 'download-3.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-4.jpg', filename: 'download-4.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-5.jpg', filename: 'download-5.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_concept_art_2' },
  { path: '/images/VexVoid_concept_art_2/download-9.jpg', filename: 'download-9.jpg', directory: 'VexVoid_concept_art_2' },
  
  // VexVoid_concept_art_3 (18 images)
  { path: '/images/VexVoid_concept_art_3/download.jpg', filename: 'download.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-1.jpg', filename: 'download-1.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-2.jpg', filename: 'download-2.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-3.jpg', filename: 'download-3.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-4.jpg', filename: 'download-4.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-5.jpg', filename: 'download-5.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-8.jpg', filename: 'download-8.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-9.jpg', filename: 'download-9.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-10.jpg', filename: 'download-10.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-11.jpg', filename: 'download-11.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-12.jpg', filename: 'download-12.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-13.jpg', filename: 'download-13.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-14.jpg', filename: 'download-14.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-15.jpg', filename: 'download-15.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-16.jpg', filename: 'download-16.jpg', directory: 'VexVoid_concept_art_3' },
  { path: '/images/VexVoid_concept_art_3/download-17.jpg', filename: 'download-17.jpg', directory: 'VexVoid_concept_art_3' },
]

// Helper functions
export const getAllImagePaths = (): string[] => conceptArtImages.map(img => img.path)

export const getImagesByDirectory = (directory: ConceptArtImage['directory']): ConceptArtImage[] => 
  conceptArtImages.filter(img => img.directory === directory)

export const getRandomImages = (count: number): ConceptArtImage[] => {
  const shuffled = [...conceptArtImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getImageForBackground = (index: number): string => {
  return conceptArtImages[index % conceptArtImages.length].path
}

// Total count: 35 images (verified)
export const totalImageCount = conceptArtImages.length 