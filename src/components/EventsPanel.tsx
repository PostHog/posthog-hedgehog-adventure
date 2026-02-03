'use client'

import { useEffect, useRef, useState } from 'react'

interface GameEvent {
  id: string
  event: string
  properties: Record<string, unknown>
  timestamp: Date
}

interface EventsPanelProps {
  events: GameEvent[]
}

export function EventsPanel({ events }: EventsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getEventColor = (eventName: string) => {
    if (eventName.includes('started')) return 'text-green-400'
    if (eventName.includes('completed')) return 'text-blue-400'
    if (eventName.includes('collected')) return 'text-yellow-400'
    if (eventName.includes('died')) return 'text-red-400'
    if (eventName.includes('jumped')) return 'text-purple-400'
    if (eventName.includes('override')) return 'text-orange-400'
    return 'text-gray-300'
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-orange-400">Live Events</h2>
        <span className="text-xs text-gray-500">{events.length} events</span>
      </div>

      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto space-y-1 font-mono text-xs"
      >
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Events will appear here as you play...
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer hover:bg-gray-800 rounded px-2 py-1"
              onClick={() =>
                setExpanded(expanded === event.id ? null : event.id)
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{formatTime(event.timestamp)}</span>
                <span className={getEventColor(event.event)}>
                  {event.event}
                </span>
                <span className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ▼
                </span>
              </div>
              {expanded === event.id && (
                <pre className="mt-1 text-gray-400 whitespace-pre-wrap break-all pl-16">
                  {JSON.stringify(event.properties, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
