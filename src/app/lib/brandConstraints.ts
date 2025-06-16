// V3XV0ID Brand Constraints System
// Ensures all public-generated content maintains brand integrity

export interface BrandConstraints {
  allowedMoods: string[];
  allowedPatterns: string[];
  titleFormat: RegExp;
  descriptionTemplate: string;
  mandatoryTags: string[];
  maxDuration: number;
  colorPalette: {
    background: string[];
    foreground: string[];
  };
  contentGuidelines: string[];
}

// Strict V3XV0ID brand constraints
export const V3XV0ID_CONSTRAINTS: BrandConstraints = {
  // Only allow moods that fit the V3XV0ID aesthetic
  allowedMoods: [
    'dark-ambient',
    'atmospheric', 
    'ethereal',
    'mysterious',
    'deep-dark',
    'psychological',
    'cinematic',
    'smoky',
    'whispered',
    'whispered-smoky'
  ],

  // Only allow art patterns that match the brand
  allowedPatterns: [
    'organicFlow',
    'flowingParticles', 
    'geometricWaves',
    'spiralMatrix'
  ],

  // Enforce consistent title format
  titleFormat: /^.+ - (organicFlow|flowingParticles|geometricWaves|spiralMatrix) Visuals \| V3XV0ID$/,

  // Template for all descriptions
  descriptionTemplate: `
🎵 Music: {TRACK_TITLE}
🎨 Visuals: {ART_PATTERN} generative art
⏱️ Duration: {DURATION}

Generated using V3XV0ID's custom algorithms and procedural art techniques.
Black and white aesthetic with organic flow patterns.

Part of the V3XV0ID generative art collection.

#GenerativeArt #V3XV0ID #ProceduralVisuals #ElectronicMusic #VisualMusic
  `.trim(),

  // Mandatory tags for brand consistency
  mandatoryTags: [
    'V3XV0ID',
    'generative art',
    'procedural visuals',
    'black and white',
    'algorithmic art'
  ],

  // Maximum duration to prevent spam
  maxDuration: 60, // 1 minute max

  // Strict color palette - only black and white
  colorPalette: {
    background: ['#000000', '#0a0a0a', '#111111'],
    foreground: ['#ffffff', '#f0f0f0', '#e0e0e0']
  },

  // Content guidelines for users
  contentGuidelines: [
    'All content must maintain V3XV0ID\'s dark, atmospheric aesthetic',
    'Only black and white visuals are permitted',
    'Music must be from the approved V3XV0ID library',
    'No custom titles - format is automatically generated',
    'Maximum 60 second duration',
    'Content will be reviewed before publishing',
    'Inappropriate or off-brand content will be rejected'
  ]
};

// Validation functions
export const validateTrackForPublic = (trackId: string): boolean => {
  const track = musicTracks.find(t => t.id === trackId);
  if (!track) return false;
  
  return V3XV0ID_CONSTRAINTS.allowedMoods.includes(track.mood || '');
};

export const validateArtPattern = (pattern: string): boolean => {
  return V3XV0ID_CONSTRAINTS.allowedPatterns.includes(pattern);
};

export const generateBrandCompliantTitle = (trackTitle: string, artPattern: string): string => {
  return `${trackTitle} - ${artPattern} Visuals | V3XV0ID`;
};

export const generateBrandCompliantDescription = (
  trackTitle: string, 
  artPattern: string, 
  duration: number
): string => {
  return V3XV0ID_CONSTRAINTS.descriptionTemplate
    .replace('{TRACK_TITLE}', trackTitle)
    .replace('{ART_PATTERN}', artPattern)
    .replace('{DURATION}', `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
};

export const validateVideoMetadata = (metadata: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check title format
  if (!V3XV0ID_CONSTRAINTS.titleFormat.test(metadata.title)) {
    errors.push('Title must follow V3XV0ID format: "Track Name - Pattern Visuals | V3XV0ID"');
  }

  // Check mandatory tags
  const missingTags = V3XV0ID_CONSTRAINTS.mandatoryTags.filter(
    tag => !metadata.tags.includes(tag)
  );
  if (missingTags.length > 0) {
    errors.push(`Missing mandatory tags: ${missingTags.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Public generation limits
export const PUBLIC_GENERATION_LIMITS = {
  maxVideosPerUser: 3, // Per day
  maxVideosPerHour: 1,
  cooldownMinutes: 60,
  requiresApproval: true
};

// Import music library for validation
import { musicTracks } from './musicLibrary'; 