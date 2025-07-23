// Centralized image configuration for V3XV0ID visual content
export interface ConceptArtImage {
  path: string
  filename: string
  directory: 'VexVoid_concept_art' | 'VexVoid_concept_art_2' | 'VexVoid_concept_art_3'
}

export interface LandscapeImage {
  path: string
  filename: string
  directory: 'VexVoid_Landscape'
}

export interface PortraitImage {
  path: string
  filename: string
  directory: 'VexVoid_Portrait'
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

// Landscape images (19 images)
export const landscapeImages: LandscapeImage[] = [
  { path: '/images/VexVoid_Landscape/download.jpg', filename: 'download.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-1.jpg', filename: 'download-1.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-2.jpg', filename: 'download-2.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-3.jpg', filename: 'download-3.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-4.jpg', filename: 'download-4.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-5.jpg', filename: 'download-5.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-8.jpg', filename: 'download-8.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-9.jpg', filename: 'download-9.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-10.jpg', filename: 'download-10.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-11.jpg', filename: 'download-11.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-12.jpg', filename: 'download-12.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-13.jpg', filename: 'download-13.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-14.jpg', filename: 'download-14.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-15.jpg', filename: 'download-15.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-16.jpg', filename: 'download-16.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-17.jpg', filename: 'download-17.jpg', directory: 'VexVoid_Landscape' },
  { path: '/images/VexVoid_Landscape/download-18.jpg', filename: 'download-18.jpg', directory: 'VexVoid_Landscape' },
]

// Portrait images (4 images)
export const portraitImages: PortraitImage[] = [
  { path: '/images/VexVoid_Portrait/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-9.jpg', filename: 'download-9.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-10.jpg', filename: 'download-10.jpg', directory: 'VexVoid_Portrait' },
]

// Combined collections for easy access
export const allImages = [...conceptArtImages, ...landscapeImages, ...portraitImages]

// Helper functions
export const getRandomImages = (count: number): ConceptArtImage[] => {
  const shuffled = [...conceptArtImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomLandscapes = (count: number): LandscapeImage[] => {
  const shuffled = [...landscapeImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomPortraits = (count: number): PortraitImage[] => {
  const shuffled = [...portraitImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Count exports for gallery display
export const totalImageCount = conceptArtImages.length
export const landscapeCount = landscapeImages.length
export const portraitCount = portraitImages.length

// Get all image paths for backgrounds
export const getAllImagePaths = (): string[] => {
  return allImages.map(img => img.path)
}

export const getImageForBackground = (index: number): string => {
  const paths = getAllImagePaths()
  return paths[index % paths.length]
} 