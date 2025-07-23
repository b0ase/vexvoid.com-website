import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  'https://bgotvvrslolholxgcivz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { collection, localPath, bucket, folder } = await request.json()
    
    console.log(`Starting upload for ${collection}`)
    console.log(`Local path: ${localPath}`)
    console.log(`Target: ${bucket}/${folder}`)
    
    // Get the full path to the assets
    const fullPath = path.join(process.cwd(), 'public', localPath.replace(/^\//, ''))
    
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Directory not found: ${fullPath}`)
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(fullPath)
    const uploadResults = []
    
    for (const filename of files) {
      // Skip hidden files and directories
      if (filename.startsWith('.')) continue
      
      const filePath = path.join(fullPath, filename)
      const stat = fs.statSync(filePath)
      
      if (stat.isFile()) {
        try {
          // Read file
          const fileBuffer = fs.readFileSync(filePath)
          
          // Determine content type
          const ext = path.extname(filename).toLowerCase()
          let contentType = 'application/octet-stream'
          
          if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg'
          else if (ext === '.png') contentType = 'image/png'
          else if (ext === '.gif') contentType = 'image/gif'
          else if (ext === '.webp') contentType = 'image/webp'
          else if (ext === '.mp4') contentType = 'video/mp4'
          else if (ext === '.mov') contentType = 'video/quicktime'
          else if (ext === '.avi') contentType = 'video/x-msvideo'
          
          // Upload to Supabase Storage
          const storagePath = `${folder}/${filename}`
          
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(storagePath, fileBuffer, {
              contentType,
              upsert: true // Overwrite if exists
            })
          
          if (error) {
            console.error(`Failed to upload ${filename}:`, error)
            uploadResults.push({
              filename,
              status: 'error',
              error: error.message
            })
          } else {
            console.log(`Successfully uploaded ${filename}`)
            uploadResults.push({
              filename,
              status: 'success',
              path: data.path
            })
          }
          
        } catch (fileError) {
          console.error(`Error processing ${filename}:`, fileError)
          uploadResults.push({
            filename,
            status: 'error',
            error: fileError instanceof Error ? fileError.message : 'Unknown error'
          })
        }
      }
    }
    
    const successCount = uploadResults.filter(r => r.status === 'success').length
    const errorCount = uploadResults.filter(r => r.status === 'error').length
    
    return NextResponse.json({
      success: true,
      collection,
      totalFiles: uploadResults.length,
      successCount,
      errorCount,
      results: uploadResults
    })
    
  } catch (error) {
    console.error('Asset upload failed:', error)
    return NextResponse.json(
      { 
        error: 'Asset upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 