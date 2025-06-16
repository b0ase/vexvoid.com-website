'use client';

import { useState, useEffect } from 'react';
import { 
  V3XV0ID_CONSTRAINTS, 
  PUBLIC_GENERATION_LIMITS,
  validateTrackForPublic,
  validateArtPattern,
  generateBrandCompliantTitle,
  generateBrandCompliantDescription
} from '../../lib/brandConstraints';
import { musicTracks, getRecommendedArtPattern, type MusicTrack } from '../../lib/musicLibrary';

interface PublicGeneratorProps {
  onVideoGenerated?: (videoId: string) => void;
}

export default function PublicGenerator({ onVideoGenerated }: PublicGeneratorProps) {
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userLimits, setUserLimits] = useState({
    videosToday: 0,
    lastGeneration: null as Date | null,
    canGenerate: true
  });
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Filter tracks and patterns based on brand constraints
  const allowedTracks = musicTracks.filter(track => 
    validateTrackForPublic(track.id)
  );

  const allowedPatterns = V3XV0ID_CONSTRAINTS.allowedPatterns;

  useEffect(() => {
    // Check user limits on component mount
    checkUserLimits();
    
    // Auto-select first allowed track
    if (allowedTracks.length > 0) {
      const firstTrack = allowedTracks[0];
      setSelectedTrack(firstTrack);
      setSelectedPattern(getRecommendedArtPattern(firstTrack));
    }
  }, []);

  const checkUserLimits = () => {
    // In a real app, this would check against a database
    // For now, using localStorage for demo
    const today = new Date().toDateString();
    const stored = localStorage.getItem('v3xv0id_generation_limits');
    
    if (stored) {
      const limits = JSON.parse(stored);
      if (limits.date === today) {
        setUserLimits({
          videosToday: limits.count,
          lastGeneration: limits.lastGeneration ? new Date(limits.lastGeneration) : null,
          canGenerate: limits.count < PUBLIC_GENERATION_LIMITS.maxVideosPerUser
        });
      }
    }
  };

  const updateUserLimits = () => {
    const today = new Date().toDateString();
    const now = new Date();
    
    const newLimits = {
      date: today,
      count: userLimits.videosToday + 1,
      lastGeneration: now.toISOString()
    };
    
    localStorage.setItem('v3xv0id_generation_limits', JSON.stringify(newLimits));
    
    setUserLimits({
      videosToday: newLimits.count,
      lastGeneration: now,
      canGenerate: newLimits.count < PUBLIC_GENERATION_LIMITS.maxVideosPerUser
    });
  };

  const canGenerateNow = () => {
    if (!userLimits.canGenerate) return false;
    
    if (userLimits.lastGeneration) {
      const timeSinceLastGeneration = Date.now() - userLimits.lastGeneration.getTime();
      const cooldownMs = PUBLIC_GENERATION_LIMITS.cooldownMinutes * 60 * 1000;
      return timeSinceLastGeneration >= cooldownMs;
    }
    
    return true;
  };

  const generateVideo = async () => {
    if (!selectedTrack || !canGenerateNow()) return;

    setIsGenerating(true);

    try {
      // Generate brand-compliant metadata
      const title = generateBrandCompliantTitle(selectedTrack.title, selectedPattern);
      const description = generateBrandCompliantDescription(
        selectedTrack.title, 
        selectedPattern, 
        Math.min(selectedTrack.duration || 30, V3XV0ID_CONSTRAINTS.maxDuration)
      );

      // In a real implementation, this would:
      // 1. Generate the video with strict constraints
      // 2. Queue it for approval
      // 3. Upload to YouTube after approval
      
      console.log('Generating video with constraints:', {
        title,
        description,
        track: selectedTrack,
        pattern: selectedPattern,
        constraints: V3XV0ID_CONSTRAINTS
      });

      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update user limits
      updateUserLimits();

      // Notify parent
      if (onVideoGenerated) {
        onVideoGenerated(`public-${selectedTrack.id}-${selectedPattern}-${Date.now()}`);
      }

      alert('Video submitted for approval! You will be notified when it\'s published to the V3XV0ID channel.');

    } catch (error) {
      console.error('Generation error:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTimeUntilNextGeneration = () => {
    if (!userLimits.lastGeneration) return null;
    
    const timeSinceLastGeneration = Date.now() - userLimits.lastGeneration.getTime();
    const cooldownMs = PUBLIC_GENERATION_LIMITS.cooldownMinutes * 60 * 1000;
    const timeRemaining = cooldownMs - timeSinceLastGeneration;
    
    if (timeRemaining <= 0) return null;
    
    const minutes = Math.ceil(timeRemaining / (60 * 1000));
    return minutes;
  };

  return (
    <div className="border border-white/20 p-6 bg-black/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg cyber-text">PUBLIC V3XV0ID GENERATOR</h2>
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="text-xs border border-white/30 px-2 py-1 hover:bg-white/10"
        >
          GUIDELINES
        </button>
      </div>

      {/* Guidelines Panel */}
      {showGuidelines && (
        <div className="mb-6 p-4 border border-yellow-500/50 bg-yellow-500/10">
          <h3 className="text-sm cyber-text mb-2 text-yellow-400">CONTENT GUIDELINES</h3>
          <ul className="text-xs space-y-1">
            {V3XV0ID_CONSTRAINTS.contentGuidelines.map((guideline, index) => (
              <li key={index} className="text-yellow-200">• {guideline}</li>
            ))}
          </ul>
        </div>
      )}

      {/* User Limits Display */}
      <div className="mb-6 p-3 border border-blue-500/50 bg-blue-500/10">
        <div className="text-xs space-y-1">
          <div>Daily Generations: {userLimits.videosToday}/{PUBLIC_GENERATION_LIMITS.maxVideosPerUser}</div>
          {getTimeUntilNextGeneration() && (
            <div className="text-yellow-400">
              Next generation available in: {getTimeUntilNextGeneration()} minutes
            </div>
          )}
          {!userLimits.canGenerate && (
            <div className="text-red-400">Daily limit reached. Try again tomorrow.</div>
          )}
        </div>
      </div>

      {/* Track Selection - Only Approved Tracks */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">
          APPROVED MUSIC TRACKS ({allowedTracks.length} available)
        </label>
        <select
          value={selectedTrack?.id || ''}
          onChange={(e) => {
            const track = allowedTracks.find(t => t.id === e.target.value);
            if (track) {
              setSelectedTrack(track);
              setSelectedPattern(getRecommendedArtPattern(track));
            }
          }}
          className="w-full bg-black border border-white/30 text-white text-xs p-2 font-mono"
        >
          {allowedTracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title} ({track.mood})
            </option>
          ))}
        </select>
      </div>

      {/* Pattern Selection - Only Approved Patterns */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">
          APPROVED ART PATTERNS ({allowedPatterns.length} available)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {allowedPatterns.map((pattern) => (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern)}
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

      {/* Generated Title Preview */}
      {selectedTrack && selectedPattern && (
        <div className="mb-6 p-3 border border-green-500/50 bg-green-500/10">
          <div className="text-xs cyber-text mb-1">GENERATED TITLE:</div>
          <div className="text-xs text-green-400">
            {generateBrandCompliantTitle(selectedTrack.title, selectedPattern)}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateVideo}
        disabled={isGenerating || !canGenerateNow() || !selectedTrack}
        className={`w-full py-3 px-4 text-sm font-mono transition-colors ${
          canGenerateNow() && selectedTrack && !isGenerating
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isGenerating 
          ? 'GENERATING & SUBMITTING FOR APPROVAL...' 
          : !canGenerateNow()
          ? 'COOLDOWN ACTIVE'
          : !userLimits.canGenerate
          ? 'DAILY LIMIT REACHED'
          : 'GENERATE V3XV0ID VIDEO'
        }
      </button>

      {/* Approval Notice */}
      <div className="mt-4 p-3 border border-orange-500/50 bg-orange-500/10">
        <div className="text-xs text-orange-400">
          ⚠️ All public generations require approval before publishing to maintain V3XV0ID brand quality.
          You will be notified via email when your video is approved and published.
        </div>
      </div>
    </div>
  );
} 