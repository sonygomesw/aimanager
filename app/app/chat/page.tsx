'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Send, Sparkles, Menu, X, Plus, MessageSquare,
  LayoutDashboard, User, Settings, Loader2
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // TODO: Remplacer par le vrai userId
      const userId = 'temp-user-id'

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId,
          conversationId: null
        })
      })

      if (!response.ok) throw new Error('Erreur API')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      // Ajouter un message vide pour l'assistant
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          // Mettre à jour le dernier message
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: assistantMessage
            }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Désolé, une erreur est survenue. Réessaie.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-200 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold">AI Manager</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            <Plus className="w-4 h-4" />
            <span>Nouvelle conversation</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link
            href="/app/chat"
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Manager</span>
          </Link>
          <Link
            href="/app/dashboard"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/app/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition"
          >
            <User className="w-4 h-4" />
            <span>Mon Profil</span>
          </Link>
          <Link
            href="/app/settings"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition"
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Artiste</p>
              <p className="text-xs text-gray-400 truncate">artiste@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Chat avec ton Manager IA</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hey ! Je suis ton Manager IA 👋
                </h2>
                <p className="text-gray-600 mb-6">
                  Pose-moi n'importe quelle question sur ta carrière, tes projets, ton contenu... Je suis là pour t'aider à atteindre tes objectifs !
                </p>
                <div className="grid gap-2 text-left">
                  <button
                    onClick={() => setInput("Comment créer du contenu viral sur TikTok ?")}
                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-sm"
                  >
                    💡 Comment créer du contenu viral sur TikTok ?
                  </button>
                  <button
                    onClick={() => setInput("Aide-moi à structurer ma semaine de travail")}
                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-sm"
                  >
                    📅 Aide-moi à structurer ma semaine de travail
                  </button>
                  <button
                    onClick={() => setInput("Comment développer mon audience sur Spotify ?")}
                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition text-sm"
                  >
                    🎵 Comment développer mon audience sur Spotify ?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`flex-1 max-w-2xl ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3'
                        : 'text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pose ta question à ton manager IA..."
                  rows={1}
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:bg-gray-50"
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-12 h-12 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              L'IA peut faire des erreurs. Vérifie les informations importantes.
            </p>
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
    </div>
  )
}
