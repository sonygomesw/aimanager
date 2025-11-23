import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer le profil
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      )
    }

    const profile = await prisma.artistProfile.findUnique({
      where: { userId }
    })

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour le profil
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { userId, ...profileData } = data

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      )
    }

    const profile = await prisma.artistProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData
      },
      update: profileData
    })

    return NextResponse.json({ success: true, profile })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer le profil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      )
    }

    await prisma.artistProfile.delete({
      where: { userId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete profile error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du profil' },
      { status: 500 }
    )
  }
}
