import { NextRequest, NextResponse } from 'next/server'

// GET - Check if user has checked in today and get streak info
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'temp-user-id'

    // Get today's date (start of day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // For now, return mock data
    // TODO: Implement actual database queries
    const mockData = {
      hasCheckedInToday: false,
      currentStreak: 5,
      longestStreak: 12,
      level: 'bronze', // bronze, silver, gold, platinum
      lastCheckIn: null,
      todayCheckIn: null
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error getting check-in status:', error)
    return NextResponse.json({ error: 'Failed to get check-in status' }, { status: 500 })
  }
}

// POST - Submit daily check-in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, mood, energy, workingOn, blockers, wins } = body

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // For now, just return success
    // TODO: Implement actual database operations
    // 1. Create check-in record
    // 2. Update user's streak
    // 3. Store in memory system

    const newStreak = 6 // Mock: increment streak

    return NextResponse.json({
      success: true,
      message: 'Check-in completed!',
      streak: newStreak,
      level: getStreakLevel(newStreak)
    })
  } catch (error) {
    console.error('Error submitting check-in:', error)
    return NextResponse.json({ error: 'Failed to submit check-in' }, { status: 500 })
  }
}

function getStreakLevel(streak: number): string {
  if (streak >= 90) return 'platinum'
  if (streak >= 30) return 'gold'
  if (streak >= 7) return 'silver'
  return 'bronze'
}
