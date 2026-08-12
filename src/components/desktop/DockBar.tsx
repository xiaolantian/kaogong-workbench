import { useDesktopStore } from '../../store/desktopStore'

export default function DockBar() {
  const { windows, focusWindow } = useDesktopStore()

  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl shadow-q"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
    >
      {windows.filter(w => !w.minimized).map(win => (
        <button
          key={win.id}
          onClick={() => focusWindow(win.id)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg
                     hover:scale-110 transition-transform duration-200"
          style={{ background: 'linear-gradient(135deg, #FF9F43, #FECA57)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
        >
          {win.title.charAt(0)}
        </button>
      ))}
    </div>
  )
}