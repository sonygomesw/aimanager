'use client'

import { Flame, Trophy, Star, Award, Crown } from 'lucide-react'

interface StreakDisplayProps {
  streak: number
  showLevel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StreakDisplay({ streak, showLevel = true, size = 'md' }: StreakDisplayProps) {
  const getStreakLevel = (days: number) => {
    if (days >= 90) {
      return {
        name: 'Platinum',
        icon: Crown,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
        flameColor: 'text-purple-500',
        nextLevel: null,
        daysToNext: 0
      }
    }
    if (days >= 30) {
      return {
        name: 'Gold',
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        flameColor: 'text-yellow-500',
        nextLevel: 'Platinum',
        daysToNext: 90 - days
      }
    }
    if (days >= 7) {
      return {
        name: 'Silver',
        icon: Star,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        flameColor: 'text-gray-500',
        nextLevel: 'Gold',
        daysToNext: 30 - days
      }
    }
    return {
      name: 'Bronze',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      flameColor: 'text-orange-500',
      nextLevel: 'Silver',
      daysToNext: 7 - days
    }
  }

  const level = getStreakLevel(streak)
  const LevelIcon = level.icon

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      flame: 'w-3 h-3',
      text: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5'
    },
    md: {
      container: 'px-3 py-2',
      flame: 'w-4 h-4',
      text: 'text-sm',
      badge: 'text-xs px-2 py-1'
    },
    lg: {
      container: 'px-4 py-3',
      flame: 'w-5 h-5',
      text: 'text-base',
      badge: 'text-sm px-3 py-1.5'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className="flex items-center gap-2">
      {/* Streak Count */}
      <div className={`flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg ${classes.container}`}>
        <Flame className={`${classes.flame} ${level.flameColor}`} />
        <span className={`font-bold ${classes.text} text-gray-900`}>{streak}</span>
        <span className={`${classes.text} text-gray-500`}>days</span>
      </div>

      {/* Level Badge */}
      {showLevel && (
        <div className={`flex items-center gap-1 rounded-full ${level.bgColor} ${level.borderColor} border ${classes.badge}`}>
          <LevelIcon className={`w-3 h-3 ${level.color}`} />
          <span className={`font-semibold ${level.color}`}>{level.name}</span>
        </div>
      )}
    </div>
  )
}

// Full streak card with progress
export function StreakCard({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  const getStreakLevel = (days: number) => {
    if (days >= 90) return { name: 'Platinum', threshold: 90, next: null, nextThreshold: 0 }
    if (days >= 30) return { name: 'Gold', threshold: 30, next: 'Platinum', nextThreshold: 90 }
    if (days >= 7) return { name: 'Silver', threshold: 7, next: 'Gold', nextThreshold: 30 }
    return { name: 'Bronze', threshold: 0, next: 'Silver', nextThreshold: 7 }
  }

  const level = getStreakLevel(streak)
  const progress = level.next
    ? ((streak - level.threshold) / (level.nextThreshold - level.threshold)) * 100
    : 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-2xl text-gray-900">{streak}</p>
            <p className="text-sm text-gray-500">day streak</p>
          </div>
        </div>
        <StreakDisplay streak={streak} size="sm" />
      </div>

      {/* Progress to next level */}
      {level.next && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{level.name}</span>
            <span>{level.next} in {level.nextThreshold - streak} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Current</p>
          <p className="font-semibold text-gray-900">{streak} days</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Longest</p>
          <p className="font-semibold text-gray-900">{longestStreak} days</p>
        </div>
      </div>

      {/* Motivation message */}
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-700">
          {streak === 0 && "Start your streak today! Consistency is key to success."}
          {streak > 0 && streak < 7 && "You're building momentum! Keep going to reach Silver status."}
          {streak >= 7 && streak < 30 && "Great progress! You're on your way to Gold status."}
          {streak >= 30 && streak < 90 && "Impressive dedication! Platinum status awaits at 90 days."}
          {streak >= 90 && "You're a true professional. Your consistency is paying off!"}
        </p>
      </div>
    </div>
  )
}
