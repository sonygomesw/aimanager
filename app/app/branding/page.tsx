'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  Palette, Loader2, RefreshCw, Sparkles, Eye, MessageSquare, Zap
} from 'lucide-react'

interface BrandingData {
  universe: {
    colors: string[]
    mood: string
    emotion: string
    niche: string
  }
  visualStyle: {
    appearance: string
    presentation: string
    storytelling: string
  }
  positioning: {
    statement: string
    comparable: string
    perception: string
  }
  guidelines: string[]
  generatedAt: string
}

export default function BrandingPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [branding, setBranding] = useState<BrandingData | null>(null)

  useEffect(() => {
    fetchBranding()
  }, [])

  const fetchBranding = async () => {
    try {
      const res = await fetch('/api/branding')
      if (res.ok) {
        const data = await res.json()
        setBranding(data.branding)
      }
    } catch (error) {
      console.error('Error fetching branding:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateBranding = async () => {
    setGenerating(true)
    try {
      const userId = 'temp-user-id'
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'branding', userId })
      })

      if (res.ok) {
        const result = await res.json()
        if (result.data) {
          setBranding(result.data)
        }
      }
    } catch (error) {
      console.error('Error generating branding:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[57px] bg-gray-50 px-4 lg:px-8 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Branding & Identity</h1>
                <p className="text-xs text-gray-500">Your artistic universe and positioning</p>
              </div>
            </div>
            {branding && (
              <button
                onClick={generateBranding}
                disabled={generating}
                className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : !branding ? (
              /* No Branding Yet */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Define Your Artist Identity
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your AI Manager will analyze your profile and create a complete branding strategy including visual style, positioning, and guidelines.
                </p>
                <button
                  onClick={generateBranding}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-purple-400"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate My Branding
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Branding Content */
              <div className="space-y-6">
                {/* Artistic Universe */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Artistic Universe</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Colors */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h3>
                      <div className="flex gap-2">
                        {branding.universe.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-lg shadow-sm border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mood & Emotion */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Mood</h3>
                        <p className="text-gray-900">{branding.universe.mood}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Emotion</h3>
                        <p className="text-gray-900">{branding.universe.emotion}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Niche</h3>
                        <p className="text-gray-900">{branding.universe.niche}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Style */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Visual Style</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">How to Appear</h3>
                      <p className="text-gray-900">{branding.visualStyle.appearance}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">How to Present Your Music</h3>
                      <p className="text-gray-900">{branding.visualStyle.presentation}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Your Storytelling</h3>
                      <p className="text-gray-900">{branding.visualStyle.storytelling}</p>
                    </div>
                  </div>
                </div>

                {/* Positioning */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Your Positioning</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xl font-medium leading-relaxed">
                        "{branding.positioning.statement}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-sm text-indigo-200 mb-1">Comparable to:</p>
                      <p className="font-medium">{branding.positioning.comparable}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200 mb-1">How people should perceive you:</p>
                      <p className="font-medium">{branding.positioning.perception}</p>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Brand Guidelines</h2>
                  </div>

                  <div className="space-y-3">
                    {branding.guidelines.map((guideline, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-green-600">✓</span>
                        </div>
                        <p className="text-gray-900">{guideline}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated Info */}
                <div className="text-center text-xs text-gray-500">
                  Generated on {new Date(branding.generatedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
