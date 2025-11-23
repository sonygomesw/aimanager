'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DailyCheckIn } from '@/components/DailyCheckIn'

interface CheckInContextType {
  hasCheckedInToday: boolean
  currentStreak: number
  longestStreak: number
  level: string
  showCheckIn: () => void
  hideCheckIn: () => void
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined)

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true) // Default to true to avoid flash
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [level, setLevel] = useState('bronze')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCheckInStatus()
  }, [])

  const fetchCheckInStatus = async () => {
    try {
      const res = await fetch('/api/checkin?userId=temp-user-id')
      if (res.ok) {
        const data = await res.json()
        setHasCheckedInToday(data.hasCheckedInToday)
        setCurrentStreak(data.currentStreak)
        setLongestStreak(data.longestStreak)
        setLevel(data.level)

        // Show check-in modal if not checked in today
        if (!data.hasCheckedInToday) {
          setShowModal(true)
        }
      }
    } catch (error) {
      console.error('Error fetching check-in status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    setHasCheckedInToday(true)
    setCurrentStreak(prev => prev + 1)
    setShowModal(false)
  }

  const showCheckIn = () => setShowModal(true)
  const hideCheckIn = () => setShowModal(false)

  return (
    <CheckInContext.Provider
      value={{
        hasCheckedInToday,
        currentStreak,
        longestStreak,
        level,
        showCheckIn,
        hideCheckIn
      }}
    >
      {children}
      {showModal && !loading && (
        <DailyCheckIn
          onComplete={handleComplete}
          onClose={hideCheckIn}
          currentStreak={currentStreak}
        />
      )}
    </CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const context = useContext(CheckInContext)
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider')
  }
  return context
}
