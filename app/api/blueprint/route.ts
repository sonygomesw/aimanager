import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all plans for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'temp-user-id'

    // For now, return empty plans
    // TODO: Implement actual database queries
    return NextResponse.json({
      plans: {
        '30day': null,
        '90day': null,
        '1year': null
      }
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}
