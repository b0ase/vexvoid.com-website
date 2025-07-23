#!/usr/bin/env node

// Make V3XV0ID Music Bucket Public
// This script makes the v3xv0id-music bucket public so music files can be accessed

const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

async function makeBucketPublic() {
  try {
    console.log('🔧 Making v3xv0id-music bucket public...')
    
    // Use the Supabase Management API to update bucket settings
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/v3xv0id-music`, {
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
      console.log('🎵 Music files should now be accessible without authentication')
    } else {
      const error = await response.text()
      console.error('❌ Failed to make bucket public:', error)
      
      // Alternative approach - try using the REST API
      console.log('🔄 Trying alternative approach...')
      await tryAlternativeApproach()
    }
  } catch (error) {
    console.error('❌ Error making bucket public:', error.message)
    await tryAlternativeApproach()
  }
}

async function tryAlternativeApproach() {
  try {
    console.log('🔄 Trying to create a new public bucket...')
    
    // First, let's check if we can list files in the bucket
    const listResponse = await fetch(`${supabaseUrl}/storage/v1/object/list/v3xv0id-music`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    })

    if (listResponse.ok) {
      const files = await listResponse.json()
      console.log(`📁 Found ${files.length} files in bucket`)
      
      // Test if we can access a file directly
      if (files.length > 0) {
        const testFile = files[0].name
        console.log(`🧪 Testing access to: ${testFile}`)
        
        const testResponse = await fetch(`${supabaseUrl}/storage/v1/object/public/v3xv0id-music/${encodeURIComponent(testFile)}`)
        
        if (testResponse.ok) {
          console.log('✅ File is accessible! The bucket might already be public.')
        } else {
          console.log('❌ File is not accessible. Bucket needs to be made public.')
          console.log('💡 You may need to make the bucket public through the Supabase dashboard:')
          console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/storage/buckets/v3xv0id-music`)
        }
      }
    } else {
      console.error('❌ Cannot list files in bucket')
    }
  } catch (error) {
    console.error('❌ Alternative approach failed:', error.message)
  }
}

// Run the script
makeBucketPublic() 