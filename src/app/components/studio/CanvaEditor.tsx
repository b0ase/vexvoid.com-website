'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'

interface CanvaDesign {
  id: string
  title: string
  thumbnail: {
    url: string
  }
  urls: {
    edit_url: string
    view_url: string
  }
  updated_at: string
}

interface AutofillJob {
  id: string
  status: 'in_progress' | 'success' | 'failed'
  design?: {
    id: string
    urls: {
      edit_url: string
    }
  }
}

export default function CanvaEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [designs, setDesigns] = useState<CanvaDesign[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<CanvaDesign | null>(null)
  const [autofillJob, setAutofillJob] = useState<AutofillJob | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
    
    // Check URL params for OAuth callback
    const params = new URLSearchParams(window.location.search)
    if (params.get('canva_success')) {
      setIsAuthenticated(true)
      fetchDesigns()
      // Clean up URL
      window.history.replaceState({}, '', '/studio')
    }
    if (params.get('canva_error')) {
      setError(`Canva OAuth error: ${params.get('canva_error')}`)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/canva/designs')
      setIsAuthenticated(response.status !== 401)
      if (response.ok) {
        const data = await response.json()
        setDesigns(data.designs || [])
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    }
  }

  const authenticate = () => {
    window.location.href = '/api/canva/auth'
  }

  const fetchDesigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/canva/designs?query=V3X VOID')
      if (response.ok) {
        const data = await response.json()
        setDesigns(data.designs || [])
      } else {
        setError('Failed to fetch designs')
      }
    } catch (err) {
      setError('Error fetching designs')
    } finally {
      setLoading(false)
    }
  }

  const duplicateDesign = async (design: CanvaDesign) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/canva/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'duplicate',
          designId: design.id,
          title: `V3X VOID Edit - ${new Date().toISOString().split('T')[0]}`
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Open the duplicated design in a new tab
        window.open(data.design.urls.edit_url, '_blank')
        fetchDesigns() // Refresh the list
      } else {
        setError('Failed to duplicate design')
      }
    } catch (err) {
      setError('Error duplicating design')
    } finally {
      setLoading(false)
    }
  }

  const applyVexVoidAutofill = async (design: CanvaDesign) => {
    setLoading(true)
    setError(null)
    try {
      const vexVoidData = {
        title: 'V3X V0ID',
        subtitle: 'UNDERGROUND COLLECTIVE',
        // You can add more V3X VOID specific data here
        // logoUrl: 'your-uploaded-logo-asset-id',
        // backgroundVideoUrl: 'your-video-asset-id',
        // musicUrl: 'your-music-asset-id'
      }

      const response = await fetch('/api/canva/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: design.id,
          vexVoidData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAutofillJob(data.job)
        // Poll for job completion
        pollAutofillStatus(data.job.id)
      } else {
        setError('Failed to apply V3X VOID autofill')
      }
    } catch (err) {
      setError('Error applying autofill')
    } finally {
      setLoading(false)
    }
  }

  const pollAutofillStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/canva/autofill?jobId=${jobId}`)
        if (response.ok) {
          const data = await response.json()
          setAutofillJob(data.job)
          
          if (data.status === 'success') {
            // Job completed successfully
            if (data.edit_url) {
              window.open(data.edit_url, '_blank')
            }
          } else if (data.status === 'failed') {
            setError('Autofill job failed')
          } else if (data.status === 'in_progress') {
            // Continue polling
            setTimeout(poll, 2000)
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }
    
    poll()
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-black/50 border border-white/20 p-6 space-y-4">
        <h3 className="text-lg font-bold lo-fi-text text-white">🎨 Canva Video Editor</h3>
        <div className="space-y-3">
          <p className="text-white/70 text-sm">
            Connect to Canva to programmatically edit V3X VOID videos with AI assistance.
          </p>
          <Button 
            onClick={authenticate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            🔗 Connect to Canva
          </Button>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/50 border border-white/20 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold lo-fi-text text-white">🎨 Canva Video Editor</h3>
        <Button 
          onClick={fetchDesigns}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
        >
          {loading ? '⟳' : '🔄'} Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {autofillJob && (
        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
          <p className="text-blue-400 text-sm">
            Autofill job status: <span className="font-bold">{autofillJob.status}</span>
          </p>
          {autofillJob.status === 'in_progress' && (
            <p className="text-blue-300 text-xs mt-1">Processing V3X VOID content...</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-white font-semibold text-sm">V3X VOID Designs</h4>
        
        {designs.length === 0 ? (
          <p className="text-white/50 text-sm">
            No V3X VOID designs found. Create some in Canva first, then refresh.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designs.map((design) => (
              <div 
                key={design.id}
                className="border border-white/10 rounded p-3 space-y-3"
              >
                <div className="flex items-start space-x-3">
                  {design.thumbnail?.url && (
                    <img 
                      src={design.thumbnail.url}
                      alt={design.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="text-white text-sm font-medium">{design.title}</h5>
                    <p className="text-white/50 text-xs">
                      Updated: {new Date(design.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => window.open(design.urls.edit_url, '_blank')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-xs"
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    onClick={() => duplicateDesign(design)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                  >
                    📋 Duplicate
                  </Button>
                  <Button 
                    onClick={() => applyVexVoidAutofill(design)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs"
                  >
                    🤖 V3X Autofill
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <h4 className="text-white font-semibold text-sm mb-2">Quick Actions</h4>
        <div className="flex space-x-2">
          <Button 
            onClick={() => window.open('https://www.canva.com/create/videos/', '_blank')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 text-xs"
          >
            ➕ Create New Video
          </Button>
        </div>
      </div>
    </div>
  )
} 