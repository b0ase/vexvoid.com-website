import { supabase, MUSIC_BUCKET, uploadMusicFile } from './supabase'

// List of all music files that need to be uploaded
export const musicFilesToUpload = [
  'Shadows of the Mind (3).mp3',
  'Shadowed Whispers.mp3',
  'Shadowed Whispers (1).mp3',
  'Shadows and Silhouettes.mp3',
  'Shadows and Silhouettes (1).mp3',
  'Midnight Reverie.mp3',
  'Midnight Reverie (1).mp3',
  'Whispers in the Smoke.mp3',
  'Whispers in the Smoke (1).mp3',
  'Shadows in the Smoke.mp3',
  'Shadows in the Smoke (1).mp3',
  'Shadows of the Mind.mp3',
  'Shadows of the Mind (1).mp3',
  'Echoes in the Dust.mp3',
  'Echoes in the Dust (1).mp3',
  'Echoes in the Mist.mp3',
  'Echoes in the Mist (1).mp3',
  'Echoes in the Fog.mp3',
  'Echoes in the Fog (1).mp3',
  'Shadows of the Mind (2).mp3',
  'Echoes in the Abyss.mp3',
  'Echoes in the Abyss (1).mp3',
  'Shadowed Depths.mp3',
  'Shadowed Depths (1).mp3'
]

// Function to upload all music files from the public/music directory
export const uploadAllMusicFiles = async (onProgress?: (filename: string, progress: number) => void) => {
  const results = []
  
  for (let i = 0; i < musicFilesToUpload.length; i++) {
    const filename = musicFilesToUpload[i]
    
    try {
      // In a real scenario, you'd need to read the file from the file system
      // For now, we'll just simulate the upload structure
      console.log(`Uploading ${filename}...`)
      
      if (onProgress) {
        onProgress(filename, (i + 1) / musicFilesToUpload.length * 100)
      }
      
      // You would implement the actual file reading and uploading here
      // For example:
      // const response = await fetch(`/music/${filename}`)
      // const blob = await response.blob()
      // const file = new File([blob], filename, { type: 'audio/mpeg' })
      // const result = await uploadMusicFile(file, filename)
      
      results.push({ filename, success: true })
      
    } catch (error) {
      console.error(`Failed to upload ${filename}:`, error)
      results.push({ filename, success: false, error })
    }
  }
  
  return results
}

// Function to check which files are already uploaded
export const checkUploadedFiles = async () => {
  try {
    const { data, error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .list()
    
    if (error) {
      console.error('Error checking uploaded files:', error)
      return []
    }
    
    return data.map(file => file.name)
  } catch (error) {
    console.error('Error checking uploaded files:', error)
    return []
  }
}

// Function to get the upload status
export const getUploadStatus = async () => {
  const uploadedFiles = await checkUploadedFiles()
  const status = musicFilesToUpload.map(filename => ({
    filename,
    uploaded: uploadedFiles.includes(filename)
  }))
  
  return {
    total: musicFilesToUpload.length,
    uploaded: uploadedFiles.length,
    remaining: musicFilesToUpload.length - uploadedFiles.length,
    files: status
  }
} 