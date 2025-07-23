'use client'

import { useEffect, useState } from 'react'
import { listMusicFiles, getMusicUrl } from '../lib/supabase'
import { musicTracks } from '../lib/musicLibrary'

export default function TestMusicConnection() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testUrls, setTestUrls] = useState<string[]>([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true)
        
        // Test 1: List files in bucket
        console.log('Testing Supabase music bucket connection...')
        const bucketFiles = await listMusicFiles()
        setFiles(bucketFiles)
        console.log('Files in bucket:', bucketFiles)
        
        // Test 2: Generate URLs for first few tracks
        const testTrackUrls = musicTracks.slice(0, 3).map(track => ({
          title: track.title,
          filename: track.filename,
          supabaseUrl: track.supabaseUrl,
          generatedUrl: getMusicUrl(track.filename)
        }))
        
        setTestUrls(testTrackUrls.map(t => `${t.title}: ${t.supabaseUrl}`))
        console.log('Test track URLs:', testTrackUrls)
        
        setLoading(false)
      } catch (err) {
        console.error('Connection test failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">V3XV0ID Music Connection Test</h1>
      
      {loading && (
        <div className="text-cyan-400">Testing Supabase connection...</div>
      )}
      
      {error && (
        <div className="text-red-400 mb-4">
          <h2 className="text-xl font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Files in v3xv0id-music bucket:</h2>
            <div className="bg-gray-900 p-4 rounded">
              {files.length > 0 ? (
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm">
                      {file.name} ({file.metadata?.size ? `${Math.round(file.metadata.size / 1024 / 1024 * 100) / 100}MB` : 'Unknown size'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-yellow-400">No files found in bucket</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Test Track URLs:</h2>
            <div className="bg-gray-900 p-4 rounded">
              {testUrls.map((url, index) => (
                <div key={index} className="text-sm mb-2">
                  <p className="text-green-400">{url}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Music Library Stats:</h2>
            <div className="bg-gray-900 p-4 rounded">
              <p>Total tracks: {musicTracks.length}</p>
              <p>Tracks with Supabase URLs: {musicTracks.filter(t => t.supabaseUrl).length}</p>
              <p>Sample track: {musicTracks[0]?.title} - {musicTracks[0]?.supabaseUrl ? 'Has URL' : 'No URL'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 