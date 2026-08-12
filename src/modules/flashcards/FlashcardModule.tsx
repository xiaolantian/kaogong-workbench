import { useState, useEffect } from 'react'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import FlashcardCard from './FlashcardCard'
import FlashcardStats from './FlashcardStats'
import { getDueCards, markReviewed, addCard } from '../../db/flashcard'
import type { Flashcard } from '../../db/flashcard'

export default function FlashcardModule() {
  const [dueCards, setDueCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [newCategory, setNewCategory] = useState('时政常识')
  const [showAdd, setShowAdd] = useState(false)
  const { setMood } = useMascotStore()

  useEffect(() => { getDueCards().then(setDueCards) }, [])

  const current = dueCards[currentIndex]

  const handleFlip = () => {
    if (!isFlipped) setShowRating(true)
    setIsFlipped(!isFlipped)
  }

  const handleRate = async (quality: number) => {
    if (!current) return
    if (quality >= 4) setMood('happy')
    else setMood('sad')
    setTimeout(() => setMood('focus'), 2000)
    await markReviewed(current.id, quality)
    setShowRating(false)
    setIsFlipped(false)
    const next = currentIndex + 1
    if (next < dueCards.length) setCurrentIndex(next)
    else {
      setDueCards([])
      setCurrentIndex(0)
    }
  }

  const handleAdd = async () => {
    if (!newFront || !newBack) return
    await addCard(newFront, newBack, newCategory)
    setNewFront(''); setNewBack(''); setShowAdd(false)
    await getDueCards().then(setDueCards)
    if (dueCards.length === 0) setCurrentIndex(0)
  }

  if (!current && dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 h-full justify-center">
        <MascotFull size={120} />
        <p className="text-lg font-cn text-warm-orange">今天没有待复习的卡片！</p>
        <p className="text-sm text-gray-500">试试添加新卡片吧~</p>
        <button onClick={() => setShowAdd(true)}
          className="mt-2 px-4 py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q hover:scale-105 transition-transform">
          + 添加卡片
        </button>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex justify-between items-center">
        <span className="text-sm font-cn text-gray-600">
          {dueCards.length > 0 ? `${currentIndex + 1} / ${dueCards.length}` : '完成'}
        </span>
        <button onClick={() => setShowAdd(!showAdd)}
          className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-cn hover:bg-blue-200">
          {showAdd ? '关闭' : '+ 添加'}
        </button>
      </div>

      {showAdd && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col gap-2">
          <input value={newFront} onChange={e => setNewFront(e.target.value)}
            placeholder="正面（问题）" className="text-sm border rounded-lg px-2 py-1 font-cn" />
          <input value={newBack} onChange={e => setNewBack(e.target.value)}
            placeholder="背面（答案）" className="text-sm border rounded-lg px-2 py-1 font-cn" />
          <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1">
            <option value="时政常识">时政常识</option>
            <option value="行政法">行政法</option>
            <option value="申论">申论</option>
            <option value="基础常识">基础常识</option>
          </select>
          <button onClick={handleAdd}
            className="text-sm px-3 py-1 rounded-lg bg-warm-orange text-white font-cn hover:bg-orange-500">添加</button>
        </div>
      )}

      <FlashcardCard
        card={current}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        showRating={showRating}
        onRate={handleRate}
      />

      <FlashcardStats dueCount={dueCards.length} />
    </div>
  )
}
