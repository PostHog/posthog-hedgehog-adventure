import posthog from 'posthog-js'

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || ''
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function initPostHog() {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
    })
  }
}

export function getPostHogClient() {
  return posthog
}

export interface FeatureFlags {
  'game-double-jump': boolean
  'game-character-skin': string
  'game-speed-boost': boolean
}

export function getDefaultFlags(): FeatureFlags {
  return {
    'game-double-jump': false,
    'game-character-skin': 'default',
    'game-speed-boost': false,
  }
}
