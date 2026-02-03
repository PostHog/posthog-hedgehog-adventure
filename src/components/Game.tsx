'use client'

import { useEffect, useRef, useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { EventBus } from '@/game/EventBus'
import type Phaser from 'phaser'

interface GameProps {
  flags: {
    doubleJump: boolean
    skin: string
    speedBoost: boolean
  }
  onEvent: (event: string, properties: Record<string, unknown>) => void
}

export function Game({ flags, onEvent }: GameProps) {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const posthog = usePostHog()
  const initialFlagsRef = useRef(flags)

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.registry.set('doubleJumpEnabled', flags.doubleJump)
      gameRef.current.registry.set('speedBoostEnabled', flags.speedBoost)
      gameRef.current.registry.set('skin', flags.skin)
    }
  }, [flags])

  useEffect(() => {
    const handlePostHogEvent = ({
      event,
      properties,
    }: {
      event: string
      properties: Record<string, unknown>
    }) => {
      posthog?.capture(event, properties)
      onEvent(event, properties)
    }

    EventBus.on('posthog-event', handlePostHogEvent)

    return () => {
      EventBus.off('posthog-event', handlePostHogEvent)
    }
  }, [posthog, onEvent])

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const initGame = async () => {
      const { createGame } = await import('@/game/main')

      if (gameRef.current) {
        gameRef.current.destroy(true)
      }

      const initFlags = initialFlagsRef.current
      gameRef.current = createGame('game-container', {
        doubleJumpEnabled: initFlags.doubleJump,
        speedBoostEnabled: initFlags.speedBoost,
        skin: initFlags.skin,
      })

      setIsLoading(false)
    }

    initGame()

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <div
        id="game-container"
        ref={containerRef}
        className="rounded-lg overflow-hidden"
        style={{ width: 800, height: 600 }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900 rounded-lg">
          <div className="text-white text-xl">Loading game...</div>
        </div>
      )}
    </div>
  )
}
