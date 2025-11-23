'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

interface FormData {
  artistName: string
  genre: string
  subGenre: string
  niche: string
  contentStyle: 'facecam' | 'faceless' | ''
  mainGoal: string
  currentStage: string
  spotifyUrl: string
  tiktokUrl: string
  instagramUrl: string
  youtubeUrl: string
}

const GENRES = [
  'Hip-Hop', 'Pop', 'R&B', 'Rock', 'Electronic', 'Trap',
  'House', 'Indie', 'Soul', 'Jazz', 'Other'
]

const GOALS = [
  'Make a living from my music',
  'Become internationally known',
  'Grow my audience',
  'Sign with a label',
  'Be independent and profitable',
  'Build an engaged community'
]

const STAGES = [
  'Beginner (0-1,000 streams/month)',
  'Intermediate (1k-10k streams/month)',
  'Advanced (10k-100k streams/month)',
  'Professional (100k+ streams/month)'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    artistName: '',
    genre: '',
    subGenre: '',
    niche: '',
    contentStyle: '',
    mainGoal: '',
    currentStage: '',
    spotifyUrl: '',
    tiktokUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  })

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // TODO: Replace with real userId once auth is in place
      const userId = 'temp-user-id'

      // 1. Save the profile
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...formData })
      })

      // 2. Analyze the profile with AI
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analyzeProfile',
          userId,
          data: formData
        })
      })

      // 3. Redirect to chat
      router.push('/')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.artistName && formData.genre
      case 2:
        return formData.contentStyle && formData.mainGoal && formData.currentStage
      case 3:
        return true // Links are optional
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold">AI Manager</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Let's talk about you
                </h1>
                <p className="text-gray-600">
                  To personalize your experience, I need some info about your artistic project.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your artist name *
                </label>
                <input
                  type="text"
                  value={formData.artistName}
                  onChange={(e) => updateField('artistName', e.target.value)}
                  placeholder="e.g. DJ Pulse"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your main music genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => updateField('genre', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select your genre</option>
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-genre / Style (optional)
                </label>
                <input
                  type="text"
                  value={formData.subGenre}
                  onChange={(e) => updateField('subGenre', e.target.value)}
                  placeholder="e.g. Melodic Trap, Lo-fi Hip-Hop..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your niche / Positioning (optional)
                </label>
                <textarea
                  value={formData.niche}
                  onChange={(e) => updateField('niche', e.target.value)}
                  placeholder="e.g. I blend organic sounds with electronic beats to create a chill atmosphere..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Strategy
                </h1>
                <p className="text-gray-600">
                  Choose your content approach and define your goals.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Style *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  This is a critical strategic choice that will shape your entire content approach.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => updateField('contentStyle', 'facecam')}
                    className={`p-6 text-left border-2 rounded-lg transition ${
                      formData.contentStyle === 'facecam'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">📸</div>
                    <div className="font-semibold text-gray-900 mb-1">FACECAM</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Show your face</p>
                      <p>Personal branding</p>
                      <p>Human connection</p>
                      <p>Storytelling</p>
                      <p className="text-xs mt-2 text-gray-500">Best for: Extroverts, talkers, authentic personalities</p>
                    </div>
                  </button>

                  <button
                    onClick={() => updateField('contentStyle', 'faceless')}
                    className={`p-6 text-left border-2 rounded-lg transition ${
                      formData.contentStyle === 'faceless'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-semibold text-gray-900 mb-1">FACELESS</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Pure aesthetics</p>
                      <p>Mystery & intrigue</p>
                      <p>Music-focused</p>
                      <p>Scalable content</p>
                      <p className="text-xs mt-2 text-gray-500">Best for: Introverts, visual artists, music purists</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Main Goal *
                </label>
                <div className="grid gap-3">
                  {GOALS.map(goal => (
                    <button
                      key={goal}
                      onClick={() => updateField('mainGoal', goal)}
                      className={`p-4 text-left border-2 rounded-lg transition ${
                        formData.mainGoal === goal
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your current level *
                </label>
                <div className="grid gap-3">
                  {STAGES.map(stage => (
                    <button
                      key={stage}
                      onClick={() => updateField('currentStage', stage)}
                      className={`p-4 text-left border-2 rounded-lg transition ${
                        formData.currentStage === stage
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your socials
                </h1>
                <p className="text-gray-600">
                  Add your links so the AI can analyze your situation and give you personalized advice.
                  <br />
                  <span className="text-sm text-gray-500">(All fields are optional)</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spotify
                </label>
                <input
                  type="url"
                  value={formData.spotifyUrl}
                  onChange={(e) => updateField('spotifyUrl', e.target.value)}
                  placeholder="https://open.spotify.com/artist/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => updateField('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => updateField('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => updateField('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Ready to start!
                </h1>
                <p className="text-gray-600 mb-8">
                  The AI will analyze your profile and create your personalized plan.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Summary:</h3>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Artist name:</span>
                    <span className="font-medium">{formData.artistName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Genre:</span>
                    <span className="font-medium">{formData.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Style:</span>
                    <span className="font-medium uppercase">{formData.contentStyle} {formData.contentStyle === 'facecam' ? '📸' : '🎨'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-medium">{formData.mainGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{formData.currentStage}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-900">
                  <strong>What happens next:</strong> The AI will analyze your profile and give you your artist archetype, strengths, and unique positioning. Then, straight to your personal AI manager!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-2xl mx-auto px-4 flex justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Launch AI Analysis
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
