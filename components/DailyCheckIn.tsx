'use client'

import { useState, useEffect } from 'react'
import { X, Flame, Zap, Sun, Cloud, CloudRain, Battery, Sparkles } from 'lucide-react'

interface DailyCheckInProps {
  onComplete: () => void
  onClose: () => void
  currentStreak: number
}

export function DailyCheckIn({ onComplete, onClose, currentStreak }: DailyCheckInProps) {
  const [step, setStep] = useState(1)
  const [mood, setMood] = useState<string>('')
  const [energy, setEnergy] = useState<number>(3)
  const [workingOn, setWorkingOn] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const moods = [
    { value: 'great', label: 'Great', icon: Sun, color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
    { value: 'good', label: 'Good', icon: Cloud, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { value: 'okay', label: 'Okay', icon: Cloud, color: 'text-gray-500 bg-gray-50 border-gray-200' },
    { value: 'tired', label: 'Tired', icon: Battery, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { value: 'stressed', label: 'Stressed', icon: CloudRain, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  ]

  const getStreakLevel = (streak: number) => {
    if (streak >= 90) return { name: 'Platinum', color: 'text-purple-600', bgColor: 'bg-purple-100' }
    if (streak >= 30) return { name: 'Gold', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (streak >= 7) return { name: 'Silver', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    return { name: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          energy,
          workingOn,
          userId: 'temp-user-id'
        })
      })

      if (res.ok) {
        onComplete()
      }
    } catch (error) {
      console.error('Error submitting check-in:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const streakLevel = getStreakLevel(currentStreak)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Daily Check-in</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Streak Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-bold text-lg">{currentStreak}</span>
              <span className="text-sm text-white/80">day streak</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${streakLevel.bgColor} ${streakLevel.color}`}>
              {streakLevel.name}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">How are you feeling today?</h3>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((m) => {
                    const Icon = m.icon
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-1 ${
                          mood === m.value ? m.color : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Energy level</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergy(level)}
                      className={`flex-1 py-3 rounded-lg border-2 transition ${
                        energy >= level
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <Zap className={`w-4 h-4 mx-auto ${energy >= level ? 'text-indigo-600' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Low</span>
                  <span className="text-xs text-gray-500">High</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!mood}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What are you working on today?</h3>
                <textarea
                  value={workingOn}
                  onChange={(e) => setWorkingOn(e.target.value)}
                  placeholder="e.g., Finishing my new track, Creating TikTok content..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400"
                >
                  {submitting ? 'Saving...' : 'Complete Check-in'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3" />
            <span>Your Manager remembers everything you share</span>
          </div>
        </div>
      </div>
    </div>
  )
}
