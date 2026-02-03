# PostHog Hedgehog Adventure

A Phaser.js + Next.js platformer game showcasing PostHog's feature flags.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to play.

## Feature Flags

Toggle these flags in the UI panel to see real-time gameplay changes:

| Flag | Effect |
|------|--------|
| Double Jump | Enable double-jump ability |
| Speed Boost | Player moves 50% faster |
| Character Skin | Switch between default, spiderhog, robohog |

## Controls

- **Arrow Left/Right**: Move
- **Arrow Up**: Jump
- **Space**: Restart (after completing level)

## PostHog Setup

1. Copy `.env.example` to `.env.local`
2. Add your PostHog API keys
3. Create feature flags in PostHog:
   - `game-double-jump` (Boolean)
   - `game-speed-boost` (Boolean)
   - `game-character-skin` (Multivariate: default/spiderhog/robohog)

## Deploy to Vercel

```bash
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
