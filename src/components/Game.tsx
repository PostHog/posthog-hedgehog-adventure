'use client'

import { useEffect, useRef, useState } from 'react'
import type Phaser from 'phaser'

export function Game() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const initGame = async () => {
      const { createGame } = await import('@/game/main')

      if (gameRef.current) {
        gameRef.current.destroy(true)
      }

      gameRef.current = createGame('game-container')
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
