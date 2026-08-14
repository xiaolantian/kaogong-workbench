import { useSettingsStore } from '../../store/settingsStore'

const STARS = [
  { emoji: '✨', left: '5%',  top: '10%', size: 20, delay: 0 },
  { emoji: '🌟', left: '88%', top: '8%',  size: 22, delay: 1 },
  { emoji: '💫', left: '78%', top: '70%', size: 26, delay: 2 },
  { emoji: '⭐', left: '8%',  top: '60%', size: 18, delay: 3 },
  { emoji: '🪐', left: '50%', top: '78%', size: 28, delay: 4 },
  { emoji: '✨', left: '18%', top: '38%', size: 18, delay: 5 },
  { emoji: '🌠', left: '64%', top: '20%', size: 22, delay: 6 },
  { emoji: '⭐', left: '34%', top: '8%',  size: 16, delay: 7 },
  { emoji: '🌟', left: '92%', top: '40%', size: 20, delay: 8 },
  { emoji: '✨', left: '3%',  top: '82%', size: 18, delay: 9 },
  { emoji: '💫', left: '44%', top: '48%', size: 22, delay: 10 },
  { emoji: '⭐', left: '70%', top: '35%', size: 18, delay: 11 },
  { emoji: '✨', left: '25%', top: '72%', size: 16, delay: 12 },
  { emoji: '🌟', left: '58%', top: '12%', size: 20, delay: 13 },
  { emoji: '✨', left: '14%', top: '25%', size: 18, delay: 14 },
  { emoji: '🌠', left: '82%', top: '22%', size: 20, delay: 15 },
]

export default function GalaxyBackground() {
  const { activeTheme } = useSettingsStore()

  if (activeTheme !== 'galaxy') return null

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute opacity-20 animate-pulse"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            lineHeight: 1,
            animationDuration: `${2 + (s.delay % 4)}s`,
            animationDelay: `${s.delay * 0.3}s`,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}