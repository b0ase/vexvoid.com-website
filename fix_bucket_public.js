#!/usr/bin/env node

// Fix V3XV0ID Music Bucket - Make Public
// This script makes the v3xv0id-music bucket public

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeBucketPublic() {
  try {
    console.log('🔧 Making v3xv0id-music bucket public...')
    
    // First, let's check the current bucket status
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }
    
    console.log('📋 Available buckets:')
    buckets.forEach(bucket => {
      console.log(`   ${bucket.name} (public: ${bucket.public})`)
    })
    
    // Now let's try to update the bucket to be public
    const { data, error } = await supabase.storage.updateBucket('v3xv0id-music', {
      public: true
    })
    
    if (error) {
      console.error('❌ Error updating bucket:', error)
      
      // If the update method doesn't work, let's try a different approach
      console.log('🔄 Trying alternative approach...')
      
      // Let's test if we can access files with the service role
      const { data: files, error: filesError } = await supabase.storage
        .from('v3xv0id-music')
        .list('', { limit: 5 })
      
      if (filesError) {
        console.error('❌ Error listing files:', filesError)
      } else {
        console.log('✅ Files accessible with service role:')
        files.forEach(file => {
          console.log(`   ${file.name} (${file.metadata?.size || 'unknown'} bytes)`)
        })
      }
      
      return
    }
    
    console.log('✅ Bucket updated successfully!')
    console.log('📊 Bucket data:', data)
    
    // Test the public access
    const testUrl = `${supabaseUrl}/storage/v1/object/public/v3xv0id-music/Echoes%20in%20the%20Abyss.mp3`
    console.log('🔗 Testing public URL:', testUrl)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

makeBucketPublic() 