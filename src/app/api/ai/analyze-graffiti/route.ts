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

    const { imageData, imageType, analysisType = 'aesthetic' } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    
    switch (analysisType) {
      case 'aesthetic':
        prompt = `Analyze this graffiti image for VEX VOID aesthetic elements. Focus on:
        - Urban decay and underground culture vibes
        - Color palette and lighting mood
        - Composition and artistic style
        - How it fits the "ninja jazz" underground aesthetic
        - Cinematic qualities for video production
        
        Provide a detailed analysis that could be used for video generation prompts.`;
        break;
        
      case 'style':
        prompt = `Analyze the graffiti style in this image. Describe:
        - Letter style and technique
        - Color scheme and effects
        - Location context (train, wall, etc.)
        - Artistic influences and era
        - Technical execution quality`;
        break;
        
      case 'cinematic':
        prompt = `Describe this graffiti scene in cinematic terms for video production:
        - Camera angles that would work best
        - Lighting conditions and mood
        - Sound design suggestions (aerosol cans, footsteps, ambient)
        - How to incorporate into VEX VOID video narrative
        - Film effects that would enhance the aesthetic`;
        break;
        
      default:
        prompt = `Analyze this graffiti image and describe its visual elements, style, and cultural context.`;
    }

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: imageType || 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
      success: true,
      analysis,
      analysisType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Graffiti analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze graffiti image' },
      { status: 500 }
    );
  }
} 