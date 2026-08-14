import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'
import type { MascotMood } from '../../types'

interface Props {
  size?: number
}

const moodAnimations: Record<MascotMood, { y?: number[]; rotate?: number[] }> = {
  focus: { y: [0, -2, 0] },
  sleepy: { rotate: [0, 1.5, -1.5, 0] },
  happy: { y: [0, -6, 0] },
  sad: { y: [0, 2, 0] },
  celebrate: { y: [0, -8, 0], rotate: [0, -4, 4, 0] },
}

export default function MascotAvatar({ size = 60 }: Props) {
  const { mood } = useMascotStore()

  return (
    <motion.div
      className="inline-flex items-center justify-center shrink-0 relative"
      animate={moodAnimations[mood]}
      transition={{
        duration: mood === 'celebrate' ? 0.6 : 2,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      style={{ width: size, height: size }}
    >
      <img
        src={`/mascot/${mood === 'sleepy' ? 'focus' : mood}.svg`}
        alt="猫猫"
        width={size}
        height={size}
        draggable={false}
        className="select-none"
      />
      {/* 空闲时星星闪烁，示意随时待命 */}
      {mood === 'sleepy' && (
        <motion.svg
          className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 select-none"
          viewBox="0 0 24 24" fill="currentColor"
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        >
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
        </motion.svg>
      )}
    </motion.div>
  )
}