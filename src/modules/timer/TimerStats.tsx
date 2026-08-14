import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { getWeeklySessions } from '../../db/studySession'
import type { StudySession } from '../../db/studySession'

const DAYS = ['日', '一', '二', '三', '四', '五', '六']
const BAR_COLORS = ['var(--accent)', '#74b9ff', '#55efc4', '#ffd93d', '#ff7675', '#fab1a0', '#a29bfe']

export default function TimerStats() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  useEffect(() => { getWeeklySessions().then(setSessions) }, [])

  const byDay: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  sessions.forEach((s) => {
    const d = new Date(s.date).getDay()
    byDay[d] = (byDay[d] || 0) + s.duration
  })
  const max = Math.max(...Object.values(byDay), 1)
  const total = sessions.reduce((s, x) => s + x.duration, 0)

  return (
    <div
      className="soft-card p-4 w-full max-w-md"
    >
      <h4 className="text-sm font-cn text-gray-700 font-bold mb-3 flex items-center gap-1.5">
        <Activity size={18} color="var(--accent)" strokeWidth={2} />
        本周专注统计
      </h4>
      <div className="flex items-end justify-between gap-1 h-32">
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              className="w-full rounded-xl min-h-[2px]"
              style={{
                background: BAR_COLORS[d],
                height: `${(byDay[d] / max) * 100}%`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${(byDay[d] / max) * 100}%` }}
              transition={{ duration: 0.5, delay: d * 0.05 }}
            />
            <span className="text-[10px] text-gray-500">周{DAYS[d]}</span>
            <span className="text-[10px] font-en text-gray-600 font-bold">
              {byDay[d] || 0}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-3 p-2 rounded-xl text-center font-cn"
        style={{ background: 'var(--card-alt)' }}
      >
        <span className="text-xs text-gray-600">
          本周共专注 <span className="font-bold font-en" style={{ color: 'var(--accent)' }}>{total}</span> 分钟
        </span>
      </div>
    </div>
  )
}
