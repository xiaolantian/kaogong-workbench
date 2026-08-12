import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import TimerStats from './TimerStats'
import { saveSession } from '../../db/studySession'

type Phase = 'study' | 'break'

export default function TimerModule() {
  const [phase, setPhase] = useState<Phase>('study')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [studyMin, setStudyMin] = useState(25)
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
      setSeconds(s => {
        if (s <= 1) {
          if (phase === 'study') {
            saveSession({ duration: studyMin, moduleId: 'timer' })
            setMood('celebrate')
            setTimeout(() => setMood('focus'), 3000)
          }
          const nextPhase = phase === 'study' ? 'break' : 'study'
          setPhase(nextPhase)
          return nextPhase === 'study' ? studyMin * 60 : breakMin * 60
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

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      <MascotFull size={140} />
      <div className="text-5xl font-en text-warm-orange tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <span className={`text-sm font-cn px-3 py-1 rounded-full ${
        phase === 'study' ? 'bg-warm-orange/20 text-warm-orange' : 'bg-mint/20 text-mint'
      }`}>
        {phase === 'study' ? '专注学习中...' : '休息一下~'}
      </span>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div className="h-2 rounded-full bg-warm-orange"
          style={{ width: `${progress * 100}%` }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1 }} />
      </div>
      <div className="flex gap-3">
        <button onClick={toggle}
          className="px-6 py-2 rounded-xl font-cn text-white shadow-q hover:scale-105 transition-transform"
          style={{ background: phase === 'study' ? '#FF9F43' : '#5F9EA0' }}>
          {running ? '暂停' : '开始'}
        </button>
        <button onClick={reset}
          className="px-6 py-2 rounded-xl font-cn text-gray-600 bg-gray-100 shadow-q hover:scale-105 transition-transform">
          重置
        </button>
        <button onClick={() => setShowStats(!showStats)}
          className="px-4 py-2 rounded-xl font-cn text-gray-600 bg-gray-100 shadow-q hover:scale-105 transition-transform">
          统计
        </button>
      </div>
      {showStats && <TimerStats />}
      <div className="flex items-center gap-3 mt-2">
        <label className="text-xs text-gray-500">学习</label>
        <input type="number" value={studyMin} onChange={e => setStudyMin(+e.target.value)}
          className="w-12 text-center text-sm border rounded-lg" min={1} max={120} />
        <label className="text-xs text-gray-500">分钟</label>
        <label className="text-xs text-gray-500 ml-2">休息</label>
        <input type="number" value={breakMin} onChange={e => setBreakMin(+e.target.value)}
          className="w-12 text-center text-sm border rounded-lg" min={1} max={30} />
        <label className="text-xs text-gray-500">分钟</label>
      </div>
    </div>
  )
}
