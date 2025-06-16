// Centralized image configuration for V3XV0ID visual content
export interface ConceptArtImage {
  path: string
  filename: string
  directory: 'VexVoid_concept_art' | 'VexVoid_concept_art_2' | 'VexVoid_concept_art_3'
}

export interface StreetArtImage {
  path: string
  filename: string
  directory: 'VexVoid_graf_train_jam'
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

// Street art / graffiti / train jam images (78 images)
export const streetArtImages: StreetArtImage[] = [
  // Download series
  { path: '/images/VexVoid_graf_train_jam/download.jpg', filename: 'download.jpg', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/download-1.jpg', filename: 'download-1.jpg', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/download-2.jpg', filename: 'download-2.jpg', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/download-3.jpg', filename: 'download-3.jpg', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/download-4.jpg', filename: 'download-4.jpg', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/download-5.jpg', filename: 'download-5.jpg', directory: 'VexVoid_graf_train_jam' },
  
  // iPhone photos (IMG series)
  { path: '/images/VexVoid_graf_train_jam/IMG_5420 2.JPG', filename: 'IMG_5420 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5421 2.JPG', filename: 'IMG_5421 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5422 2.JPG', filename: 'IMG_5422 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5424 2.JPG', filename: 'IMG_5424 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5425 2.JPG', filename: 'IMG_5425 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5426 2.JPG', filename: 'IMG_5426 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5427 2.JPG', filename: 'IMG_5427 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5428 2.JPG', filename: 'IMG_5428 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5429 2.JPG', filename: 'IMG_5429 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5430 2.JPG', filename: 'IMG_5430 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5431 2.JPG', filename: 'IMG_5431 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5432 2.JPG', filename: 'IMG_5432 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5433 2.JPG', filename: 'IMG_5433 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5434 2.JPG', filename: 'IMG_5434 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5435 2.JPG', filename: 'IMG_5435 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5436 2.JPG', filename: 'IMG_5436 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5437 2.JPG', filename: 'IMG_5437 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5438 2.JPG', filename: 'IMG_5438 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5439 2.JPG', filename: 'IMG_5439 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5440 2.JPG', filename: 'IMG_5440 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5442 2.JPG', filename: 'IMG_5442 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5443 2.JPG', filename: 'IMG_5443 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5444 2.JPG', filename: 'IMG_5444 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5445 2.JPG', filename: 'IMG_5445 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5446 2.JPG', filename: 'IMG_5446 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5447 2.JPG', filename: 'IMG_5447 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5448 2.JPG', filename: 'IMG_5448 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5450 2.JPG', filename: 'IMG_5450 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5451 2.JPG', filename: 'IMG_5451 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5452 2.JPG', filename: 'IMG_5452 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5453 2.JPG', filename: 'IMG_5453 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5454 3.JPG', filename: 'IMG_5454 3.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5454 4.JPG', filename: 'IMG_5454 4.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5455 2.JPG', filename: 'IMG_5455 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5456 2.JPG', filename: 'IMG_5456 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5457 2.JPG', filename: 'IMG_5457 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5458 2.JPG', filename: 'IMG_5458 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5459 2.JPG', filename: 'IMG_5459 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5460 2.JPG', filename: 'IMG_5460 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5461 2.JPG', filename: 'IMG_5461 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5463 2.JPG', filename: 'IMG_5463 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5464 2.JPG', filename: 'IMG_5464 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5465 2.JPG', filename: 'IMG_5465 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5466 2.JPG', filename: 'IMG_5466 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5467 2.JPG', filename: 'IMG_5467 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5468 2.JPG', filename: 'IMG_5468 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5469 2.JPG', filename: 'IMG_5469 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5470 2.JPG', filename: 'IMG_5470 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5471 2.JPG', filename: 'IMG_5471 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5472 2.JPG', filename: 'IMG_5472 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5473 2.JPG', filename: 'IMG_5473 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5474 2.JPG', filename: 'IMG_5474 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5475 2.JPG', filename: 'IMG_5475 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5476 2.JPG', filename: 'IMG_5476 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5477 2.JPG', filename: 'IMG_5477 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5478 2.JPG', filename: 'IMG_5478 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5479 2.JPG', filename: 'IMG_5479 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5480 2.JPG', filename: 'IMG_5480 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5481 2.JPG', filename: 'IMG_5481 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5482 3.JPG', filename: 'IMG_5482 3.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5482 4.JPG', filename: 'IMG_5482 4.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5484 2.JPG', filename: 'IMG_5484 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5485 2.JPG', filename: 'IMG_5485 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5486 2.JPG', filename: 'IMG_5486 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5487 2.JPG', filename: 'IMG_5487 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5488 2.JPG', filename: 'IMG_5488 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5489 2.JPG', filename: 'IMG_5489 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5490 2.JPG', filename: 'IMG_5490 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5491 2.JPG', filename: 'IMG_5491 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5492 2.JPG', filename: 'IMG_5492 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5493 2.JPG', filename: 'IMG_5493 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5494 2.JPG', filename: 'IMG_5494 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5495 2.JPG', filename: 'IMG_5495 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5496 2.JPG', filename: 'IMG_5496 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5497 2.JPG', filename: 'IMG_5497 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5498 2.JPG', filename: 'IMG_5498 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5499 2.JPG', filename: 'IMG_5499 2.JPG', directory: 'VexVoid_graf_train_jam' },
  { path: '/images/VexVoid_graf_train_jam/IMG_5500 2.JPG', filename: 'IMG_5500 2.JPG', directory: 'VexVoid_graf_train_jam' },
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

// Portrait images (5 images)
export const portraitImages: PortraitImage[] = [
  { path: '/images/VexVoid_Portrait/download-6.jpg', filename: 'download-6.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-7.jpg', filename: 'download-7.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-8.jpg', filename: 'download-8.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-9.jpg', filename: 'download-9.jpg', directory: 'VexVoid_Portrait' },
  { path: '/images/VexVoid_Portrait/download-10.jpg', filename: 'download-10.jpg', directory: 'VexVoid_Portrait' },
]

// Combined collections for easy access
export const allImages = [...conceptArtImages, ...streetArtImages, ...landscapeImages, ...portraitImages]

// Helper functions
export const getRandomImages = (count: number): ConceptArtImage[] => {
  const shuffled = [...conceptArtImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomStreetArt = (count: number): StreetArtImage[] => {
  const shuffled = [...streetArtImages].sort(() => 0.5 - Math.random())
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

export const getAllImagePaths = (): string[] => {
  return allImages.map(img => img.path)
}

export const getImageForBackground = (index: number): string => {
  return allImages[index % allImages.length].path
}

// Collection counts
export const totalImageCount = conceptArtImages.length
export const streetArtCount = streetArtImages.length
export const landscapeCount = landscapeImages.length
export const portraitCount = portraitImages.length
export const totalAllImages = allImages.length 