// Music Library for V3XV0ID
// Automatically manages all available music tracks from Supabase Storage

import { getMusicUrl } from './supabase'

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

// All your atmospheric tracks - now with Supabase URLs
export const musicTracks: MusicTrack[] = [
  {
    id: 'echoes-abyss',
    title: 'Echoes in the Abyss',
    filename: 'Echoes in the Abyss.mp3',
    path: '/music/Echoes in the Abyss.mp3', // Keep for backward compatibility
    supabaseUrl: getMusicUrl('Echoes in the Abyss.mp3'),
    mood: 'dark-ambient'
  },
  {
    id: 'echoes-abyss-alt',
    title: 'Echoes in the Abyss (Alt)',
    filename: 'Echoes in the Abyss (1).mp3',
    path: '/music/Echoes in the Abyss (1).mp3',
    supabaseUrl: getMusicUrl('Echoes in the Abyss (1).mp3'),
    mood: 'dark-ambient'
  },
  {
    id: 'echoes-dust',
    title: 'Echoes in the Dust',
    filename: 'Echoes in the Dust.mp3',
    path: '/music/Echoes in the Dust.mp3',
    supabaseUrl: getMusicUrl('Echoes in the Dust.mp3'),
    mood: 'atmospheric'
  },
  {
    id: 'echoes-dust-alt',
    title: 'Echoes in the Dust (Alt)',
    filename: 'Echoes in the Dust (1).mp3',
    path: '/music/Echoes in the Dust (1).mp3',
    supabaseUrl: getMusicUrl('Echoes in the Dust (1).mp3'),
    mood: 'atmospheric'
  },
  {
    id: 'echoes-fog',
    title: 'Echoes in the Fog',
    filename: 'Echoes in the Fog.mp3',
    path: '/music/Echoes in the Fog.mp3',
    supabaseUrl: getMusicUrl('Echoes in the Fog.mp3'),
    mood: 'ethereal'
  },
  {
    id: 'echoes-fog-alt',
    title: 'Echoes in the Fog (Alt)',
    filename: 'Echoes in the Fog (1).mp3',
    path: '/music/Echoes in the Fog (1).mp3',
    supabaseUrl: getMusicUrl('Echoes in the Fog (1).mp3'),
    mood: 'ethereal'
  },
  {
    id: 'echoes-mist',
    title: 'Echoes in the Mist',
    filename: 'Echoes in the Mist.mp3',
    path: '/music/Echoes in the Mist.mp3',
    supabaseUrl: getMusicUrl('Echoes in the Mist.mp3'),
    mood: 'mysterious'
  },
  {
    id: 'echoes-mist-alt',
    title: 'Echoes in the Mist (Alt)',
    filename: 'Echoes in the Mist (1).mp3',
    path: '/music/Echoes in the Mist (1).mp3',
    supabaseUrl: getMusicUrl('Echoes in the Mist (1).mp3'),
    mood: 'mysterious'
  },
  {
    id: 'midnight-reverie',
    title: 'Midnight Reverie',
    filename: 'Midnight Reverie.mp3',
    path: '/music/Midnight Reverie.mp3',
    supabaseUrl: getMusicUrl('Midnight Reverie.mp3'),
    mood: 'dreamy'
  },
  {
    id: 'midnight-reverie-alt',
    title: 'Midnight Reverie (Alt)',
    filename: 'Midnight Reverie (1).mp3',
    path: '/music/Midnight Reverie (1).mp3',
    supabaseUrl: getMusicUrl('Midnight Reverie (1).mp3'),
    mood: 'dreamy'
  },
  {
    id: 'shadowed-depths',
    title: 'Shadowed Depths',
    filename: 'Shadowed Depths.mp3',
    path: '/music/Shadowed Depths.mp3',
    supabaseUrl: getMusicUrl('Shadowed Depths.mp3'),
    mood: 'deep-dark'
  },
  {
    id: 'shadowed-depths-alt',
    title: 'Shadowed Depths (Alt)',
    filename: 'Shadowed Depths (1).mp3',
    path: '/music/Shadowed Depths (1).mp3',
    supabaseUrl: getMusicUrl('Shadowed Depths (1).mp3'),
    mood: 'deep-dark'
  },
  {
    id: 'shadowed-whispers',
    title: 'Shadowed Whispers',
    filename: 'Shadowed Whispers.mp3',
    path: '/music/Shadowed Whispers.mp3',
    supabaseUrl: getMusicUrl('Shadowed Whispers.mp3'),
    mood: 'whispered'
  },
  {
    id: 'shadowed-whispers-alt',
    title: 'Shadowed Whispers (Alt)',
    filename: 'Shadowed Whispers (1).mp3',
    path: '/music/Shadowed Whispers (1).mp3',
    supabaseUrl: getMusicUrl('Shadowed Whispers (1).mp3'),
    mood: 'whispered'
  },
  {
    id: 'shadows-silhouettes',
    title: 'Shadows and Silhouettes',
    filename: 'Shadows and Silhouettes.mp3',
    path: '/music/Shadows and Silhouettes.mp3',
    supabaseUrl: getMusicUrl('Shadows and Silhouettes.mp3'),
    mood: 'cinematic'
  },
  {
    id: 'shadows-silhouettes-alt',
    title: 'Shadows and Silhouettes (Alt)',
    filename: 'Shadows and Silhouettes (1).mp3',
    path: '/music/Shadows and Silhouettes (1).mp3',
    supabaseUrl: getMusicUrl('Shadows and Silhouettes (1).mp3'),
    mood: 'cinematic'
  },
  {
    id: 'shadows-smoke',
    title: 'Shadows in the Smoke',
    filename: 'Shadows in the Smoke.mp3',
    path: '/music/Shadows in the Smoke.mp3',
    supabaseUrl: getMusicUrl('Shadows in the Smoke.mp3'),
    mood: 'smoky'
  },
  {
    id: 'shadows-smoke-alt',
    title: 'Shadows in the Smoke (Alt)',
    filename: 'Shadows in the Smoke (1).mp3',
    path: '/music/Shadows in the Smoke (1).mp3',
    supabaseUrl: getMusicUrl('Shadows in the Smoke (1).mp3'),
    mood: 'smoky'
  },
  {
    id: 'shadows-mind',
    title: 'Shadows of the Mind',
    filename: 'Shadows of the Mind.mp3',
    path: '/music/Shadows of the Mind.mp3',
    supabaseUrl: getMusicUrl('Shadows of the Mind.mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt1',
    title: 'Shadows of the Mind (Alt 1)',
    filename: 'Shadows of the Mind (1).mp3',
    path: '/music/Shadows of the Mind (1).mp3',
    supabaseUrl: getMusicUrl('Shadows of the Mind (1).mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt2',
    title: 'Shadows of the Mind (Alt 2)',
    filename: 'Shadows of the Mind (2).mp3',
    path: '/music/Shadows of the Mind (2).mp3',
    supabaseUrl: getMusicUrl('Shadows of the Mind (2).mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt3',
    title: 'Shadows of the Mind (Alt 3)',
    filename: 'Shadows of the Mind (3).mp3',
    path: '/music/Shadows of the Mind (3).mp3',
    supabaseUrl: getMusicUrl('Shadows of the Mind (3).mp3'),
    mood: 'psychological'
  },
  {
    id: 'whispers-smoke',
    title: 'Whispers in the Smoke',
    filename: 'Whispers in the Smoke.mp3',
    path: '/music/Whispers in the Smoke.mp3',
    supabaseUrl: getMusicUrl('Whispers in the Smoke.mp3'),
    mood: 'whispered-smoky'
  },
  {
    id: 'whispers-smoke-alt',
    title: 'Whispers in the Smoke (Alt)',
    filename: 'Whispers in the Smoke (1).mp3',
    path: '/music/Whispers in the Smoke (1).mp3',
    supabaseUrl: getMusicUrl('Whispers in the Smoke (1).mp3'),
    mood: 'whispered-smoky'
  }
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