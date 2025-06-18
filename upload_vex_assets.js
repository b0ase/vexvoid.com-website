#!/usr/bin/env node

// VEX VOID Asset Upload Script
// Uploads all local assets to Supabase Storage

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

// VEX VOID Asset Collections
const assetCollections = [
  {
    name: '🎨 VexVoid Concept Art',
    localPath: './public/images/VexVoid_concept_art',
    bucket: 'v3xv0id-images',
    folder: 'concept_art',
    aesthetic: 'neon_noir'
  },
  {
    name: '🎨 VexVoid Concept Art 2',
    localPath: './public/images/VexVoid_concept_art_2',
    bucket: 'v3xv0id-images',
    folder: 'concept_art_2',
    aesthetic: 'urban_decay'
  },
  {
    name: '🎨 VexVoid Concept Art 3',
    localPath: './public/images/VexVoid_concept_art_3',
    bucket: 'v3xv0id-images',
    folder: 'concept_art_3',
    aesthetic: 'cinematic'
  },
  {
    name: '🌆 VexVoid Landscapes',
    localPath: './public/images/VexVoid_Landscape',
    bucket: 'v3xv0id-images',
    folder: 'landscapes',
    aesthetic: 'urban_decay'
  },
  {
    name: '👤 VexVoid Portraits',
    localPath: './public/images/VexVoid_Portrait',
    bucket: 'v3xv0id-images',
    folder: 'portraits',
    aesthetic: 'neon_noir'
  },
  {
    name: '🚂 Graffiti Train Jam',
    localPath: './public/images/VexVoid_graf_train_jam',
    bucket: 'v3xv0id-images',
    folder: 'graffiti_train',
    aesthetic: 'graffiti_culture'
  },
  {
    name: '🎬 V3X Video Jam Images',
    localPath: './public/images/v3x_vide0_Jam_01',
    bucket: 'v3xv0id-images',
    folder: 'video_jam_01',
    aesthetic: 'train_yards'
  },
  {
    name: '🎥 V3X Video Jam Videos',
    localPath: './public/videos/vex_video_jam_01',
    bucket: 'v3xv0id-videos',
    folder: 'vex_video_jam_01',
    aesthetic: 'cinematic'
  }
]

// Supported file extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv']
const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a']

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  
  if (imageExtensions.includes(ext)) {
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
    if (ext === '.png') return 'image/png'
    if (ext === '.webp') return 'image/webp'
    if (ext === '.gif') return 'image/gif'
  }
  
  if (videoExtensions.includes(ext)) {
    if (ext === '.mp4') return 'video/mp4'
    if (ext === '.mov') return 'video/quicktime'
    if (ext === '.avi') return 'video/x-msvideo'
    if (ext === '.mkv') return 'video/x-matroska'
  }
  
  if (audioExtensions.includes(ext)) {
    if (ext === '.mp3') return 'audio/mpeg'
    if (ext === '.wav') return 'audio/wav'
    if (ext === '.ogg') return 'audio/ogg'
    if (ext === '.m4a') return 'audio/mp4'
  }
  
  return 'application/octet-stream'
}

function isValidFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return [...imageExtensions, ...videoExtensions, ...audioExtensions].includes(ext)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function uploadFile(localPath, supabasePath, bucket, filename) {
  try {
    const fileBuffer = fs.readFileSync(localPath)
    const contentType = getContentType(filename)
    
    console.log(`   📤 Uploading: ${filename} (${formatFileSize(fileBuffer.length)})`)
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(supabasePath, fileBuffer, {
        contentType,
        upsert: true
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(supabasePath)

    return {
      success: true,
      url: urlData.publicUrl,
      size: fileBuffer.length
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function uploadCollection(collection) {
  console.log(`\n🎯 ${collection.name}`)
  console.log(`   📁 Local: ${collection.localPath}`)
  console.log(`   ☁️  Remote: ${collection.bucket}/${collection.folder}`)
  console.log(`   🎨 Aesthetic: ${collection.aesthetic}`)
  
  if (!fs.existsSync(collection.localPath)) {
    console.log(`   ⚠️  Directory not found, skipping...`)
    return { success: false, files: 0, totalSize: 0 }
  }

  const files = fs.readdirSync(collection.localPath)
    .filter(file => isValidFile(file))
    .sort()

  if (files.length === 0) {
    console.log(`   ⚠️  No valid files found, skipping...`)
    return { success: false, files: 0, totalSize: 0 }
  }

  console.log(`   📊 Found ${files.length} files`)

  let successCount = 0
  let totalSize = 0
  const errors = []

  for (const filename of files) {
    const localFilePath = path.join(collection.localPath, filename)
    const supabasePath = `${collection.folder}/${filename}`
    
    const result = await uploadFile(localFilePath, supabasePath, collection.bucket, filename)
    
    if (result.success) {
      successCount++
      totalSize += result.size
      console.log(`   ✅ ${filename}`)
    } else {
      errors.push({ filename, error: result.error })
      console.log(`   ❌ ${filename}: ${result.error}`)
    }
  }

  console.log(`   📈 Results: ${successCount}/${files.length} uploaded (${formatFileSize(totalSize)})`)
  
  if (errors.length > 0) {
    console.log(`   ⚠️  Errors:`)
    errors.forEach(({ filename, error }) => {
      console.log(`      • ${filename}: ${error}`)
    })
  }

  return {
    success: successCount === files.length,
    files: successCount,
    totalSize,
    errors
  }
}

async function main() {
  console.log(`
🎨 VEX VOID ASSET UPLOADER
═══════════════════════════════════════
Uploading graffiti culture assets to Supabase Storage...
`)

  let totalFiles = 0
  let totalSize = 0
  let totalErrors = 0

  const startTime = Date.now()

  for (const collection of assetCollections) {
    const result = await uploadCollection(collection)
    totalFiles += result.files
    totalSize += result.totalSize
    if (result.errors) {
      totalErrors += result.errors.length
    }
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log(`
🎉 UPLOAD COMPLETE!
═══════════════════════════════════════
📊 Total Files: ${totalFiles}
💾 Total Size: ${formatFileSize(totalSize)}
⏱️  Duration: ${duration}s
${totalErrors > 0 ? `⚠️  Errors: ${totalErrors}` : '✅ No errors!'}

🔗 Access your assets at:
   https://${supabaseUrl.replace('https://', '')}/storage/v1/object/public/v3xv0id-images/
   https://${supabaseUrl.replace('https://', '')}/storage/v1/object/public/v3xv0id-videos/
`)

  if (totalErrors === 0) {
    console.log(`
🎬 READY FOR VIDEO GENERATION!
Your VEX VOID aesthetic is now fully loaded:
• Graffiti culture imagery ✅
• Train yard atmosphere ✅ 
• Urban decay landscapes ✅
• Cinematic video clips ✅

Time to create some ninja jazz videos! 🥷🎵
`)
  }
}

main().catch(console.error) 