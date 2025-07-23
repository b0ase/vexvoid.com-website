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
    id: 'echoes-abyss',
    title: 'Echoes in the Abyss',
    filename: 'Echoes in the Abyss.mp3',
    path: '/music/Echoes in the Abyss.mp3',
    supabaseUrl: '', // Will be generated dynamically
    mood: 'dark-ambient'
  },
  {
    id: 'echoes-abyss-alt',
    title: 'Echoes in the Abyss (Alt)',
    filename: 'Echoes in the Abyss (1).mp3',
    path: '/music/Echoes in the Abyss (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'dark-ambient'
  },
  {
    id: 'echoes-dust',
    title: 'Echoes in the Dust',
    filename: 'Echoes in the Dust.mp3',
    path: '/music/Echoes in the Dust.mp3',
    supabaseUrl: "",
    mood: 'atmospheric'
  },
  {
    id: 'echoes-dust-alt',
    title: 'Echoes in the Dust (Alt)',
    filename: 'Echoes in the Dust (1).mp3',
    path: '/music/Echoes in the Dust (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'atmospheric'
  },
  {
    id: 'echoes-dust-alt2',
    title: 'Echoes in the Dust (Alt 2)',
    filename: 'Echoes in the Dust (2).mp3',
    path: '/music/Echoes in the Dust (2).mp3',
    supabaseUrl: "".mp3'),
    mood: 'atmospheric'
  },
  {
    id: 'echoes-fog',
    title: 'Echoes in the Fog',
    filename: 'Echoes in the Fog.mp3',
    path: '/music/Echoes in the Fog.mp3',
    supabaseUrl: "",
    mood: 'ethereal'
  },
  {
    id: 'echoes-fog-alt',
    title: 'Echoes in the Fog (Alt)',
    filename: 'Echoes in the Fog (1).mp3',
    path: '/music/Echoes in the Fog (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'ethereal'
  },
  {
    id: 'echoes-mist',
    title: 'Echoes in the Mist',
    filename: 'Echoes in the Mist.mp3',
    path: '/music/Echoes in the Mist.mp3',
    supabaseUrl: "",
    mood: 'mysterious'
  },
  {
    id: 'echoes-mist-alt',
    title: 'Echoes in the Mist (Alt)',
    filename: 'Echoes in the Mist (1).mp3',
    path: '/music/Echoes in the Mist (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'mysterious'
  },
  {
    id: 'four-ton-shadow',
    title: 'Four Ton Shadow',
    filename: 'Four Ton Shadow.mp3',
    path: '/music/Four Ton Shadow.mp3',
    supabaseUrl: "",
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadow-alt1',
    title: 'Four Ton Shadow (Alt 1)',
    filename: 'Four Ton Shadow (1).mp3',
    path: '/music/Four Ton Shadow (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadow-alt2',
    title: 'Four Ton Shadow (Alt 2)',
    filename: 'Four Ton Shadow (2).mp3',
    path: '/music/Four Ton Shadow (2).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadow-alt3',
    title: 'Four Ton Shadow (Alt 3)',
    filename: 'Four Ton Shadow (3).mp3',
    path: '/music/Four Ton Shadow (3).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadow-alt4',
    title: 'Four Ton Shadow (Alt 4)',
    filename: 'Four Ton Shadow (4).mp3',
    path: '/music/Four Ton Shadow (4).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadow-alt5',
    title: 'Four Ton Shadow (Alt 5)',
    filename: 'Four Ton Shadow (5).mp3',
    path: '/music/Four Ton Shadow (5).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadows',
    title: 'Four Ton Shadows',
    filename: 'Four Ton Shadows.mp3',
    path: '/music/Four Ton Shadows.mp3',
    supabaseUrl: "",
    mood: 'heavy-dark'
  },
  {
    id: 'four-ton-shadows-alt',
    title: 'Four Ton Shadows (Alt)',
    filename: 'Four Ton Shadows (1).mp3',
    path: '/music/Four Ton Shadows (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'heavy-dark'
  },
  {
    id: 'midnight-reverie',
    title: 'Midnight Reverie',
    filename: 'Midnight Reverie.mp3',
    path: '/music/Midnight Reverie.mp3',
    supabaseUrl: "",
    mood: 'dreamy'
  },
  {
    id: 'midnight-reverie-alt',
    title: 'Midnight Reverie (Alt)',
    filename: 'Midnight Reverie (1).mp3',
    path: '/music/Midnight Reverie (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'dreamy'
  },
  {
    id: 'shadow-steps',
    title: 'Shadow Steps',
    filename: 'Shadow Steps.mp3',
    path: '/music/Shadow Steps.mp3',
    supabaseUrl: "",
    mood: 'rhythmic'
  },
  {
    id: 'shadow-steps-alt',
    title: 'Shadow Steps (Alt)',
    filename: 'Shadow Steps (1).mp3',
    path: '/music/Shadow Steps (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'rhythmic'
  },
  {
    id: 'shadowed-depths',
    title: 'Shadowed Depths',
    filename: 'Shadowed Depths.mp3',
    path: '/music/Shadowed Depths.mp3',
    supabaseUrl: "",
    mood: 'deep-dark'
  },
  {
    id: 'shadowed-depths-alt',
    title: 'Shadowed Depths (Alt)',
    filename: 'Shadowed Depths (1).mp3',
    path: '/music/Shadowed Depths (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'deep-dark'
  },
  {
    id: 'shadowed-whispers',
    title: 'Shadowed Whispers',
    filename: 'Shadowed Whispers.mp3',
    path: '/music/Shadowed Whispers.mp3',
    supabaseUrl: "",
    mood: 'whispered'
  },
  {
    id: 'shadowed-whispers-alt',
    title: 'Shadowed Whispers (Alt)',
    filename: 'Shadowed Whispers (1).mp3',
    path: '/music/Shadowed Whispers (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'whispered'
  },
  {
    id: 'shadows-silhouettes',
    title: 'Shadows and Silhouettes',
    filename: 'Shadows and Silhouettes.mp3',
    path: '/music/Shadows and Silhouettes.mp3',
    supabaseUrl: "",
    mood: 'cinematic'
  },
  {
    id: 'shadows-silhouettes-alt',
    title: 'Shadows and Silhouettes (Alt)',
    filename: 'Shadows and Silhouettes (1).mp3',
    path: '/music/Shadows and Silhouettes (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'cinematic'
  },
  {
    id: 'shadows-smoke',
    title: 'Shadows in the Smoke',
    filename: 'Shadows in the Smoke.mp3',
    path: '/music/Shadows in the Smoke.mp3',
    supabaseUrl: "",
    mood: 'smoky'
  },
  {
    id: 'shadows-smoke-alt',
    title: 'Shadows in the Smoke (Alt)',
    filename: 'Shadows in the Smoke (1).mp3',
    path: '/music/Shadows in the Smoke (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'smoky'
  },
  {
    id: 'shadows-mind',
    title: 'Shadows of the Mind',
    filename: 'Shadows of the Mind.mp3',
    path: '/music/Shadows of the Mind.mp3',
    supabaseUrl: "",
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt1',
    title: 'Shadows of the Mind (Alt 1)',
    filename: 'Shadows of the Mind (1).mp3',
    path: '/music/Shadows of the Mind (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt2',
    title: 'Shadows of the Mind (Alt 2)',
    filename: 'Shadows of the Mind (2).mp3',
    path: '/music/Shadows of the Mind (2).mp3',
    supabaseUrl: "".mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-mind-alt3',
    title: 'Shadows of the Mind (Alt 3)',
    filename: 'Shadows of the Mind (3).mp3',
    path: '/music/Shadows of the Mind (3).mp3',
    supabaseUrl: "".mp3'),
    mood: 'psychological'
  },
  {
    id: 'shadows-past',
    title: 'Shadows of the Past',
    filename: 'Shadows of the Past.mp3',
    path: '/music/Shadows of the Past.mp3',
    supabaseUrl: "",
    mood: 'nostalgic'
  },
  {
    id: 'shadows-past-alt',
    title: 'Shadows of the Past (Alt)',
    filename: 'Shadows of the Past (1).mp3',
    path: '/music/Shadows of the Past (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'nostalgic'
  },
  {
    id: 'shadows-street',
    title: 'Shadows of the Street',
    filename: 'Shadows of the Street.mp3',
    path: '/music/Shadows of the Street.mp3',
    supabaseUrl: "",
    mood: 'urban'
  },
  {
    id: 'shadows-street-alt',
    title: 'Shadows of the Street (Alt)',
    filename: 'Shadows of the Street (1).mp3',
    path: '/music/Shadows of the Street (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'urban'
  },
  {
    id: 'silent-shadows',
    title: 'Silent Shadows',
    filename: 'Silent Shadows.mp3',
    path: '/music/Silent Shadows.mp3',
    supabaseUrl: "",
    mood: 'minimal'
  },
  {
    id: 'silent-shadows-alt',
    title: 'Silent Shadows (Alt)',
    filename: 'Silent Shadows (1).mp3',
    path: '/music/Silent Shadows (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'minimal'
  },
  {
    id: 'whispering-shadows',
    title: 'Whispering Shadows',
    filename: 'Whispering Shadows.mp3',
    path: '/music/Whispering Shadows.mp3',
    supabaseUrl: "",
    mood: 'ethereal'
  },
  {
    id: 'whispering-shadows-alt',
    title: 'Whispering Shadows (Alt)',
    filename: 'Whispering Shadows (1).mp3',
    path: '/music/Whispering Shadows (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'ethereal'
  },
  {
    id: 'whispers-smoke',
    title: 'Whispers in the Smoke',
    filename: 'Whispers in the Smoke.mp3',
    path: '/music/Whispers in the Smoke.mp3',
    supabaseUrl: "",
    mood: 'smoky'
  },
  {
    id: 'whispers-smoke-alt',
    title: 'Whispers in the Smoke (Alt)',
    filename: 'Whispers in the Smoke (1).mp3',
    path: '/music/Whispers in the Smoke (1).mp3',
    supabaseUrl: "".mp3'),
    mood: 'smoky'
  },
  {
    id: 'whispers-wind',
    title: 'Whispers in the Wind',
    filename: 'Whispers in the Wind.mp3',
    path: '/music/Whispers in the Wind.mp3',
    supabaseUrl: "",
    mood: 'airy'
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