'use client'

import { useEffect, useState } from 'react'
import { listMusicFiles, getMusicUrl } from '../lib/supabase'
import { musicTracks } from '../lib/musicLibrary'

export default function TestPage() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testUrls, setTestUrls] = useState<Array<{title: string; url: string; filename: string}>>([])

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
          url: track.supabaseUrl,
          filename: track.filename
        }))
        setTestUrls(testTrackUrls)
        console.log('Test track URLs:', testTrackUrls)
        
      } catch (err) {
        console.error('Error testing connection:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black text-cyber-white p-8">
        <h1 className="text-3xl font-mono mb-8">V3XV0ID Music Connection Test</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-accent"></div>
        <p>Testing Supabase connection...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cyber-black text-cyber-white p-8">
        <h1 className="text-3xl font-mono mb-8">V3XV0ID Music Connection Test</h1>
        <div className="bg-red-900/20 border border-red-500 p-4 rounded">
          <h2 className="text-xl text-red-400 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white p-8">
      <h1 className="text-3xl font-mono mb-8">V3XV0ID Music Connection Test</h1>
      
      <div className="space-y-8">
        <div className="bg-cyber-white/5 border border-cyber-white/20 p-6 rounded">
          <h2 className="text-xl font-mono mb-4">✅ Supabase Connection Status</h2>
          <p className="text-cyber-accent">Successfully connected to v3xv0id-music bucket</p>
          <p className="text-cyber-accent">Total files found: {files.length}</p>
        </div>

        <div className="bg-cyber-white/5 border border-cyber-white/20 p-6 rounded">
          <h2 className="text-xl font-mono mb-4">🎵 Test Track URLs</h2>
          <div className="space-y-2">
            {testUrls.map((track, index) => (
              <div key={index} className="border border-cyber-white/10 p-3 rounded">
                <h3 className="font-mono text-cyber-accent">{track.title}</h3>
                <p className="text-sm text-gray-400">File: {track.filename}</p>
                <p className="text-xs text-gray-500 break-all">URL: {track.url}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cyber-white/5 border border-cyber-white/20 p-6 rounded">
          <h2 className="text-xl font-mono mb-4">📁 Bucket Files (First 10)</h2>
          <div className="space-y-1">
            {files.slice(0, 10).map((file, index) => (
              <div key={index} className="text-sm text-cyber-accent">
                {file.name}
              </div>
            ))}
            {files.length > 10 && (
              <p className="text-gray-400 text-sm">... and {files.length - 10} more files</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 