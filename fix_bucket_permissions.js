#!/usr/bin/env node

// Fix V3XV0ID Music Bucket Permissions
// Make the bucket public so all tracks can be accessed

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function fixBucketPermissions() {
  try {
    console.log('🔧 Making v3xv0id-music bucket public...')
    
    // Use the Supabase Management API
    const response = await fetch(`https://api.supabase.com/v1/projects/klaputzxeqgypphzdxpr/storage/buckets/v3xv0id-music`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        public: true
      })
    })

    if (response.ok) {
      console.log('✅ Successfully made v3xv0id-music bucket public!')
      console.log('🎵 All 63 music tracks should now be accessible')
      
      // Test a few tracks
      const testTracks = [
        'Echoes in the Abyss.mp3',
        'Shadows in the Mind.mp3',
        'Four Ton Shadow.mp3'
      ]
      
      for (const track of testTracks) {
        const testUrl = `${supabaseUrl}/storage/v1/object/public/v3xv0id-music/${encodeURIComponent(track)}`
        console.log(`🧪 Testing: ${track}`)
        
        const testResponse = await fetch(testUrl)
        if (testResponse.ok) {
          console.log(`✅ ${track} - ACCESSIBLE`)
        } else {
          console.log(`❌ ${track} - NOT ACCESSIBLE`)
        }
      }
    } else {
      const error = await response.text()
      console.error('❌ Failed to make bucket public:', error)
      console.log('💡 Manual fix required:')
      console.log('1. Go to: https://supabase.com/dashboard/project/klaputzxeqgypphzdxpr/storage/buckets/v3xv0id-music')
      console.log('2. Click "Settings" or "Edit"')
      console.log('3. Enable "Public bucket" option')
      console.log('4. Save changes')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixBucketPermissions() 