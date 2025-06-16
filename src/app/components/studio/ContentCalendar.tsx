'use client'

import { useState, useEffect } from 'react'

interface ContentItem {
  id: string
  title: string
  type: 'video' | 'audio' | 'live'
  status: 'scheduled' | 'in-progress' | 'completed' | 'published'
  scheduledDate: string
  publishedDate?: string
  duration?: string
  views?: number
  description?: string
}

interface ContentCalendarProps {}

export default function ContentCalendar({}: ContentCalendarProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isAddingContent, setIsAddingContent] = useState(false)
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    type: 'video',
    status: 'scheduled',
    scheduledDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadContentItems()
  }, [])

  const loadContentItems = () => {
    // Mock data - in real app, load from database
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Echoes in the Abyss - Visual Mix',
        type: 'video',
        status: 'published',
        scheduledDate: '2024-01-15',
        publishedDate: '2024-01-15',
        duration: '2:24',
        views: 1200,
        description: 'Dark ambient track with generative visuals'
      },
      {
        id: '2',
        title: 'Shadowed Depths - Atmospheric Journey',
        type: 'video',
        status: 'completed',
        scheduledDate: '2024-01-18',
        duration: '4:06',
        description: 'Deep atmospheric composition with particle effects'
      },
      {
        id: '3',
        title: 'Midnight Reverie - Live Performance',
        type: 'live',
        status: 'scheduled',
        scheduledDate: '2024-01-22',
        duration: '45:00',
        description: 'Live streaming session with real-time visuals'
      }
    ]
    setContentItems(mockContent)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 border-blue-400/30'
      case 'in-progress': return 'text-yellow-400 border-yellow-400/30'
      case 'completed': return 'text-green-400 border-green-400/30'
      case 'published': return 'text-purple-400 border-purple-400/30'
      default: return 'text-white/70 border-white/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬'
      case 'audio': return '🎵'
      case 'live': return '🔴'
      default: return '📄'
    }
  }

  const filteredContent = contentItems.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  )

  const addContent = () => {
    if (!newContent.title) return

    const content: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title,
      type: newContent.type || 'video',
      status: newContent.status || 'scheduled',
      scheduledDate: newContent.scheduledDate || new Date().toISOString().split('T')[0],
      duration: newContent.duration,
      description: newContent.description
    }

    setContentItems(prev => [...prev, content])
    setNewContent({
      type: 'video',
      status: 'scheduled',
      scheduledDate: new Date().toISOString().split('T')[0]
    })
    setIsAddingContent(false)
  }

  const updateContentStatus = (id: string, newStatus: ContentItem['status']) => {
    setContentItems(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: newStatus,
            publishedDate: newStatus === 'published' ? new Date().toISOString().split('T')[0] : item.publishedDate
          }
        : item
    ))
  }

  const getContentStats = () => {
    const total = contentItems.length
    const published = contentItems.filter(item => item.status === 'published').length
    const scheduled = contentItems.filter(item => item.status === 'scheduled').length
    const inProgress = contentItems.filter(item => item.status === 'in-progress').length
    
    return { total, published, scheduled, inProgress }
  }

  const stats = getContentStats()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-white/20 p-3 text-center">
          <div className="text-lg lo-fi-text">{stats.total}</div>
          <div className="text-xs text-white/70">TOTAL CONTENT</div>
        </div>
        <div className="border border-purple-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-purple-400">{stats.published}</div>
          <div className="text-xs text-white/70">PUBLISHED</div>
        </div>
        <div className="border border-blue-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-blue-400">{stats.scheduled}</div>
          <div className="text-xs text-white/70">SCHEDULED</div>
        </div>
        <div className="border border-yellow-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-yellow-400">{stats.inProgress}</div>
          <div className="text-xs text-white/70">IN PROGRESS</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filterStatus === 'all'
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filterStatus === 'scheduled'
                ? 'border-blue-400 bg-blue-400 text-black'
                : 'border-blue-400/30 text-blue-400 hover:bg-blue-400/10'
            }`}
          >
            SCHEDULED
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
              filterStatus === 'published'
                ? 'border-purple-400 bg-purple-400 text-black'
                : 'border-purple-400/30 text-purple-400 hover:bg-purple-400/10'
            }`}
          >
            PUBLISHED
          </button>
        </div>

        {/* Add Content */}
        <button
          onClick={() => setIsAddingContent(true)}
          className="px-4 py-1 text-xs lo-fi-text border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors"
        >
          + ADD CONTENT
        </button>
      </div>

      {/* Add Content Form */}
      {isAddingContent && (
        <div className="border border-green-500/50 bg-green-500/10 p-4">
          <h3 className="text-sm lo-fi-text text-green-400 mb-4">📝 Add New Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/70 mb-1">Title</label>
              <input
                type="text"
                value={newContent.title || ''}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-green-400"
                placeholder="Content title..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Type</label>
              <select
                value={newContent.type || 'video'}
                onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as ContentItem['type'] }))}
                className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-green-400"
              >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={newContent.scheduledDate || ''}
                onChange={(e) => setNewContent(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Duration</label>
              <input
                type="text"
                value={newContent.duration || ''}
                onChange={(e) => setNewContent(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full bg-black border border-white/20 p-2 text-white text-xs lo-fi-text focus:outline-none focus:border-green-400"
                placeholder="e.g., 3:24"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addContent}
              className="px-4 py-2 text-xs lo-fi-text border border-green-400 bg-green-400 text-black hover:bg-green-500 transition-colors"
            >
              ADD CONTENT
            </button>
            <button
              onClick={() => setIsAddingContent(false)}
              className="px-4 py-2 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-3">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className={`border p-4 transition-colors ${getStatusColor(item.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                  <h4 className="text-sm lo-fi-text">{item.title}</h4>
                  <span className={`px-2 py-1 text-xs border ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/70 mb-2">
                  <div>
                    <span className="text-white/50">Scheduled:</span> {item.scheduledDate}
                  </div>
                  {item.publishedDate && (
                    <div>
                      <span className="text-white/50">Published:</span> {item.publishedDate}
                    </div>
                  )}
                  {item.duration && (
                    <div>
                      <span className="text-white/50">Duration:</span> {item.duration}
                    </div>
                  )}
                  {item.views && (
                    <div>
                      <span className="text-white/50">Views:</span> {item.views.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-xs text-white/60">{item.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {/* Status Update Buttons */}
                {item.status === 'scheduled' && (
                  <button
                    onClick={() => updateContentStatus(item.id, 'in-progress')}
                    className="px-2 py-1 text-xs border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                  >
                    START
                  </button>
                )}
                {item.status === 'in-progress' && (
                  <button
                    onClick={() => updateContentStatus(item.id, 'completed')}
                    className="px-2 py-1 text-xs border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors"
                  >
                    COMPLETE
                  </button>
                )}
                {item.status === 'completed' && (
                  <button
                    onClick={() => updateContentStatus(item.id, 'published')}
                    className="px-2 py-1 text-xs border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-colors"
                  >
                    PUBLISH
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p className="text-sm lo-fi-text">No content found matching your criteria</p>
        </div>
      )}
    </div>
  )
} 