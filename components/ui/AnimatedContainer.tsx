'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeIn, fadeInUp, scaleIn, staggerContainer, staggerItem } from '@/lib/animations'

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'fadeInUp' | 'scaleIn'
  delay?: number
}

export function AnimatedContainer({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
}: AnimatedContainerProps) {
  const animations = {
    fadeIn,
    fadeInUp,
    scaleIn,
  }

  const selectedAnimation = animations[animation]

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      transition={{ ...selectedAnimation.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerListProps {
  children: ReactNode
  className?: string
}

export function StaggerList({ children, className = '' }: StaggerListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

// Presence wrapper for enter/exit animations
interface PresenceProps {
  children: ReactNode
  show: boolean
}

export function Presence({ children, show }: PresenceProps) {
  return (
    <AnimatePresence mode="wait">
      {show && children}
    </AnimatePresence>
  )
}

// Loading skeleton with pulse animation
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-[var(--background-tertiary)] rounded-lg ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
