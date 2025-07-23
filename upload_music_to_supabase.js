#!/usr/bin/env node

// VEX VOID Music Upload Script
// Uploads music files to Supabase Storage v3xv0id-music bucket

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Music bucket configuration
const MUSIC_BUCKET = 'v3xv0id-music'

// Expected music files based on musicLibrary.ts
const expectedMusicFiles = [
  'Echoes in the Abyss.mp3',
  'Echoes in the Abyss (1).mp3',
  'Echoes in the Dust.mp3',
  'Echoes in the Dust (1).mp3',
  'Echoes in the Dust (2).mp3',
  'Echoes in the Fog.mp3',
  'Echoes in the Fog (1).mp3',
  'Echoes in the Mist.mp3',
  'Echoes in the Mist (1).mp3',
  'Four Ton Shadow.mp3',
  'Four Ton Shadow (1).mp3',
  'Four Ton Shadow (2).mp3',
  'Four Ton Shadow (3).mp3',
  'Four Ton Shadow (4).mp3',
  'Four Ton Shadow (5).mp3',
  'Four Ton Shadows.mp3',
  'Four Ton Shadows (1).mp3',
  'Midnight Reverie.mp3',
  'Midnight Reverie (1).mp3',
  'Shadow Steps.mp3',
  'Shadow Steps (1).mp3',
  'Shadowed Depths.mp3',
  'Shadowed Depths (1).mp3',
  'Shadowed Whispers.mp3',
  'Shadowed Whispers (1).mp3',
  'Shadows and Silhouettes.mp3',
  'Shadows and Silhouettes (1).mp3',
  'Shadows in the Smoke.mp3',
  'Shadows in the Smoke (1).mp3',
  'Shadows of the Mind.mp3',
  'Shadows of the Mind (1).mp3',
  'Shadows of the Mind (2).mp3',
  'Shadows of the Mind (3).mp3',
  'Shadows of the Past.mp3',
  'Shadows of the Past (1).mp3',
  'Shadows of the Street.mp3',
  'Shadows of the Street (1).mp3',
  'Silent Shadows.mp3',
  'Silent Shadows (1).mp3',
  'Whispering Shadows.mp3',
  'Whispering Shadows (1).mp3',
  'Whispers in the Smoke.mp3',
  'Whispers in the Smoke (1).mp3',
  'Whispers in the Wind.mp3'
]

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function checkBucketStatus() {
  console.log('🔍 Checking v3xv0id-music bucket status...')
  
  try {
    // Check if bucket exists and list files
    const { data: files, error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .list()
    
    if (error) {
      console.error('❌ Error accessing bucket:', error.message)
      return { exists: false, files: [] }
    }
    
    console.log(`✅ Bucket exists with ${files.length} files`)
    return { exists: true, files }
  } catch (err) {
    console.error('❌ Error checking bucket:', err.message)
    return { exists: false, files: [] }
  }
}

async function uploadMusicFile(filePath, filename) {
  try {
    console.log(`📤 Uploading ${filename}...`)
    
    const fileBuffer = fs.readFileSync(filePath)
    const fileSize = formatFileSize(fileBuffer.length)
    
    const { data, error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .upload(filename, fileBuffer, {
        cacheControl: '31536000', // 1 year cache
        upsert: true, // Overwrite if exists
        contentType: 'audio/mpeg'
      })
    
    if (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message)
      return false
    }
    
    console.log(`✅ Uploaded ${filename} (${fileSize})`)
    return true
  } catch (err) {
    console.error(`❌ Error uploading ${filename}:`, err.message)
    return false
  }
}

async function uploadFromDirectory(directoryPath) {
  console.log(`📁 Scanning directory: ${directoryPath}`)
  
  if (!fs.existsSync(directoryPath)) {
    console.error(`❌ Directory does not exist: ${directoryPath}`)
    return { uploaded: 0, failed: 0 }
  }
  
  const files = fs.readdirSync(directoryPath)
  const musicFiles = files.filter(file => 
    file.toLowerCase().endsWith('.mp3') || 
    file.toLowerCase().endsWith('.wav') || 
    file.toLowerCase().endsWith('.m4a')
  )
  
  console.log(`🎵 Found ${musicFiles.length} music files`)
  
  let uploaded = 0
  let failed = 0
  
  for (const file of musicFiles) {
    const filePath = path.join(directoryPath, file)
    const success = await uploadMusicFile(filePath, file)
    
    if (success) {
      uploaded++
    } else {
      failed++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return { uploaded, failed }
}

async function main() {
  console.log('🎵 VEX VOID Music Upload Script')
  console.log('================================')
  
  // Check bucket status
  const { exists, files } = await checkBucketStatus()
  
  if (!exists) {
    console.error('❌ Cannot access v3xv0id-music bucket. Please ensure:')
    console.error('   1. The bucket exists in your Supabase project')
    console.error('   2. Your service role key has proper permissions')
    console.error('   3. The bucket name is correct: v3xv0id-music')
    process.exit(1)
  }
  
  console.log('\n📋 Current files in bucket:')
  if (files.length === 0) {
    console.log('   No files found')
  } else {
    files.forEach(file => {
      const size = file.metadata?.size ? formatFileSize(file.metadata.size) : 'Unknown'
      console.log(`   ${file.name} (${size})`)
    })
  }
  
  console.log('\n📋 Expected music files:')
  expectedMusicFiles.forEach(file => {
    const exists = files.some(f => f.name === file)
    console.log(`   ${exists ? '✅' : '❌'} ${file}`)
  })
  
  // Check for music files in common locations
  const musicDirectories = [
    './public/music',
    './music',
    './assets/music',
    './src/assets/music',
    './uploads/music'
  ]
  
  console.log('\n🔍 Looking for music files to upload...')
  
  for (const dir of musicDirectories) {
    if (fs.existsSync(dir)) {
      console.log(`\n📁 Found music directory: ${dir}`)
      const { uploaded, failed } = await uploadFromDirectory(dir)
      
      if (uploaded > 0 || failed > 0) {
        console.log(`\n📊 Upload Summary for ${dir}:`)
        console.log(`   ✅ Uploaded: ${uploaded}`)
        console.log(`   ❌ Failed: ${failed}`)
      }
    }
  }
  
  console.log('\n🎵 Music upload process completed!')
  console.log('\n💡 If you have music files in a different location, you can:')
  console.log('   1. Copy them to ./public/music/')
  console.log('   2. Run this script again')
  console.log('   3. Or manually upload them to the v3xv0id-music bucket')
}

// Run the script
main().catch(console.error) 