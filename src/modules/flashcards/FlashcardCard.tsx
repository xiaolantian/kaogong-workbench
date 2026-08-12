import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Flashcard } from '../../db/flashcard'

interface Props {
  card: Flashcard
  onFlip: () => void
  isFlipped: boolean
  onRate: (quality: number) => void
  showRating: boolean
}

export default function FlashcardCard({ card, onFlip, isFlipped, onRate, showRating }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div
        className="w-full h-48 rounded-2xl shadow-q cursor-pointer flex items-center justify-center p-6 relative"
        style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE8C7)', border: '2px solid #FFE0B2' }}
        onClick={onFlip}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 ${isFlipped ? 'block' : 'hidden'}`}
          style={{ background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: '2px solid #A5D6A7' }}>
          <p className="text-base text-center font-cn text-gray-800 leading-relaxed">{card.back}</p>
        </div>
        <div className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 ${isFlipped ? 'hidden' : 'block'}`}>
          <p className="text-base text-center font-cn text-gray-800 leading-relaxed">{card.front}</p>
        </div>
      </motion.div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          间隔 {card.interval} 天 | 熟练度 {card.easeFactor.toFixed(1)}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{card.category}</span>
      </div>
      {showRating && (
        <div className="flex gap-2">
          <button onClick={() => onRate(1)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-sm font-cn hover:bg-red-200">忘记</button>
          <button onClick={() => onRate(3)} className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-cn hover:bg-yellow-200">模糊</button>
          <button onClick={() => onRate(5)} className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-cn hover:bg-green-200">记住</button>
        </div>
      )}
      {!showRating && (
        <button onClick={onFlip}
          className="px-4 py-1.5 rounded-lg bg-warm-orange text-white text-sm font-cn hover:bg-orange-500">
          {isFlipped ? '翻回正面' : '翻面看答案'}
        </button>
      )}
    </div>
  )
}
