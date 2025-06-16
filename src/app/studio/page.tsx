'use client'

import { useState, useEffect } from 'react'
import MusicUploader from '../components/MusicUploader'

const STUDIO_PASSWORD = 'shadow'

export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAuth = localStorage.getItem('v3xv0id_studio_auth')
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === STUDIO_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('v3xv0id_studio_auth', 'authenticated')
      setPassword('')
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('v3xv0id_studio_auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-cyber-white lo-fi-text">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="bg-black/90 border border-white p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white lo-fi-text mb-2">V3XV0ID STUDIO</h1>
            <p className="text-white/70 text-sm lo-fi-text">Access restricted</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm lo-fi-text mb-2">
                Enter Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white p-2 text-white lo-fi-text focus:outline-none focus:border-cyan-400"
                placeholder="Password required..."
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-white text-black py-2 px-4 lo-fi-text hover:bg-gray-200 transition-colors"
            >
              ACCESS STUDIO
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      <div className="border-b border-white/20 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold lo-fi-text">V3XV0ID STUDIO</h1>
            <p className="text-white/70 text-sm lo-fi-text">Content Creation & Management</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="text-white/70 hover:text-white lo-fi-text text-sm"
            >
              ← Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm lo-fi-text"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🎵 Music Management</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Upload and manage V3XV0ID music tracks in Supabase Storage.
            </p>
            <MusicUploader />
          </div>

          <div className="bg-black/50 border border-white/20 p-6">
            <h2 className="text-xl font-bold lo-fi-text mb-4">🎬 Video Generation</h2>
            <p className="text-white/70 text-sm lo-fi-text mb-4">
              Create atmospheric videos with AI-generated visuals.
            </p>
            <div className="bg-yellow-600/20 border border-yellow-600/50 p-4 text-yellow-200 text-sm lo-fi-text">
              ⚠ Video generation features coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 