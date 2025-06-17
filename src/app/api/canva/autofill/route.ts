import { NextRequest, NextResponse } from 'next/server'

interface AutofillRequest {
  designId: string
  data: {
    [key: string]: {
      type: 'text' | 'image' | 'video'
      value: string
    }
  }
}

interface VexVoidAssets {
  backgroundVideo?: string
  logoImage?: string
  titleText?: string
  subtitleText?: string
  musicTrack?: string
}

/**
 * VEX VOID Canva Autofill API
 * Automatically populate Canva designs with V3X VOID content
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('canva_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Canva access token found. Please authenticate first.' },
        { status: 401 }
      )
    }

    const { designId, vexVoidData, customData } = await request.json()

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      )
    }

    // Prepare autofill data for V3X VOID aesthetic
    const autofillData: any = {}

    // Apply V3X VOID branding if provided
    if (vexVoidData) {
      // Text elements
      if (vexVoidData.title) {
        autofillData['title'] = {
          type: 'text',
          text: vexVoidData.title
        }
      }

      if (vexVoidData.subtitle) {
        autofillData['subtitle'] = {
          type: 'text', 
          text: vexVoidData.subtitle
        }
      }

      // Logo/brand elements
      if (vexVoidData.logoUrl) {
        autofillData['logo'] = {
          type: 'image',
          asset_id: vexVoidData.logoUrl
        }
      }

      // Background video
      if (vexVoidData.backgroundVideoUrl) {
        autofillData['background'] = {
          type: 'video',
          asset_id: vexVoidData.backgroundVideoUrl
        }
      }

      // Music track
      if (vexVoidData.musicUrl) {
        autofillData['audio'] = {
          type: 'audio',
          asset_id: vexVoidData.musicUrl
        }
      }
    }

    // Merge custom data if provided
    if (customData) {
      Object.assign(autofillData, customData)
    }

    // Create autofill job
    const autofillResponse = await fetch(
      'https://api.canva.com/rest/v1/autofills',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brand_template_id: designId,
          data: autofillData
        })
      }
    )

    if (!autofillResponse.ok) {
      const errorText = await autofillResponse.text()
      console.error('Autofill creation failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to create autofill job', details: errorText },
        { status: autofillResponse.status }
      )
    }

    const autofillJob = await autofillResponse.json()
    
    return NextResponse.json({
      success: true,
      job: autofillJob,
      message: 'Autofill job created. Use the job ID to check status.',
      next_step: `GET /api/canva/autofill/${autofillJob.job.id}`
    })

  } catch (error) {
    console.error('Canva autofill error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * Check autofill job status
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('canva_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Canva access token found' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://api.canva.com/rest/v1/autofills/${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Autofill status check failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to check autofill status' },
        { status: response.status }
      )
    }

    const jobStatus = await response.json()
    
    return NextResponse.json({
      success: true,
      job: jobStatus,
      status: jobStatus.job.status,
      ...(jobStatus.job.status === 'success' && {
        design_id: jobStatus.job.design?.id,
        edit_url: jobStatus.job.design?.urls?.edit_url
      })
    })

  } catch (error) {
    console.error('Autofill status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 