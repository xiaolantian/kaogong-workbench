import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import TimerStats from './TimerStats'
import { saveSession } from '../../db/studySession'
import { addPoints } from '../../db/points'

type Phase = 'study' | 'break'

const RADIUS = 78
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function TimerModule() {
  const [phase, setPhase] = useState<Phase>('study')
  const [seconds, setSeconds] = useState(30 * 60)
  const [running, setRunning] = useState(false)
  const [studyMin, setStudyMin] = useState(30)
  const [breakMin, setBreakMin] = useState(5)
  const [showStats, setShowStats] = useState(false)
  const intervalRef = useRef<number>()
  const { setMood } = useMascotStore()

  useEffect(() => {
    setMood(running ? 'focus' : 'sleepy')
  }, [running, setMood])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (phase === 'study') {
            saveSession({ duration: studyMin, moduleId: 'timer' })
            const earned = Math.floor(studyMin / 30) * 10
            if (earned > 0) addPoints(earned, 'study_time', 'earn', `专注 ${studyMin} 分钟`)
            setMood('celebrate')
            setTimeout(() => setMood('focus'), 3000)
          }
          const next = phase === 'study' ? 'break' : 'study'
          setPhase(next)
          return next === 'study' ? studyMin * 60 : breakMin * 60
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phase, studyMin, breakMin, setMood])

  const toggle = () => setRunning(!running)
  const reset = () => { setRunning(false); setSeconds(studyMin * 60); setPhase('study') }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = phase === 'study'
    ? 1 - seconds / (studyMin * 60)
    : 1 - seconds / (breakMin * 60)
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE

  const phaseColor = phase === 'study' ? 'var(--accent)' : '#55efc4'
  const phaseLabel = phase === 'study' ? '专注学习中...' : '休息一下~'
  const phaseBg = phase === 'study' ? 'var(--accent-soft)' : '#e8f8f0'

  return (
    <div className="flex flex-col items-center gap-5 h-full">
      {/* 顶部 Mascot */}
      <MascotFull size={120} />

      {/* SVG 环形计时器 */}
      <div
        className="soft-card p-6 flex flex-col items-center gap-3 relative"
      >
        <div className="relative flex items-center justify-center">
          <svg width="220" height="220" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r={RADIUS}
              fill="none"
              stroke="var(--ring-track)"
              strokeWidth="12"
            />
            <motion.circle
              cx="100" cy="100" r={RADIUS}
              fill="none"
              stroke={phaseColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-en tabular-nums" style={{ color: 'var(--accent)' }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span
              className="pill mt-1"
              style={{ background: phaseBg, color: phaseColor }}
            >
              {phaseLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 按钮组 */}
      <div className="flex gap-3">
        <button
          onClick={toggle}
          className="neo-btn primary px-6 py-2.5 text-sm font-cn"
        >
          {running ? '暂停' : '开始'}
        </button>
        <button
          onClick={reset}
          className="neo-btn px-6 py-2.5 text-sm font-cn text-gray-600"
        >
          重置
        </button>
        <button
          onClick={() => setShowStats(!showStats)}
          className="neo-btn px-6 py-2.5 text-sm font-cn text-gray-600"
        >
          统计
        </button>
      </div>

      {showStats && <TimerStats />}

      {/* 时长设置 */}
      <div
        className="soft-card p-4 flex items-center gap-3 w-full max-w-sm justify-center"
      >
        <label className="text-xs text-gray-500 font-cn">学习</label>
        <input
          type="number"
          value={studyMin}
          onChange={(e) => setStudyMin(+e.target.value)}
          className="w-14 text-center text-sm font-en tabular-nums py-1 soft-input"
          min={1}
          max={120}
        />
        <label className="text-xs text-gray-500 font-cn">分钟</label>
        <label className="text-xs text-gray-500 ml-2 font-cn">休息</label>
        <input
          type="number"
          value={breakMin}
          onChange={(e) => setBreakMin(+e.target.value)}
          className="w-14 text-center text-sm font-en tabular-nums py-1 soft-input"
          min={1}
          max={30}
        />
        <label className="text-xs text-gray-500 font-cn">分钟</label>
      </div>
    </div>
  )
}
