// Cloud-based image configuration for V3XV0ID visual content
// All images are now stored in Supabase buckets instead of local files

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgotvvrslolholxgcivz.supabase.co'
const IMAGES_BUCKET = 'images'

export interface CloudImage {
  url: string
  filename: string
  directory: string
  bucket: string
}

// Helper function to get Supabase image URL
export const getSupabaseImageUrl = (bucket: string, path: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

// Concept Art Images (stored in Supabase images bucket)
export const getConceptArtImages = (): CloudImage[] => {
  const directories = ['VexVoid_concept_art', 'VexVoid_concept_art_2', 'VexVoid_concept_art_3']
  const images: CloudImage[] = []
  
  // VexVoid_concept_art (8 images)
  const conceptArt1 = [
    'download.jpg', 'download-1.jpg', 'download-2.jpg', 'download-3.jpg',
    'download-4.jpg', 'download-6.jpg', 'download-7.jpg', 'download-8.jpg'
  ]
  
  conceptArt1.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_concept_art/${filename}`),
      filename,
      directory: 'VexVoid_concept_art',
      bucket: IMAGES_BUCKET
    })
  })
  
  // VexVoid_concept_art_2 (9 images)
  const conceptArt2 = [
    'download.jpg', 'download-1.jpg', 'download-2.jpg', 'download-3.jpg',
    'download-4.jpg', 'download-5.jpg', 'download-6.jpg', 'download-7.jpg', 'download-9.jpg'
  ]
  
  conceptArt2.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_concept_art_2/${filename}`),
      filename,
      directory: 'VexVoid_concept_art_2',
      bucket: IMAGES_BUCKET
    })
  })
  
  // VexVoid_concept_art_3 (18 images)
  const conceptArt3 = [
    'download.jpg', 'download-1.jpg', 'download-2.jpg', 'download-3.jpg',
    'download-4.jpg', 'download-5.jpg', 'download-6.jpg', 'download-7.jpg',
    'download-8.jpg', 'download-9.jpg', 'download-10.jpg', 'download-11.jpg',
    'download-12.jpg', 'download-13.jpg', 'download-14.jpg', 'download-15.jpg',
    'download-16.jpg', 'download-17.jpg'
  ]
  
  conceptArt3.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_concept_art_3/${filename}`),
      filename,
      directory: 'VexVoid_concept_art_3',
      bucket: IMAGES_BUCKET
    })
  })
  
  return images
}

// Street Art Images (graffiti train jam - 68 images)
export const getStreetArtImages = (): CloudImage[] => {
  const images: CloudImage[] = []
  
  // Download series
  const downloadFiles = ['download-2.jpg', 'download-3.jpg', 'download-4.jpg', 'download-5.jpg']
  downloadFiles.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_graf_train_jam/${filename}`),
      filename,
      directory: 'VexVoid_graf_train_jam',
      bucket: IMAGES_BUCKET
    })
  })
  
  // IMG series (64 images)
  const imgFiles = [
    'IMG_5420 2.JPG', 'IMG_5421 2.JPG', 'IMG_5422 2.JPG', 'IMG_5424 2.JPG',
    'IMG_5425 2.JPG', 'IMG_5426 2.JPG', 'IMG_5427 2.JPG', 'IMG_5428 2.JPG',
    'IMG_5429 2.JPG', 'IMG_5430 2.JPG', 'IMG_5431 2.JPG', 'IMG_5432 2.JPG',
    'IMG_5433 2.JPG', 'IMG_5434 2.JPG', 'IMG_5435 2.JPG', 'IMG_5436 2.JPG',
    'IMG_5437 2.JPG', 'IMG_5438 2.JPG', 'IMG_5439 2.JPG', 'IMG_5440 2.JPG',
    'IMG_5442 2.JPG', 'IMG_5443 2.JPG', 'IMG_5444 2.JPG', 'IMG_5446 2.JPG',
    'IMG_5447 2.JPG', 'IMG_5450 2.JPG', 'IMG_5451 2.JPG', 'IMG_5453 2.JPG',
    'IMG_5454 3.JPG', 'IMG_5454 4.JPG', 'IMG_5456 2.JPG', 'IMG_5457 2.JPG',
    'IMG_5458 2.JPG', 'IMG_5460 2.JPG', 'IMG_5461 2.JPG', 'IMG_5463 2.JPG',
    'IMG_5464 2.JPG', 'IMG_5465 2.JPG', 'IMG_5466 2.JPG', 'IMG_5468 2.JPG',
    'IMG_5469 2.JPG', 'IMG_5470 2.JPG', 'IMG_5471 2.JPG', 'IMG_5472 2.JPG',
    'IMG_5473 2.JPG', 'IMG_5474 2.JPG', 'IMG_5475 2.JPG', 'IMG_5476 2.JPG',
    'IMG_5477 2.JPG', 'IMG_5478 2.JPG', 'IMG_5479 2.JPG', 'IMG_5480 2.JPG',
    'IMG_5481 2.JPG', 'IMG_5482 3.JPG', 'IMG_5482 4.JPG', 'IMG_5484 2.JPG',
    'IMG_5485 2.JPG', 'IMG_5486 2.JPG', 'IMG_5487 2.JPG', 'IMG_5488 2.JPG',
    'IMG_5489 2.JPG', 'IMG_5490 2.JPG', 'IMG_5491 2.JPG', 'IMG_5492 2.JPG',
    'IMG_5493 2.JPG', 'IMG_5494 2.JPG', 'IMG_5495 2.JPG', 'IMG_5496 2.JPG',
    'IMG_5497 2.JPG', 'IMG_5498 2.JPG', 'IMG_5499 2.JPG', 'IMG_5500 2.JPG'
  ]
  
  imgFiles.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_graf_train_jam/${filename}`),
      filename,
      directory: 'VexVoid_graf_train_jam',
      bucket: IMAGES_BUCKET
    })
  })
  
  return images
}

// Video Jam Images (31 images)
export const getVideoJamImages = (): CloudImage[] => {
  const images: CloudImage[] = []
  const filenames = [
    'download.jpg', 'download-1.jpg', 'download-2.jpg', 'download-3.jpg',
    'download-4.jpg', 'download-5.jpg', 'download-6.jpg', 'download-7.jpg',
    'download-8.jpg', 'download-9.jpg', 'download-10.jpg', 'download-11.jpg',
    'download-12.jpg', 'download-13.jpg', 'download-14.jpg', 'download-15.jpg',
    'download-16.jpg', 'download-17.jpg', 'download-18.jpg', 'download-19.jpg',
    'download-20.jpg', 'download-21.jpg', 'download-22.jpg', 'download-23.jpg',
    'download-24.jpg', 'download-25.jpg', 'download-26.jpg', 'download-27.jpg',
    'download-28.jpg', 'download-29.jpg', 'download-30.jpg'
  ]
  
  filenames.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `v3x_vide0_Jam_01/${filename}`),
      filename,
      directory: 'v3x_vide0_Jam_01',
      bucket: IMAGES_BUCKET
    })
  })
  
  return images
}

// Landscape Images (19 images)
export const getLandscapeImages = (): CloudImage[] => {
  const images: CloudImage[] = []
  const filenames = [
    'download.jpg', 'download-1.jpg', 'download-2.jpg', 'download-3.jpg',
    'download-4.jpg', 'download-5.jpg', 'download-6.jpg', 'download-7.jpg',
    'download-8.jpg', 'download-9.jpg', 'download-10.jpg', 'download-11.jpg',
    'download-12.jpg', 'download-13.jpg', 'download-14.jpg', 'download-15.jpg',
    'download-16.jpg', 'download-17.jpg', 'download-18.jpg'
  ]
  
  filenames.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_Landscape/${filename}`),
      filename,
      directory: 'VexVoid_Landscape',
      bucket: IMAGES_BUCKET
    })
  })
  
  return images
}

// Portrait Images (4 images)
export const getPortraitImages = (): CloudImage[] => {
  const images: CloudImage[] = []
  const filenames = ['download-6.jpg', 'download-7.jpg', 'download-9.jpg', 'download-10.jpg']
  
  filenames.forEach(filename => {
    images.push({
      url: getSupabaseImageUrl(IMAGES_BUCKET, `VexVoid_Portrait/${filename}`),
      filename,
      directory: 'VexVoid_Portrait',
      bucket: IMAGES_BUCKET
    })
  })
  
  return images
}

// Combined street art (graffiti + video jam)
export const getAllStreetArtImages = (): CloudImage[] => {
  return [...getStreetArtImages(), ...getVideoJamImages()]
}

// Utility functions
export const getRandomImages = (images: CloudImage[], count: number): CloudImage[] => {
  const shuffled = [...images].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomConceptArt = (count: number): CloudImage[] => {
  return getRandomImages(getConceptArtImages(), count)
}

export const getRandomStreetArt = (count: number): CloudImage[] => {
  return getRandomImages(getAllStreetArtImages(), count)
}

export const getRandomLandscapes = (count: number): CloudImage[] => {
  return getRandomImages(getLandscapeImages(), count)
}

export const getRandomPortraits = (count: number): CloudImage[] => {
  return getRandomImages(getPortraitImages(), count)
}

// Get all cloud images combined
export const getAllCloudImages = (): CloudImage[] => {
  return [
    ...getConceptArtImages(),
    ...getStreetArtImages(),
    ...getVideoJamImages(),
    ...getLandscapeImages(),
    ...getPortraitImages()
  ]
}

// Asset counts
export const conceptArtCount = 35  // 8 + 9 + 18
export const streetArtCount = 99   // 68 + 31 (graffiti + video jam)
export const landscapeCount = 19
export const portraitCount = 4
export const totalImageCount = conceptArtCount + streetArtCount + landscapeCount + portraitCount 