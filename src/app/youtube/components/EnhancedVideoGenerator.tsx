'use client';

import { useState, useEffect } from 'react';
import { musicTracks, getRandomTrack, getRecommendedArtPattern, loadAudioMetadata, type MusicTrack } from '../../lib/musicLibrary';
import { generateFrames, artPatterns, type ArtPatternName } from '../../lib/generativeArt';
import { createVideoFromFrames } from '../../lib/videoEncoder';

interface EnhancedVideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void;
}

export default function EnhancedVideoGenerator({ onVideoGenerated }: EnhancedVideoGeneratorProps) {
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<ArtPatternName>('organicFlow');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Auto-select random track on mount
  useEffect(() => {
    const randomTrack = getRandomTrack();
    setSelectedTrack(randomTrack);
    setSelectedPattern(getRecommendedArtPattern(randomTrack) as ArtPatternName);
  }, []);

  const handleTrackChange = (trackId: string) => {
    const track = musicTracks.find(t => t.id === trackId);
    if (track) {
      setSelectedTrack(track);
      setSelectedPattern(getRecommendedArtPattern(track) as ArtPatternName);
    }
  };

  const generateVideo = async () => {
    if (!selectedTrack) return;

    setIsGenerating(true);
    setProgress(0);
    setStatus('Initializing...');

    try {
      // Step 1: Load audio metadata
      setStatus('Loading audio metadata...');
      setProgress(10);
      const trackWithMetadata = await loadAudioMetadata(selectedTrack);
      
      // Step 2: Generate art frames
      setStatus('Generating art frames...');
      setProgress(20);
      
      const frames = await generateFrames(selectedPattern, {
        width: 1920,
        height: 1080,
        duration: Math.min(trackWithMetadata.duration || 30, 60), // Max 60 seconds
        frameRate: 30,
        backgroundColor: '#000000',
        strokeColor: '#ffffff',
        strokeWeight: 1
      });
      
      setProgress(60);
      setStatus('Loading audio file...');
      
      // Step 3: Load audio file
      const audioResponse = await fetch(selectedTrack.path);
      const audioBlob = await audioResponse.blob();
      
      setProgress(70);
      setStatus('Creating video...');
      
      // Step 4: Create video from frames
      const videoBlob = await createVideoFromFrames(frames, audioBlob, {
        fps: 30,
        width: 1920,
        height: 1080
      });
      
      setProgress(90);
      setStatus('Finalizing...');
      
      // Step 5: Create download URL
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);
      
      setProgress(100);
      setStatus('Video generated successfully!');
      
      // Notify parent component
      if (onVideoGenerated) {
        onVideoGenerated(`${selectedTrack.id}-${selectedPattern}-${Date.now()}`);
      }
      
    } catch (error) {
      console.error('Video generation error:', error);
      setStatus(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (generatedVideoUrl && selectedTrack) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `${selectedTrack.title} - ${selectedPattern} - V3XV0ID.mp4`;
      link.click();
    }
  };

  return (
    <div className="border border-white/20 p-6 bg-black/50">
      <h2 className="text-lg cyber-text mb-6">ENHANCED VIDEO GENERATOR</h2>
      
      {/* Track Selection */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">SELECT MUSIC TRACK</label>
        <select
          value={selectedTrack?.id || ''}
          onChange={(e) => handleTrackChange(e.target.value)}
          className="w-full bg-black border border-white/30 text-white text-xs p-2 font-mono"
        >
          {musicTracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title} ({track.mood})
            </option>
          ))}
        </select>
      </div>

      {/* Pattern Selection */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">ART PATTERN</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(artPatterns).map((pattern) => (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern as ArtPatternName)}
              className={`p-2 text-xs font-mono border transition-colors ${
                selectedPattern === pattern
                  ? 'border-white bg-white text-black'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {pattern.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Track Info */}
      {selectedTrack && (
        <div className="mb-6 p-3 border border-white/20 bg-black/30">
          <div className="text-xs cyber-text mb-1">SELECTED COMBINATION</div>
          <div className="text-xs text-white/80">
            🎵 {selectedTrack.title}
          </div>
          <div className="text-xs text-white/80">
            🎨 {selectedPattern.replace(/([A-Z])/g, ' $1')} Visuals
          </div>
          <div className="text-xs text-white/80">
            🎭 Mood: {selectedTrack.mood}
          </div>
        </div>
      )}

      {/* Generation Controls */}
      <div className="mb-6">
        <button
          onClick={generateVideo}
          disabled={isGenerating || !selectedTrack}
          className="w-full bg-white text-black py-3 px-4 text-sm font-mono hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE VIDEO'}
        </button>
      </div>

      {/* Progress */}
      {isGenerating && (
        <div className="mb-6">
          <div className="text-xs cyber-text mb-2">PROGRESS: {progress}%</div>
          <div className="w-full bg-white/20 h-2">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-white/70 mt-1">{status}</div>
        </div>
      )}

      {/* Generated Video */}
      {generatedVideoUrl && (
        <div className="border border-green-500/50 bg-green-500/10 p-4">
          <div className="text-xs cyber-text text-green-400 mb-3">VIDEO GENERATED SUCCESSFULLY</div>
          
          <video
            src={generatedVideoUrl}
            controls
            className="w-full mb-3 border border-white/30"
            style={{ maxHeight: '300px' }}
          />
          
          <div className="flex gap-2">
            <button
              onClick={downloadVideo}
              className="flex-1 bg-green-600 text-white py-2 px-3 text-xs font-mono hover:bg-green-700 transition-colors"
            >
              DOWNLOAD MP4
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement YouTube upload
                alert('YouTube upload coming soon! For now, download and upload manually.');
              }}
              className="flex-1 bg-red-600 text-white py-2 px-3 text-xs font-mono hover:bg-red-700 transition-colors"
            >
              UPLOAD TO YOUTUBE
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="border border-white/20 p-2">
          <div className="text-xs cyber-text">{musicTracks.length}</div>
          <div className="text-[10px] text-white/70">TRACKS</div>
        </div>
        <div className="border border-white/20 p-2">
          <div className="text-xs cyber-text">{Object.keys(artPatterns).length}</div>
          <div className="text-[10px] text-white/70">PATTERNS</div>
        </div>
        <div className="border border-white/20 p-2">
          <div className="text-xs cyber-text">{musicTracks.length * Object.keys(artPatterns).length}</div>
          <div className="text-[10px] text-white/70">COMBINATIONS</div>
        </div>
      </div>

      {/* Batch Generation Hint */}
      <div className="mt-4 text-xs text-white/50 text-center">
        💡 Tip: Each track has a recommended art pattern based on its mood
      </div>
    </div>
  );
} 