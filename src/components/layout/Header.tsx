import { useState, useEffect } from 'react'
import MascotAvatar from '../mascot/MascotAvatar'
import { useSettingsStore } from '../../store/settingsStore'
import { Sun, Moon, Flower2, TreeDeciduous, Fish, Sparkles } from 'lucide-react'
import type { ThemeId } from '../../types'

const THEME_ORDER: ThemeId[] = ['day', 'night', 'sakura', 'forest', 'ocean', 'galaxy']

const THEME_ICON: Record<ThemeId, { icon: React.ComponentType<any>; color: string }> = {
  day:    { icon: Sun, color: '#f59e0b' },
  night:  { icon: Moon, color: '#636e72' },
  sakura: { icon: Flower2, color: '#be185d' },
  forest: { icon: TreeDeciduous, color: '#2e7d32' },
  ocean:  { icon: Fish, color: '#1565c0' },
  galaxy: { icon: Sparkles, color: '#4a148c' },
}

export default function Header() {
  const [time, setTime] = useState(new Date())
  const { activeTheme, ownedThemes, setActiveTheme } = useSettingsStore()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(activeTheme)
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length]
    setActiveTheme(next)
  }

  const themeConfig = THEME_ICON[activeTheme]
  const ThemeIcon = themeConfig.icon
  const themeName = { day: '白天', night: '黑夜', sakura: '樱花', forest: '森林', ocean: '海洋', galaxy: '星河' }[activeTheme]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2"
      style={{
        background: 'var(--aside-bg)',
        borderBottom: `1px solid var(--aside-border)`,
        boxShadow: `0 2px 8px var(--aside-shadow)`,
      }}
    >
      <div className="flex items-center gap-2">
        <MascotAvatar size={32} />
        <div>
          <span className="text-sm text-gray-700 font-en leading-tight">
            {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="block text-[10px] text-gray-400 leading-tight">
            {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
          </span>
        </div>
      </div>
      <button
        onClick={cycleTheme}
        className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:shadow-md transition-all"
        style={{
          background: 'var(--card-bg)',
          border: `2px solid var(--border)`,
          boxShadow: `2px 2px 0 var(--shadow-harsh)`,
        }}
        title={`${themeName}（点击切换）`}
      >
        <ThemeIcon size={16} color={themeConfig.color} strokeWidth={2} />
        <span className="text-xs font-cn" style={{ color: themeConfig.color, fontWeight: 600 }}>
          {themeName}
        </span>
      </button>
    </header>
  )
}
