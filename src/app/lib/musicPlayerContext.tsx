'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'
import { musicTracks } from './musicLibrary'
import { getMusicUrl } from './supabase'

interface MusicPlayerContextType {
  // Visibility control
  isGlobalPlayerVisible: boolean
  setIsGlobalPlayerVisible: (visible: boolean) => void
  
  // Music player state
  isPlaying: boolean
  currentTrack: number
  currentTrackTitle: string
  showPlaylist: boolean
  isLoading: boolean
  autoPlay: boolean
  hasUserInteracted: boolean
  connectionStatus: 'good' | 'poor' | 'failed'
  
  // Music player controls
  togglePlay: () => Promise<void>
  nextTrack: () => void
  prevTrack: () => void
  selectTrack: (index: number) => void
  setShowPlaylist: (show: boolean) => void
  setAutoPlay: (auto: boolean) => void
  
  // Audio ref for global access
  audioRef: React.RefObject<HTMLAudioElement>
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // Visibility state
  const [isGlobalPlayerVisible, setIsGlobalPlayerVisible] = useState(true)
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'poor' | 'failed'>('good')
  
  // Global audio ref
  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize with random track and attempt autoplay
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * musicTracks.length)
    setCurrentTrack(randomIndex)
    
    // Try to autoplay after a short delay (browsers require user interaction first)
    const autoplayTimer = setTimeout(() => {
      if (audioRef.current && !hasUserInteracted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
          setHasUserInteracted(true)
        }).catch((error) => {
          console.log('Autoplay blocked by browser:', error)
          // Autoplay blocked - this is normal, user needs to click play
        })
      }
    }, 1000)

    return () => clearTimeout(autoplayTimer)
  }, [])

  // Get current track URL dynamically
  const getCurrentTrackUrl = () => {
    const track = musicTracks[currentTrack]
    return getMusicUrl(track.filename) || track.path
  }

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const newUrl = getCurrentTrackUrl()
      console.log('Loading track:', musicTracks[currentTrack].title, 'from:', newUrl)
      audioRef.current.src = newUrl
      audioRef.current.load()
    }
  }, [currentTrack])

  // Connection monitoring
  useEffect(() => {
    const monitorConnection = setInterval(() => {
      if (audioRef.current && isPlaying) {
        if (audioRef.current.readyState < 2) {
          console.log('Audio connection seems stalled, attempting reload...')
          handleConnectionIssue()
        }
      }
    }, 30000)

    return () => clearInterval(monitorConnection)
  }, [isPlaying])

  const handleConnectionIssue = () => {
    setConnectionStatus('poor')
    
    if (retryCount < 3) {
      console.log(`Retrying connection (attempt ${retryCount + 1})`)
      setRetryCount(prev => prev + 1)
      if (audioRef.current) {
        audioRef.current.load()
        if (isPlaying) {
          setTimeout(() => {
            audioRef.current?.play().then(() => {
              setConnectionStatus('good')
            }).catch(console.error)
          }, 1000)
        }
      }
    } else {
      console.log('Max retries reached, switching to fallback')
      setConnectionStatus('failed')
      nextTrack()
      setRetryCount(0)
      setTimeout(() => setConnectionStatus('good'), 2000)
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current) return
    setIsLoading(true)
    setHasUserInteracted(true)

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsLoading(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
        setRetryCount(0)
      } catch (error) {
        console.error('Play failed:', error)
        setIsLoading(false)
        handleConnectionIssue()
      }
    }
  }

  const getRandomTrack = () => {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * musicTracks.length)
    } while (randomIndex === currentTrack && musicTracks.length > 1)
    return randomIndex
  }

  const handleTrackEnd = () => {
    if (autoPlay) {
      const nextIndex = getRandomTrack()
      setCurrentTrack(nextIndex)
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    } else {
      setIsPlaying(false)
    }
  }

  const nextTrack = () => {
    const nextIndex = autoPlay ? getRandomTrack() : (currentTrack + 1) % musicTracks.length
    setCurrentTrack(nextIndex)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const prevTrack = () => {
    const prevIndex = autoPlay ? getRandomTrack() : (currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1)
    setCurrentTrack(prevIndex)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
  }

  const handleError = (e: any) => {
    console.error('Audio error:', e)
    setIsLoading(false)
    
    if (audioRef.current && audioRef.current.src.includes('supabase') && retryCount < 2) {
      const track = musicTracks[currentTrack]
      console.log('Trying fallback to local file:', track.path)
      audioRef.current.src = track.path
      audioRef.current.load()
      setRetryCount(prev => prev + 1)
      
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current?.play().catch(() => {
            console.log('Local fallback failed, trying next track')
            nextTrack()
          })
        }, 500)
      }
    } else {
      console.log('All recovery attempts failed, trying next track')
      if (autoPlay && musicTracks.length > 1) {
        nextTrack()
      } else {
        setIsPlaying(false)
      }
      setRetryCount(0)
    }
  }

  const currentTrackTitle = musicTracks[currentTrack]?.title || 'Loading...'

  return (
    <MusicPlayerContext.Provider value={{
      // Visibility control
      isGlobalPlayerVisible,
      setIsGlobalPlayerVisible,
      
      // Music player state
      isPlaying,
      currentTrack,
      currentTrackTitle,
      showPlaylist,
      isLoading,
      autoPlay,
      hasUserInteracted,
      connectionStatus,
      
      // Music player controls
      togglePlay,
      nextTrack,
      prevTrack,
      selectTrack,
      setShowPlaylist,
      setAutoPlay,
      
      // Audio ref
      audioRef
    }}>
      {children}
      
      {/* Global Audio Element - Persists across all pages */}
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onLoadedData={handleLoadedData}
        onLoadStart={handleLoadStart}
        onError={handleError}
        onCanPlay={() => setConnectionStatus('good')}
        onWaiting={() => setConnectionStatus('poor')}
        onStalled={() => handleConnectionIssue()}
        onSuspend={() => setConnectionStatus('poor')}
        preload="metadata"
        crossOrigin="anonymous"
        style={{ display: 'none' }} // Hidden but persistent
      />
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
} 