import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bgotvvrslolholxgcivz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnb3R2dnJzbG9saG9seGdjaXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTU0ODksImV4cCI6MjA2NTY3MTQ4OX0.zBeEf2NeSRq_zW2MBcZkX_m_dIas7aJoZS7IAM4UQ-8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket for music files
export const MUSIC_BUCKET = 'v3xv0id-music'

// Helper function to get the public URL for a music file
export const getMusicUrl = (filename: string): string => {
  const { data } = supabase.storage
    .from(MUSIC_BUCKET)
    .getPublicUrl(filename)
  
  return data.publicUrl
}

// Helper function to upload a music file
export const uploadMusicFile = async (file: File, filename: string) => {
  const { data, error } = await supabase.storage
    .from(MUSIC_BUCKET)
    .upload(filename, file, {
      cacheControl: '31536000', // 1 year cache
      upsert: true // Overwrite if exists
    })

  if (error) {
    console.error('Error uploading music file:', error)
    throw error
  }

  return data
}

// Helper function to list all music files
export const listMusicFiles = async () => {
  const { data, error } = await supabase.storage
    .from(MUSIC_BUCKET)
    .list()

  if (error) {
    console.error('Error listing music files:', error)
    throw error
  }

  return data
}

// Helper function to check which files are already uploaded
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