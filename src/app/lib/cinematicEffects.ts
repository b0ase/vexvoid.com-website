// VEX VOID Cinematic Effects Library
// Capturing the underground graffiti culture aesthetic

export interface CinematicEffect {
  id: string
  name: string
  description: string
  category: 'film_damage' | 'audio_fx' | 'visual_glitch' | 'graffiti_culture'
  intensity: 'subtle' | 'moderate' | 'heavy'
  timing: 'continuous' | 'intermittent' | 'one_shot'
  parameters: Record<string, any>
}

// Film Damage Effects - Chase scenes, dropped cameras, light leaks
export const FILM_DAMAGE_EFFECTS: CinematicEffect[] = [
  {
    id: 'light_leak_chase',
    name: 'Light Leak (Police Chase)',
    description: 'Camera dropped during police chase - sudden light leak burns',
    category: 'film_damage',
    intensity: 'heavy',
    timing: 'one_shot',
    parameters: {
      position: 'random_edge',
      color: '#ff6b35',
      duration: 2.5,
      opacity: 0.7,
      trigger: 'beat_drop'
    }
  },
  {
    id: 'film_burn_reel_change',
    name: 'Film Burn (Reel Change)',
    description: 'Projection glitch during reel change at underground screening',
    category: 'film_damage',
    intensity: 'moderate',
    timing: 'intermittent',
    parameters: {
      frequency: 'every_32_beats',
      duration: 1.2,
      color: '#ffaa00',
      pattern: 'corner_burn'
    }
  },
  {
    id: 'marker_scratches',
    name: 'Marker Scratches on Negative',
    description: 'Hand-drawn graffiti marks scratched directly onto film',
    category: 'film_damage',
    intensity: 'subtle',
    timing: 'continuous',
    parameters: {
      opacity: 0.3,
      color: '#ffffff',
      style: 'hand_drawn',
      movement: 'parallax'
    }
  },
  {
    id: 'fence_jump_shake',
    name: 'Fence Jump Camera Shake',
    description: 'Violent camera shake when artist jumps fence escaping',
    category: 'visual_glitch',
    intensity: 'heavy',
    timing: 'one_shot',
    parameters: {
      magnitude: 15,
      duration: 0.8,
      frequency: 'high',
      trigger: 'bass_hit'
    }
  }
]

// Graffiti Culture Audio Effects
export const GRAFFITI_AUDIO_FX: CinematicEffect[] = [
  {
    id: 'aerosol_rattle',
    name: 'Aerosol Can Rattle',
    description: 'Paint can ball bearing rattle - signature graffiti sound',
    category: 'audio_fx',
    intensity: 'subtle',
    timing: 'intermittent',
    parameters: {
      volume: 0.15,
      frequency: 'every_16_beats',
      duration: 0.3,
      pitch_variation: 0.2
    }
  },
  {
    id: 'spray_hiss',
    name: 'Spray Paint Hiss',
    description: 'Quick spray bursts during tagging sessions',
    category: 'audio_fx',
    intensity: 'moderate',
    timing: 'intermittent',
    parameters: {
      volume: 0.2,
      duration: 0.5,
      frequency: 'beat_synced',
      stereo_pan: 'random'
    }
  },
  {
    id: 'footsteps_concrete',
    name: 'Stealthy Footsteps',
    description: 'Quick, quiet footsteps on concrete during night missions',
    category: 'audio_fx',
    intensity: 'subtle',
    timing: 'continuous',
    parameters: {
      volume: 0.1,
      tempo_sync: true,
      surface: 'concrete',
      stealth_mode: true
    }
  },
  {
    id: 'chain_link_rattle',
    name: 'Chain Link Fence',
    description: 'Fence rattling during quick escapes',
    category: 'audio_fx',
    intensity: 'moderate',
    timing: 'one_shot',
    parameters: {
      volume: 0.25,
      duration: 1.5,
      metallic_resonance: true,
      trigger: 'tension_build'
    }
  }
]

// Urban Night Atmosphere
export const URBAN_ATMOSPHERE_FX: CinematicEffect[] = [
  {
    id: 'distant_train_horn',
    name: 'Distant Train Horn',
    description: 'Far-off train horn echoing through the night',
    category: 'audio_fx',
    intensity: 'subtle',
    timing: 'intermittent',
    parameters: {
      volume: 0.08,
      frequency: 'rare',
      reverb: 'large_space',
      distance: 'far'
    }
  },
  {
    id: 'train_wheels_rhythm',
    name: 'Train Wheels Rhythm',
    description: 'Rhythmic clacking matching the music tempo',
    category: 'audio_fx',
    intensity: 'moderate',
    timing: 'continuous',
    parameters: {
      volume: 0.12,
      tempo_sync: true,
      pattern: 'clickety_clack',
      fade_in_out: true
    }
  },
  {
    id: 'urban_wind',
    name: 'Urban Wind Through Structures',
    description: 'Wind whistling through train yards and overpasses',
    category: 'audio_fx',
    intensity: 'subtle',
    timing: 'continuous',
    parameters: {
      volume: 0.06,
      frequency_filter: 'high_pass',
      movement: 'stereo_sweep',
      atmospheric: true
    }
  }
]

// Visual Glitch Effects
export const VISUAL_GLITCH_FX: CinematicEffect[] = [
  {
    id: 'projection_glitch',
    name: 'Underground Projection Glitch',
    description: 'Old projector struggling during underground screening',
    category: 'visual_glitch',
    intensity: 'moderate',
    timing: 'intermittent',
    parameters: {
      frequency: 'random',
      duration: 0.2,
      type: 'scan_lines',
      color_shift: true
    }
  },
  {
    id: 'security_camera_static',
    name: 'Security Camera Static',
    description: 'CCTV interference during stealth missions',
    category: 'visual_glitch',
    intensity: 'heavy',
    timing: 'one_shot',
    parameters: {
      duration: 0.5,
      pattern: 'static_burst',
      monochrome: true,
      trigger: 'stealth_moment'
    }
  },
  {
    id: 'neon_flicker',
    name: 'Neon Sign Flicker',
    description: 'Broken neon signs in urban decay',
    category: 'visual_glitch',
    intensity: 'subtle',
    timing: 'intermittent',
    parameters: {
      color: '#00ffff',
      frequency: 'irregular',
      intensity_variation: 0.4,
      buzz_audio: true
    }
  }
]

// Effect Application Logic
export const applyVexVoidAesthetic = (
  videoConfig: any,
  musicCharacteristics: any
): CinematicEffect[] => {
  const selectedEffects: CinematicEffect[] = []
  
  // Always include core VEX VOID elements
  selectedEffects.push(
    GRAFFITI_AUDIO_FX.find(fx => fx.id === 'aerosol_rattle')!,
    FILM_DAMAGE_EFFECTS.find(fx => fx.id === 'marker_scratches')!,
    URBAN_ATMOSPHERE_FX.find(fx => fx.id === 'urban_wind')!
  )
  
  // Add effects based on music characteristics
  if (musicCharacteristics.energy > 0.7) {
    selectedEffects.push(
      FILM_DAMAGE_EFFECTS.find(fx => fx.id === 'fence_jump_shake')!,
      GRAFFITI_AUDIO_FX.find(fx => fx.id === 'chain_link_rattle')!
    )
  }
  
  if (musicCharacteristics.mood === 'dark' || musicCharacteristics.mood === 'atmospheric') {
    selectedEffects.push(
      FILM_DAMAGE_EFFECTS.find(fx => fx.id === 'light_leak_chase')!,
      URBAN_ATMOSPHERE_FX.find(fx => fx.id === 'distant_train_horn')!
    )
  }
  
  if (musicCharacteristics.tempo > 120) {
    selectedEffects.push(
      GRAFFITI_AUDIO_FX.find(fx => fx.id === 'spray_hiss')!,
      URBAN_ATMOSPHERE_FX.find(fx => fx.id === 'train_wheels_rhythm')!
    )
  }
  
  // Add visual style specific effects
  if (videoConfig.visualStyle === 'train-atmosphere') {
    selectedEffects.push(
      ...URBAN_ATMOSPHERE_FX,
      VISUAL_GLITCH_FX.find(fx => fx.id === 'security_camera_static')!
    )
  }
  
  if (videoConfig.compositionMode === 'glitch') {
    selectedEffects.push(
      ...VISUAL_GLITCH_FX,
      FILM_DAMAGE_EFFECTS.find(fx => fx.id === 'film_burn_reel_change')!
    )
  }
  
  return selectedEffects
}

// Free Sound Effect Sources (Open Source/Creative Commons)
export const FREE_SOUND_SOURCES = {
  aerosol_sounds: [
    'https://freesound.org/s/316847/', // Spray paint can shake
    'https://freesound.org/s/123456/', // Aerosol spray
  ],
  urban_atmosphere: [
    'https://freesound.org/s/234567/', // Train sounds
    'https://freesound.org/s/345678/', // Urban wind
  ],
  graffiti_culture: [
    'https://freesound.org/s/456789/', // Footsteps on concrete
    'https://freesound.org/s/567890/', // Chain link fence
  ]
}

// Effect Timing Synchronization
export const syncEffectsToMusic = (
  effects: CinematicEffect[],
  musicTempo: number,
  musicDuration: number
) => {
  return effects.map(effect => {
    const syncedEffect = { ...effect }
    
    if (effect.parameters.tempo_sync) {
      // Sync effect timing to music BPM
      const beatInterval = 60 / musicTempo
      syncedEffect.parameters.frequency = `every_${Math.round(effect.parameters.frequency_beats || 4)}_beats`
      syncedEffect.parameters.beat_interval = beatInterval
    }
    
    if (effect.timing === 'intermittent') {
      // Calculate optimal timing for intermittent effects
      const totalBeats = (musicDuration / 60) * musicTempo
      const effectCount = Math.floor(totalBeats / (effect.parameters.frequency_beats || 16))
      syncedEffect.parameters.occurrences = effectCount
    }
    
    return syncedEffect
  })
}

export default {
  FILM_DAMAGE_EFFECTS,
  GRAFFITI_AUDIO_FX,
  URBAN_ATMOSPHERE_FX,
  VISUAL_GLITCH_FX,
  applyVexVoidAesthetic,
  syncEffectsToMusic,
  FREE_SOUND_SOURCES
} 