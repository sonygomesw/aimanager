'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  ListTodo, Calendar, CalendarDays, Trophy, CheckCircle2, Circle,
  Loader2, RefreshCw, Clock
} from 'lucide-react'

interface Task {
  id: string
  title: string
  category: string
  completed: boolean
  deadline?: string
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'annual'>('weekly')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    weekly: [],
    monthly: [],
    annual: []
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || { weekly: [], monthly: [], annual: [] })
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTasks = async (type: string) => {
    setGenerating(true)
    try {
      const userId = 'temp-user-id'
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: `${type}Tasks`, userId })
      })

      if (res.ok) {
        await fetchTasks()
      }
    } catch (error) {
      console.error('Error generating tasks:', error)
    } finally {
      setGenerating(false)
    }
  }

  const toggleTask = async (taskId: string, type: string) => {
    // Optimistic update
    setTasks(prev => ({
      ...prev,
      [type]: prev[type].map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    }))

    // TODO: Save to server
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !tasks[type].find(t => t.id === taskId)?.completed })
      })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const currentTasks = tasks[activeTab] || []
  const completedCount = currentTasks.filter(t => t.completed).length
  const totalCount = currentTasks.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const tabs = [
    {
      id: 'weekly',
      label: 'This Week',
      icon: Calendar,
      description: 'Daily actions for consistency',
      examples: ['3 micro-contents', '1 studio session', '1 branding post', '1 DJ/playlist contact']
    },
    {
      id: 'monthly',
      label: 'This Month',
      icon: CalendarDays,
      description: 'Monthly milestones',
      examples: ['1 release', '1 visual shoot', 'Spotify audit', 'KPI review', 'Press kit update']
    },
    {
      id: 'annual',
      label: 'This Year',
      icon: Trophy,
      description: 'Yearly career goals',
      examples: ['12 tracks', '100K listeners', '10 collabs', '1 EP', '50+ TikToks']
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      creation: 'bg-purple-100 text-purple-700',
      branding: 'bg-pink-100 text-pink-700',
      engagement: 'bg-green-100 text-green-700',
      promotion: 'bg-blue-100 text-blue-700',
      music: 'bg-indigo-100 text-indigo-700',
      business: 'bg-orange-100 text-orange-700',
      default: 'bg-gray-100 text-gray-700'
    }
    return colors[category.toLowerCase()] || colors.default
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[57px] bg-gray-50 px-4 lg:px-8 flex items-center">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
              <p className="text-xs text-gray-500">Your structured action plan</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
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
            ) : currentTasks.length === 0 ? (
              /* No Tasks Yet */
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListTodo className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No {activeTab === 'weekly' ? 'Weekly' : activeTab === 'monthly' ? 'Monthly' : 'Annual'} Tasks Yet
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your AI Manager will create personalized tasks based on your goals.
                  </p>
                </div>

                {/* Example Tasks */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Example tasks:</h3>
                  <div className="grid gap-2">
                    {tabs.find(t => t.id === activeTab)?.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Circle className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-600">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => generateTasks(activeTab)}
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
                        <ListTodo className="w-4 h-4" />
                        Generate My Tasks
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Tasks List */
              <div className="space-y-4">
                {/* Progress Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm text-gray-600">{completedCount} of {totalCount} completed</span>
                    </div>
                    <button
                      onClick={() => generateTasks(activeTab)}
                      disabled={generating}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {currentTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, activeTab)}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="pt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>
                          {task.deadline && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Completion Message */}
                {progressPercent === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-1">
                      All tasks completed!
                    </h3>
                    <p className="text-sm text-green-700">
                      Excellent work! Your consistency is building your career.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
