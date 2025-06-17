import { NextRequest, NextResponse } from 'next/server';

interface SunoTrackRequest {
  series?: 'midnight_mission' | 'shadow_steps' | 'aerosol_dreams' | 'four_ton_shadow' | 'experimental';
  customPrompt?: string;
  bpm?: number;
  duration?: number;
}

interface SunoResponse {
  id: string;
  title: string;
  audio_url: string;
  video_url: string;
  metadata: any;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.SUNOAPI_ORG_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Suno API key not configured' },
        { status: 500 }
      );
    }

    const { series = 'midnight_mission', customPrompt, bpm, duration = 180 }: SunoTrackRequest = await request.json();

    // VEX VOID Prompt Templates
    const promptTemplates = {
      midnight_mission: {
        style: "Dark ambient jazz with industrial undertones",
        bpm: bpm || Math.floor(Math.random() * 11) + 85, // 85-95
        description: "Train yard at 3AM, spray can rhythms, distant police sirens, muted trumpet over mechanical beats, vinyl crackle, urban decay atmosphere",
        mood: "Tense, focused, underground, mysterious",
        tags: ["dark ambient", "industrial jazz", "train yard", "urban noir", "underground"]
      },
      shadow_steps: {
        style: "Downtempo electronic with jazz samples",
        bpm: bpm || Math.floor(Math.random() * 11) + 70, // 70-80
        description: "Footsteps on gravel, vinyl crackle, saxophone fragments, urban wind through abandoned buildings, concrete reverb",
        mood: "Mysterious, contemplative, noir, atmospheric",
        tags: ["downtempo", "jazz samples", "ambient", "urban exploration", "contemplative"]
      },
      aerosol_dreams: {
        style: "Glitch-hop with organic jazz elements",
        bpm: bpm || Math.floor(Math.random() * 11) + 100, // 100-110
        description: "Spray paint hiss as percussion, jazz piano loops, train wheel rhythms, police scanner chatter, creative flow state",
        mood: "Creative flow state, artistic intensity, focused energy",
        tags: ["glitch-hop", "jazz fusion", "spray paint", "creative", "urban art"]
      },
      four_ton_shadow: {
        style: "Heavy industrial jazz fusion",
        bpm: bpm || Math.floor(Math.random() * 11) + 120, // 120-130
        description: "Freight train bass lines, distorted trumpet, concrete reverb, metal-on-metal percussion, urban decay power",
        mood: "Powerful, relentless, urban decay, intense",
        tags: ["industrial", "jazz fusion", "freight train", "heavy", "urban power"]
      },
      experimental: {
        style: "Experimental ambient with jazz and industrial elements",
        bpm: bpm || Math.floor(Math.random() * 81) + 60, // 60-140
        description: "Genre-bending VEX VOID exploration, unexpected sounds, train yard field recordings, jazz improvisation, industrial textures",
        mood: "Experimental, unpredictable, artistic exploration",
        tags: ["experimental", "ambient", "jazz", "industrial", "field recording"]
      }
    };

    const template = promptTemplates[series];
    
    // Construct Suno prompt
    const sunoPrompt = customPrompt || `
[${template.style}]
${template.description}
Mood: ${template.mood}
BPM: ${template.bpm}
Key: Minor scales, dissonant jazz chords
Artist: V3XV0ID
Genre: Ninja Jazz / Industrial Ambient
Duration: ${duration} seconds

Style markers:
- Vinyl crackle and analog warmth
- Concrete/industrial reverb spaces
- Sudden drops and unexpected silence
- Layered, atmospheric, mysterious textures
- Underground graffiti culture aesthetic
`;

    // Generate track title
    const trackTitles = {
      midnight_mission: ["Midnight Mission", "3AM Protocol", "Shadow Run", "Night Shift", "Silent Approach"],
      shadow_steps: ["Shadow Steps", "Concrete Whispers", "Urban Meditation", "Quiet Corners", "City Ghosts"],
      aerosol_dreams: ["Aerosol Dreams", "Spray Paint Symphony", "Color Theory", "Creative Flow", "Art in Motion"],
      four_ton_shadow: ["Four Ton Shadow", "Freight Line", "Steel and Steam", "Heavy Metal", "Industrial Power"],
      experimental: ["Void Experiment", "Unknown Territory", "Sound Lab", "Frequency Test", "Glitch Protocol"]
    };

    const titleOptions = trackTitles[series];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)] + 
                  ` (${new Date().toISOString().split('T')[0]})`;

    // Make request to Suno API
    const sunoResponse = await fetch('https://api.sunoapi.org/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: sunoPrompt,
        title: title,
        tags: template.tags.join(', '),
        duration: duration,
        custom_mode: true,
        instrumental: true // VEX VOID is primarily instrumental
      })
    });

    if (!sunoResponse.ok) {
      const errorData = await sunoResponse.text();
      throw new Error(`Suno API error: ${sunoResponse.status} - ${errorData}`);
    }

    const sunoData: SunoResponse = await sunoResponse.json();

    // VEX VOID Aesthetic Quality Check
    const aestheticScore = await validateVexVoidAesthetic(sunoData, template);

    // Upload to Supabase if quality passes
    let supabaseUrl = null;
    if (aestheticScore.score >= 7) {
      supabaseUrl = await uploadToSupabase(sunoData, title, series);
    }

    return NextResponse.json({
      success: true,
      track: {
        id: sunoData.id,
        title: title,
        series: series,
        audio_url: sunoData.audio_url,
        video_url: sunoData.video_url,
        supabase_url: supabaseUrl,
        aesthetic_score: aestheticScore.score,
        aesthetic_notes: aestheticScore.notes,
        metadata: {
          bpm: template.bpm,
          style: template.style,
          mood: template.mood,
          tags: template.tags,
          duration: duration,
          generated_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Suno track generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate track', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function validateVexVoidAesthetic(track: SunoResponse, template: any) {
  // This would use AI analysis to score the track against VEX VOID aesthetic
  // For now, we'll use template matching and random scoring
  
  const baseScore = 6; // Minimum acceptable score
  const bonusPoints = [];
  
  // Check for VEX VOID elements (this would be AI-powered in production)
  if (template.tags.includes('jazz')) bonusPoints.push('Jazz elements detected');
  if (template.tags.includes('industrial')) bonusPoints.push('Industrial sounds present');
  if (template.bpm >= 60 && template.bpm <= 140) bonusPoints.push('BPM in VEX VOID range');
  
  const finalScore = Math.min(10, baseScore + bonusPoints.length + Math.random() * 2);
  
  return {
    score: Math.round(finalScore * 10) / 10,
    notes: bonusPoints.join(', ') || 'Basic VEX VOID compliance'
  };
}

async function uploadToSupabase(track: SunoResponse, title: string, series: string) {
  try {
    // Download the audio file
    const audioResponse = await fetch(track.audio_url);
    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Upload to Supabase storage
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const fileName = `${series}/${title.replace(/\s+/g, '_').toLowerCase()}.mp3`;
    
    const { data, error } = await supabase.storage
      .from('music')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (error) throw error;

    return `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/music/${fileName}`;
  } catch (error) {
    console.error('Supabase upload error:', error);
    return null;
  }
} 