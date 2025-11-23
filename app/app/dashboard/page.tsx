'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, CheckCircle2, Circle, Calendar, Zap, TrendingUp, Plus, Loader2,
  Video, Target, Music
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

export default function DashboardPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  const generateContent = async (type: string) => {
    setGenerating(type)
    try {
      const userId = 'temp-user-id'

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, userId })
      })

      const data = await response.json()
      console.log('Generated:', data)
      alert(`${type} generated successfully! Check the results.`)
    } catch (error) {
      console.error('Error:', error)
      alert('Error during generation')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Your artist dashboard</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={<Target className="w-5 h-5" />}
                title="Current Goal"
                value="Grow my audience"
                color="indigo"
              />
              <StatCard
                icon={<Music className="w-5 h-5" />}
                title="Genre"
                value="Hip-Hop"
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                title="Level"
                value="Intermediate"
                color="green"
              />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Daily Checklist */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Daily Checklist
                    </h2>
                    <button
                      onClick={() => generateContent('dailyChecklist')}
                      disabled={generating === 'dailyChecklist'}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:text-gray-400"
                    >
                      {generating === 'dailyChecklist' ? 'Generating...' : 'Generate new'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <TaskItem
                      title="Create 1 TikTok video"
                      category="Creation"
                      duration="30min"
                      completed={false}
                    />
                    <TaskItem
                      title="Reply to DMs"
                      category="Promotion"
                      duration="15min"
                      completed={true}
                    />
                    <TaskItem
                      title="Listen to 3 new beats"
                      category="Creation"
                      duration="20min"
                      completed={false}
                    />
                    <TaskItem
                      title="Post an Instagram story"
                      category="Promotion"
                      duration="10min"
                      completed={false}
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Today's progress</span>
                      <span className="font-semibold text-indigo-600">25%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <QuickActionButton
                      onClick={() => generateContent('30DayPlan')}
                      loading={generating === '30DayPlan'}
                      icon={<Calendar className="w-4 h-4" />}
                      title="30-Day Plan"
                      description="Generate your TikTok plan"
                    />
                    <QuickActionButton
                      onClick={() => generateContent('hooks')}
                      loading={generating === 'hooks'}
                      icon={<Zap className="w-4 h-4" />}
                      title="Viral Hooks"
                      description="10 hooks for your videos"
                    />
                    <QuickActionButton
                      onClick={() => generateContent('videoIdeas')}
                      loading={generating === 'videoIdeas'}
                      icon={<Video className="w-4 h-4" />}
                      title="Video Ideas"
                      description="15 content concepts"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <Sparkles className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Need advice?</h3>
                  <p className="text-sm text-indigo-100 mb-4">
                    Ask your AI manager any question
                  </p>
                  <Link
                    href="/"
                    className="block w-full bg-white text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
                  >
                    Open chat
                  </Link>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6">
              <PlanCard
                title="Monthly Plan"
                description="Your personalized 30-day TikTok plan"
                action={() => generateContent('30DayPlan')}
                loading={generating === '30DayPlan'}
              />
              <PlanCard
                title="Annual Plan"
                description="Your 12-month career roadmap"
                action={() => generateContent('annualPlan')}
                loading={generating === 'annualPlan'}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: {
  icon: React.ReactNode
  title: string
  value: string
  color: 'indigo' | 'purple' | 'green'
}) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function TaskItem({ title, category, duration, completed }: {
  title: string
  category: string
  duration: string
  completed: boolean
}) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
      <button className="mt-0.5">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </button>
      <div className="flex-1">
        <p className={`font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500">{category}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{duration}</span>
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ onClick, loading, icon, title, description }: {
  onClick: () => void
  loading: boolean
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-50"
    >
      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      </div>
      <div className="text-left">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </button>
  )
}

function PlanCard({ title, description, action, loading }: {
  title: string
  description: string
  action: () => void
  loading: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={action}
        disabled={loading}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm disabled:text-gray-400"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Generate now
          </>
        )}
      </button>
    </div>
  )
}
