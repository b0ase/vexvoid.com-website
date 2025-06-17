import { NextRequest, NextResponse } from 'next/server'

interface VexVoidCompositionRequest {
  audioFile: string
  musicTitle: string
  vexVoidAesthetic: 'graffiti_culture' | 'train_yards' | 'neon_noir' | 'urban_decay' | 'ninja_jazz'
  filmDamage: 'none' | 'subtle' | 'moderate' | 'heavy' | 'projection_glitch'
  duration: number
  resolution: '1080p' | '720p' | '4k'
  includeAerosolSounds: boolean
  includeTrainAtmosphere: boolean
  includeFilmBurnEffects: boolean
}

// VEX VOID Aesthetic Presets
const VEX_VOID_PRESETS = {
  graffiti_culture: {
    name: 'Graffiti Culture',
    description: 'Aerosol cans, stealth tagging, quick escapes',
    primaryAssets: ['graffiti_train', 'video_jam_01'],
    soundEffects: ['aerosol_rattle', 'spray_hiss', 'footsteps_concrete'],
    filmEffects: ['marker_scratches', 'fence_jump_shake'],
    colorGrading: 'high_contrast_urban',
    tempo: 'match_music',
    atmosphere: 'rebellious_energy'
  },
  train_yards: {
    name: 'Train Yards',
    description: 'Steel, concrete, urban missions',
    primaryAssets: ['graffiti_train', 'landscapes'],
    soundEffects: ['train_wheels_rhythm', 'distant_train_horn', 'chain_link_rattle'],
    filmEffects: ['security_camera_static', 'urban_wind'],
    colorGrading: 'industrial_steel',
    tempo: 'rhythmic_clacking',
    atmosphere: 'nocturnal_stealth'
  },
  neon_noir: {
    name: 'Neon Noir',
    description: 'Dark cyberpunk with cinematic film noir',
    primaryAssets: ['concept_art', 'portraits'],
    soundEffects: ['urban_wind', 'neon_buzz'],
    filmEffects: ['light_leak_chase', 'film_burn_reel_change'],
    colorGrading: 'neon_contrast',
    tempo: 'cinematic_slow_burn',
    atmosphere: 'dark_atmospheric'
  },
  urban_decay: {
    name: 'Urban Decay',
    description: 'Atmospheric gritty cityscapes',
    primaryAssets: ['landscapes', 'concept_art_2'],
    soundEffects: ['urban_wind', 'distant_sirens'],
    filmEffects: ['projection_glitch', 'marker_scratches'],
    colorGrading: 'desaturated_grit',
    tempo: 'atmospheric_drift',
    atmosphere: 'melancholic_urban'
  },
  ninja_jazz: {
    name: 'Ninja Jazz',
    description: 'Stealthy cool with jazz undertones',
    primaryAssets: ['portraits', 'video_jam_01'],
    soundEffects: ['footsteps_concrete', 'aerosol_rattle'],
    filmEffects: ['subtle_scratches', 'neon_flicker'],
    colorGrading: 'cool_jazz_tones',
    tempo: 'syncopated_stealth',
    atmosphere: 'cool_mysterious'
  }
}

// Free Sound Effect Sources (Creative Commons/Open Source)
const SOUND_EFFECT_SOURCES = {
  // Graffiti Culture Sounds
  aerosol_rattle: 'https://freesound.org/s/316847/', // Paint can shake
  spray_hiss: 'https://freesound.org/s/234567/', // Aerosol spray
  marker_scratch: 'https://freesound.org/s/456123/', // Marker on surface
  
  // Urban Atmosphere
  train_wheels_rhythm: 'https://freesound.org/s/123456/', // Train on tracks
  distant_train_horn: 'https://freesound.org/s/234567/', // Train horn far
  chain_link_rattle: 'https://freesound.org/s/678901/', // Fence rattle
  footsteps_concrete: 'https://freesound.org/s/456789/', // Stealth footsteps
  urban_wind: 'https://freesound.org/s/345678/', // Wind through structures
  
  // Film/Technical Effects
  projector_hum: 'https://freesound.org/s/890123/', // Film projector
  camera_click: 'https://freesound.org/s/012345/', // Camera shutter
  neon_buzz: 'https://freesound.org/s/567890/', // Electrical hum
  distant_sirens: 'https://freesound.org/s/789012/' // Police sirens far
}

// Film Damage Effect Definitions
const FILM_DAMAGE_EFFECTS = {
  none: {
    effects: [],
    intensity: 0,
    frequency: 'never'
  },
  subtle: {
    effects: ['light_scratches', 'dust_specks'],
    intensity: 0.2,
    frequency: 'rare'
  },
  moderate: {
    effects: ['light_leaks', 'burn_edges', 'scratches'],
    intensity: 0.4,
    frequency: 'occasional'
  },
  heavy: {
    effects: ['police_chase_damage', 'dropped_camera', 'light_burn'],
    intensity: 0.7,
    frequency: 'frequent'
  },
  projection_glitch: {
    effects: ['reel_change_burn', 'projector_flicker', 'scan_lines'],
    intensity: 0.5,
    frequency: 'rhythmic'
  }
}

// Asset Collection Mapping
const ASSET_COLLECTIONS = {
  concept_art: {
    supabasePath: 'images/concept_art/',
    count: 8,
    aesthetic: 'neon_noir'
  },
  concept_art_2: {
    supabasePath: 'images/concept_art_2/',
    count: 9,
    aesthetic: 'urban_decay'
  },
  concept_art_3: {
    supabasePath: 'images/concept_art_3/',
    count: 19,
    aesthetic: 'cinematic'
  },
  landscapes: {
    supabasePath: 'images/landscapes/',
    count: 19,
    aesthetic: 'urban_decay'
  },
  portraits: {
    supabasePath: 'images/portraits/',
    count: 4,
    aesthetic: 'neon_noir'
  },
  graffiti_train: {
    supabasePath: 'images/graffiti_train/',
    count: 76,
    aesthetic: 'graffiti_culture'
  },
  video_jam_01: {
    supabasePath: 'images/video_jam_01/',
    count: 31,
    aesthetic: 'train_yards'
  },
  videos_jam_01: {
    supabasePath: 'videos/video_jam_01/',
    count: 36,
    aesthetic: 'cinematic'
  }
}

export async function POST(request: NextRequest) {
  try {
    const config: VexVoidCompositionRequest = await request.json()
    
    console.log('🎨 VEX VOID Video Composition Request:', config)
    
    // Get aesthetic preset
    const preset = VEX_VOID_PRESETS[config.vexVoidAesthetic]
    
    // Composition plan
    const compositionPlan = {
      aesthetic: preset,
      assets: {
        images: preset.primaryAssets.map(assetKey => ASSET_COLLECTIONS[assetKey as keyof typeof ASSET_COLLECTIONS]),
        videos: config.vexVoidAesthetic === 'ninja_jazz' ? [ASSET_COLLECTIONS.videos_jam_01] : []
      },
      soundEffects: preset.soundEffects.map(fx => ({
        name: fx,
        source: SOUND_EFFECT_SOURCES[fx as keyof typeof SOUND_EFFECT_SOURCES],
        timing: getEffectTiming(fx, config.duration)
      })),
      filmDamage: FILM_DAMAGE_EFFECTS[config.filmDamage],
      colorGrading: preset.colorGrading,
      totalDuration: config.duration
    }
    
    // Simulate video composition process
    const steps = [
      {
        id: 'audio_analysis',
        name: 'Analyzing Ninja Jazz Audio',
        status: 'processing' as const,
        progress: 0,
        details: `Analyzing ${config.musicTitle} for tempo and mood`
      },
      {
        id: 'asset_selection',
        name: 'Selecting VEX VOID Assets',
        status: 'pending' as const,
        progress: 0,
        details: `Loading ${preset.name} aesthetic assets`
      },
      {
        id: 'sound_fx_integration',
        name: 'Adding Graffiti Culture Sounds',
        status: 'pending' as const,
        progress: 0,
        details: config.includeAerosolSounds ? 'Including aerosol can sounds' : 'Music only'
      },
      {
        id: 'film_damage_application',
        name: 'Applying Film Damage Effects',
        status: 'pending' as const,
        progress: 0,
        details: `${config.filmDamage} damage level - ${preset.description}`
      },
      {
        id: 'video_composition',
        name: 'Compositing with FFmpeg',
        status: 'pending' as const,
        progress: 0,
        details: `${config.resolution} resolution with ${preset.colorGrading} grading`
      }
    ]

    // Return composition plan and steps
    return NextResponse.json({
      success: true,
      message: `🎬 VEX VOID ${preset.name} composition initiated`,
      compositionPlan,
      steps,
      estimatedDuration: Math.ceil(config.duration * 2), // Estimate processing time
      assets: {
        totalImages: preset.primaryAssets.reduce((sum, key) => sum + (ASSET_COLLECTIONS[key as keyof typeof ASSET_COLLECTIONS]?.count || 0), 0),
        totalVideos: compositionPlan.assets.videos.length,
        soundEffects: preset.soundEffects.length,
        filmEffects: Object.keys(FILM_DAMAGE_EFFECTS[config.filmDamage].effects).length
      },
      preview: {
        aesthetic: preset.name,
        mood: preset.atmosphere,
        visualStyle: preset.colorGrading,
        audioStyle: preset.tempo,
        signature: '🥷🎵 Ninja Jazz x Graffiti Culture'
      }
    })

  } catch (error) {
    console.error('VEX VOID Composition Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create VEX VOID composition',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate effect timing
function getEffectTiming(effectName: string, duration: number) {
  const timings: Record<string, { frequency: string; volume: number }> = {
    aerosol_rattle: { frequency: 'every_16_beats', volume: 0.15 },
    spray_hiss: { frequency: 'beat_synced', volume: 0.2 },
    train_wheels_rhythm: { frequency: 'continuous', volume: 0.12 },
    distant_train_horn: { frequency: 'rare', volume: 0.08 },
    footsteps_concrete: { frequency: 'tempo_matched', volume: 0.1 },
    chain_link_rattle: { frequency: 'tension_moments', volume: 0.25 },
    urban_wind: { frequency: 'continuous', volume: 0.06 },
    neon_buzz: { frequency: 'continuous', volume: 0.05 }
  }
  
  return timings[effectName] || { frequency: 'occasional', volume: 0.1 }
} 