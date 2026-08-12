import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getWeeklySessions } from '../../db/studySession'
import type { StudySession } from '../../db/studySession'

export default function TimerStats() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  useEffect(() => { getWeeklySessions().then(setSessions) }, [])

  const days = ['日','一','二','三','四','五','六']
  const byDay: Record<number, number> = {0:0,1:0,2:0,3:0,4:0,5:0,6:0}
  sessions.forEach(s => {
    const d = new Date(s.date).getDay()
    byDay[d] = (byDay[d] || 0) + s.duration
  })
  const max = Math.max(...Object.values(byDay), 1)

  return (
    <div className="mt-4 p-3 rounded-xl bg-gray-50 w-full">
      <h4 className="text-sm font-cn text-gray-700 mb-2">本周专注（分钟）</h4>
      <div className="flex items-end justify-between gap-1 h-24">
        {[0,1,2,3,4,5,6].map(d => (
          <div key={d} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              className="w-full rounded-t-lg bg-warm-orange min-h-[2px]"
              style={{ height: `${(byDay[d] / max) * 80}px` }}
              initial={{ height: 0 }}
              animate={{ height: `${(byDay[d] / max) * 80}px` }}
              transition={{ duration: 0.5, delay: d * 0.05 }} />
            <span className="text-xs text-gray-500">周{days[d]}</span>
            <span className="text-xs text-gray-600">{byDay[d] || 0}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        本周共专注 {sessions.reduce((s, x) => s + x.duration, 0)} 分钟
      </p>
    </div>
  )
}
