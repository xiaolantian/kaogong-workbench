import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { useMascotStore } from '../../store/mascotStore'
import { MapPin, Target, CheckCircle2, NotepadText, Medal, Pencil, Trash2, X } from 'lucide-react'
import { getPlans, addPlan, updatePlan, deletePlan, markDayActive } from '../../db/planner'
import { addPoints } from '../../db/points'
import type { StudyPlan } from '../../db/planner'
import StreakBadge from './StreakBadge'

const COLUMNS = [
  { key: 'today' as const, label: '今日任务', icon: MapPin, color: 'var(--cat-1, var(--accent))', bg: 'var(--cat-1-soft, var(--col-tint-1))' },
  { key: 'week' as const, label: '本周目标', icon: Target, color: 'var(--cat-2, #74b9ff)', bg: 'var(--cat-2-soft, var(--col-tint-2))' },
  { key: 'done' as const, label: '已完成', icon: CheckCircle2, color: 'var(--cat-3, #55efc4)', bg: 'var(--cat-3-soft, var(--col-tint-3))' },
]

export default function PlannerModule() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newColumn, setNewColumn] = useState<'today' | 'week'>('today')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const { setMood, streak } = useMascotStore()
  const dragOver = useRef<number | null>(null)

  useEffect(() => {
    getPlans().then((p) => {
      setPlans(p)
      setCompleted(p.filter((x) => x.done).length)
    })
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addPlan(newTitle, newColumn)
    setNewTitle('')
    await getPlans().then((p) => { setPlans(p); setCompleted(p.filter((x) => x.done).length) })
  }

  const handleDone = async (id: number, current: boolean) => {
    await updatePlan(id, { done: !current, column: !current ? 'done' : 'today' })
    if (!current) {
      setMood('happy')
      setTimeout(() => setMood('focus'), 2000)
      const plan = plans.find((p) => p.id === id)
      if (plan) addPoints(5, 'task', 'earn', `完成任务：${plan.title}`)
      await markDayActive()
      useMascotStore.getState().computeStreak()
    }
    await getPlans().then((p) => { setPlans(p); setCompleted(p.filter((x) => x.done).length) })
  }

  const handleDelete = async (id: number) => {
    await deletePlan(id)
    await getPlans().then((p) => { setPlans(p); setCompleted(p.filter((x) => x.done).length) })
  }

  const startEdit = (p: StudyPlan) => {
    setEditingId(p.id)
    setEditText(p.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleEditSave = async (id: number) => {
    if (!editText.trim()) return
    await updatePlan(id, { title: editText.trim() })
    setEditingId(null)
    setEditText('')
    await getPlans().then((p) => setPlans(p))
  }

  const total = plans.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const ringR = 18
  const ringC = 2 * Math.PI * ringR

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto overflow-x-visible p-1" style={{ paddingRight: 6 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MascotFull size={52} />
          <span className="font-cn text-lg font-bold text-gray-800">学习计划</span>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div className="flex gap-3">
        <div className="soft-card p-3 flex items-center gap-3 flex-1">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle
              cx="25" cy="25" r={ringR}
              strokeWidth="5"
              style={{ fill: 'none', stroke: 'var(--ring-track)' }}
            />
            <circle
              cx="25" cy="25" r={ringR}
              strokeWidth="5"
              strokeDasharray={`${pct * 0.113} ${ringC}`}
              transform="rotate(-90 25 25)"
              strokeLinecap="round"
              style={{ fill: 'none', stroke: 'var(--accent)' }}
            />
            <text
              x="25" y="28"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              style={{ fill: 'var(--accent)' }}
            >
              {pct}%
            </text>
          </svg>
          <div>
            <span className="text-xs font-cn text-gray-600">今日进度</span>
            <div className="text-sm font-en font-bold text-purple-600">
              {completed}/{total}
            </div>
          </div>
        </div>

        <div className="soft-card p-3 flex-1">
          <div className="flex items-center gap-2">
            <NotepadText size={22} color="#3b82f6" strokeWidth={1.8} />
            <span className="text-xs font-cn text-gray-600">待办任务</span>
          </div>
          <span className="text-xl font-en font-bold text-blue-500">
            {total - completed}
          </span>
        </div>

        <div className="soft-card p-3 flex-1">
          <div className="flex items-center gap-2">
            <Medal size={22} color="#22c55e" strokeWidth={1.8} />
            <span className="text-xs font-cn text-gray-600">已完成</span>
          </div>
          <span className="text-xl font-en font-bold text-green-500">
            {completed}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="添加学习任务..."
          className="soft-input flex-1"
        />
        <select
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value as 'today' | 'week')}
          className="soft-input text-xs"
        >
          <option value="today">今日</option>
          <option value="week">本周</option>
        </select>
        <button
          onClick={handleAdd}
          className="neo-btn primary px-4 py-2 text-sm font-cn"
        >
          添加
        </button>
      </div>

      <div
        className="flex flex-col sm:flex-row gap-2 flex-1 overflow-y-auto overflow-x-visible py-1"
        style={{ paddingRight: 6 }}
      >
        {COLUMNS.map((col) => {
          const ColIcon = col.icon
          return (
            <div
              key={col.key}
              className="w-full sm:flex-1 sm:min-w-0 rounded-2xl p-3 flex flex-col gap-1.5"
              style={{
                background: col.bg,
                border: `2px solid ${col.color}`,
                boxShadow: `4px 4px 0 ${col.color}`,
              }}
            >
              <div className="flex items-center gap-2 px-1 mb-1">
                <ColIcon size={16} color={col.color} strokeWidth={2} />
                <span className="text-xs font-cn font-bold" style={{ color: col.color }}>
                  {col.label}
                </span>
                <span
                  className="ml-auto pill"
                  style={{ background: 'var(--card-bg)', color: col.color }}
                >
                  {plans.filter((p) => p.column === col.key).length}
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto overflow-x-visible flex-1 py-1 px-2">
                {(plans
                  .filter((p) => p.column === col.key)
                  .sort((a, b) => a.order - b.order)
                  .map((p) => (
                    <motion.div
                      key={p.id}
                      className="soft-card p-2 text-sm font-cn cursor-grab hover:bg-gray-50"
                      draggable={editingId !== p.id}
                      onDragStart={() => setDraggedId(p.id)}
                      onDragOver={(e) => { e.preventDefault(); dragOver.current = p.id }}
                      onDrop={async () => {
                        if (draggedId && dragOver.current) {
                          const from = plans.find((x) => x.id === draggedId)
                          const to = plans.find((x) => x.id === dragOver.current)
                          if (from && to && from.column === to.column) {
                            const tmp = from.order
                            await updatePlan(from.id, { order: to.order })
                            await updatePlan(to.id, { order: tmp })
                            await getPlans().then((p) => setPlans(p))
                          }
                        }
                        setDraggedId(null)
                      }}
                      whileHover={{ y: -1 }}
                    >
                      <div className="flex items-start gap-1.5">
                        <span
                          className={p.done ? 'line-through text-gray-400' : 'text-gray-800'}
                          style={{
                            display: 'block',
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordBreak: 'break-word',
                            fontSize: '0.75rem',
                            lineHeight: '1.4',
                            paddingRight: 2,
                          }}
                        >
                          {p.title}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                          {editingId === p.id ? (
                            <>
                              <button
                                onClick={() => handleEditSave(p.id)}
                                className="w-5 h-5 rounded flex items-center justify-center text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 size={12} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100"
                              >
                                <X size={12} strokeWidth={2.5} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(p)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil size={11} strokeWidth={2} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={11} strokeWidth={2} />
                              </button>
                              <button
                                onClick={() => handleDone(p.id, p.done)}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  p.done ? 'border-green-400 bg-green-400 text-white' : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {p.done && '✓'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {editingId === p.id && (
                        <input
                          autoFocus
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(p.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          onBlur={() => handleEditSave(p.id)}
                          className="mt-1.5 w-full px-1.5 py-0.5 text-xs border border-purple-300 rounded focus:outline-none focus:border-purple-500 font-cn"
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}