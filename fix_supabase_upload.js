const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration - use environment variable or fallback
const supabaseUrl = 'https://bgotvvrslolholxgcivz.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set')
  console.log('Please set it with: export SUPABASE_SERVICE_ROLE_KEY="your_key_here"')
  process.exit(1)
}

console.log('🔑 Using service role key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test connection first
async function testConnection() {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    // Try to list buckets first
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Failed to list buckets:', listError.message)
      return false
    }
    
    console.log('✅ Connection successful! Available buckets:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    // Check if images bucket exists
    const imagesBucket = buckets.find(b => b.name === 'images')
    if (!imagesBucket) {
      console.log('📦 Creating "images" bucket...')
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (createError) {
        console.error('❌ Failed to create bucket:', createError.message)
        return false
      }
      
      console.log('✅ Images bucket created successfully!')
    } else {
      console.log('✅ Images bucket already exists')
    }
    
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

// Upload a single file with better error handling
async function uploadFile(filePath, bucketPath) {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = path.basename(filePath)
    
    console.log(`📤 Uploading: ${bucketPath}`)
    
    // First, try to remove existing file (ignore errors)
    await supabase.storage.from('images').remove([bucketPath])
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(bucketPath, fileBuffer, {
        contentType: filePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
        upsert: true
      })
    
    if (error) {
      console.error(`❌ Error uploading ${bucketPath}:`, error.message)
      if (error.message.includes('payload too large')) {
        console.log('   File might be too large, skipping...')
      }
      return false
    }
    
    // Verify the upload by trying to get the public URL
    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(bucketPath)
    console.log(`✅ Uploaded: ${bucketPath} -> ${publicUrl.publicUrl}`)
    
    return true
  } catch (err) {
    console.error(`❌ Failed to upload ${bucketPath}:`, err.message)
    return false
  }
}

// Upload all images in a directory
async function uploadDirectory(localDir, bucketDir) {
  const fullPath = path.join('public/images', localDir)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`📂 Directory ${fullPath} does not exist, skipping...`)
    return
  }
  
  const files = fs.readdirSync(fullPath)
  const imageFiles = files.filter(file => 
    file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i)
  )
  
  console.log(`\n📁 Processing directory: ${localDir} (${imageFiles.length} image files)`)
  
  let successCount = 0
  
  for (const file of imageFiles) {
    const localPath = path.join(fullPath, file)
    const bucketPath = `${bucketDir}/${file}`
    
    const success = await uploadFile(localPath, bucketPath)
    if (success) successCount++
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log(`✅ Successfully uploaded ${successCount}/${imageFiles.length} files from ${localDir}`)
  return successCount
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting V3XV0ID image upload to Supabase...')
  console.log(`📡 Target: ${supabaseUrl}`)
  
  // Test connection first
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.error('❌ Connection test failed. Aborting upload.')
    process.exit(1)
  }
  
  // List of directories to upload
  const directories = [
    'VexVoid_concept_art',
    'VexVoid_concept_art_2', 
    'VexVoid_concept_art_3',
    'VexVoid_graf_train_jam',
    'v3x_vide0_Jam_01',
    'VexVoid_Landscape',
    'VexVoid_Portrait'
  ]
  
  let totalUploaded = 0
  
  for (const dir of directories) {
    const uploaded = await uploadDirectory(dir, dir)
    totalUploaded += uploaded || 0
  }
  
  console.log(`\n🎉 Upload completed! ${totalUploaded} total images uploaded.`)
  console.log('🌐 Images are now available at:')
  console.log(`   ${supabaseUrl}/storage/v1/object/public/images/[directory]/[filename]`)
  
  // Test a few URLs
  console.log('\n🧪 Testing some URLs:')
  const testUrls = [
    `${supabaseUrl}/storage/v1/object/public/images/VexVoid_concept_art/download.jpg`,
    `${supabaseUrl}/storage/v1/object/public/images/VexVoid_Portrait/download-6.jpg`
  ]
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      console.log(`   ${response.ok ? '✅' : '❌'} ${url} (${response.status})`)
    } catch (err) {
      console.log(`   ❌ ${url} (error: ${err.message})`)
    }
  }
}

// Run the upload
uploadAllImages().catch(error => {
  console.error('💥 Upload failed:', error)
  process.exit(1)
}) 