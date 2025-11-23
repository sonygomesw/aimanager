'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Calendar, Loader2, RefreshCw, CheckCircle2, Circle } from 'lucide-react'

interface DayPlan {
  day: number
  date: string
  tasks: {
    id: string
    title: string
    category: string
    completed: boolean
  }[]
}

export default function CalendarPlanPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [plan, setPlan] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/calendar-plan')
      if (res.ok) {
        const data = await res.json()
        setPlan(data.plan || [])
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    setGenerating(true)
    try {
      const userId = 'temp-user-id'
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '30DayPlan', userId })
      })

      if (res.ok) {
        await fetchPlan()
      }
    } catch (error) {
      console.error('Error generating plan:', error)
    } finally {
      setGenerating(false)
    }
  }

  const toggleTask = async (dayIndex: number, taskId: string) => {
    // Optimistic update
    setPlan(prev => prev.map((day, i) => {
      if (i === dayIndex) {
        return {
          ...day,
          tasks: day.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
      }
      return day
    }))

    // TODO: Save to server
  }

  const currentDay = new Date().getDate()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">30-Day Plan</h1>
                <p className="text-sm text-gray-600">Your personalized TikTok content calendar</p>
              </div>
            </div>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Generate New Plan
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : plan.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No plan yet</h2>
                <p className="text-gray-600 mb-6">
                  Generate your personalized 30-day TikTok content plan
                </p>
                <button
                  onClick={generatePlan}
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
                      <Calendar className="w-4 h-4" />
                      Generate 30-Day Plan
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendar</h2>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      {plan.map((day, index) => {
                        const completedTasks = day.tasks.filter(t => t.completed).length
                        const totalTasks = day.tasks.length
                        const isToday = day.day === currentDay
                        const isSelected = selectedDay === index

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDay(index)}
                            className={`aspect-square rounded-lg p-2 text-center transition relative ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : isToday
                                ? 'bg-indigo-100 text-indigo-600 font-bold'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="text-sm font-medium">{day.day}</div>
                            {totalTasks > 0 && (
                              <div className={`text-xs mt-1 ${
                                isSelected ? 'text-indigo-200' : 'text-gray-500'
                              }`}>
                                {completedTasks}/{totalTasks}
                              </div>
                            )}
                            {completedTasks === totalTasks && totalTasks > 0 && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle2 className={`w-3 h-3 ${
                                  isSelected ? 'text-white' : 'text-green-500'
                                }`} />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Day Details */}
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                    {selectedDay !== null ? (
                      <>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                          Day {plan[selectedDay].day}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">{plan[selectedDay].date}</p>

                        <div className="space-y-2">
                          {plan[selectedDay].tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(selectedDay, task.id)}
                              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                              )}
                              <div>
                                <p className={`text-sm font-medium ${
                                  task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500">{task.category}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Select a day to view tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
