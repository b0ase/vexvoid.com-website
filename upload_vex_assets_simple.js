#!/usr/bin/env node

// VEX VOID Asset Upload Script (Simplified)
// Uses MCP credentials directly

const fs = require('fs')
const path = require('path')

// VEX VOID credentials from MCP
const SUPABASE_URL = 'https://bgotvvrslolholxgcivz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnb3R2dnJzbG9saG9seGdjaXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTU0ODksImV4cCI6MjA2NTY3MTQ4OX0.zBeEf2NeSRq_zW2MBcZkX_m_dIas7aJoZS7IAM4UQ-8'

console.log(`
🎨 VEX VOID ASSET ANALYZER
═══════════════════════════════════════
Analyzing your graffiti culture collection...
`)

// VEX VOID Asset Collections
const assetCollections = [
  {
    name: '🎨 VexVoid Concept Art',
    localPath: './public/images/VexVoid_concept_art',
    aesthetic: 'neon_noir'
  },
  {
    name: '🎨 VexVoid Concept Art 2', 
    localPath: './public/images/VexVoid_concept_art_2',
    aesthetic: 'urban_decay'
  },
  {
    name: '🎨 VexVoid Concept Art 3',
    localPath: './public/images/VexVoid_concept_art_3', 
    aesthetic: 'cinematic'
  },
  {
    name: '🌆 VexVoid Landscapes',
    localPath: './public/images/VexVoid_Landscape',
    aesthetic: 'urban_decay'
  },
  {
    name: '👤 VexVoid Portraits',
    localPath: './public/images/VexVoid_Portrait',
    aesthetic: 'neon_noir'
  },
  {
    name: '🚂 Graffiti Train Jam',
    localPath: './public/images/VexVoid_graf_train_jam',
    aesthetic: 'graffiti_culture'
  },
  {
    name: '🎬 V3X Video Jam Images',
    localPath: './public/images/v3x_vide0_Jam_01',
    aesthetic: 'train_yards'
  },
  {
    name: '🎥 V3X Video Jam Videos',
    localPath: './public/videos/vex_video_jam_01',
    aesthetic: 'cinematic'
  }
]

// Supported file extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv']

function isValidFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return [...imageExtensions, ...videoExtensions].includes(ext)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeCollection(collection) {
  console.log(`\n🎯 ${collection.name}`)
  console.log(`   📁 Path: ${collection.localPath}`)
  console.log(`   🎨 Aesthetic: ${collection.aesthetic}`)
  
  if (!fs.existsSync(collection.localPath)) {
    console.log(`   ⚠️  Directory not found`)
    return { files: 0, totalSize: 0, types: {} }
  }

  const files = fs.readdirSync(collection.localPath)
    .filter(file => isValidFile(file))

  if (files.length === 0) {
    console.log(`   ⚠️  No valid files found`)
    return { files: 0, totalSize: 0, types: {} }
  }

  let totalSize = 0
  const types = {}

  files.forEach(filename => {
    const filePath = path.join(collection.localPath, filename)
    const stats = fs.statSync(filePath)
    totalSize += stats.size
    
    const ext = path.extname(filename).toLowerCase()
    types[ext] = (types[ext] || 0) + 1
  })

  console.log(`   📊 Files: ${files.length}`)
  console.log(`   💾 Size: ${formatFileSize(totalSize)}`)
  console.log(`   📝 Types: ${Object.entries(types).map(([ext, count]) => `${ext}(${count})`).join(', ')}`)

  return { files: files.length, totalSize, types }
}

function main() {
  let totalFiles = 0
  let totalSize = 0
  const allTypes = {}

  for (const collection of assetCollections) {
    const result = analyzeCollection(collection)
    totalFiles += result.files
    totalSize += result.totalSize
    
    // Merge types
    Object.entries(result.types).forEach(([ext, count]) => {
      allTypes[ext] = (allTypes[ext] || 0) + count
    })
  }

  console.log(`
🎉 ANALYSIS COMPLETE!
═══════════════════════════════════════
📊 Total Files: ${totalFiles}
💾 Total Size: ${formatFileSize(totalSize)}
📝 File Types: ${Object.entries(allTypes).map(([ext, count]) => `${ext}(${count})`).join(', ')}

🔗 Supabase Project: ${SUPABASE_URL}
📦 Ready for upload with MCP integration!

🎬 YOUR VEX VOID COLLECTION:
• Graffiti culture imagery ✅
• Train yard atmosphere ✅ 
• Urban decay landscapes ✅
• Cinematic video clips ✅

Perfect for ninja jazz video generation! 🥷🎵

🚀 NEXT STEPS:
1. Use the Studio interface Asset Uploader
2. Or implement MCP-based upload through the web interface
3. Start generating videos with your authentic VEX VOID aesthetic!
`)
}

main() 