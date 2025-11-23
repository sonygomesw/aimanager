'use client'

import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface TooltipProps {
  content: string
  children?: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        {children || <HelpCircle className="w-4 h-4" />}
      </button>
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
          {content}
        </div>
      )}
    </div>
  )
}
