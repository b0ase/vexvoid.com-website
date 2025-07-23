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
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Multiple autoplay strategies
    const attemptAutoplay = async () => {
      if (!audioRef.current) return
      
      try {
        // Strategy 1: Immediate autoplay attempt
        await audioRef.current.play()
        setIsPlaying(true)
        setHasUserInteracted(true)
        console.log('Autoplay successful - immediate')
        return
      } catch (error) {
        console.log('Immediate autoplay blocked:', error)
      }
      
      // Strategy 2: Try after short delay
      setTimeout(async () => {
        if (audioRef.current && !hasUserInteracted) {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
            setHasUserInteracted(true)
            console.log('Autoplay successful - delayed')
            return
          } catch (error) {
            console.log('Delayed autoplay blocked:', error)
          }
        }
      }, 1000)
      
      // Strategy 3: Try after page interaction (click, scroll, etc)
      const handleFirstInteraction = async () => {
        if (audioRef.current && !isPlaying && !hasUserInteracted) {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
            setHasUserInteracted(true)
            console.log('Autoplay successful - after interaction')
            
            // Remove listeners after successful play
            document.removeEventListener('click', handleFirstInteraction)
            document.removeEventListener('scroll', handleFirstInteraction)
            document.removeEventListener('keydown', handleFirstInteraction)
            document.removeEventListener('touchstart', handleFirstInteraction)
            document.removeEventListener('touchmove', handleFirstInteraction)
            document.removeEventListener('touchend', handleFirstInteraction)
          } catch (error) {
            console.log('Interaction-triggered autoplay failed:', error)
          }
        }
      }
      
      // Add interaction listeners (more aggressive on mobile)
      document.addEventListener('click', handleFirstInteraction, { once: false })
      document.addEventListener('scroll', handleFirstInteraction, { once: false })
      document.addEventListener('keydown', handleFirstInteraction, { once: false })
      document.addEventListener('touchstart', handleFirstInteraction, { once: false })
      
      if (isMobile) {
        // Additional mobile-specific listeners
        document.addEventListener('touchmove', handleFirstInteraction, { once: false })
        document.addEventListener('touchend', handleFirstInteraction, { once: false })
        document.addEventListener('gesturestart', handleFirstInteraction, { once: false })
        document.addEventListener('gesturechange', handleFirstInteraction, { once: false })
        document.addEventListener('gestureend', handleFirstInteraction, { once: false })
        
        // Try more frequently on mobile
        const mobileRetryInterval = setInterval(async () => {
          if (audioRef.current && !isPlaying && !hasUserInteracted) {
            try {
              await audioRef.current.play()
              setIsPlaying(true)
              setHasUserInteracted(true)
              console.log('Mobile retry autoplay successful')
              clearInterval(mobileRetryInterval)
            } catch (error) {
              // Silent fail, will keep trying
            }
          }
        }, 2000)
        
        // Stop trying after 30 seconds
        setTimeout(() => clearInterval(mobileRetryInterval), 30000)
      }
      
      // Cleanup listeners after 15 seconds (longer for mobile)
      setTimeout(() => {
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('scroll', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
        document.removeEventListener('touchmove', handleFirstInteraction)
        document.removeEventListener('touchend', handleFirstInteraction)
      }, 15000)
    }

    // Start autoplay attempts after audio is loaded
    const timer = setTimeout(attemptAutoplay, 500)
    return () => clearTimeout(timer)
  }, [])

  // Get current track URL dynamically
  const getCurrentTrackUrl = () => {
    const track = musicTracks[currentTrack]
    // Generate Supabase URL dynamically
    const supabaseUrl = getMusicUrl(track.filename)
    console.log(`Track ${currentTrack}: ${track.title}`)
    console.log(`Supabase URL: ${supabaseUrl}`)
    console.log(`Fallback path: ${track.path}`)
    return supabaseUrl || track.path
  }

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const newUrl = getCurrentTrackUrl()
      console.log('=== TRACK CHANGE ===')
      console.log('Loading track:', musicTracks[currentTrack].title, 'from:', newUrl)
      console.log('Current track index:', currentTrack)
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
    console.log('Track ended, current track:', currentTrack, musicTracks[currentTrack]?.title)
    if (autoPlay) {
      const nextIndex = getRandomTrack()
      console.log('Next track index:', nextIndex, musicTracks[nextIndex]?.title)
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
    
    // Try autoplay when audio is loaded and ready
    if (!hasUserInteracted && !isPlaying && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        setHasUserInteracted(true)
        console.log('Autoplay successful - on loaded data')
      }).catch(() => {
        console.log('Autoplay blocked - on loaded data')
      })
    }
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