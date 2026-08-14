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
    <div className="flex flex-col items-stretch gap-3 w-full">
      <div
        className="rounded-3xl w-full"
        style={{
          border: `2px solid ${isFlipped ? 'var(--accent-2, #55efc4)' : 'var(--border-soft, #e8e0f5)'}`,
          boxShadow: `4px 4px 0 var(--shadow-harsh, #6c5ce7)`,
        }}
      >
        <div className="rounded-3xl overflow-hidden w-full">
          <motion.div
            className="w-full min-h-36 sm:min-h-44 md:min-h-52 cursor-pointer flex items-center justify-center p-4 sm:p-6 relative"
            style={{ background: 'var(--card-alt)' }}
            onClick={onFlip}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 ${isFlipped ? 'block' : 'hidden'}`}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm sm:text-base text-center font-cn text-gray-800 leading-relaxed font-bold">
                {card.back}
              </p>
            </motion.div>
            <motion.div
              className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 ${isFlipped ? 'hidden' : 'block'}`}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm sm:text-base text-center font-cn text-gray-800 leading-relaxed">
                {card.front}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-cn">
          间隔 <span className="font-en font-bold">{card.interval}</span> 天
          {' · '}
          熟练度 <span className="font-en font-bold">{card.easeFactor.toFixed(1)}</span>
        </span>
        <span className="pill bg-lavender/20 text-purple-700">
          {card.category}
        </span>
      </div>

      {showRating && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onRate(1)}
            className="pill px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold flex-1 min-w-0 text-center"
          >
            😵 忘记
          </button>
          <button
            onClick={() => onRate(3)}
            className="pill px-4 py-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-bold flex-1 min-w-0 text-center"
          >
            🤔 模糊
          </button>
          <button
            onClick={() => onRate(5)}
            className="pill px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 font-bold flex-1 min-w-0 text-center"
          >
            😎 记住
          </button>
        </div>
      )}

      {!showRating && (
        <button
          onClick={onFlip}
          className="neo-btn primary px-6 py-2 text-sm font-cn"
        >
          {isFlipped ? '翻回正面' : '翻面看答案'}
        </button>
      )}
    </div>
  )
}