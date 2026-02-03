'use client'

import dynamic from 'next/dynamic'

const Game = dynamic(() => import('@/components/Game').then((m) => m.Game), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{ width: 800, height: 600, backgroundColor: '#1d4aff' }}
    >
      <div className="text-white text-xl font-medium">waking up the hedgehog...</div>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#EEEFE9' }}>
      <header className="max-w-4xl mx-auto mb-6">
        <h1
          className="text-4xl font-bold flex items-center gap-3"
          style={{ color: '#1E2F46' }}
        >
          hedgehog adventure
        </h1>
        <p className="mt-2 text-lg" style={{ color: '#5A6577' }}>
          help max collect data points. use arrow keys to move, up to jump.
          <br />
          <span className="text-sm opacity-75">
            tl;dr - it&apos;s a platformer. you got this.
          </span>
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            boxShadow: '0 4px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          <Game />
        </div>

        <div
          className="mt-4 p-4 rounded-lg"
          style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center gap-6 text-sm" style={{ color: '#5A6577' }}>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded font-mono text-xs"
                style={{ backgroundColor: '#F3F4F6' }}
              >
                ←→
              </span>
              <span>move</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded font-mono text-xs"
                style={{ backgroundColor: '#F3F4F6' }}
              >
                ↑
              </span>
              <span>jump</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded font-mono text-xs"
                style={{ backgroundColor: '#F3F4F6' }}
              >
                space
              </span>
              <span>restart</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm" style={{ color: '#9CA3AF' }}>
        <p>
          made with{' '}
          <a
            href="https://phaser.io"
            className="hover:underline"
            style={{ color: '#f75a00' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            phaser
          </a>
          {' '}and questionable platforming skills
        </p>
      </footer>
    </div>
  )
}
