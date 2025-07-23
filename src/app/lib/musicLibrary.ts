// Music Library for V3XV0ID
// Automatically manages all available music tracks from Supabase Storage



export interface MusicTrack {
  id: string;
  title: string;
  filename: string;
  path: string;
  supabaseUrl: string; // Add Supabase URL field
  duration?: number;
  bpm?: number;
  key?: string;
  mood?: string;
}

// All your atmospheric tracks - URLs generated dynamically
export const musicTracks: MusicTrack[] = [
  {
    id: 'test-track',
    title: 'Test Track',
    filename: 'test-track.mp3',
    path: '/music/test-track.mp3',
    supabaseUrl: '', // Will be generated dynamically
    mood: 'test'
  },

];

// Mood-based art pattern matching
export const moodToArtPattern = {
  'dark-ambient': 'organicFlow',
  'atmospheric': 'flowingParticles',
  'ethereal': 'geometricWaves',
  'mysterious': 'spiralMatrix',
  'dreamy': 'flowingParticles',
  'deep-dark': 'organicFlow',
  'whispered': 'geometricWaves',
  'cinematic': 'spiralMatrix',
  'smoky': 'organicFlow',
  'psychological': 'spiralMatrix',
  'whispered-smoky': 'organicFlow'
};

// Get random track
export const getRandomTrack = (): MusicTrack => {
  return musicTracks[Math.floor(Math.random() * musicTracks.length)];
};

// Get track by mood
export const getTracksByMood = (mood: string): MusicTrack[] => {
  return musicTracks.filter(track => track.mood === mood);
};

// Get track by ID
export const getTrackById = (id: string): MusicTrack | undefined => {
  return musicTracks.find(track => track.id === id);
};

// Get recommended art pattern based on track mood
export const getRecommendedArtPattern = (track: MusicTrack): string => {
  const patterns: Record<string, string> = {
    'dark-ambient': 'void-spiral',
    'atmospheric': 'fractal-waves',
    'ethereal': 'plasma-flow',
    'mysterious': 'shadow-dance',
    'dreamy': 'crystal-formations',
    'deep-dark': 'void-spiral',
    'whispered': 'particle-swarm',
    'cinematic': 'geometric-evolution',
    'smoky': 'fluid-dynamics',
    'psychological': 'neural-network',
    'whispered-smoky': 'particle-swarm'
  };
  
  return patterns[track.mood || 'atmospheric'] || 'fractal-waves';
};

// Load audio and get duration - now supports both local and Supabase URLs
export const loadAudioMetadata = async (track: MusicTrack): Promise<MusicTrack> => {
  return new Promise((resolve, reject) => {
    // Try Supabase URL first, fallback to local path
    const audioUrl = track.supabaseUrl || track.path;
    const audio = new Audio(audioUrl);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        ...track,
        duration: audio.duration
      });
    });
    
    audio.addEventListener('error', () => {
      // If Supabase URL fails, try local path
      if (audioUrl === track.supabaseUrl && track.path) {
        const fallbackAudio = new Audio(track.path);
        
        fallbackAudio.addEventListener('loadedmetadata', () => {
          resolve({
            ...track,
            duration: fallbackAudio.duration
          });
        });
        
        fallbackAudio.addEventListener('error', () => {
          reject(new Error(`Failed to load audio: ${track.path} and ${track.supabaseUrl}`));
        });
        
        fallbackAudio.load();
      } else {
        reject(new Error(`Failed to load audio: ${audioUrl}`));
      }
    });
    
    audio.load();
  });
};

// Get audio URL (prioritizes Supabase, falls back to local)
export const getAudioUrl = (track: MusicTrack): string => {
  return track.supabaseUrl || track.path;
};

// Generate video combinations
export const generateVideoCombinations = (): Array<{
  track: MusicTrack;
  artPattern: string;
  title: string;
}> => {
  return musicTracks.map(track => ({
    track,
    artPattern: getRecommendedArtPattern(track),
    title: `${track.title} - ${getRecommendedArtPattern(track)} Visuals | V3XV0ID`
  }));
};

// Get next track for automated generation
let lastTrackIndex = -1;
export const getNextTrackForGeneration = (): MusicTrack => {
  lastTrackIndex = (lastTrackIndex + 1) % musicTracks.length;
  return musicTracks[lastTrackIndex];
}; 