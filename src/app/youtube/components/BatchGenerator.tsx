'use client';

import { useState } from 'react';
import { musicTracks, generateVideoCombinations, getNextTrackForGeneration } from '../../lib/musicLibrary';

interface BatchGeneratorProps {
  onBatchComplete?: (generatedCount: number) => void;
}

export default function BatchGenerator({ onBatchComplete }: BatchGeneratorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [batchSize, setBatchSize] = useState(5);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const startBatchGeneration = async () => {
    setIsRunning(true);
    setProgress(0);
    setGeneratedCount(0);
    setLogs([]);
    
    addLog('Starting batch generation...');
    
    try {
      for (let i = 0; i < batchSize; i++) {
        const track = getNextTrackForGeneration();
        setCurrentTrack(track.title);
        addLog(`Generating video ${i + 1}/${batchSize}: ${track.title}`);
        
        // Simulate video generation (replace with actual generation)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setGeneratedCount(i + 1);
        setProgress(((i + 1) / batchSize) * 100);
        
        addLog(`✓ Completed: ${track.title}`);
      }
      
      addLog(`Batch complete! Generated ${batchSize} videos.`);
      
      if (onBatchComplete) {
        onBatchComplete(batchSize);
      }
      
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setIsRunning(false);
      setCurrentTrack('');
    }
  };

  const stopBatchGeneration = () => {
    setIsRunning(false);
    addLog('Batch generation stopped by user.');
  };

  const combinations = generateVideoCombinations();

  return (
    <div className="border border-white/20 p-6 bg-black/50">
      <h2 className="text-lg cyber-text mb-6">BATCH VIDEO GENERATOR</h2>
      
      {/* Batch Settings */}
      <div className="mb-6">
        <label className="block text-xs cyber-text mb-2">BATCH SIZE</label>
        <select
          value={batchSize}
          onChange={(e) => setBatchSize(parseInt(e.target.value))}
          disabled={isRunning}
          className="w-full bg-black border border-white/30 text-white text-xs p-2 font-mono"
        >
          <option value={1}>1 video</option>
          <option value={3}>3 videos</option>
          <option value={5}>5 videos</option>
          <option value={10}>10 videos</option>
          <option value={24}>All tracks (24 videos)</option>
        </select>
      </div>

      {/* Controls */}
      <div className="mb-6">
        {!isRunning ? (
          <button
            onClick={startBatchGeneration}
            className="w-full bg-white text-black py-3 px-4 text-sm font-mono hover:bg-white/90 transition-colors"
          >
            START BATCH GENERATION
          </button>
        ) : (
          <button
            onClick={stopBatchGeneration}
            className="w-full bg-red-600 text-white py-3 px-4 text-sm font-mono hover:bg-red-700 transition-colors"
          >
            STOP GENERATION
          </button>
        )}
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="mb-6">
          <div className="text-xs cyber-text mb-2">
            PROGRESS: {generatedCount}/{batchSize} ({Math.round(progress)}%)
          </div>
          <div className="w-full bg-white/20 h-2 mb-2">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentTrack && (
            <div className="text-xs text-white/70">
              Currently generating: {currentTrack}
            </div>
          )}
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="mb-6">
          <div className="text-xs cyber-text mb-2">GENERATION LOG</div>
          <div className="bg-black/50 border border-white/20 p-3 h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-xs text-white/80 font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-white/20 p-3 text-center">
          <div className="text-sm cyber-text">{musicTracks.length}</div>
          <div className="text-xs text-white/70">TOTAL TRACKS</div>
        </div>
        <div className="border border-white/20 p-3 text-center">
          <div className="text-sm cyber-text">{combinations.length}</div>
          <div className="text-xs text-white/70">POSSIBLE VIDEOS</div>
        </div>
      </div>

      {/* Track Preview */}
      <div className="mb-6">
        <div className="text-xs cyber-text mb-2">UPCOMING COMBINATIONS</div>
        <div className="bg-black/30 border border-white/20 p-3 max-h-40 overflow-y-auto">
          {combinations.slice(0, 10).map((combo, index) => (
            <div key={index} className="text-xs text-white/70 mb-1 font-mono">
              {index + 1}. {combo.track.title} → {combo.artPattern}
            </div>
          ))}
          {combinations.length > 10 && (
            <div className="text-xs text-white/50 mt-2">
              ...and {combinations.length - 10} more combinations
            </div>
          )}
        </div>
      </div>

      {/* Automation Settings */}
      <div className="border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="text-xs cyber-text text-blue-400 mb-2">AUTOMATION OPTIONS</div>
        <div className="space-y-2 text-xs text-blue-300">
          <div>🤖 Schedule daily video generation</div>
          <div>📤 Auto-upload to YouTube (requires setup)</div>
          <div>🎨 Smart pattern selection based on audio analysis</div>
          <div>📊 Performance tracking and optimization</div>
        </div>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 px-3 text-xs font-mono hover:bg-blue-700 transition-colors">
          CONFIGURE AUTOMATION
        </button>
      </div>
    </div>
  );
} 