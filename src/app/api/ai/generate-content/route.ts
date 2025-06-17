import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI Studio API key not configured' },
        { status: 500 }
      );
    }

    const { 
      contentType, 
      context = '', 
      aesthetic = 'graffiti_culture',
      tone = 'underground',
      length = 'medium'
    } = await request.json();

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    
    const vexVoidContext = `
    VEX VOID is an underground graffiti culture project with these core elements:
    - Train lines, aerosol cans rattling, ninja jazz music
    - Stealthy missions, police chases, dropped cameras
    - Light leaks, film burn effects, projection glitches
    - Spray paint hiss, footsteps on concrete, chain link fences
    - Urban decay, authentic street culture, raw aesthetics
    `;

    switch (contentType) {
      case 'video_title':
        prompt = `Generate ${length === 'short' ? '3' : length === 'long' ? '10' : '5'} creative video titles for VEX VOID content.
        
        Context: ${context}
        Aesthetic: ${aesthetic}
        Tone: ${tone}
        
        ${vexVoidContext}
        
        Make titles authentic to graffiti culture, avoiding clichés. Include references to:
        - Train yards, urban exploration
        - Spray paint techniques, color schemes
        - Underground movement, stealth missions
        - Film damage effects, analog aesthetics
        
        Format as a JSON array of strings.`;
        break;

      case 'video_description':
        prompt = `Write a compelling YouTube video description for VEX VOID content.
        
        Context: ${context}
        Aesthetic: ${aesthetic}
        Tone: ${tone}
        
        ${vexVoidContext}
        
        Include:
        - Authentic graffiti culture narrative
        - Technical details about the aesthetic
        - Call to action for the VEX VOID community
        - Relevant hashtags
        - Credits and acknowledgments
        
        Length: ${length === 'short' ? '100-200' : length === 'long' ? '400-600' : '200-400'} words`;
        break;

      case 'scene_description':
        prompt = `Create a cinematic scene description for video generation (Veo/AI).
        
        Context: ${context}
        Aesthetic: ${aesthetic}
        
        ${vexVoidContext}
        
        Generate a detailed scene that includes:
        - Visual composition and camera work
        - Lighting and color grading
        - Sound design elements
        - Movement and timing
        - VEX VOID aesthetic elements
        
        Make it specific enough for AI video generation.`;
        break;

      case 'lore':
        prompt = `Expand the VEX VOID lore and backstory.
        
        Context: ${context}
        Tone: ${tone}
        
        ${vexVoidContext}
        
        Create authentic underground culture narrative that includes:
        - Character backstories and motivations
        - Historical context of the movement
        - Specific locations and their significance
        - Technical aspects of the craft
        - Community dynamics and codes
        
        Keep it grounded in real graffiti culture while building the VEX VOID mythology.`;
        break;

      case 'audio_description':
        prompt = `Generate audio/sound design descriptions for VEX VOID content.
        
        Context: ${context}
        
        ${vexVoidContext}
        
        Describe:
        - Ambient urban sounds
        - Spray paint and tool sounds
        - Footsteps and movement
        - Environmental acoustics
        - Music style and mood
        - Timing and layering suggestions
        
        Be specific about frequencies, textures, and emotional impact.`;
        break;

      default:
        prompt = `Generate creative content for VEX VOID project based on: ${context}
        
        ${vexVoidContext}
        
        Create authentic, underground culture content that captures the essence of the project.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return NextResponse.json({
      success: true,
      content,
      contentType,
      aesthetic,
      tone,
      length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 