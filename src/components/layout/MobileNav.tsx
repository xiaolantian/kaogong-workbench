import { useDesktopStore, ICON_PACKS } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { ModuleId } from '../../types'

export default function MobileNav() {
  const { activeModuleId, icons, setActiveModule } = useDesktopStore()
  const { iconPack } = useSettingsStore()
  const packIcons = ICON_PACKS[iconPack]

  const moduleColors: Record<ModuleId, { color: string; bg: string }> = {
    timer:      { color: '#6c5ce7', bg: '#ede7ff' },
    flashcards: { color: '#74b9ff', bg: '#e3f2fd' },
    planner:    { color: '#55efc4', bg: '#e8f8f0' },
    quiz:       { color: '#ff7675', bg: '#ffe8e8' },
    news:       { color: '#ffd93d', bg: '#fff8e1' },
    store:      { color: '#e17055', bg: '#ffeaa7' },
  }

  const moduleLabels: Record<ModuleId, string> = {
    timer: '专注',
    flashcards: '卡片',
    planner: '计划',
    quiz: '答题',
    news: '新闻',
    store: '商城',
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1.5 safe-area-bottom"
      style={{
        background: 'var(--aside-bg)',
        borderTop: `1px solid var(--aside-border)`,
        boxShadow: `0 -2px 8px var(--aside-shadow)`,
        paddingBottom: '8px',
      }}
    >
      {icons.map((icon) => {
        const isActive = activeModuleId === icon.id
        const meta = moduleColors[icon.id]
        const PackIcon = packIcons[icon.id]
        return (
          <button
            key={icon.id}
            onClick={() => setActiveModule(icon.id)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-200"
            style={isActive ? { background: 'var(--card-bg)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--shadow-harsh)' } : {}}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{
                background: isActive ? meta.bg : 'transparent',
              }}
            >
              <PackIcon size={20} color={isActive ? meta.color : '#999'} strokeWidth={2} />
            </span>
            <span
              className="text-[10px] font-cn leading-tight"
              style={{
                color: isActive ? meta.color : '#999',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {moduleLabels[icon.id]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}