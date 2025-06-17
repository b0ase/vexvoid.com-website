'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MusicPlayerContextType {
  isGlobalPlayerVisible: boolean
  hideGlobalPlayer: () => void
  showGlobalPlayer: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [isGlobalPlayerVisible, setIsGlobalPlayerVisible] = useState(true)

  const hideGlobalPlayer = () => setIsGlobalPlayerVisible(false)
  const showGlobalPlayer = () => setIsGlobalPlayerVisible(true)

  return (
    <MusicPlayerContext.Provider value={{
      isGlobalPlayerVisible,
      hideGlobalPlayer,
      showGlobalPlayer
    }}>
      {children}
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