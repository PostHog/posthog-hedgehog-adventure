'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { FlagPanel } from '@/components/FlagPanel'
import { EventsPanel } from '@/components/EventsPanel'

const Game = dynamic(() => import('@/components/Game').then((m) => m.Game), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-blue-900 rounded-lg"
      style={{ width: 800, height: 600 }}
    >
      <div className="text-white text-xl">Loading game...</div>
    </div>
  ),
})

interface GameEvent {
  id: string
  event: string
  properties: Record<string, unknown>
  timestamp: Date
}

export default function Home() {
  const [flags, setFlags] = useState({
    doubleJump: false,
    skin: 'default',
    speedBoost: false,
  })
  const [events, setEvents] = useState<GameEvent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function loadFlags() {
      try {
        const res = await fetch('/api/flags')
        const data = await res.json()

        setFlags({
          doubleJump: data.featureFlags['game-double-jump'] ?? false,
          skin: data.featureFlags['game-character-skin'] ?? 'default',
          speedBoost: data.featureFlags['game-speed-boost'] ?? false,
        })
      } catch (error) {
        console.error('Failed to load flags:', error)
      }
      setIsLoaded(true)
    }

    loadFlags()
  }, [])

  const handleEvent = useCallback(
    (event: string, properties: Record<string, unknown>) => {
      setEvents((prev) => [
        ...prev.slice(-49),
        {
          id: `${Date.now()}-${Math.random()}`,
          event,
          properties,
          timestamp: new Date(),
        },
      ])
    },
    []
  )

  const handleFlagChange = useCallback(
    (newFlags: { doubleJump: boolean; skin: string; speedBoost: boolean }) => {
      setFlags(newFlags)
    },
    []
  )

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-4xl">🦔</span>
          PostHog Hedgehog Adventure
        </h1>
        <p className="text-gray-400 mt-2">
          A feature flag demo game - toggle flags to change gameplay in
          real-time!
        </p>
      </header>

      <main className="max-w-6xl mx-auto flex gap-6">
        <div className="flex-shrink-0">
          <Game flags={flags} onEvent={handleEvent} />
        </div>

        <div className="flex-1 space-y-4 min-w-[280px]">
          <FlagPanel flags={flags} onFlagChange={handleFlagChange} />
          <EventsPanel events={events} />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>
          Built with{' '}
          <a
            href="https://nextjs.org"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
          ,{' '}
          <a
            href="https://phaser.io"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Phaser
          </a>
          , and{' '}
          <a
            href="https://posthog.com"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            PostHog
          </a>
        </p>
      </footer>
    </div>
  )
}
