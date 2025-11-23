'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles, MessageSquare,
  Flame, CheckCircle2, Trophy, Music, Video, TrendingUp,
  Target, Plus, BarChart3
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Tooltip } from '@/components/Tooltip'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [monthlyProgress, setMonthlyProgress] = useState<any>(null)
  const [dailyTasks, setDailyTasks] = useState<any[]>([])

  // Modals
  const [showTikTokModal, setShowTikTokModal] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [tiktokCount, setTiktokCount] = useState('')
  const [trackName, setTrackName] = useState('')
  const [trackUrl, setTrackUrl] = useState('')

  // Fetch real data from APIs
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // Fetch profile/streak
      const profileRes = await fetch('/api/profile')
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data.profile)
      }

      // Fetch monthly progress
      const progressRes = await fetch('/api/monthly-progress')
      if (progressRes.ok) {
        const data = await progressRes.json()
        setMonthlyProgress(data.progress)
      }

      // Fetch daily tasks
      const tasksRes = await fetch('/api/daily-tasks')
      if (tasksRes.ok) {
        const data = await tasksRes.json()
        setDailyTasks(data.tasks)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setDailyTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t)
      )

      // Update on server
      const res = await fetch('/api/daily-tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !currentStatus })
      })

      if (!res.ok) {
        // Revert on error
        setDailyTasks(prev =>
          prev.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t)
        )
      } else {
        // Refresh streak if needed
        const streakRes = await fetch('/api/streak')
        if (streakRes.ok) {
          const data = await streakRes.json()
          setProfile(prev => prev ? { ...prev, ...data } : null)
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      // Revert on error
      setDailyTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t)
      )
    }
  }

  const logTikToks = async () => {
    try {
      const count = parseInt(tiktokCount)
      if (isNaN(count) || count <= 0) return

      const res = await fetch('/api/monthly-progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tiktoksCreated: (monthlyProgress?.tiktoksCreated || 0) + count
        })
      })

      if (res.ok) {
        const data = await res.json()
        setMonthlyProgress(data.progress)
        setShowTikTokModal(false)
        setTiktokCount('')

        // Show success toast
        const event = new CustomEvent('show-toast', {
          detail: { message: `${count} TikTok${count > 1 ? 's' : ''} added! Keep going 🔥`, type: 'success' }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Error logging TikToks:', error)
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to log TikToks. Please try again.', type: 'error' }
      })
      window.dispatchEvent(event)
    }
  }

  const markTrackReleased = async () => {
    try {
      if (!trackName) return

      const res = await fetch('/api/monthly-progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackReleased: true,
          trackName,
          trackSpotifyUrl: trackUrl
        })
      })

      if (res.ok) {
        const data = await res.json()
        setMonthlyProgress(data.progress)
        setShowTrackModal(false)
        setTrackName('')
        setTrackUrl('')

        // Show success toast
        const event = new CustomEvent('show-toast', {
          detail: { message: `Track "${trackName}" marked as released! 🎵`, type: 'success' }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Error marking track released:', error)
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to mark track. Please try again.', type: 'error' }
      })
      window.dispatchEvent(event)
    }
  }

  const tasksCompleted = dailyTasks.filter(t => t.completed).length
  const tasksTotal = dailyTasks.length
  const progressPercent = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0

  const tiktoksProgress = monthlyProgress?.tiktoksCreated || 0
  const tiktoksGoal = 200
  const tiktoksPercent = Math.round((tiktoksProgress / tiktoksGoal) * 100)

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[57px] bg-gray-50 px-4 lg:px-8 sticky top-0 z-10 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Today</h1>
                <p className="text-xs text-gray-500" suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <Link
              href="/app/chat"
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Manager</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="space-y-6">
            {/* Streak Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Current Streak */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{profile?.currentStreak || 0}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">Day streak</div>
                  <Tooltip content="Consistency is everything! Post daily to build momentum and train the algorithm. Never break your streak." />
                </div>
              </div>

              {/* Best Streak */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Record</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{profile?.longestStreak || 0}</div>
                <div className="text-sm text-gray-500">Best streak</div>
              </div>

              {/* Today Progress */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{progressPercent}%</div>
                <div className="text-sm text-gray-500">{tasksCompleted} of {tasksTotal} tasks done</div>
              </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Monthly Progress</h2>
                    <p className="text-sm text-gray-500 mt-1" suppressHydrationWarning>{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Track Status */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        monthlyProgress?.trackReleased ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Music className={`w-5 h-5 ${
                          monthlyProgress?.trackReleased ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Track Release</div>
                        <div className="text-xs text-gray-500">1 per month required</div>
                      </div>
                    </div>
                    {monthlyProgress?.trackReleased ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <button
                        onClick={() => setShowTrackModal(true)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Mark Released
                      </button>
                    )}
                  </div>
                </div>

                {/* TikToks Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">TikToks Created</div>
                          <Tooltip content="Why 200? Each TikTok is a free lottery ticket for virality. More content = more chances to blow up. Batch filming makes this sustainable." />
                        </div>
                        <div className="text-xs text-gray-500">Goal: 200 per month</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTikTokModal(true)}
                      className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{tiktoksProgress} / 200</span>
                      <span className="font-semibold text-gray-900">{tiktoksPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(tiktoksPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Checklist */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
                    <p className="text-sm text-gray-500 mt-1">{tasksCompleted} of {tasksTotal} completed</p>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-100"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercent / 100)}`}
                        className="text-indigo-600 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-900">{progressPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="space-y-1">
                  {dailyTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
                    >
                      <div className="flex-shrink-0">
                        {task.completed ? (
                          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}>
                          {task.task}
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-md ${
                        task.category === 'music' ? 'bg-indigo-100 text-indigo-700' :
                        task.category === 'branding' ? 'bg-purple-100 text-purple-700' :
                        task.category === 'engagement' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {progressPercent === 100 && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-900">Perfect day!</div>
                      <div className="text-sm text-green-700">Streak: {(profile?.currentStreak || 0) + 1} days</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* TikTok Log Modal */}
      {showTikTokModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Log TikToks</h2>
                  <p className="text-sm text-gray-500">How many did you create?</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <input
                type="number"
                value={tiktokCount}
                onChange={(e) => setTiktokCount(e.target.value)}
                placeholder="Enter count"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setShowTikTokModal(false)
                  setTiktokCount('')
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={logTikToks}
                disabled={!tiktokCount || parseInt(tiktokCount) <= 0}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Add TikToks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Released Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Track Released</h2>
                  <p className="text-sm text-gray-500">Log your release</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="Track name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              <input
                type="url"
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="Spotify URL (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setShowTrackModal(false)
                  setTrackName('')
                  setTrackUrl('')
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={markTrackReleased}
                disabled={!trackName}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Mark Released
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
