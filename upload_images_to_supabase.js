const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration
const supabaseUrl = 'https://bgotvvrslolholxgcivz.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnb3R2dnJzbG9saG9seGdjaXZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDM2ODg1NCwiZXhwIjoyMDQ5OTQ0ODU0fQ.XZmJ6xBcNR5q7gXkQfQMmZxFrF6qFvOVxnvPfZBGjQs'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Function to upload a single file
async function uploadFile(filePath, bucketPath) {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = path.basename(filePath)
    
    console.log(`Uploading: ${bucketPath}`)
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(bucketPath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true // Overwrite if exists
      })
    
    if (error) {
      console.error(`Error uploading ${bucketPath}:`, error.message)
      return false
    }
    
    console.log(`✅ Uploaded: ${bucketPath}`)
    return true
  } catch (err) {
    console.error(`Failed to upload ${bucketPath}:`, err.message)
    return false
  }
}

// Function to upload all images in a directory
async function uploadDirectory(localDir, bucketDir) {
  const fullPath = path.join('public/images', localDir)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Directory ${fullPath} does not exist, skipping...`)
    return
  }
  
  const files = fs.readdirSync(fullPath)
  console.log(`\n📁 Processing directory: ${localDir} (${files.length} files)`)
  
  let successCount = 0
  
  for (const file of files) {
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
      const localPath = path.join(fullPath, file)
      const bucketPath = `${bucketDir}/${file}`
      
      const success = await uploadFile(localPath, bucketPath)
      if (success) successCount++
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`✅ Uploaded ${successCount}/${files.length} files from ${localDir}`)
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting image upload to Supabase...')
  console.log(`📡 Supabase URL: ${supabaseUrl}`)
  
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
  
  for (const dir of directories) {
    await uploadDirectory(dir, dir)
  }
  
  console.log('\n🎉 Image upload completed!')
  console.log('Images are now available at:')
  console.log(`${supabaseUrl}/storage/v1/object/public/images/[directory]/[filename]`)
}

// Run the upload
uploadAllImages().catch(console.error) 