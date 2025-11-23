'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  Target, Calendar, TrendingUp, Loader2, RefreshCw,
  CheckCircle2, Clock, Zap, Trophy, ChevronRight
} from 'lucide-react'

interface Goal {
  title: string
  description: string
  metric: string
  targetValue: string
}

interface Milestone {
  title: string
  deadline: string
  completed: boolean
  description: string
  tasks: string[]
  successCriteria: string
}

interface Strategy {
  title: string
  description: string
  steps: string[]
  tools: string[]
}

interface Plan {
  id: string
  type: '30day' | '90day' | '1year'
  title: string
  overview: string
  goals: Goal[]
  milestones: Milestone[]
  strategies: Strategy[]
  weeklyActions: string[]
  dailyHabits: string[]
  generatedAt: string
}

export default function BlueprintPage() {
  const [activeTab, setActiveTab] = useState<'30day' | '90day' | '1year'>('30day')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [plans, setPlans] = useState<Record<string, Plan | null>>({
    '30day': null,
    '90day': null,
    '1year': null
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/blueprint')
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans || {})
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async (type: string) => {
    setGenerating(true)
    try {
      const userId = 'temp-user-id'
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: `${type}Plan`, userId })
      })

      if (res.ok) {
        const result = await res.json()
        if (result.data) {
          setPlans(prev => ({
            ...prev,
            [type]: result.data
          }))
        }
      }
    } catch (error) {
      console.error('Error generating plan:', error)
    } finally {
      setGenerating(false)
    }
  }

  const currentPlan = plans[activeTab]

  const tabs = [
    { id: '30day', label: '30 Days', icon: Calendar, description: 'Short-term goals & daily routine' },
    { id: '90day', label: '90 Days', icon: TrendingUp, description: 'Release strategy & growth plan' },
    { id: '1year', label: '1 Year', icon: Trophy, description: 'Career milestones & long-term vision' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[57px] bg-gray-50 px-4 lg:px-8 flex items-center">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Career Blueprint</h1>
              <p className="text-xs text-gray-500">Your strategic roadmap to success</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              <div className="grid grid-cols-3 gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`p-4 rounded-lg text-left transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                      <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : !currentPlan ? (
              /* No Plan Yet */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeTab === '30day' ? '30-Day' : activeTab === '90day' ? '90-Day' : '1-Year'} Plan Yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Let your AI Manager create a personalized strategic plan based on your goals and current situation.
                </p>
                <button
                  onClick={() => generatePlan(activeTab)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate My Plan
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Plan Content */
              <div className="space-y-6">
                {/* Overview */}
                {currentPlan.overview && (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                    <h2 className="text-lg font-semibold mb-2">{currentPlan.title || 'Plan Overview'}</h2>
                    <p className="text-indigo-100">{currentPlan.overview}</p>
                    <button
                      onClick={() => generatePlan(activeTab)}
                      disabled={generating}
                      className="mt-4 text-sm text-white/80 hover:text-white font-medium flex items-center gap-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                      Regenerate Plan
                    </button>
                  </div>
                )}

                {/* Goals Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Goals</h2>
                  <div className="space-y-4">
                    {currentPlan.goals.map((goal, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-indigo-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{typeof goal === 'string' ? goal : goal.title}</p>
                            {typeof goal !== 'string' && (
                              <>
                                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                <div className="flex gap-4 mt-2 text-xs">
                                  <span className="text-indigo-600"><strong>Metric:</strong> {goal.metric}</span>
                                  <span className="text-green-600"><strong>Target:</strong> {goal.targetValue}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h2>
                  <div className="space-y-4">
                    {currentPlan.milestones.map((milestone, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          {milestone.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {milestone.title}
                              </p>
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{milestone.deadline}</span>
                            </div>
                            {milestone.description && (
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            )}
                            {milestone.tasks && milestone.tasks.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-500 mb-2">Tasks:</p>
                                <ul className="space-y-1">
                                  {milestone.tasks.map((task, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                      {task}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {milestone.successCriteria && (
                              <p className="text-xs text-green-600 mt-2">
                                <strong>Success:</strong> {milestone.successCriteria}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategies Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategies</h2>
                  <div className="space-y-4">
                    {currentPlan.strategies.map((strategy, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                        {typeof strategy === 'string' ? (
                          <p className="text-gray-900 text-sm">{strategy}</p>
                        ) : (
                          <>
                            <h3 className="font-medium text-gray-900">{strategy.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                            {strategy.steps && strategy.steps.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-500 mb-2">Steps:</p>
                                <ol className="space-y-1 list-decimal list-inside">
                                  {strategy.steps.map((step, i) => (
                                    <li key={i} className="text-sm text-gray-700">{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            {strategy.tools && strategy.tools.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {strategy.tools.map((tool, i) => (
                                  <span key={i} className="text-xs bg-white px-2 py-0.5 rounded text-indigo-600">{tool}</span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Habits & Weekly Actions */}
                {(currentPlan.dailyHabits?.length > 0 || currentPlan.weeklyActions?.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentPlan.dailyHabits?.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Habits</h2>
                        <ul className="space-y-2">
                          {currentPlan.dailyHabits.map((habit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              {habit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {currentPlan.weeklyActions?.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Actions</h2>
                        <ul className="space-y-2">
                          {currentPlan.weeklyActions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Generated Info */}
                <div className="text-center text-xs text-gray-500">
                  Generated on {new Date(currentPlan.generatedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
