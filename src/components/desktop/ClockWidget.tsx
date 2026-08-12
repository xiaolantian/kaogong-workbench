import { useState, useEffect } from 'react'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="absolute top-4 left-4 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-q"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-10 h-10 rounded-full bg-warm-orange/30 flex items-center justify-center text-lg">🐱</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 font-en">
          {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-xs text-gray-500">
          {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
        </span>
      </div>
    </div>
  )
}