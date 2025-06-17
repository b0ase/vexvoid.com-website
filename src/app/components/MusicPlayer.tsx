'use client'

import { useMusicPlayer } from '../lib/musicPlayerContext'
import { musicTracks } from '../lib/musicLibrary'

export default function MusicPlayer() {
  const {
    isGlobalPlayerVisible,
    isPlaying,
    currentTrack,
    currentTrackTitle,
    showPlaylist,
    isLoading,
    autoPlay,
    hasUserInteracted,
    connectionStatus,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    setShowPlaylist,
    setAutoPlay
  } = useMusicPlayer()

  // Don't render if globally hidden (projection mode)
  if (!isGlobalPlayerVisible) {
    return null
  }

  return (
    <div className="fixed z-50 
                    top-4 right-4 
                    md:top-4 md:right-4 
                    max-md:top-4 max-md:left-1/2 max-md:-translate-x-1/2">
      {/* Compact Player Box - Medium Size, Responsive Width */}
      <div className="bg-black/95 border border-white p-3 text-white lo-fi-text 
                      w-72 max-md:w-80 max-md:max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-bold">V3XV0ID MUSIC</div>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'good' ? 'bg-green-400' :
              connectionStatus === 'poor' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400 animate-pulse'
            }`} title={`Connection: ${connectionStatus}`} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`text-[10px] px-1.5 py-0.5 border transition-colors ${
                autoPlay 
                  ? 'border-green-400 text-green-400' 
                  : 'border-white/30 text-white/50'
              }`}
              title="Auto-play mode"
            >
              {autoPlay ? 'RAND' : 'SEQ'}
            </button>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-xs hover:text-cyan-400 transition-colors"
              title="Show playlist"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Now Playing */}
        <div className="mb-2">
          <div className="text-[10px] text-white/60 mb-1">
            {isPlaying ? 'NOW PLAYING:' : (!hasUserInteracted ? 'CLICK ▶ TO START:' : 'PAUSED:')}
          </div>
          <div className="text-xs font-medium truncate" title={currentTrackTitle}>
            {currentTrackTitle}
          </div>
          <div className="text-[10px] text-white/50 mt-1">
            Track {currentTrack + 1} of {musicTracks.length} • {autoPlay ? 'Random' : 'Sequential'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevTrack}
              className="text-sm hover:text-cyan-400 transition-colors"
              title="Previous track"
            >
              ⏮
            </button>
            
            <button
              onClick={togglePlay}
              className="text-base hover:text-cyan-400 transition-colors mx-1"
              disabled={isLoading}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? '⏳' : (isPlaying ? '⏸' : '▶')}
            </button>
            
            <button
              onClick={nextTrack}
              className="text-sm hover:text-cyan-400 transition-colors"
              title="Next track"
            >
              ⏭
            </button>
          </div>

          <div className="text-[10px] text-white/50">
            ATMOSPHERIC • ELECTRONIC
          </div>
        </div>

        {/* Playlist Dropdown */}
        {showPlaylist && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-[10px] text-white/60 mb-2 border-b border-white/20 pb-1">
                SELECT TRACK ({musicTracks.length} available)
              </div>
              {musicTracks.map((track, index) => (
                <div
                  key={index}
                  onClick={() => selectTrack(index)}
                  className={`cursor-pointer text-xs p-1.5 hover:bg-white/10 transition-colors ${
                    index === currentTrack ? 'bg-white/20 text-cyan-400' : 'text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{index + 1}. {track.title}</span>
                    {index === currentTrack && (
                      <span className="text-cyan-400 ml-2 text-xs">
                        {isPlaying ? '♪' : '▫'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 