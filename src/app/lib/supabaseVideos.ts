// Centralized Supabase video configuration for V3XV0ID video content
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgotvvrslolholxgcivz.supabase.co'
const VIDEOS_BUCKET = 'v3xv0id-videos'

export interface CloudVideo {
  url: string
  filename: string
  directory: string
  bucket: string
  type: 'train' | 'environment' | 'generated' | 'atmospheric'
}

// Helper function to get Supabase video URL
export const getSupabaseVideoUrl = (bucket: string, path: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

// Helper function to get video URL from vex_video_jam_01 collection
export const getVideoUrl = (filename: string): string => {
  return getSupabaseVideoUrl(VIDEOS_BUCKET, `vex_video_jam_01/${filename}`)
}

// V3X Video Jam 01 Videos (train atmosphere and urban scenes)
export const getVideoJamVideos = (): CloudVideo[] => {
  const videos: CloudVideo[] = []
  
  // Train sequences
  const trainVideos = [
    'A_train_rushes_past_while_urban_.mp4',
    'A_train_rushes_past_while_urban_ (1).mp4',
    'A_train_rushes_past_while_urban_ (2).mp4',
    'A_train_rushes_past_while_urban_ (3).mp4',
    'A_train_rushes_past_while_urban_ (4).mp4',
    'A_train_rushes_past_while_urban_ (5).mp4',
    'A_train_rushes_past_while_urban_ (6).mp4',
    'A_train_rushes_past_while_urban_ (7).mp4'
  ]
  
  trainVideos.forEach(filename => {
    videos.push({
      url: getVideoUrl(filename),
      filename,
      directory: 'vex_video_jam_01',
      bucket: VIDEOS_BUCKET,
      type: 'train'
    })
  })
  
  // Atmospheric videos
  const atmosphericVideos = [
    'Heavy_rain_pelts_the_ground__str.mp4',
    'Footsteps_echo_on_the_graffitied.mp4'
  ]
  
  atmosphericVideos.forEach(filename => {
    videos.push({
      url: getVideoUrl(filename),
      filename,
      directory: 'vex_video_jam_01',
      bucket: VIDEOS_BUCKET,
      type: 'atmospheric'
    })
  })
  
  // Environment videos
  const environmentVideos = [
    'Extended_Video.mp4'
  ]
  
  environmentVideos.forEach(filename => {
    videos.push({
      url: getVideoUrl(filename),
      filename,
      directory: 'vex_video_jam_01',
      bucket: VIDEOS_BUCKET,
      type: 'environment'
    })
  })
  
  // Professional generated videos
  const professionalVideos = [
    'Professional_Mode_Generated_Video.mp4',
    'Professional_Mode_Generated_Video (1).mp4',
    'Professional_Mode_Generated_Video (2).mp4',
    'Professional_Mode_Generated_Video (3).mp4',
    'Professional_Mode_Generated_Video (4).mp4',
    'Professional_Mode_Generated_Video (5).mp4',
    'Professional_Mode_Generated_Video (6).mp4',
    'Professional_Mode_Generated_Video (7).mp4',
    'Professional_Mode_Generated_Video (8).mp4',
    'Professional_Mode_Generated_Video (9).mp4',
    'Professional_Mode_Generated_Video (10).mp4',
    'Professional_Mode_Generated_Video (11).mp4',
    'Professional_Mode_Generated_Video (12).mp4',
    'Professional_Mode_Generated_Video (13).mp4',
    'Professional_Mode_Generated_Video (14).mp4',
    'Professional_Mode_Generated_Video (15).mp4',
    'Professional_Mode_Generated_Video (16).mp4'
  ]
  
  professionalVideos.forEach(filename => {
    videos.push({
      url: getVideoUrl(filename),
      filename,
      directory: 'vex_video_jam_01',
      bucket: VIDEOS_BUCKET,
      type: 'generated'
    })
  })
  
  // Standard generated videos
  const standardVideos = [
    'Standard_Mode_Generated_Video.mp4',
    'Standard_Mode_Generated_Video (1).mp4',
    'Standard_Mode_Generated_Video (2).mp4',
    'Standard_Mode_Generated_Video (3).mp4',
    'Standard_Mode_Generated_Video (4).mp4',
    'Standard_Mode_Generated_Video (5).mp4',
    'Standard_Mode_Generated_Video (6).mp4',
    'Standard_Mode_Generated_Video (7).mp4'
  ]
  
  standardVideos.forEach(filename => {
    videos.push({
      url: getVideoUrl(filename),
      filename,
      directory: 'vex_video_jam_01',
      bucket: VIDEOS_BUCKET,
      type: 'generated'
    })
  })
  
  return videos
}

// Get videos by type
export const getVideosByType = (type: CloudVideo['type']): CloudVideo[] => {
  return getVideoJamVideos().filter(video => video.type === type)
}

// Get all cloud videos
export const getAllCloudVideos = (): CloudVideo[] => {
  return getVideoJamVideos()
}

// Get random videos
export const getRandomVideos = (count: number, type?: CloudVideo['type']): CloudVideo[] => {
  const videos = type ? getVideosByType(type) : getAllCloudVideos()
  const shuffled = [...videos].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get curated video selection for different moods
export const getCuratedVideoSelection = (mood: 'urban' | 'atmospheric' | 'dynamic' | 'mixed'): CloudVideo[] => {
  switch (mood) {
    case 'urban':
      return [
        ...getVideosByType('train').slice(0, 4),
        ...getVideosByType('environment').slice(0, 2)
      ]
    case 'atmospheric':
      return [
        ...getVideosByType('atmospheric'),
        ...getVideosByType('generated').slice(0, 3)
      ]
    case 'dynamic':
      return [
        ...getVideosByType('train').slice(0, 3),
        ...getVideosByType('generated').slice(0, 4)
      ]
    case 'mixed':
    default:
      return [
        ...getVideosByType('train').slice(0, 2),
        ...getVideosByType('atmospheric').slice(0, 1),
        ...getVideosByType('generated').slice(0, 3),
        ...getVideosByType('environment').slice(0, 1)
      ]
  }
} 