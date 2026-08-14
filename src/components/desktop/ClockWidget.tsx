import { useState, useEffect } from 'react'
import MascotAvatar from '../mascot/MascotAvatar'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="absolute top-4 left-4 flex items-center gap-3 px-4 py-2 rounded-2xl glass-clock"
      style={{
        background: 'var(--card-bg)',
        border: '2px solid var(--border)',
        boxShadow: '4px 4px 0 var(--shadow-harsh)',
      }}
    >
      <MascotAvatar size={40} />
      <div className="flex flex-col">
        <span className="text-sm text-gray-700 font-en leading-tight">
          {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-xs text-gray-500 leading-tight">
          {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
        </span>
      </div>
    </div>
  )
}