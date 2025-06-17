'use client';

import { useState } from 'react';

interface GeneratedTrack {
  id: string;
  title: string;
  series: string;
  audio_url: string;
  supabase_url?: string;
  aesthetic_score: number;
  aesthetic_notes: string;
  metadata: any;
}

export default function VexVoidSuno() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<'midnight_mission' | 'shadow_steps' | 'aerosol_dreams' | 'four_ton_shadow' | 'experimental'>('midnight_mission');
  const [customPrompt, setCustomPrompt] = useState('');
  const [duration, setDuration] = useState(180);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [error, setError] = useState<string>('');

  const seriesInfo = {
    midnight_mission: {
      name: "Midnight Mission",
      description: "Dark ambient jazz with industrial undertones",
      bpm: "85-95",
      mood: "Tense, focused, underground",
      icon: "🌙"
    },
    shadow_steps: {
      name: "Shadow Steps", 
      description: "Downtempo electronic with jazz samples",
      bpm: "70-80",
      mood: "Mysterious, contemplative, noir",
      icon: "👤"
    },
    aerosol_dreams: {
      name: "Aerosol Dreams",
      description: "Glitch-hop with organic jazz elements", 
      bpm: "100-110",
      mood: "Creative flow state, artistic intensity",
      icon: "🎨"
    },
    four_ton_shadow: {
      name: "Four Ton Shadow",
      description: "Heavy industrial jazz fusion",
      bpm: "120-130", 
      mood: "Powerful, relentless, urban decay",
      icon: "🚂"
    },
    experimental: {
      name: "Experimental",
      description: "Genre-bending VEX VOID exploration",
      bpm: "60-140",
      mood: "Unpredictable, artistic exploration", 
      icon: "🧪"
    }
  };

  const generateTrack = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/suno/generate-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          series: selectedSeries,
          customPrompt: customPrompt || undefined,
          duration: duration
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate track');
      }

      setGeneratedTracks(prev => [data.track, ...prev]);
      setCustomPrompt(''); // Clear custom prompt after successful generation

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getAestheticScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* VEX VOID Suno Header */}
      <div className="bg-black/50 border border-green-500/20 p-6">
        <h3 className="text-xl font-bold lo-fi-text mb-4 text-green-400">🎵 VEX VOID SUNO PIPELINE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Monthly Capacity</div>
            <div className="text-green-300">500 tracks (~16/day)</div>
            <div className="text-white/70">$10 Suno subscription</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">Target Output</div>
            <div className="text-green-300">8 curated tracks/day</div>
            <div className="text-white/70">Quality over quantity</div>
          </div>
          <div className="border border-white/20 p-3">
            <div className="font-bold text-white">VEX VOID DNA</div>
            <div className="text-green-300">Ninja Jazz + Industrial</div>
            <div className="text-white/70">Train yard aesthetic</div>
          </div>
        </div>
      </div>

      {/* Track Generation Controls */}
      <div className="bg-black/50 border border-white/20 p-6">
        <h4 className="text-lg font-bold lo-fi-text mb-4">🎼 Generate New Track</h4>
        
        {/* Series Selection */}
        <div className="mb-4">
          <label className="block text-white text-sm lo-fi-text mb-2">Track Series:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(seriesInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedSeries(key as any)}
                className={`p-3 text-left border transition-colors ${
                  selectedSeries === key
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-white/20 bg-black/30 text-white hover:border-white/40'
                }`}
              >
                <div className="font-bold text-sm">{info.icon} {info.name}</div>
                <div className="text-xs text-white/70">{info.description}</div>
                <div className="text-xs text-white/50">BPM: {info.bpm}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Series Info */}
        <div className="mb-4 p-3 bg-black/30 border border-white/10">
          <div className="text-sm">
            <span className="text-green-400 font-bold">{seriesInfo[selectedSeries].icon} {seriesInfo[selectedSeries].name}</span>
            <div className="text-white/70 mt-1">{seriesInfo[selectedSeries].description}</div>
            <div className="text-white/50 text-xs mt-1">
              Mood: {seriesInfo[selectedSeries].mood} | BPM: {seriesInfo[selectedSeries].bpm}
            </div>
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="mb-4">
          <label className="block text-white text-sm lo-fi-text mb-2">
            Custom Prompt (Optional):
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Override default prompt with custom VEX VOID elements..."
            className="w-full bg-black border border-white/20 text-white p-2 text-sm lo-fi-text h-20"
          />
        </div>

        {/* Duration Control */}
        <div className="mb-4">
          <label className="block text-white text-sm lo-fi-text mb-2">
            Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </label>
          <input
            type="range"
            min="60"
            max="300"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>1:00</span>
            <span>3:00</span>
            <span>5:00</span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateTrack}
          disabled={isGenerating}
          className={`w-full py-3 px-4 lo-fi-text font-bold transition-colors ${
            isGenerating
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isGenerating ? '🎵 GENERATING TRACK...' : '🎼 GENERATE VEX VOID TRACK'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Generated Tracks */}
      {generatedTracks.length > 0 && (
        <div className="bg-black/50 border border-white/20 p-6">
          <h4 className="text-lg font-bold lo-fi-text mb-4">🎧 Generated Tracks</h4>
          <div className="space-y-4">
            {generatedTracks.map((track, index) => (
              <div key={track.id} className="border border-white/20 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-white">{track.title}</h5>
                    <div className="text-sm text-white/70">
                      {seriesInfo[track.series as keyof typeof seriesInfo]?.icon} {track.series.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getAestheticScoreColor(track.aesthetic_score)}`}>
                      {track.aesthetic_score}/10
                    </div>
                    <div className="text-xs text-white/50">VEX VOID Score</div>
                  </div>
                </div>

                <div className="text-xs text-white/50 mb-3">
                  {track.aesthetic_notes}
                </div>

                <div className="flex gap-2 text-xs">
                  {track.audio_url && (
                    <a
                      href={track.audio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1"
                    >
                      🎵 Listen
                    </a>
                  )}
                  {track.supabase_url && (
                    <a
                      href={track.supabase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1"
                    >
                      ☁️ Supabase
                    </a>
                  )}
                  <span className="bg-gray-600 text-white px-2 py-1">
                    {track.metadata.bpm} BPM
                  </span>
                  <span className="bg-gray-600 text-white px-2 py-1">
                    {Math.floor(track.metadata.duration / 60)}:{(track.metadata.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VEX VOID Influences Reference */}
      <div className="bg-black/50 border border-yellow-500/20 p-6">
        <h4 className="text-lg font-bold lo-fi-text mb-4 text-yellow-400">🎷 VEX VOID INFLUENCES</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="font-bold text-white mb-2">🎷 Ninja Jazz</div>
            <div className="text-white/70 space-y-1">
              <div>• Miles Davis - "Kind of Blue"</div>
              <div>• Thelonious Monk - "Round Midnight"</div>
              <div>• John Coltrane - "A Love Supreme"</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">🔊 Electronic Underground</div>
            <div className="text-white/70 space-y-1">
              <div>• Aphex Twin - "Selected Ambient Works"</div>
              <div>• Burial - "Untrue"</div>
              <div>• Boards of Canada - "Music Has the Right"</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">🏭 Detroit/Industrial</div>
            <div className="text-white/70 space-y-1">
              <div>• Underground Resistance</div>
              <div>• Jeff Mills - "Waveform Transmission"</div>
              <div>• Drexciya - "Neptune's Lair"</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">🚂 Train/Urban</div>
            <div className="text-white/70 space-y-1">
              <div>• Detroit freight yard recordings</div>
              <div>• Train wheel rhythms</div>
              <div>• Urban decay atmosphere</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 