import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { useMascotStore } from '../../store/mascotStore'
import { getPlans, addPlan, updatePlan } from '../../db/planner'
import type { StudyPlan } from '../../db/planner'
import StreakBadge from './StreakBadge'

export default function PlannerModule() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newColumn, setNewColumn] = useState<'today' | 'week'>('today')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(0)
  const { setMood, streak } = useMascotStore()
  const dragOver = useRef<number | null>(null)

  useEffect(() => {
    getPlans().then(p => {
      setPlans(p)
      setCompleted(p.filter(x => x.done).length)
    })
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addPlan(newTitle, newColumn)
    setNewTitle('')
    await getPlans().then(p => { setPlans(p); setCompleted(p.filter(x => x.done).length) })
  }

  const handleDone = async (id: number, current: boolean) => {
    await updatePlan(id, { done: !current, column: !current ? 'done' : 'today' })
    if (!current) {
      setMood('happy')
      setTimeout(() => setMood('focus'), 2000)
    }
    await getPlans().then(p => { setPlans(p); setCompleted(p.filter(x => x.done).length) })
  }

  const columns: { key: 'today' | 'week' | 'done'; label: string; color: string }[] = [
    { key: 'today', label: '今日任务', color: 'bg-orange-100' },
    { key: 'week', label: '本周目标', color: 'bg-blue-100' },
    { key: 'done', label: '已完成', color: 'bg-green-100' },
  ]

  const total = plans.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MascotFull size={50} />
          <span className="font-cn text-gray-700">学习计划</span>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E0E0" strokeWidth="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#FF9F43" strokeWidth="4"
            strokeDasharray={`${pct * 1.005} 100`}
            transform="rotate(-90 20 20)" strokeLinecap="round"/>
        </svg>
        <div>
          <span className="text-lg font-en text-warm-orange">{pct}%</span>
          <span className="text-xs text-gray-500 ml-1">{completed}/{total} 完成</span>
        </div>
      </div>

      <div className="flex gap-2">
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="添加学习任务..."
          className="flex-1 text-sm border rounded-xl px-3 py-2 font-cn" />
        <select value={newColumn} onChange={e => setNewColumn(e.target.value as 'today' | 'week')}
          className="text-xs border rounded-lg px-2 py-2">
          <option value="today">今日</option>
          <option value="week">本周</option>
        </select>
        <button onClick={handleAdd}
          className="px-3 py-2 rounded-xl bg-warm-orange text-white font-cn text-sm hover:bg-orange-500">添加</button>
      </div>

      <div className="flex gap-2 flex-1 overflow-auto">
        {columns.map(col => (
          <div key={col.key}
            className={`flex-1 rounded-xl p-2 flex flex-col gap-2 min-h-32 ${col.color}`}>
            <span className="text-xs font-cn text-gray-600 px-1">{col.label}</span>
            {(plans.filter(p => p.column === col.key)).sort((a,b) => a.order - b.order).map(p => (
              <motion.div
                key={p.id}
                className="p-2 bg-white rounded-lg shadow-q text-sm font-cn cursor-grab hover:shadow-md"
                draggable
                onDragStart={() => setDraggedId(p.id)}
                onDragOver={(e) => { e.preventDefault(); dragOver.current = p.id }}
                onDrop={async () => {
                  if (draggedId && dragOver.current) {
                    const from = plans.find(x => x.id === draggedId)
                    const to = plans.find(x => x.id === dragOver.current)
                    if (from && to && from.column === to.column) {
                      const tmp = from.order
                      await updatePlan(from.id, { order: to.order })
                      await updatePlan(to.id, { order: tmp })
                      await getPlans().then(p => setPlans(p))
                    }
                  }
                  setDraggedId(null)
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <span className={p.done ? 'line-through text-gray-400' : 'text-gray-800'}>
                    {p.title}
                  </span>
                  <button onClick={() => handleDone(p.id, p.done)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      p.done ? 'border-green-400 bg-green-400 text-white' : 'border-gray-300'
                    }`}>
                    {p.done && '✓'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}