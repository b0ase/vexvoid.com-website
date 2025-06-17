import { NextRequest, NextResponse } from 'next/server'

interface CanvaDesign {
  id: string
  title: string
  thumbnail: {
    url: string
  }
  urls: {
    edit_url: string
    view_url: string
  }
  created_at: string
  updated_at: string
  tags?: string[]
}

/**
 * VEX VOID Canva Designs API
 * List, search, and manage Canva designs for video editing
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('canva_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Canva access token found. Please authenticate first.' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    // Search for V3X VOID related designs
    const searchParams = new URLSearchParams({
      query: query || 'V3X VOID',
      limit: limit.toString(),
      ...(query && { query })
    })

    const response = await fetch(
      `https://api.canva.com/rest/v1/designs?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Canva API error:', errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Canva token expired. Please re-authenticate.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch designs from Canva' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      designs: data.items || [],
      total: data.items?.length || 0,
      canva_response: data
    })

  } catch (error) {
    console.error('Canva designs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Create or duplicate a design for V3X VOID editing
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('canva_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Canva access token found' },
        { status: 401 }
      )
    }

    const { action, designId, title } = await request.json()

    if (action === 'duplicate' && designId) {
      // Duplicate an existing design
      const response = await fetch(
        `https://api.canva.com/rest/v1/designs/${designId}/duplicate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title || `V3X VOID Edit - ${new Date().toISOString().split('T')[0]}`
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Design duplication failed:', errorText)
        return NextResponse.json(
          { error: 'Failed to duplicate design' },
          { status: response.status }
        )
      }

      const duplicatedDesign = await response.json()
      
      return NextResponse.json({
        success: true,
        design: duplicatedDesign,
        message: 'Design duplicated successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Canva design creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 