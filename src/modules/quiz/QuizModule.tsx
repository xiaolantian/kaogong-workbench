import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { useMascotStore } from '../../store/mascotStore'
import { getQuestions, saveAttempt } from '../../db/quiz'
import { addCard } from '../../db/flashcard'
import type { QuizQuestion } from '../../db/quiz'

export default function QuizModule() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
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
    loadQuestions()
  }, [filter])

  useEffect(() => {
    if (finished || !showAnswer) return
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setShowAnswer(true); handleAnswer(null) }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIndex, showAnswer, finished])

  const loadQuestions = async () => {
    const qs = await getQuestions(filter === 'all' ? undefined : filter)
    setQuestions(qs)
    setCurrentIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setTimeLeft(60); setFinished(false)
  }

  const current = questions[currentIndex]
  const options = current ? current.options.split('\n').map(o => ({ key: o[0], text: o })) : []

  const handleSelect = (key: string) => {
    if (showAnswer) return
    setSelected(key)
  }

  const handleAnswer = async (guess: string | null) => {
    setShowAnswer(true)
    clearInterval(timerRef.current)
    const isCorrect = guess === current?.answer
    if (isCorrect) {
      setScore(s => s + 1)
      setMood('happy')
    } else {
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
        setCurrentIndex(next)
        setSelected(null)
        setShowAnswer(false)
        setTimeLeft(60)
      } else {
        setFinished(true)
      }
    }, 2000)
  }

  const categories = ['all', '行政法', '言语理解', '数量关系', '判断推理', '常识判断', '基础常识', '时政常识', '申论']

  if (finished) {
    const total = questions.length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div className="flex flex-col items-center gap-4 h-full justify-center">
        <MascotFull size={100} />
        <p className="text-2xl font-cn text-warm-orange">
          {pct >= 80 ? '太棒了！' : pct >= 60 ? '不错哦！' : '继续加油！'}
        </p>
        <p className="text-lg font-en">{score} / {total}  <span className="text-sm text-gray-500">({pct}%)</span></p>
        <p className="text-xs text-gray-500">错题已自动加入知识卡片</p>
        <button onClick={() => setFinished(false)}
          className="px-4 py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q hover:scale-105 transition-transform">
          再来一轮
        </button>
      </div>
    )
  }

  if (!current) {
    return <div className="flex items-center justify-center h-full text-gray-400">题目加载中...</div>
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-cn ${
                filter === c ? 'bg-warm-orange text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {c === 'all' ? '全部' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MascotFull size={48} />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{currentIndex + 1} / {questions.length}</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 rounded-full bg-warm-orange transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gray-50">
        <p className="font-cn text-gray-800 leading-relaxed">{current.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map(opt => {
          let bg = 'bg-white border-gray-200'
          if (showAnswer) {
            if (opt.key === current.answer) bg = 'bg-green-100 border-green-400'
            else if (opt.key === selected && opt.key !== current.answer) bg = 'bg-red-100 border-red-400'
          } else if (opt.key === selected) {
            bg = 'bg-orange-100 border-warm-orange'
          }
          return (
            <button key={opt.key} onClick={() => handleSelect(opt.key)}
              className={`p-2 rounded-xl border text-left font-cn text-sm transition-colors ${bg}`}>
              {opt.text}
            </button>
          )
        })}
      </div>

      {!showAnswer ? (
        <button onClick={() => handleAnswer(selected)} disabled={!selected}
          className="w-full py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q disabled:opacity-50 hover:bg-orange-500">
          确认答案
        </button>
      ) : (
        <p className={`text-center font-cn text-sm ${selected === current.answer ? 'text-green-600' : 'text-red-600'}`}>
          {selected === current.answer ? '✓ 答对了！' : `✗ 正确答案是 ${current.answer}`}
        </p>
      )}
    </div>
  )
}
