'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  danger?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
}

export function Dropdown({ trigger, items, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56 bg-[var(--background-secondary)] border-[var(--border)]">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={`${
              item.danger ? 'text-red-400 focus:text-red-400' : 'text-[var(--foreground)]'
            } cursor-pointer`}
          >
            {item.icon && (
              <span className="mr-3 h-4 w-4">{item.icon}</span>
            )}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple dropdown button with chevron
export function DropdownButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)] transition-colors">
      {children}
      <ChevronDown className="w-4 h-4 text-[var(--foreground-secondary)]" />
    </button>
  )
}
