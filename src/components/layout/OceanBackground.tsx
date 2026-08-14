import { useSettingsStore } from '../../store/settingsStore'

const CREATURES = [
  { emoji: '🐟', left: '4%',  top: '12%', size: 26, delay: 0 },
  { emoji: '🐠', left: '86%', top: '8%',  size: 22, delay: 1 },
  { emoji: '🐬', left: '76%', top: '68%', size: 30, delay: 2 },
  { emoji: '🐙', left: '8%',  top: '62%', size: 24, delay: 3 },
  { emoji: '🐳', left: '48%', top: '78%', size: 34, delay: 4 },
  { emoji: '🦀', left: '18%', top: '38%', size: 20, delay: 5 },
  { emoji: '🐚', left: '62%', top: '22%', size: 18, delay: 6 },
  { emoji: '🫧', left: '34%', top: '8%',  size: 26, delay: 7 },
  { emoji: '🌊', left: '90%', top: '42%', size: 22, delay: 8 },
  { emoji: '🐋', left: '3%',  top: '82%', size: 28, delay: 9 },
  { emoji: '🐡', left: '44%', top: '48%', size: 20, delay: 10 },
  { emoji: '🦈', left: '68%', top: '38%', size: 26, delay: 11 },
  { emoji: '🫧', left: '25%', top: '72%', size: 18, delay: 12 },
  { emoji: '🐟', left: '55%', top: '15%', size: 18, delay: 13 },
  { emoji: '🐠', left: '12%', top: '25%', size: 20, delay: 14 },
  { emoji: '🫧', left: '80%', top: '25%', size: 16, delay: 15 },
]

export default function OceanBackground() {
  const { activeTheme } = useSettingsStore()

  if (activeTheme !== 'ocean') return null

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {CREATURES.map((c, i) => (
        <span
          key={i}
          className="absolute opacity-12 animate-bounce"
          style={{
            left: c.left,
            top: c.top,
            fontSize: c.size,
            lineHeight: 1,
            animationDuration: `${3 + (c.delay % 4)}s`,
            animationDelay: `${c.delay * 0.3}s`,
          }}
        >
          {c.emoji}
        </span>
      ))}
    </div>
  )
}