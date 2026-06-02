'use client'

import { useEffect, useRef, useState } from 'react'
import type Phaser from 'phaser'

export function Game() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    // Tracks whether this effect has been torn down. The dynamic import below
    // is async, so the component can unmount (e.g. a React #418 hydration
    // remount) before `createGame` runs. Without this guard, cleanup would be a
    // no-op (gameRef.current is still null) and the resolved game would attach
    // Phaser to a stale/detached container, leaving the canvas blank.
    let cancelled = false

    const initGame = async () => {
      const { createGame } = await import('@/game/main')

      if (cancelled) return

      if (gameRef.current) {
        gameRef.current.destroy(true)
      }

      // Assign immediately so cleanup can always tear the instance down.
      const game = createGame('game-container')
      gameRef.current = game

      // If we were torn down while createGame ran, destroy right away.
      if (cancelled) {
        game.destroy(true)
        gameRef.current = null
        return
      }

      setIsLoading(false)
    }

    initGame()

    return () => {
      cancelled = true
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
