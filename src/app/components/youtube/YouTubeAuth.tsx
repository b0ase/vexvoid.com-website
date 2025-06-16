'use client'

import { useState } from 'react'

interface YouTubeAuthProps {
  onAuthChange: (isAuthenticated: boolean) => void
}

export default function YouTubeAuth({ onAuthChange }: YouTubeAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    setIsLoading(true)
    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsAuthenticated(true)
      onAuthChange(true)
    } catch (error) {
      console.error('YouTube auth failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setIsAuthenticated(false)
    onAuthChange(false)
  }

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <div>
          <p className="text-white/70 text-sm lo-fi-text mb-4">
            Connect to YouTube to enable video uploads
          </p>
          <button
            onClick={handleAuth}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 lo-fi-text transition-colors"
          >
            {isLoading ? 'Connecting...' : 'Connect YouTube'}
          </button>
        </div>
      ) : (
        <div className="bg-green-600/20 border border-green-600/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm lo-fi-text">✓ YouTube Connected</p>
              <p className="text-white/70 text-xs">Ready to upload videos</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm lo-fi-text"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 