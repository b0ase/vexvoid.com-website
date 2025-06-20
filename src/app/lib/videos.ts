// Centralized video configuration for V3XV0ID video content
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const getVideoUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/v3xv0id-videos/vex_video_jam_01/${filename}`

export interface VideoClip {
  path: string
  filename: string
  directory: 'vex_video_jam_01'
  type: 'train' | 'environment' | 'generated' | 'atmospheric'
}

// All available video clips from vex_video_jam_01
export const videoClips: VideoClip[] = [
  // Train sequences - urban movement
  { path: getVideoUrl('A_train_rushes_past_while_urban_.mp4'), filename: 'A_train_rushes_past_while_urban_.mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (1).mp4'), filename: 'A_train_rushes_past_while_urban_ (1).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (2).mp4'), filename: 'A_train_rushes_past_while_urban_ (2).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (3).mp4'), filename: 'A_train_rushes_past_while_urban_ (3).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (4).mp4'), filename: 'A_train_rushes_past_while_urban_ (4).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (5).mp4'), filename: 'A_train_rushes_past_while_urban_ (5).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (6).mp4'), filename: 'A_train_rushes_past_while_urban_ (6).mp4', directory: 'vex_video_jam_01', type: 'train' },
  { path: getVideoUrl('A_train_rushes_past_while_urban_ (7).mp4'), filename: 'A_train_rushes_past_while_urban_ (7).mp4', directory: 'vex_video_jam_01', type: 'train' },
  
  // Atmospheric/environmental clips
  { path: getVideoUrl('Heavy_rain_pelts_the_ground__str.mp4'), filename: 'Heavy_rain_pelts_the_ground__str.mp4', directory: 'vex_video_jam_01', type: 'atmospheric' },
  { path: getVideoUrl('Footsteps_echo_on_the_graffitied.mp4'), filename: 'Footsteps_echo_on_the_graffitied.mp4', directory: 'vex_video_jam_01', type: 'atmospheric' },
  { path: getVideoUrl('Extended_Video.mp4'), filename: 'Extended_Video.mp4', directory: 'vex_video_jam_01', type: 'environment' },
  
  // Professional generated clips
  { path: getVideoUrl('Professional_Mode_Generated_Video.mp4'), filename: 'Professional_Mode_Generated_Video.mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (1).mp4'), filename: 'Professional_Mode_Generated_Video (1).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (2).mp4'), filename: 'Professional_Mode_Generated_Video (2).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (3).mp4'), filename: 'Professional_Mode_Generated_Video (3).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (4).mp4'), filename: 'Professional_Mode_Generated_Video (4).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (5).mp4'), filename: 'Professional_Mode_Generated_Video (5).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (6).mp4'), filename: 'Professional_Mode_Generated_Video (6).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (7).mp4'), filename: 'Professional_Mode_Generated_Video (7).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (8).mp4'), filename: 'Professional_Mode_Generated_Video (8).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (9).mp4'), filename: 'Professional_Mode_Generated_Video (9).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (10).mp4'), filename: 'Professional_Mode_Generated_Video (10).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (11).mp4'), filename: 'Professional_Mode_Generated_Video (11).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (12).mp4'), filename: 'Professional_Mode_Generated_Video (12).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (13).mp4'), filename: 'Professional_Mode_Generated_Video (13).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (14).mp4'), filename: 'Professional_Mode_Generated_Video (14).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (15).mp4'), filename: 'Professional_Mode_Generated_Video (15).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Professional_Mode_Generated_Video (16).mp4'), filename: 'Professional_Mode_Generated_Video (16).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  
  // Standard generated clips
  { path: getVideoUrl('Standard_Mode_Generated_Video.mp4'), filename: 'Standard_Mode_Generated_Video.mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (1).mp4'), filename: 'Standard_Mode_Generated_Video (1).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (2).mp4'), filename: 'Standard_Mode_Generated_Video (2).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (3).mp4'), filename: 'Standard_Mode_Generated_Video (3).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (4).mp4'), filename: 'Standard_Mode_Generated_Video (4).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (5).mp4'), filename: 'Standard_Mode_Generated_Video (5).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (6).mp4'), filename: 'Standard_Mode_Generated_Video (6).mp4', directory: 'vex_video_jam_01', type: 'generated' },
  { path: getVideoUrl('Standard_Mode_Generated_Video (7).mp4'), filename: 'Standard_Mode_Generated_Video (7).mp4', directory: 'vex_video_jam_01', type: 'generated' },
]

// Helper functions
export const getVideosByType = (type: VideoClip['type']): VideoClip[] => {
  return videoClips.filter(clip => clip.type === type)
}

export const getRandomVideos = (count: number, type?: VideoClip['type']): VideoClip[] => {
  const clips = type ? getVideosByType(type) : videoClips
  const shuffled = [...clips].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getAllVideoPaths = (): string[] => {
  return videoClips.map(clip => clip.path)
}

// Curated video selections for different moods
export const getCuratedVideoSelection = (mood: 'urban' | 'atmospheric' | 'dynamic' | 'mixed'): VideoClip[] => {
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

export const getVideoDisplayName = (clip: VideoClip): string => {
  return clip.filename
    .replace('.mp4', '')
    .replace(/_/g, ' ')
    .replace(/\s+\(\d+\)/, '')
    .replace(/^A train rushes past while urban/, 'Urban Train')
    .replace(/^Heavy rain pelts the ground/, 'Heavy Rain')
    .replace(/^Footsteps echo on the graffitied/, 'Footsteps Echo')
    .replace(/^Professional Mode Generated Video/, 'Pro Generated')
    .replace(/^Standard Mode Generated Video/, 'Standard Generated')
    .replace(/^Extended Video/, 'Extended Scene')
} 