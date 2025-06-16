'use client'

import { useState, useEffect } from 'react'

interface AITask {
  id: string
  type: 'video-generation' | 'content-analysis' | 'scheduling' | 'optimization'
  status: 'queued' | 'running' | 'completed' | 'failed'
  title: string
  description: string
  progress: number
  startTime?: string
  endTime?: string
  result?: any
}

interface AIAgentProps {}

export default function AIAgent({}: AIAgentProps) {
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [tasks, setTasks] = useState<AITask[]>([])
  const [agentMode, setAgentMode] = useState<'manual' | 'auto' | 'scheduled'>('manual')
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    loadTasks()
    loadLogs()
  }, [])

  useEffect(() => {
    if (isAgentActive) {
      const interval = setInterval(() => {
        processTasks()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAgentActive])

  const loadTasks = () => {
    // Mock tasks
    const mockTasks: AITask[] = [
      {
        id: '1',
        type: 'video-generation',
        status: 'completed',
        title: 'Generate "Echoes in the Abyss" Video',
        description: 'Created video with organic flow algorithm and audio sync',
        progress: 100,
        startTime: '2024-01-15T10:30:00',
        endTime: '2024-01-15T10:45:00',
        result: { videoId: 'v3xv0id_1705312500', uploadedToYouTube: true }
      },
      {
        id: '2',
        type: 'content-analysis',
        status: 'completed',
        title: 'Analyze Music Library',
        description: 'Analyzed 43 tracks for BPM, mood, and visual compatibility',
        progress: 100,
        startTime: '2024-01-15T09:00:00',
        endTime: '2024-01-15T09:15:00',
        result: { tracksAnalyzed: 43, optimalPairings: 28 }
      },
      {
        id: '3',
        type: 'scheduling',
        status: 'running',
        title: 'Optimize Upload Schedule',
        description: 'Analyzing audience engagement patterns for optimal timing',
        progress: 65,
        startTime: '2024-01-15T11:00:00'
      }
    ]
    setTasks(mockTasks)
  }

  const loadLogs = () => {
    const mockLogs = [
      '[11:30:15] AI Agent initialized',
      '[11:30:16] Loaded 43 music tracks from library',
      '[11:30:17] Loaded 137 concept art images',
      '[11:30:18] Connected to YouTube API',
      '[11:30:20] Ready for content generation',
      '[11:45:32] Generated video: Echoes in the Abyss',
      '[11:45:45] Uploaded to YouTube: v3xv0id_1705312500',
      '[11:46:00] Scheduled next generation for 18:00'
    ]
    setLogs(mockLogs)
  }

  const processTasks = () => {
    setTasks(prev => prev.map(task => {
      if (task.status === 'running' && task.progress < 100) {
        const newProgress = Math.min(task.progress + Math.random() * 10, 100)
        const updatedTask = { ...task, progress: newProgress }
        
        if (newProgress >= 100) {
          updatedTask.status = 'completed'
          updatedTask.endTime = new Date().toISOString()
          addLog(`Task completed: ${task.title}`)
        }
        
        return updatedTask
      }
      return task
    }))
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)])
  }

  const startAgent = () => {
    setIsAgentActive(true)
    addLog('AI Agent activated')
    
    // Start a new task
    const newTask: AITask = {
      id: Date.now().toString(),
      type: 'video-generation',
      status: 'running',
      title: 'Generate New Content',
      description: 'Creating video with selected music and visuals',
      progress: 0,
      startTime: new Date().toISOString()
    }
    
    setTasks(prev => [newTask, ...prev])
  }

  const stopAgent = () => {
    setIsAgentActive(false)
    addLog('AI Agent deactivated')
  }

  const createManualTask = (type: AITask['type']) => {
    const taskTitles = {
      'video-generation': 'Generate Video Content',
      'content-analysis': 'Analyze Content Library',
      'scheduling': 'Optimize Publishing Schedule',
      'optimization': 'Optimize Performance'
    }

    const newTask: AITask = {
      id: Date.now().toString(),
      type,
      status: 'queued',
      title: taskTitles[type],
      description: `Manual ${type.replace('-', ' ')} task`,
      progress: 0
    }

    setTasks(prev => [newTask, ...prev])
    addLog(`Queued task: ${newTask.title}`)
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'video-generation': return '🎬'
      case 'content-analysis': return '📊'
      case 'scheduling': return '📅'
      case 'optimization': return '⚡'
      default: return '🤖'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'text-blue-400 border-blue-400/30'
      case 'running': return 'text-yellow-400 border-yellow-400/30'
      case 'completed': return 'text-green-400 border-green-400/30'
      case 'failed': return 'text-red-400 border-red-400/30'
      default: return 'text-white/70 border-white/20'
    }
  }

  const runningTasks = tasks.filter(t => t.status === 'running').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const queuedTasks = tasks.filter(t => t.status === 'queued').length

  return (
    <div className="space-y-6">
      {/* Agent Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`border p-3 text-center ${isAgentActive ? 'border-green-400/50 bg-green-400/10' : 'border-white/20'}`}>
          <div className={`text-lg lo-fi-text ${isAgentActive ? 'text-green-400' : 'text-white/70'}`}>
            {isAgentActive ? 'ACTIVE' : 'INACTIVE'}
          </div>
          <div className="text-xs text-white/70">AGENT STATUS</div>
        </div>
        <div className="border border-yellow-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-yellow-400">{runningTasks}</div>
          <div className="text-xs text-white/70">RUNNING</div>
        </div>
        <div className="border border-blue-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-blue-400">{queuedTasks}</div>
          <div className="text-xs text-white/70">QUEUED</div>
        </div>
        <div className="border border-green-400/30 p-3 text-center">
          <div className="text-lg lo-fi-text text-green-400">{completedTasks}</div>
          <div className="text-xs text-white/70">COMPLETED</div>
        </div>
      </div>

      {/* Agent Controls */}
      <div className="border border-white/20 p-4">
        <h3 className="text-sm lo-fi-text mb-4">🤖 Agent Controls</h3>
        
        <div className="flex items-center gap-4 mb-4">
          {!isAgentActive ? (
            <button
              onClick={startAgent}
              className="px-4 py-2 text-sm lo-fi-text border border-green-400 bg-green-400 text-black hover:bg-green-500 transition-colors"
            >
              START AGENT
            </button>
          ) : (
            <button
              onClick={stopAgent}
              className="px-4 py-2 text-sm lo-fi-text border border-red-400 bg-red-400 text-black hover:bg-red-500 transition-colors"
            >
              STOP AGENT
            </button>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setAgentMode('manual')}
              className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
                agentMode === 'manual'
                  ? 'border-white bg-white text-black'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => setAgentMode('auto')}
              className={`px-3 py-1 text-xs lo-fi-text border transition-colors ${
                agentMode === 'auto'
                  ? 'border-cyan-400 bg-cyan-400 text-black'
                  : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
              }`}
            >
              AUTO
            </button>
          </div>
        </div>

        {/* Manual Task Creation */}
        {agentMode === 'manual' && (
          <div className="flex gap-2">
            <button
              onClick={() => createManualTask('video-generation')}
              className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              🎬 GENERATE VIDEO
            </button>
            <button
              onClick={() => createManualTask('content-analysis')}
              className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              📊 ANALYZE CONTENT
            </button>
            <button
              onClick={() => createManualTask('scheduling')}
              className="px-3 py-1 text-xs lo-fi-text border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              📅 OPTIMIZE SCHEDULE
            </button>
          </div>
        )}
      </div>

      {/* Task Queue */}
      <div className="border border-white/20 p-4">
        <h3 className="text-sm lo-fi-text mb-4">📋 Task Queue</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`border p-3 transition-colors ${getStatusColor(task.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getTaskIcon(task.type)}</span>
                    <h4 className="text-sm lo-fi-text">{task.title}</h4>
                    <span className={`px-2 py-1 text-xs border ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-white/70 mb-2">{task.description}</p>
                  
                  {task.status === 'running' && (
                    <div className="w-full h-1 bg-black border border-white/20 mb-2">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    {task.startTime && (
                      <span>Started: {new Date(task.startTime).toLocaleTimeString()}</span>
                    )}
                    {task.endTime && (
                      <span>Completed: {new Date(task.endTime).toLocaleTimeString()}</span>
                    )}
                    {task.status === 'running' && (
                      <span>{Math.round(task.progress)}% complete</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-4 text-white/50">
            <p className="text-sm lo-fi-text">No tasks in queue</p>
          </div>
        )}
      </div>

      {/* Agent Logs */}
      <div className="border border-white/20 p-4">
        <h3 className="text-sm lo-fi-text mb-4">📝 Agent Logs</h3>
        
        <div className="bg-black border border-white/10 p-3 max-h-48 overflow-y-auto font-mono text-xs">
          {logs.map((log, index) => (
            <div key={index} className="text-green-400 mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 