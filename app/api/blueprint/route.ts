import { NextRequest, NextResponse } from 'next/server'
import { generateDetailedPlan } from '@/lib/aiGenerators'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les plans d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'temp-user-id'

    // Récupérer le profil artiste
    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId }
    })

    // Récupérer les plans existants depuis la base de données
    // Note: Pour l'instant on retourne null, ils seront générés à la demande
    return NextResponse.json({
      plans: {
        '30day': null,
        '90day': null,
        '1year': null
      },
      profile: artistProfile ? {
        artistName: artistProfile.artistName,
        genre: artistProfile.genre,
        currentStage: artistProfile.currentStage
      } : null
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des plans' }, { status: 500 })
  }
}

// POST - Générer un nouveau plan
export async function POST(req: NextRequest) {
  try {
    const { userId, planType } = await req.json()

    if (!userId || !planType) {
      return NextResponse.json(
        { error: 'userId et planType requis' },
        { status: 400 }
      )
    }

    if (!['30day', '90day', '1year'].includes(planType)) {
      return NextResponse.json(
        { error: 'Type de plan invalide. Utiliser: 30day, 90day, ou 1year' },
        { status: 400 }
      )
    }

    // Récupérer le profil artiste
    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId }
    })

    if (!artistProfile) {
      return NextResponse.json(
        { error: 'Profil artiste non trouvé. Complétez d\'abord votre onboarding.' },
        { status: 404 }
      )
    }

    // Générer le plan avec l'IA
    const plan = await generateDetailedPlan(
      {
        artistName: artistProfile.artistName || undefined,
        genre: artistProfile.genre || undefined,
        subGenre: artistProfile.subGenre || undefined,
        niche: artistProfile.niche || undefined,
        mainGoal: artistProfile.mainGoal || undefined,
        currentStage: artistProfile.currentStage || undefined,
        currentStreak: artistProfile.currentStreak,
        longestStreak: artistProfile.longestStreak
      },
      planType as '30day' | '90day' | '1year'
    )

    return NextResponse.json({
      success: true,
      plan
    })
  } catch (error) {
    console.error('Erreur lors de la génération du plan:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du plan' },
      { status: 500 }
    )
  }
}
