import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les tasks du jour
export async function GET(req: NextRequest) {
  try {
    const userId = 'temp-user-id' // TODO: Get from auth

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's tasks
    let tasks = await prisma.dailyTask.findMany({
      where: {
        userId,
        date: {
          gte: today
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // If no tasks for today, generate default ones
    if (tasks.length === 0) {
      const defaultTasks = [
        { task: 'Post 3 music TikToks on Main account', category: 'music' },
        { task: 'Post 2 music TikToks on Test account', category: 'music' },
        { task: 'Post 1 branding TikTok', category: 'branding' },
        { task: 'Respond to comments/DMs (20min)', category: 'engagement' },
        { task: 'Analyze yesterday\'s performance', category: 'analytics' },
        { task: 'Batch 10 new TikToks', category: 'creation' },
        { task: 'Work on this month\'s track', category: 'music' }
      ]

      tasks = await Promise.all(
        defaultTasks.map(t =>
          prisma.dailyTask.create({
            data: {
              userId,
              ...t,
              date: today
            }
          })
        )
      )
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching daily tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST - Créer une nouvelle task
export async function POST(req: NextRequest) {
  try {
    const userId = 'temp-user-id' // TODO: Get from auth
    const { task, category } = await req.json()

    const newTask = await prisma.dailyTask.create({
      data: {
        userId,
        task,
        category,
        date: new Date()
      }
    })

    return NextResponse.json({ task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

// PATCH - Toggle task completion
export async function PATCH(req: NextRequest) {
  try {
    const { taskId, completed } = await req.json()

    const task = await prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    // Update streak if all tasks completed
    if (completed) {
      const userId = task.userId
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const allTasks = await prisma.dailyTask.findMany({
        where: {
          userId,
          date: { gte: today }
        }
      })

      const allCompleted = allTasks.every(t => t.completed)

      if (allCompleted) {
        await updateStreak(userId)
      }
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// Helper: Update streak
async function updateStreak(userId: string) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId }
  })

  if (!profile) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActive = profile.lastActiveDate
    ? new Date(profile.lastActiveDate)
    : null

  let newStreak = profile.currentStreak

  if (!lastActive) {
    // First time
    newStreak = 1
  } else {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    if (lastActive.getTime() === yesterday.getTime()) {
      // Consecutive day
      newStreak += 1
    } else if (lastActive.getTime() < yesterday.getTime()) {
      // Streak broken
      newStreak = 1
    }
    // If lastActive === today, already counted
  }

  await prisma.artistProfile.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, profile.longestStreak),
      lastActiveDate: today
    }
  })
}
