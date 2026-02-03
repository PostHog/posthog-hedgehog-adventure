import { PostHog } from 'posthog-node'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.POSTHOG_API_KEY
  const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!apiKey) {
    return NextResponse.json({
      distinctId: crypto.randomUUID(),
      featureFlags: {
        'game-double-jump': false,
        'game-character-skin': 'default',
        'game-speed-boost': false,
      },
    })
  }

  const posthog = new PostHog(apiKey, { host })

  try {
    const vercelId = request.headers.get('x-vercel-id')
    const existingId = request.cookies.get('ph_distinct_id')?.value
    const distinctId = existingId || vercelId || crypto.randomUUID()

    const flags = await posthog.getAllFlags(distinctId)

    await posthog.shutdown()

    const response = NextResponse.json({
      distinctId,
      featureFlags: {
        'game-double-jump': flags['game-double-jump'] ?? false,
        'game-character-skin': flags['game-character-skin'] ?? 'default',
        'game-speed-boost': flags['game-speed-boost'] ?? false,
      },
    })

    if (!existingId) {
      response.cookies.set('ph_distinct_id', distinctId, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    console.error('Error fetching flags:', error)
    await posthog.shutdown()
    return NextResponse.json({
      distinctId: crypto.randomUUID(),
      featureFlags: {
        'game-double-jump': false,
        'game-character-skin': 'default',
        'game-speed-boost': false,
      },
    })
  }
}
