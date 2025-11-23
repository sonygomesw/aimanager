'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles, Menu, X, Plus, MessageSquare,
  LayoutDashboard, User, Settings, Home,
  Target, Palette, ListTodo, DollarSign, TrendingUp
} from 'lucide-react'

interface SidebarProps {
  onNewChat?: () => void
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/app/home', icon: Home, label: 'Dashboard' },
    { href: '/', icon: MessageSquare, label: 'Chat Manager' },
    { href: '/app/blueprint', icon: Target, label: 'Career Blueprint' },
    { href: '/app/branding', icon: Palette, label: 'Branding' },
    { href: '/app/tasks', icon: ListTodo, label: 'Tasks' },
    { href: '/app/revenue', icon: DollarSign, label: 'Revenue' },
    { href: '/app/profile', icon: User, label: 'Profile' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="h-[57px] px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-900">AI Manager</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat */}
        {onNewChat && (
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat()
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>New conversation</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Artist</p>
              <p className="text-xs text-gray-500 truncate">artist@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </>
  )
}

export function SidebarTrigger() {
  return null // Le bouton est déjà dans la Sidebar
}
