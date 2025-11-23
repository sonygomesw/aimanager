import { NextRequest, NextResponse } from 'next/server'
import { getChatManagerResponseStream } from '@/lib/aiGenerators'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId, userId } = await req.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message et userId requis' },
        { status: 400 }
      )
    }

    // Récupérer le profil artiste avec streak info
    const artistProfile = await prisma.artistProfile.findUnique({
      where: { userId }
    })

    // Récupérer les memories importantes de l'artiste
    let memories: Array<{ key: string; value: string; type: string }> = []
    try {
      const memoryRecords = await prisma.memory.findMany({
        where: { userId },
        orderBy: { importance: 'desc' },
        take: 10 // Les 10 memories les plus importantes
      })
      memories = memoryRecords.map(m => ({
        key: m.key,
        value: m.value,
        type: m.type
      }))
    } catch (e) {
      // Memory table might not exist yet
      console.log('Memory table not available:', e)
    }

    // Récupérer ou créer la conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title: message.substring(0, 50),
        },
        include: { messages: true }
      })
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      )
    }

    // Sauvegarder le message utilisateur
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message
      }
    })

    // Préparer l'historique
    const history = conversation.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    // Obtenir la réponse en streaming
    const stream = await getChatManagerResponseStream(
      message,
      {
        artistName: artistProfile?.artistName || undefined,
        genre: artistProfile?.genre || undefined,
        subGenre: artistProfile?.subGenre || undefined,
        currentStage: artistProfile?.currentStage || undefined,
        mainGoal: artistProfile?.mainGoal || undefined,
        currentStreak: artistProfile?.currentStreak || 0,
        longestStreak: artistProfile?.longestStreak || 0,
        memories
      },
      history
    )

    // Créer un stream de réponse
    const encoder = new TextEncoder()
    let fullResponse = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            fullResponse += content
            controller.enqueue(encoder.encode(content))
          }

          // Sauvegarder la réponse complète
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: 'assistant',
              content: fullResponse
            }
          })

          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      }
    })

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Conversation-Id': conversation.id
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    )
  }
}
