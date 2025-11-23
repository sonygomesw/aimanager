import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer le progress du mois actuel
export async function GET(req: NextRequest) {
  try {
    const userId = 'temp-user-id' // TODO: Get from auth

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    let progress = await prisma.monthlyProgress.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year
        }
      }
    })

    // Create if doesn't exist
    if (!progress) {
      progress = await prisma.monthlyProgress.create({
        data: {
          userId,
          month,
          year
        }
      })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching monthly progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// PATCH - Mettre à jour le progress
export async function PATCH(req: NextRequest) {
  try {
    const userId = 'temp-user-id' // TODO: Get from auth
    const data = await req.json()

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const progress = await prisma.monthlyProgress.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year
        }
      },
      update: data,
      create: {
        userId,
        month,
        year,
        ...data
      }
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error updating monthly progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
