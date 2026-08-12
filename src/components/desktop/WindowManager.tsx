import { useDesktopStore } from '../../store/desktopStore'
import WindowFrame from './WindowFrame'

export default function WindowManager() {
  const windows = useDesktopStore(s => s.windows)
  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows.map(win => {
        if (win.minimized) return null
        return (
          <WindowFrame key={win.id} id={win.id} title={win.title}>
            <div className="flex items-center justify-center h-full text-gray-400 font-cn">
              模块加载中...
            </div>
          </WindowFrame>
        )
      })}
    </div>
  )
}
