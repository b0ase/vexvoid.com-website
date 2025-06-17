'use client';

import { useState, useEffect } from 'react';

interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  duration?: number;
  hasAudio?: boolean;
  thumbnail?: string;
}

interface TimelineTrack {
  id: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  clips: TimelineClip[];
  muted?: boolean;
  volume?: number;
}

interface TimelineClip {
  id: string;
  assetId: string;
  startTime: number;
  duration: number;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  transition?: 'cut' | 'fade' | 'dissolve' | 'wipe';
}

export default function CinematicEditor() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [timeline, setTimeline] = useState<TimelineTrack[]>([
    { id: 'video1', type: 'video', name: 'Video Track 1', clips: [] },
    { id: 'video2', type: 'video', name: 'Video Track 2', clips: [] },
    { id: 'images', type: 'image', name: 'Image Overlay', clips: [] },
    { id: 'music', type: 'audio', name: 'Music Track', clips: [], volume: 0.8 },
    { id: 'atmosphere', type: 'audio', name: 'Atmosphere', clips: [], volume: 0.3 }
  ]);
  
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [totalDuration, setTotalDuration] = useState(180);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoArrangeMode, setAutoArrangeMode] = useState<'random' | 'beat-sync' | 'cinematic'>('cinematic');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const mockAssets: MediaAsset[] = [
        // Videos from your collection
        ...Array.from({length: 36}, (_, i) => ({
          id: `video_${i}`,
          name: `V3X_Video_${i + 1}.mp4`,
          type: 'video' as const,
          url: `/videos/vex_video_jam_01/video_${i + 1}.mp4`,
          duration: Math.random() * 30 + 10,
          hasAudio: Math.random() > 0.3,
          thumbnail: `/videos/vex_video_jam_01/thumb_${i + 1}.jpg`
        })),
        
        // Graffiti images
        ...Array.from({length: 76}, (_, i) => ({
          id: `graf_${i}`,
          name: `Graffiti_${i + 1}.jpg`,
          type: 'image' as const,
          url: `/images/VexVoid_graf_train_jam/IMG_${5420 + i}.JPG`,
          duration: 5,
          thumbnail: `/images/VexVoid_graf_train_jam/IMG_${5420 + i}.JPG`
        })),
        
        // Music tracks
        {
          id: 'music_1',
          name: 'Echoes in the Abyss.mp3',
          type: 'audio' as const,
          url: '/music/Echoes in the Abyss.mp3',
          duration: 180
        }
      ];
      
      setAssets(mockAssets);
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  };

  const autoArrangeClips = async () => {
    setIsGenerating(true);
    
    try {
      const videoAssets = assets.filter(a => a.type === 'video');
      const imageAssets = assets.filter(a => a.type === 'image');
      const musicAssets = assets.filter(a => a.type === 'audio');

      const clearedTimeline: TimelineTrack[] = timeline.map(track => ({ ...track, clips: [] as TimelineClip[] }));
      
      // Generate cinematic arrangement
      let currentTime = 0;
      const video1Track = clearedTimeline.find(t => t.id === 'video1');
      const musicTrack = clearedTimeline.find(t => t.id === 'music');

      // Add music
      if (musicTrack && musicAssets.length > 0) {
        const selectedMusic = musicAssets[Math.floor(Math.random() * musicAssets.length)];
        musicTrack.clips.push({
          id: `music_${Date.now()}`,
          assetId: selectedMusic.id,
          startTime: 0,
          duration: Math.min(selectedMusic.duration || totalDuration, totalDuration),
          fadeIn: 2,
          fadeOut: 3
        });
      }

      // Add video clips
      while (currentTime < totalDuration && video1Track && videoAssets.length > 0) {
        const video = videoAssets[Math.floor(Math.random() * videoAssets.length)];
        const clipDuration = Math.min(
          Math.random() * 15 + 8,
          totalDuration - currentTime
        );
        
        video1Track.clips.push({
          id: `v1_${Date.now()}_${currentTime}`,
          assetId: video.id,
          startTime: currentTime,
          duration: clipDuration,
          transition: 'fade',
          fadeIn: 1,
          fadeOut: 1,
          volume: video.hasAudio ? 0.3 : 0
        });

        currentTime += clipDuration;
      }

      setTimeline(clearedTimeline);
      
    } catch (error) {
      console.error('Auto-arrange failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportVideo = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/video/compose-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeline,
          duration: totalDuration,
          resolution: '1080p',
          format: 'mp4'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Upload to YouTube
        const uploadResponse = await fetch('/api/youtube/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoUrl: result.videoUrl,
            title: `VEX VOID - ${autoArrangeMode} Composition ${new Date().toISOString().split('T')[0]}`,
            description: `Auto-generated VEX VOID video using ${autoArrangeMode} arrangement.`
          })
        });

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/50 border border-purple-500/20 p-6">
        <h3 className="text-xl font-bold lo-fi-text mb-4 text-purple-400">🎬 CINEMATIC EDITING SUITE</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Video Assets</div>
            <div className="text-purple-300">{assets.filter(a => a.type === 'video').length} clips</div>
            <div className="text-white/70">Professional footage</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Image Assets</div>
            <div className="text-purple-300">{assets.filter(a => a.type === 'image').length} images</div>
            <div className="text-white/70">Graffiti + landscapes</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Audio Tracks</div>
            <div className="text-purple-300">{assets.filter(a => a.type === 'audio').length} tracks</div>
            <div className="text-white/70">VEX VOID music</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Timeline</div>
            <div className="text-purple-300">{formatTime(totalDuration)}</div>
            <div className="text-white/70">Target duration</div>
          </div>
        </div>
      </div>

      {/* Auto-Arrange Controls */}
      <div className="bg-black/50 border border-white/20 p-6">
        <h4 className="text-lg font-bold lo-fi-text mb-4">🎭 Auto-Arrange</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white text-sm lo-fi-text mb-2">Arrangement Style:</label>
            <select
              value={autoArrangeMode}
              onChange={(e) => setAutoArrangeMode(e.target.value as any)}
              className="w-full bg-black border border-white/20 text-white p-2 text-sm lo-fi-text"
            >
              <option value="cinematic">🎬 Cinematic (Smooth transitions, layered)</option>
              <option value="beat-sync">🎵 Beat-Sync (Cut on beats, rhythmic)</option>
              <option value="random">🎲 Random (Chaotic, experimental)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm lo-fi-text mb-2">
              Duration: {formatTime(totalDuration)}
            </label>
            <input
              type="range"
              min="60"
              max="600"
              value={totalDuration}
              onChange={(e) => setTotalDuration(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={autoArrangeClips}
            disabled={isGenerating}
            className={`px-6 py-3 lo-fi-text font-bold transition-colors ${
              isGenerating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isGenerating ? '🎬 GENERATING...' : '🎭 AUTO-ARRANGE'}
          </button>
          
          <button
            onClick={exportVideo}
            disabled={isGenerating || timeline.every(t => t.clips.length === 0)}
            className={`px-6 py-3 lo-fi-text font-bold transition-colors ${
              isGenerating || timeline.every(t => t.clips.length === 0)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isGenerating ? '📤 EXPORTING...' : '📤 EXPORT & UPLOAD'}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-black/50 border border-white/20 p-6">
        <h4 className="text-lg font-bold lo-fi-text mb-4">🎞️ Timeline</h4>
        
        <div className="space-y-3">
          {timeline.map(track => (
            <div key={track.id} className="border border-white/10 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold text-sm">{track.name}</span>
                <div className="flex gap-2 text-xs">
                  <span className="text-white/70">{track.clips.length} clips</span>
                  {track.type === 'audio' && (
                    <span className="text-green-400">Vol: {Math.round((track.volume || 1) * 100)}%</span>
                  )}
                </div>
              </div>
              
              <div className="h-8 bg-black/30 border border-white/20 relative overflow-hidden">
                {track.clips.map(clip => {
                  const asset = assets.find(a => a.id === clip.assetId);
                  const leftPercent = (clip.startTime / totalDuration) * 100;
                  const widthPercent = (clip.duration / totalDuration) * 100;
                  
                  return (
                    <div
                      key={clip.id}
                      className={`absolute h-full border-r border-white/30 ${
                        track.type === 'video' ? 'bg-blue-500/50' :
                        track.type === 'image' ? 'bg-green-500/50' :
                        'bg-yellow-500/50'
                      }`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                      title={asset?.name || 'Unknown asset'}
                    >
                      <div className="text-xs text-white p-1 truncate">
                        {asset?.name?.substring(0, 10)}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Browser */}
      <div className="bg-black/50 border border-white/20 p-6">
        <h4 className="text-lg font-bold lo-fi-text mb-4">📁 Asset Browser</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
          {assets.slice(0, 50).map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`border p-2 cursor-pointer transition-colors ${
                selectedAsset?.id === asset.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {asset.type === 'image' ? (
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  className="w-full h-16 object-cover mb-1"
                />
              ) : (
                <div className={`w-full h-16 flex items-center justify-center text-2xl mb-1 ${
                  asset.type === 'video' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                }`}>
                  {asset.type === 'video' ? '🎬' : '🎵'}
                </div>
              )}
              
              <div className="text-xs text-white truncate">{asset.name}</div>
              <div className="text-xs text-white/50">
                {asset.duration ? formatTime(asset.duration) : 'N/A'}
                {asset.hasAudio && ' 🔊'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
