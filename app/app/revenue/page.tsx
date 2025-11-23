'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  DollarSign, TrendingUp, Target, Music, Users,
  Briefcase, Award, ChevronRight, Info
} from 'lucide-react'

export default function RevenuePage() {
  const [monthlyListeners, setMonthlyListeners] = useState<number>(5000)

  // Revenue calculations based on industry averages
  const calculateRevenue = (listeners: number) => {
    // Spotify pays roughly $0.003-0.005 per stream
    // Average listener streams 3-5 times per month
    const avgStreamsPerListener = 4
    const totalStreams = listeners * avgStreamsPerListener
    const lowRate = 0.003
    const highRate = 0.005

    return {
      low: Math.round(totalStreams * lowRate),
      high: Math.round(totalStreams * highRate),
      streams: totalStreams
    }
  }

  const revenue = calculateRevenue(monthlyListeners)

  const milestones = [
    {
      listeners: 10000,
      title: '10K Monthly Listeners',
      revenue: '€40 - €200/month',
      opportunities: ['Playlist pitching', 'First brand deals possible'],
      icon: Music
    },
    {
      listeners: 100000,
      title: '100K Monthly Listeners',
      revenue: '€400 - €2,000/month',
      opportunities: ['Label interest', 'Booking opportunities', 'Spotify editorial'],
      icon: TrendingUp
    },
    {
      listeners: 500000,
      title: '500K Monthly Listeners',
      revenue: '€2,000 - €10,000/month',
      opportunities: ['Major label negotiations', 'Festival bookings', 'Sync licensing'],
      icon: Target
    },
    {
      listeners: 1000000,
      title: '1M Monthly Listeners',
      revenue: '€4,000 - €20,000/month',
      opportunities: ['Top-tier label deals', 'International touring', 'Major brand partnerships'],
      icon: Award
    }
  ]

  const negotiations = [
    {
      opportunity: 'Label Interest',
      threshold: '200K - 500K monthly',
      description: 'Labels start paying attention when you prove organic growth',
      icon: Briefcase
    },
    {
      opportunity: 'Booking Fee',
      threshold: '20K+ followers + engagement',
      description: 'Venues care about ticket sales potential',
      icon: Users
    },
    {
      opportunity: 'Collaboration Value',
      threshold: 'Track trending on TikTok',
      description: 'Your value spikes when you have a trending sound',
      icon: Music
    },
    {
      opportunity: 'Spotify Deals',
      threshold: '1M+ monthly listeners',
      description: 'Premium placement and promotional support',
      icon: Award
    }
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-[57px] bg-gray-50 px-4 lg:px-8 flex items-center">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Revenue Intelligence</h1>
              <p className="text-xs text-gray-500">Understand your earning potential</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Revenue Calculator */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Calculator</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Listeners
                </label>
                <input
                  type="range"
                  min="1000"
                  max="5000000"
                  step="1000"
                  value={monthlyListeners}
                  onChange={(e) => setMonthlyListeners(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">1K</span>
                  <span className="text-lg font-bold text-indigo-600" suppressHydrationWarning>
                    {monthlyListeners.toLocaleString('en-US')}
                  </span>
                  <span className="text-xs text-gray-500">5M</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Monthly Streams</p>
                  <p className="text-xl font-bold text-gray-900" suppressHydrationWarning>{revenue.streams.toLocaleString('en-US')}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Est. Revenue (Low)</p>
                  <p className="text-xl font-bold text-green-600" suppressHydrationWarning>€{revenue.low.toLocaleString('en-US')}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Est. Revenue (High)</p>
                  <p className="text-xl font-bold text-green-600">€{revenue.high.toLocaleString('en-US')}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Based on Spotify average payout of €0.003-0.005 per stream and 4 streams per listener per month.
                  Actual revenue varies by country and listener behavior.
                </p>
              </div>
            </div>

            {/* Revenue Milestones */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Milestones</h2>

              <div className="space-y-4">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon
                  const isAchieved = monthlyListeners >= milestone.listeners
                  const isNext = !isAchieved && (index === 0 || monthlyListeners >= milestones[index - 1].listeners)

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition ${
                        isAchieved
                          ? 'border-green-500 bg-green-50'
                          : isNext
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isAchieved ? 'bg-green-100' : isNext ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isAchieved ? 'text-green-600' : isNext ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${
                              isAchieved ? 'text-green-900' : isNext ? 'text-indigo-900' : 'text-gray-900'
                            }`}>
                              {milestone.title}
                            </h3>
                            <p className={`text-sm ${
                              isAchieved ? 'text-green-700' : isNext ? 'text-indigo-700' : 'text-gray-600'
                            }`}>
                              {milestone.revenue}
                            </p>
                          </div>
                        </div>
                        {isAchieved && (
                          <span className="text-xs font-medium bg-green-500 text-white px-2 py-1 rounded">
                            Achieved!
                          </span>
                        )}
                        {isNext && (
                          <span className="text-xs font-medium bg-indigo-500 text-white px-2 py-1 rounded">
                            Next Goal
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {milestone.opportunities.map((opp, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                            {opp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Negotiation Thresholds */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">When Can You Negotiate?</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {negotiations.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.opportunity}</h3>
                          <p className="text-sm font-medium text-indigo-600 mt-1">{item.threshold}</p>
                          <p className="text-xs text-gray-600 mt-2">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Projection */}
            {monthlyListeners < 1000000 && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-2">Your Projection</h2>
                <p className="text-indigo-100 mb-4">
                  Based on your current growth, your Manager estimates:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-indigo-200">In 6 months</p>
                    <p className="text-xl font-bold">{Math.round(monthlyListeners * 2.5).toLocaleString('en-US')} listeners</p>
                    <p className="text-sm text-indigo-200">€{Math.round(monthlyListeners * 2.5 * 4 * 0.004).toLocaleString('en-US')}/month</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-indigo-200">In 12 months</p>
                    <p className="text-xl font-bold">{Math.round(monthlyListeners * 5).toLocaleString('en-US')} listeners</p>
                    <p className="text-sm text-indigo-200">€{Math.round(monthlyListeners * 5 * 4 * 0.004).toLocaleString('en-US')}/month</p>
                  </div>
                </div>
                <p className="text-xs text-indigo-200 mt-4">
                  *Projection based on consistent posting and strategy execution
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
