import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'

interface Props {
  size?: number
}

export default function MascotFull({ size = 200 }: Props) {
  const { mood } = useMascotStore()

  const animations = {
    focus: { y: [0, -3, 0], duration: 1.5, repeat: Infinity },
    sleepy: { rotate: [0, 2, -2, 0], duration: 3, repeat: Infinity },
    happy: { y: [0, -10, 0], duration: 0.6, repeat: Infinity },
    sad: { y: [0, 3, 0], duration: 2, repeat: Infinity },
    celebrate: { y: [0, -20, 0], rotate: [0, -5, 5, 0], duration: 0.5, repeat: Infinity },
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={animations[mood]}
      transition={{ ease: 'easeInOut' }}
    >
      <svg width={size} height={size} viewBox="-60 -60 120 120">
        <style>{`
          @keyframes breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
          .full-body { animation: breathe 2s ease-in-out infinite; transform-origin: center bottom; }
        `}</style>
        <g className="full-body">
          <ellipse cx="0" cy="30" rx="30" ry="10" fill="rgba(0,0,0,0.1)"/>
          <ellipse cx="0" cy="15" rx="36" ry="32" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="-30,-15 -42,-40 -18,-20" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="30,-15 42,-40 18,-20" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="-28,-12 -36,-32 -22,-18" fill="#FFCC80"/>
          <polygon points="28,-12 36,-32 22,-18" fill="#FFCC80"/>
          <ellipse cx="-12" cy="8" rx="6" ry="7" fill="#333"/>
          <ellipse cx="12" cy="8" rx="6" ry="7" fill="#333"/>
          <ellipse cx="-10" cy="5" rx="2" ry="2" fill="white"/>
          <ellipse cx="14" cy="5" rx="2" ry="2" fill="white"/>
          <circle cx="0" cy="18" r="3" fill="#FF6B6B"/>
          {mood === 'happy' || mood === 'celebrate' ? (
            <path d="M-12 22 Q0 34 12 22" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          ) : mood === 'sad' ? (
            <path d="M-10 32 Q0 22 10 32" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          ) : (
            <path d="M-8 26 L8 26" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          )}
          <path d="M-24 0 L-32 -3 M-24 5 L-32 5 M24 0 L32 -3 M24 5 L32 5" stroke="#333" strokeWidth="1.2"/>
          <ellipse cx="-18" cy="16" rx="6" ry="4" fill="#FFCDD2" opacity="0.5"/>
          <ellipse cx="18" cy="16" rx="6" ry="4" fill="#FFCDD2" opacity="0.5"/>
        </g>
        {(mood === 'focus' || mood === 'sleepy') && (
          <path d="M-32 -38 L32 -38 L26 -46 L-26 -46 Z" fill="#2C3E50"/>
        )}
      </svg>
    </motion.div>
  )
}
