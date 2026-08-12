import { useEffect } from 'react'
import { useDesktopStore } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import DockBar from './DockBar'
import DeskIcon from './DeskIcon'
import ClockWidget from './ClockWidget'

export default function DesktopShell() {
  const { icons, openWindow } = useDesktopStore()
  const { theme } = useSettingsStore()

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{
        background: theme === 'cream'
          ? 'linear-gradient(135deg, #FFF8E7 0%, #FFE8C7 100%)'
          : 'linear-gradient(135deg, #F0F8FF 0%, #D4ECFF 100%)',
      }}
    >
      <ClockWidget />
      <div className="absolute inset-0 pt-16">
        {icons.map(icon => (
          <DeskIcon
            key={icon.id}
            icon={icon}
            onClick={() => openWindow(icon.id)}
          />
        ))}
      </div>
      <DockBar />
    </div>
  )
}