import { useState, useEffect, useRef } from 'react'
import MascotFull from '../../components/mascot/MascotFull'
import { ClipboardList } from 'lucide-react'
import { useMascotStore } from '../../store/mascotStore'
import { getQuestions, saveAttempt } from '../../db/quiz'
import { addCard } from '../../db/flashcard'
import type { QuizQuestion } from '../../db/quiz'

const CATEGORIES = [
  'all', '行政法', '言语理解', '数量关系',
  '判断推理', '常识判断', '基础常识', '时政常识', '申论',
]

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  all:      { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  '行政法':  { bg: '#e3f2fd', color: '#1976d2' },
  '言语理解': { bg: '#e8f8f0', color: '#388e3c' },
  '数量关系': { bg: '#fff8e1', color: '#f57f17' },
  '判断推理': { bg: '#ffe8e8', color: '#d32f2f' },
  '常识判断': { bg: '#fce4ec', color: '#c2185b' },
  '基础常识': { bg: '#f3e5f5', color: '#7b1fa2' },
  '时政常识': { bg: '#e0f7fa', color: '#00838f' },
  '申论':    { bg: '#fff3e0', color: '#e65100' },
}

const buildFilterRow = (filter: string, onFilter: (c: string) => void) => (
  <div className="flex flex-wrap gap-1.5 pb-1">
    {CATEGORIES.map((c) => {
      const cs = CAT_COLORS[c] || CAT_COLORS.all
      return (
        <button
          key={c}
          onClick={() => onFilter(c)}
          className="pill whitespace-nowrap"
          style={{
            background: filter === c ? cs.color : 'var(--card-bg)',
            color: filter === c ? '#ffffff' : cs.color,
            boxShadow: filter === c ? `0 2px 8px ${cs.color}40` : 'none',
          }}
        >
          {c === 'all' ? <span className="flex items-center gap-1"><ClipboardList size={12} strokeWidth={2} />全部</span> : c}
        </button>
      )
    })}
  </div>
)

export default function QuizModule({ preloaded = [] }: { preloaded?: QuizQuestion[] } = {}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(preloaded)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [filter, setFilter] = useState<string>('all')
  const [finished, setFinished] = useState(false)
  const { setMood } = useMascotStore()
  const timerRef = useRef<number>()

  useEffect(() => {
    const fetch = async () => {
      if (filter === 'all' && preloaded.length > 0) {
        setQuestions(preloaded)
        return
      }
      const qs = await getQuestions(filter === 'all' ? undefined : filter)
      setQuestions(qs)
      setCurrentIndex(0); setSelected(null); setShowAnswer(false)
      setScore(0); setTimeLeft(60); setFinished(false)
    }
    fetch()
  }, [filter])

  useEffect(() => {
    if (finished || !showAnswer) return
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setShowAnswer(true); handleAnswer(null) }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIndex, showAnswer, finished])

  const current = questions[currentIndex]
  const options = current
    ? current.options.match(/[A-D]\..*?(?=\s+[A-D]\.|$)/g)?.map((o) => ({
        key: o[0],
        text: o.trim(),
      })) ?? []
    : []

  const handleSelect = (key: string) => {
    if (showAnswer) return
    setSelected(key)
  }

  const handleAnswer = async (guess: string | null) => {
    setShowAnswer(true)
    clearInterval(timerRef.current)
    const isCorrect = guess === current?.answer
    if (isCorrect) { setScore((s) => s + 1); setMood('happy') }
    else {
      setMood('sad')
      if (current) {
        await saveAttempt(current.id, false)
        await addCard(current.question, current.answer, current.category)
      }
    }
    setTimeout(async () => {
      setMood('focus')
      if (current && guess !== null) await saveAttempt(current.id, isCorrect)
      const next = currentIndex + 1
      if (next < questions.length) {
        setCurrentIndex(next); setSelected(null); setShowAnswer(false); setTimeLeft(60)
      } else {
        setFinished(true)
      }
    }, 2000)
  }

  if (finished) {
    const total = questions.length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div className="flex flex-col gap-3 h-full overflow-y-auto overflow-x-visible p-2" style={{ paddingRight: 4 }}>
        {buildFilterRow(filter, (c) => { setFilter(c); setFinished(false) })}
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          <MascotFull size={80} />
          <div className="soft-card p-6 sm:p-8 flex flex-col items-center gap-2">
            <p className="text-lg sm:text-2xl font-cn font-bold text-purple-600">
              {pct >= 80 ? '太棒了！' : pct >= 60 ? '不错哦！' : '继续加油！'}
            </p>
            <p className="text-xl sm:text-2xl font-en font-bold text-purple-600">
              {score} / {total}
              <span className="text-sm text-gray-400 ml-2">({pct}%)</span>
            </p>
            <p className="text-xs text-gray-500">错题已自动加入知识卡片</p>
            <button
              onClick={() => setFinished(false)}
              className="neo-btn primary mt-2 px-6 py-2 text-sm font-cn"
            >
              再来一轮
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="flex flex-col gap-3 h-full overflow-y-auto overflow-x-visible p-2" style={{ paddingRight: 4 }}>
        {buildFilterRow(filter, setFilter)}
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          <MascotFull size={80} />
          <div className="soft-card p-5 sm:p-6 flex flex-col items-center gap-2">
            <p className="text-base sm:text-lg font-cn font-bold text-purple-600">
              暂无题目
            </p>
            <p className="text-sm text-gray-500 font-cn text-center">
              {filter !== 'all' ? `「${filter}」分类下还没有题目` : '还没有任何题目，先去添加一些吧~'}
            </p>
            <button
              onClick={() => setFilter('all')}
              className="neo-btn mt-2 px-4 py-1.5 text-xs font-cn"
            >
              返回查看全部
            </button>
          </div>
        </div>
      </div>
    )
  }

  const catStyle = CAT_COLORS[filter] || CAT_COLORS.all

  return (
    <div className="flex flex-col gap-2 sm:gap-3 h-full overflow-y-auto overflow-x-visible p-1 sm:p-2" style={{ paddingRight: 4 }}>
      {buildFilterRow(filter, setFilter)}

      <div className="soft-card p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
        <MascotFull size={36} />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-cn">
              第 <span className="font-en font-bold text-purple-600">{currentIndex + 1}</span> 题
              {' / '}{questions.length}
            </span>
            <span
              className="font-en font-bold tabular-nums"
              style={{ color: timeLeft <= 10 ? 'var(--pink, #ff7675)' : 'var(--accent, #6c5ce7)' }}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'var(--ring-track)' }}>
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${(timeLeft / 60) * 100}%`,
                background: timeLeft <= 10 ? 'var(--pink, #ff7675)' : 'var(--accent, #6c5ce7)',
              }}
            />
          </div>
        </div>
        <div
          className="pill text-xs"
          style={{ background: catStyle.bg, color: catStyle.color }}
        >
          {current.category}
        </div>
      </div>

      <div className="soft-card p-3 sm:p-5">
        <p className="font-cn text-gray-800 leading-relaxed font-bold text-sm sm:text-base">
          {current.question}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          let bg = 'var(--card-bg)'
          let border = 'var(--border-soft)'
          let color = 'var(--text-primary)'
          let shadow = '4px 4px 0 var(--border-soft)'

          if (showAnswer) {
            if (opt.key === current.answer) {
              bg = '#e8f8f0'; border = '#55efc4'; color = '#2e7d32'; shadow = '4px 4px 0 #55efc4'
            } else if (opt.key === selected && opt.key !== current.answer) {
              bg = '#ffe8e8'; border = '#ff7675'; color = '#c62828'; shadow = '4px 4px 0 #ff7675'
            }
          } else if (opt.key === selected) {
            bg = 'var(--accent-soft)'; border = 'var(--accent)'; color = 'var(--accent)'; shadow = '4px 4px 0 var(--accent)'
          }

          return (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl text-left font-cn text-xs sm:text-sm transition-all"
              style={{ background: bg, border: `2px solid ${border}`, color, boxShadow: shadow }}
            >
              <span
                className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-xl font-en font-bold text-[10px] sm:text-xs"
                style={{
                  background: selected === opt.key && !showAnswer ? 'var(--accent)' : 'var(--ring-track)',
                  color: selected === opt.key && !showAnswer ? '#ffffff' : 'var(--accent)',
                }}
              >
                {opt.key}
              </span>
              <span className="flex-1">{opt.text}</span>
              {showAnswer && opt.key === current.answer && <span className="text-green-600">✓</span>}
              {showAnswer && opt.key === selected && opt.key !== current.answer && (
                <span className="text-red-500">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {!showAnswer ? (
        <button
          onClick={() => handleAnswer(selected)}
          disabled={!selected}
          className="neo-btn primary w-full py-2 sm:py-3 font-cn text-sm disabled:opacity-40"
        >
          确认答案
        </button>
      ) : (
        <div
          className="text-center font-cn text-xs sm:text-sm p-2 rounded-xl"
          style={{
            background: selected === current.answer ? '#e8f8f0' : '#ffe8e8',
            color: selected === current.answer ? '#2e7d32' : '#c62828',
          }}
        >
          {selected === current.answer ? '✓ 答对了！' : `✗ 正确答案是 ${current.answer}`}
        </div>
      )}
    </div>
  )
}