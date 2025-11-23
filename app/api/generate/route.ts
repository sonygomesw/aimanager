import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeArtistProfile,
  generate30DayPlan,
  generateAnnualPlan,
  generateDailyChecklist,
  generateHooks,
  generateVideoIdeas,
  generateSpotifyStrategy,
  generateDetailedPlan,
  generateBranding
} from '@/lib/aiGenerators'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { type, userId, data } = await req.json()

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Type et userId requis' },
        { status: 400 }
      )
    }

    let result

    // Handle Blueprint plans and Branding with AI generation
    const aiGeneratedTypes = ['30dayPlan', '90dayPlan', '1yearPlan', 'branding']

    if (aiGeneratedTypes.includes(type)) {
      // Get artist profile from database if available, otherwise use defaults
      let artistProfile: any = {
        artistName: 'Artiste',
        genre: 'Electronic',
        subGenre: 'Melodic Techno',
        niche: 'Dark melodic techno for introspective moments',
        mainGoal: 'Croissance organique via TikTok',
        currentStage: 'Débutant',
        currentStreak: 0
      }

      try {
        const dbProfile = await prisma.artistProfile.findUnique({
          where: { userId }
        })
        if (dbProfile) {
          artistProfile = {
            ...artistProfile,
            artistName: dbProfile.artistName || artistProfile.artistName,
            genre: dbProfile.genre || artistProfile.genre,
            subGenre: dbProfile.subGenre || artistProfile.subGenre,
            niche: dbProfile.niche || artistProfile.niche,
            mainGoal: dbProfile.mainGoal || artistProfile.mainGoal,
            currentStage: dbProfile.currentStage || artistProfile.currentStage
          }
        }
      } catch (e) {
        console.log('Database not available, using default profile')
      }

      switch (type) {
        case '30dayPlan':
          result = await generateDetailedPlan(artistProfile, '30day')
          break
        case '90dayPlan':
          result = await generateDetailedPlan(artistProfile, '90day')
          break
        case '1yearPlan':
          result = await generateDetailedPlan(artistProfile, '1year')
          break
        case 'branding':
          result = await generateBranding(artistProfile)
          break
      }

      return NextResponse.json({ success: true, data: result })
    }

    // Handle task types with mock data (can be converted to AI later)
    const taskTypes = ['weeklyTasks', 'monthlyTasks', 'annualTasks']
    if (taskTypes.includes(type)) {
      switch (type) {
        case 'weeklyTasks':
          result = {
            weekly: [
              { id: `task-${Date.now()}-1`, title: 'Post 7 TikToks today', category: 'creation', completed: false },
              { id: `task-${Date.now()}-2`, title: 'Respond to all comments', category: 'engagement', completed: false },
              { id: `task-${Date.now()}-3`, title: 'Film 20 TikTok variations', category: 'creation', completed: false },
              { id: `task-${Date.now()}-4`, title: 'Analyze yesterday\'s top performer', category: 'promotion', completed: false },
              { id: `task-${Date.now()}-5`, title: 'Post 1 branding TikTok', category: 'branding', completed: false },
              { id: `task-${Date.now()}-6`, title: 'DM 3 potential collaborators', category: 'engagement', completed: false },
              { id: `task-${Date.now()}-7`, title: 'Work on this month\'s track (1h)', category: 'music', completed: false }
            ]
          }
          break
        case 'monthlyTasks':
          result = {
            monthly: [
              { id: `task-${Date.now()}-1`, title: 'Release 1 track on Spotify', category: 'music', completed: false, deadline: 'Week 1' },
              { id: `task-${Date.now()}-2`, title: 'Batch 200 TikToks', category: 'creation', completed: false, deadline: 'Week 2' },
              { id: `task-${Date.now()}-3`, title: 'Reach 1000 new followers', category: 'promotion', completed: false },
              { id: `task-${Date.now()}-4`, title: 'Collaborate with 1 artist', category: 'engagement', completed: false },
              { id: `task-${Date.now()}-5`, title: 'Update Spotify profile', category: 'branding', completed: false },
              { id: `task-${Date.now()}-6`, title: 'Review monthly analytics', category: 'business', completed: false, deadline: 'Week 4' }
            ]
          }
          break
        case 'annualTasks':
          result = {
            annual: [
              { id: `task-${Date.now()}-1`, title: 'Release 12 tracks', category: 'music', completed: false },
              { id: `task-${Date.now()}-2`, title: 'Reach 100K monthly listeners', category: 'promotion', completed: false },
              { id: `task-${Date.now()}-3`, title: 'Post 2400+ TikToks', category: 'creation', completed: false },
              { id: `task-${Date.now()}-4`, title: 'Build 50K+ followers', category: 'promotion', completed: false },
              { id: `task-${Date.now()}-5`, title: 'Generate €2000/month revenue', category: 'business', completed: false },
              { id: `task-${Date.now()}-6`, title: 'Get featured on editorial playlist', category: 'promotion', completed: false },
              { id: `task-${Date.now()}-7`, title: 'Launch merchandise', category: 'business', completed: false },
              { id: `task-${Date.now()}-8`, title: 'Perform 5 live shows', category: 'music', completed: false }
            ]
          }
          break
      }
      return NextResponse.json({ success: true, data: result })
    }

    // For other types, try to get artist profile from database
    let artistProfile = null
    try {
      artistProfile = await prisma.artistProfile.findUnique({
        where: { userId }
      })
    } catch (e) {
      console.log('Database not available, using mock data')
    }

    switch (type) {
      case 'analyzeProfile':
        if (!artistProfile) {
          return NextResponse.json(
            { error: 'Profil artiste non trouvé' },
            { status: 404 }
          )
        }
        result = await analyzeArtistProfile(artistProfile)

        // Mettre à jour le profil avec l'analyse
        await prisma.artistProfile.update({
          where: { userId },
          data: {
            archetype: result.archetype,
            strengths: JSON.stringify(result.strengths),
            weaknesses: JSON.stringify(result.weaknesses),
            positioning: result.positioning
          }
        })
        break

      case '30DayPlan':
        result = await generate30DayPlan({
          artistName: artistProfile?.artistName,
          genre: artistProfile?.genre,
          currentStage: artistProfile?.currentStage,
          mainGoal: artistProfile?.mainGoal
        })

        // Sauvegarder le plan mensuel
        const now = new Date()
        await prisma.monthlyPlan.upsert({
          where: {
            userId_month_year: {
              userId,
              month: now.getMonth() + 1,
              year: now.getFullYear()
            }
          },
          create: {
            userId,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            content: JSON.stringify(result),
            goals: JSON.stringify(result.contentIdeas || []),
            strategies: JSON.stringify(result.weeklyBreakdown || [])
          },
          update: {
            content: JSON.stringify(result),
            goals: JSON.stringify(result.contentIdeas || []),
            strategies: JSON.stringify(result.weeklyBreakdown || [])
          }
        })
        break

      case 'annualPlan':
        result = await generateAnnualPlan({
          artistName: artistProfile?.artistName,
          genre: artistProfile?.genre,
          currentStage: artistProfile?.currentStage,
          mainGoal: artistProfile?.mainGoal
        })

        // Sauvegarder le plan annuel
        const currentYear = new Date().getFullYear()
        await prisma.annualPlan.upsert({
          where: {
            userId_year: {
              userId,
              year: currentYear
            }
          },
          create: {
            userId,
            year: currentYear,
            content: JSON.stringify(result),
            milestones: JSON.stringify(result.yearEndGoals || []),
            quarters: JSON.stringify(result.quarters || [])
          },
          update: {
            content: JSON.stringify(result),
            milestones: JSON.stringify(result.yearEndGoals || []),
            quarters: JSON.stringify(result.quarters || [])
          }
        })
        break

      case 'dailyChecklist':
        result = await generateDailyChecklist({
          currentStage: artistProfile?.currentStage,
          mainGoal: artistProfile?.mainGoal
        })

        // Sauvegarder la checklist du jour
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        await prisma.dailyPlan.upsert({
          where: {
            userId_date: {
              userId,
              date: today
            }
          },
          create: {
            userId,
            date: today,
            tasks: JSON.stringify(result.tasks || [])
          },
          update: {
            tasks: JSON.stringify(result.tasks || [])
          }
        })
        break

      case 'hooks':
        result = await generateHooks(data?.context, data?.platform)

        // Sauvegarder les hooks
        if (result?.hooks) {
          await Promise.all(
            result.hooks.map((hook: any) =>
              prisma.hook.create({
                data: {
                  userId,
                  type: data?.platform || 'tiktok',
                  content: hook.hook,
                  context: hook.why
                }
              })
            )
          )
        }
        break

      case 'videoIdeas':
        result = await generateVideoIdeas({
          genre: artistProfile?.genre,
          niche: artistProfile?.niche,
          currentStage: artistProfile?.currentStage
        })

        // Sauvegarder les idées vidéo
        if (result?.ideas) {
          await Promise.all(
            result.ideas.map((idea: any) =>
              prisma.videoIdea.create({
                data: {
                  userId,
                  title: idea.title,
                  description: idea.description,
                  platform: idea.platform,
                  category: idea.category
                }
              })
            )
          )
        }
        break

      case 'spotifyStrategy':
        const stats = await prisma.statsInput.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        })

        result = await generateSpotifyStrategy({
          genre: artistProfile?.genre,
          currentStage: artistProfile?.currentStage,
          spotifyListeners: stats?.spotifyListeners || 0
        })
        break

      default:
        return NextResponse.json(
          { error: 'Type de génération non reconnu' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}
