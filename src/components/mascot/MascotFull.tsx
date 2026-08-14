import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'
import type { MascotMood } from '../../types'

interface Props {
  size?: number
}

const moodAnimations: Record<MascotMood, { y?: number[]; rotate?: number[] }> = {
  focus: { y: [0, -3, 0] },
  sleepy: { rotate: [0, 2, -2, 0] },
  happy: { y: [0, -10, 0] },
  sad: { y: [0, 3, 0] },
  celebrate: { y: [0, -14, 0], rotate: [0, -5, 5, 0] },
}

export default function MascotFull({ size = 200 }: Props) {
  const { mood } = useMascotStore()

  return (
    <motion.div
      className="flex items-center justify-center relative"
      animate={moodAnimations[mood]}
      transition={{
        ease: 'easeInOut',
        duration: mood === 'celebrate' ? 0.5 : 1.5,
        repeat: Infinity,
      }}
    >
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-lg"
        style={{
          background: mood === 'happy'
            ? 'radial-gradient(circle, #55efc4 0%, transparent 70%)'
            : mood === 'sad'
              ? 'radial-gradient(circle, #ff7675 0%, transparent 70%)'
              : mood === 'celebrate'
                ? 'radial-gradient(circle, #ffd93d 0%, transparent 70%)'
                : 'radial-gradient(circle, #a29bfe 0%, transparent 70%)',
          width: size * 0.8,
          height: size * 0.8,
        }}
      />
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
        <>
          <motion.svg
            className="absolute top-2 -right-2 w-4 h-4 text-yellow-400 select-none"
            viewBox="0 0 24 24" fill="currentColor"
            animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4], rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay: 0 }}
          >
            <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
          </motion.svg>
          <motion.svg
            className="absolute -top-2 right-3 w-3 h-3 text-green-400 select-none"
            viewBox="0 0 24 24" fill="currentColor"
            animate={{ scale: [0.4, 0.9, 0.4], opacity: [0.3, 1, 0.3], rotate: [180, 200, 180, 160] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay: 0.7 }}
          >
            <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
          </motion.svg>
        </>
      )}
    </motion.div>
  )
}