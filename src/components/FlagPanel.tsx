'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

interface FlagPanelProps {
  flags: {
    doubleJump: boolean
    skin: string
    speedBoost: boolean
  }
  onFlagChange: (flags: {
    doubleJump: boolean
    skin: string
    speedBoost: boolean
  }) => void
}

export function FlagPanel({ flags, onFlagChange }: FlagPanelProps) {
  const posthog = usePostHog()
  const [localOverrides, setLocalOverrides] = useState<{
    doubleJump?: boolean
    skin?: string
    speedBoost?: boolean
  }>({})

  const effectiveFlags = {
    doubleJump: localOverrides.doubleJump ?? flags.doubleJump,
    skin: localOverrides.skin ?? flags.skin,
    speedBoost: localOverrides.speedBoost ?? flags.speedBoost,
  }

  useEffect(() => {
    onFlagChange(effectiveFlags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveFlags.doubleJump,
    effectiveFlags.skin,
    effectiveFlags.speedBoost,
    onFlagChange,
  ])

  const handleDoubleJumpToggle = () => {
    const newValue = !effectiveFlags.doubleJump
    setLocalOverrides((prev) => ({ ...prev, doubleJump: newValue }))
    posthog?.capture('flag_override', {
      flag: 'game-double-jump',
      value: newValue,
    })
  }

  const handleSpeedBoostToggle = () => {
    const newValue = !effectiveFlags.speedBoost
    setLocalOverrides((prev) => ({ ...prev, speedBoost: newValue }))
    posthog?.capture('flag_override', {
      flag: 'game-speed-boost',
      value: newValue,
    })
  }

  const handleSkinChange = (skin: string) => {
    setLocalOverrides((prev) => ({ ...prev, skin }))
    posthog?.capture('flag_override', {
      flag: 'game-character-skin',
      value: skin,
    })
  }

  const resetOverrides = () => {
    setLocalOverrides({})
    posthog?.capture('flags_reset')
  }

  const hasOverrides = Object.keys(localOverrides).length > 0

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-orange-400">Feature Flags</h2>
        {hasOverrides && (
          <button
            onClick={resetOverrides}
            className="text-xs text-gray-400 hover:text-white"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <span className="text-sm">Double Jump</span>
            {localOverrides.doubleJump !== undefined && (
              <span className="text-xs text-orange-400">(override)</span>
            )}
          </label>
          <button
            onClick={handleDoubleJumpToggle}
            className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
              effectiveFlags.doubleJump
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                : 'bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${
                effectiveFlags.doubleJump ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <span className="text-sm">Speed Boost</span>
            {localOverrides.speedBoost !== undefined && (
              <span className="text-xs text-orange-400">(override)</span>
            )}
          </label>
          <button
            onClick={handleSpeedBoostToggle}
            className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
              effectiveFlags.speedBoost
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                : 'bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${
                effectiveFlags.speedBoost ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2">
            <span className="text-sm">Character Skin</span>
            {localOverrides.skin !== undefined && (
              <span className="text-xs text-orange-400">(override)</span>
            )}
          </label>
          <div className="flex gap-2">
            {['default', 'spiderhog', 'robohog'].map((skin) => (
              <button
                key={skin}
                onClick={() => handleSkinChange(skin)}
                className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                  effectiveFlags.skin === skin
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {skin}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Toggle flags to see real-time changes in the game.
        </p>
      </div>
    </div>
  )
}
