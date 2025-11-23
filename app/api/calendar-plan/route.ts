import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userId = 'temp-user-id' // TODO: Get from auth

    // Get the current month's plan
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const calendarPlan = await prisma.calendarPlan.findFirst({
      where: {
        userId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        days: {
          include: {
            tasks: true
          },
          orderBy: {
            dayNumber: 'asc'
          }
        }
      }
    })

    if (!calendarPlan) {
      return NextResponse.json({ plan: [] })
    }

    // Format the response
    const plan = calendarPlan.days.map(day => ({
      day: day.dayNumber,
      date: day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      tasks: day.tasks.map(task => ({
        id: task.id,
        title: task.title,
        category: task.category,
        completed: task.completed
      }))
    }))

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Error fetching calendar plan:', error)
    return NextResponse.json({ plan: [] })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, plan } = await request.json()

    // Delete existing plan for this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    await prisma.calendarPlan.deleteMany({
      where: {
        userId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Create new plan
    const calendarPlan = await prisma.calendarPlan.create({
      data: {
        userId,
        month: startOfMonth,
        days: {
          create: plan.map((day: any) => ({
            dayNumber: day.day,
            date: new Date(now.getFullYear(), now.getMonth(), day.day),
            tasks: {
              create: day.tasks.map((task: any) => ({
                title: task.title,
                category: task.category,
                completed: false
              }))
            }
          }))
        }
      },
      include: {
        days: {
          include: {
            tasks: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, planId: calendarPlan.id })
  } catch (error) {
    console.error('Error saving calendar plan:', error)
    return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { taskId, completed } = await request.json()

    await prisma.calendarTask.update({
      where: { id: taskId },
      data: { completed }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
