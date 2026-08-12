import { motion } from 'framer-motion'
import type { DesktopIcon } from '../../types'

interface Props {
  icon: DesktopIcon
  onClick: () => void
}

export default function DeskIcon({ icon, onClick }: Props) {
  const iconEmojis: Record<string, string> = {
    timer: '⏰', flashcards: '📚', planner: '📋', quiz: '🎮', news: '📰'
  }

  return (
    <motion.button
      className="absolute flex flex-col items-center gap-1 w-20 cursor-pointer"
      style={{ left: icon.x, top: icon.y }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-q"
        style={{ background: 'linear-gradient(135deg, #FFFFFF, #FFF3E0)' }}>
        {iconEmojis[icon.id] || '📁'}
      </div>
      <span className="text-xs text-gray-700 font-cn">{icon.name}</span>
    </motion.button>
  )
}