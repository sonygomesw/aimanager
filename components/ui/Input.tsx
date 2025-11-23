'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[var(--background-secondary)] border ${
            error ? 'border-red-500' : 'border-[var(--border)]'
          } rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-[var(--background-secondary)] border ${
            error ? 'border-red-500' : 'border-[var(--border)]'
          } rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
