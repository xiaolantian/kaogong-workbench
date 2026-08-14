import { useState, useEffect } from 'react'
import { useDesktopStore, ICON_PACKS } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import MascotAvatar from '../mascot/MascotAvatar'
import { Hourglass, Puzzle, Map, Target, Newspaper, Award, Sun, Moon, Flower2, TreeDeciduous, Fish, Sparkles, Palette } from 'lucide-react'
import type { ModuleId, ThemeId } from '../../types'

const THEME_CHIPS: { id: ThemeId; label: string; icon: React.ComponentType<any>; color: string; bg: string }[] = [
  { id: 'day', label: '白天', icon: Sun, color: '#f59e0b', bg: '#fef3c7' },
  { id: 'night', label: '黑夜', icon: Moon, color: '#636e72', bg: '#e8e0f5' },
  { id: 'sakura', label: '樱花', icon: Flower2, color: '#be185d', bg: '#fce4ec' },
  { id: 'forest', label: '森林', icon: TreeDeciduous, color: '#2e7d32', bg: '#e8f5e9' },
  { id: 'ocean', label: '海洋', icon: Fish, color: '#1565c0', bg: '#e3f2fd' },
  { id: 'galaxy', label: '星河', icon: Sparkles, color: '#4a148c', bg: '#ede7f6' },
]

const moduleMeta: Record<ModuleId, { icon: React.ComponentType<any>; color: string; bg: string }> = {
  timer:      { icon: Hourglass, color: '#6c5ce7', bg: '#ede7ff' },
  flashcards: { icon: Puzzle, color: '#74b9ff', bg: '#e3f2fd' },
  planner:    { icon: Map, color: '#55efc4', bg: '#e8f8f0' },
  quiz:       { icon: Target, color: '#ff7675', bg: '#ffe8e8' },
  news:       { icon: Newspaper, color: '#ffd93d', bg: '#fff8e1' },
  store:      { icon: Award, color: '#e17055', bg: '#ffeaa7' },
}

const moduleLabels: Record<ModuleId, string> = {
  timer: '专注',
  flashcards: '卡片',
  planner: '计划',
  quiz: '答题',
  news: '新闻',
  store: '商城',
}

export default function Sidebar() {
  const { activeModuleId, icons, setActiveModule } = useDesktopStore()
  const { activeTheme, ownedThemes, setActiveTheme, iconPack } = useSettingsStore()
  const [time, setTime] = useState(new Date())
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const packIcons = ICON_PACKS[iconPack]

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside
      className="w-60 h-screen flex flex-col shrink-0 p-3 gap-3"
      style={{
        background: 'var(--aside-bg)',
        paddingBottom: '8px',
      }}
    >
      <div className="soft-card p-4 flex items-center gap-3">
        <MascotAvatar size={48} />
        <div>
          <span className="text-lg font-en text-purple-700 tabular-nums">
            {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="text-[11px] text-gray-500 font-cn">
            {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {icons.map((icon) => {
          const isActive = activeModuleId === icon.id
          const meta = moduleMeta[icon.id]
          const PackIcon = packIcons[icon.id]
          return (
            <button
              key={icon.id}
              onClick={() => setActiveModule(icon.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-cn transition-all duration-200 ${
                isActive ? 'soft-card' : 'hover:bg-white/40'
              }`}
              style={isActive ? { background: 'var(--card-bg)' } : {}}
            >
              <span
                className="flex items-center justify-center icon-chip shrink-0"
                style={{ background: meta.bg, width: 36, height: 36, borderRadius: 12 }}
              >
                <PackIcon size={18} color={isActive ? meta.color : '#636e72'} strokeWidth={2} />
              </span>
              <span
                className="flex-1 text-left truncate"
                style={{ color: isActive ? meta.color : '#636e72', fontWeight: isActive ? 700 : 400 }}
              >
                {icon.name}
              </span>
              {isActive && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: meta.color }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <div
        className="soft-card mt-auto p-3 flex flex-col gap-2"
      >
        <button
          onClick={() => setThemeMenuOpen(!themeMenuOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all hover:bg-white/60"
        >
          <Palette size={12} strokeWidth={2} color="#9ca3af" />
          <span className="text-xs font-cn text-gray-500">主题</span>
          <span className="text-[10px] font-cn text-gray-400 ml-auto">
            {themeMenuOpen ? '收起' : '切换'}
          </span>
        </button>
        {themeMenuOpen && (
          <div className="grid grid-cols-3 gap-1.5">
            {THEME_CHIPS.map((chip) => {
              const isActive = activeTheme === chip.id
              const owned = ownedThemes.includes(chip.id) || ['day', 'night'].includes(chip.id)
              const ChipIcon = chip.icon
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    if (owned) setActiveTheme(chip.id)
                    setThemeMenuOpen(false)
                  }}
                  title={isActive ? `${chip.label}（使用中）` : owned ? chip.label : '未在商城解锁'}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-purple-500 bg-purple-50'
                      : owned
                      ? 'border-transparent bg-white/60 hover:bg-white'
                      : 'border-transparent bg-gray-100/50 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <ChipIcon size={14} color={isActive ? chip.color : '#9ca3af'} strokeWidth={2} />
                  <span
                    className="text-[9px] font-cn"
                    style={{ color: isActive ? chip.color : '#9ca3af', fontWeight: isActive ? 700 : 400 }}
                  >
                    {chip.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}