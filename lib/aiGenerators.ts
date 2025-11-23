/**
 * AI Generators - Fonctions pour générer du contenu avec OpenAI
 */

import { openai } from './openai'
import { getPromptForFeature } from './artistManagerPrompt'

export interface ArtistProfile {
  artistName?: string
  genre?: string
  subGenre?: string
  niche?: string
  mainGoal?: string
  currentStage?: string
  spotifyUrl?: string
  tiktokUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  currentStreak?: number
  longestStreak?: number
  memories?: Array<{ key: string; value: string; type: string }>
}

// ==================== PROFILE ANALYSIS ====================

export async function analyzeArtistProfile(profile: ArtistProfile) {
  const systemPrompt = getPromptForFeature('analyzeProfile', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyse ce profil et génère le JSON demandé.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

// ==================== PLANS GENERATION ====================

export async function generate30DayPlan(profile: ArtistProfile) {
  const systemPrompt = getPromptForFeature('generate30DayPlan', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère le plan 30 jours complet en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

export async function generateAnnualPlan(profile: ArtistProfile) {
  const systemPrompt = getPromptForFeature('generateAnnualPlan', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère le plan annuel complet en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

export async function generateDailyChecklist(profile: {
  currentStage?: string
  mainGoal?: string
}) {
  const systemPrompt = getPromptForFeature('generateDailyChecklist', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère la checklist du jour en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

// ==================== CONTENT GENERATION ====================

export async function generateHooks(context?: string, platform: string = 'tiktok') {
  const systemPrompt = getPromptForFeature('generateHooks', { context, platform })

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère 10 hooks viraux en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.9,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

export async function generateVideoIdeas(profile: {
  genre?: string
  niche?: string
  currentStage?: string
}) {
  const systemPrompt = getPromptForFeature('generateVideoIdeas', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère 15 idées de vidéos virales en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

export async function generateSpotifyStrategy(profile: {
  genre?: string
  currentStage?: string
  spotifyListeners?: number
}) {
  const systemPrompt = getPromptForFeature('generateSpotifyStrategy', profile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Génère la stratégie Spotify complète en JSON.' }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

// ==================== BLUEPRINT PLANS ====================

export async function generateDetailedPlan(profile: ArtistProfile, planType: '30day' | '90day' | '1year') {
  const planConfigs = {
    '30day': {
      title: '30-Day Viral Launch Plan',
      focus: 'positioning, content creation, and algorithm activation',
      milestoneCount: 10,
      goalCount: 6
    },
    '90day': {
      title: '90-Day Booking Machine',
      focus: 'content scaling, outreach, reputation building, and first bookings',
      milestoneCount: 15,
      goalCount: 8
    },
    '1year': {
      title: '1-Year Career Blueprint',
      focus: 'catalog building, label deals, touring, and revenue streams',
      milestoneCount: 20,
      goalCount: 10
    }
  }

  const config = planConfigs[planType]

  const systemPrompt = `Tu es un manager d'artiste expert en stratégie musicale digitale inspiré par la méthode "Get Booked or Stay Broke". Tu crées des plans ULTRA-DÉTAILLÉS et ACTIONNABLES basés sur les stratégies qui ont fait exploser Hugel, Peggy Gou, Keinemusik, WizTheMc.

PROFIL ARTISTE:
- Nom: ${profile.artistName || 'Artiste'}
- Genre: ${profile.genre || 'Electronic'}
- Sous-genre: ${profile.subGenre || 'Non spécifié'}
- Niche: ${profile.niche || 'Non définie'}
- Objectif principal: ${profile.mainGoal || 'Croissance organique'}
- Stade actuel: ${profile.currentStage || 'Débutant'}
- Streak actuel: ${profile.currentStreak || 0} jours

GÉNÈRE UN ${config.title.toUpperCase()} avec focus sur: ${config.focus}

PRINCIPES CLÉS À INTÉGRER:
1. Système des 3 comptes TikTok (DJ Sets, Face Cam/BTS, Remixes/Trends)
2. Batching de contenu (1 session = 1 mois de contenu, 200 TikToks par track)
3. Chaque vidéo = un ticket de loterie gratuit
4. Les clubs bookent la VISIBILITÉ, pas le talent
5. Cibles: 10k streams/jour = premiers deals, 25k-50k = vraies offres, 100k+ = tours
6. 20 messages de booking par semaine minimum
7. Fake it till you make it (faux tours, sessions studio filmées comme gigs)

Le plan doit être HYPER-DÉTAILLÉ avec:
- ${config.goalCount} objectifs SMART spécifiques et mesurables
- ${config.milestoneCount} jalons avec deadlines précises et actions concrètes
- Stratégies détaillées étape par étape avec nombres précis
- Métriques de succès pour chaque milestone
- Actions quotidiennes/hebdomadaires spécifiques

${planType === '30day' ? `
STRUCTURE 30 JOURS:
- Semaine 1: Positioning & Présence (profils, analyse concurrence, premiers contenus)
- Semaine 2: Launch & First Content (15 TikToks filmés, 1 track à pusher)
- Semaine 3: Scale & Snowball (recycler, 3 comptes actifs, micro-influenceurs)
- Semaine 4: Outreach & PR (press kit, 10 clubs, 5 festivals, storytelling)
` : ''}

${planType === '90day' ? `
STRUCTURE 90 JOURS:
- Phase 1 (J1-15): Positioning & Présence
- Phase 2 (J16-45): Content & Growth (2 TikToks/jour main + 2 fan pages)
- Phase 3 (J46-75): Outreach & Réputation (50 clubs, 10 emails/jour)
- Phase 4 (J76-90): Scaling & Monétisation (mini tour, 100 TikToks par track)
` : ''}

${planType === '1year' ? `
STRUCTURE 1 AN:
- Q1: Foundation (3 tracks, 600 TikToks, premiers gigs)
- Q2: Growth (6 tracks, 10k monthly listeners, réseau)
- Q3: Scale (9 tracks, 50k listeners, premiers deals labels)
- Q4: Monetize (12 tracks, 100k listeners, tours, merch, €2000/mois)
` : ''}

IMPORTANT: Chaque milestone doit avoir des sous-tâches détaillées avec NOMBRES PRÉCIS et indicateurs de succès clairs.

Retourne un JSON avec cette structure EXACTE:
{
  "id": "plan-[timestamp]",
  "type": "${planType}",
  "title": "${config.title}",
  "overview": "Résumé exécutif du plan en 2-3 phrases percutantes style coach",
  "goals": [
    {
      "title": "Objectif SMART avec nombre",
      "description": "Description détaillée avec méthode",
      "metric": "KPI précis",
      "targetValue": "Valeur cible chiffrée"
    }
  ],
  "milestones": [
    {
      "title": "Titre du jalon",
      "deadline": "Jour X / Semaine X / Mois X",
      "completed": false,
      "description": "Description détaillée de ce qui doit être fait",
      "tasks": ["Tâche 1 avec nombre", "Tâche 2 spécifique", "Tâche 3 actionnable"],
      "successCriteria": "Indicateur mesurable de succès"
    }
  ],
  "strategies": [
    {
      "title": "Nom de la stratégie",
      "description": "Description complète avec la logique derrière",
      "steps": ["Étape 1 détaillée", "Étape 2 avec outil", "Étape 3 avec résultat attendu"],
      "tools": ["Outil 1", "Outil 2"]
    }
  ],
  "weeklyActions": [
    "Action récurrente avec nombre (ex: 14 TikToks/semaine)",
    "Action networking avec nombre (ex: 20 DMs booking/semaine)"
  ],
  "dailyHabits": [
    "Habitude quotidienne précise",
    "Routine contenu"
  ],
  "generatedAt": "[ISO date]"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Génère le ${config.title} complet et ultra-détaillé pour cet artiste. Sois spécifique et actionnable.` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

// ==================== BRANDING ====================

export async function generateBranding(profile: ArtistProfile) {
  const systemPrompt = `Tu es un expert en branding d'artistes musicaux et en marketing digital. Tu crées des identités de marque UNIQUES et MÉMORABLES.

PROFIL ARTISTE:
- Nom: ${profile.artistName || 'Artiste'}
- Genre: ${profile.genre || 'Electronic'}
- Sous-genre: ${profile.subGenre || 'Non spécifié'}
- Niche: ${profile.niche || 'Non définie'}
- Objectif principal: ${profile.mainGoal || 'Croissance organique'}
- Stade actuel: ${profile.currentStage || 'Débutant'}

GÉNÈRE UNE IDENTITÉ DE MARQUE COMPLÈTE ET UNIQUE pour cet artiste.

Le branding doit:
- Être DISTINCTIF et mémorable
- Correspondre au genre et à la niche
- Être cohérent sur toutes les plateformes
- Inclure des guidelines précises et actionnables

Retourne un JSON avec cette structure EXACTE:
{
  "universe": {
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
    "colorNames": ["Nom couleur 1", "Nom couleur 2", "Nom couleur 3", "Nom couleur 4"],
    "colorUsage": "Comment utiliser chaque couleur",
    "mood": "L'ambiance générale en 3-4 mots",
    "emotion": "L'émotion que la musique évoque",
    "niche": "Positionnement précis dans le marché",
    "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"]
  },
  "visualStyle": {
    "appearance": "Description détaillée de comment l'artiste doit apparaître",
    "presentation": "Comment présenter la musique visuellement",
    "storytelling": "L'histoire personnelle à raconter",
    "aestheticReferences": ["Référence visuelle 1", "Référence 2", "Référence 3"],
    "photoStyle": "Style de photos recommandé",
    "videoStyle": "Style de vidéos recommandé"
  },
  "positioning": {
    "statement": "Statement de positionnement unique (1 phrase percutante)",
    "comparable": "Comparaison avec artistes connus pour situer",
    "perception": "Comment les gens doivent percevoir l'artiste",
    "uniqueValue": "Ce qui rend cet artiste unique",
    "targetAudience": "Description précise de l'audience cible"
  },
  "voice": {
    "tone": "Ton de communication (ex: authentique, mystérieux, énergique)",
    "vocabulary": ["Mot à utiliser 1", "Mot 2", "Mot 3"],
    "avoidWords": ["Mot à éviter 1", "Mot 2"],
    "captionStyle": "Style de légendes pour les posts",
    "hashtagStrategy": "Stratégie hashtags recommandée"
  },
  "guidelines": [
    "Guideline détaillée 1 avec exemple concret",
    "Guideline détaillée 2 avec exemple concret",
    "Guideline détaillée 3 avec exemple concret",
    "Guideline détaillée 4 avec exemple concret",
    "Guideline détaillée 5 avec exemple concret"
  ],
  "contentPillars": [
    {
      "name": "Pilier de contenu 1",
      "description": "Description",
      "examples": ["Exemple 1", "Exemple 2"]
    }
  ],
  "generatedAt": "[ISO date]"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Génère une identité de marque complète, unique et mémorable pour cet artiste. Sois créatif et spécifique au genre ${profile.genre || 'electronic'}.` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  })

  const result = completion.choices[0].message.content
  return result ? JSON.parse(result) : null
}

// ==================== CHAT MANAGER ====================

export async function getChatManagerResponse(
  userMessage: string,
  artistProfile?: ArtistProfile,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const systemPrompt = getPromptForFeature('chatManager', artistProfile)

  // Limite l'historique aux 10 derniers messages pour éviter trop de tokens
  const recentHistory = conversationHistory.slice(-10)

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 500, // Limite pour garder les réponses courtes
  })

  return completion.choices[0].message.content
}

// ==================== STREAMING CHAT (pour meilleure UX) ====================

export async function getChatManagerResponseStream(
  userMessage: string,
  artistProfile?: ArtistProfile,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const systemPrompt = getPromptForFeature('chatManager', artistProfile)
  const recentHistory = conversationHistory.slice(-10)

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ]

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 500,
    stream: true,
  })

  return stream
}
