import { useRef, useEffect, useState } from 'react'
import { useDesktopStore } from '../../store/desktopStore'

interface Props {
  id: string
  title: string
  children: React.ReactNode
}

export default function WindowFrame({ id, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const { moveWindow, focusWindow, closeWindow, minimizeWindow, windows } = useDesktopStore()
  const win = windows.find(w => w.id === id)
  if (!win) return null
  if (win.minimized) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(id)
    const rect = ref.current!.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragging(true)
  }

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent) => {
      moveWindow(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y)
    }
    const handleUp = () => setDragging(false)
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, dragOffset, id, moveWindow])

  return (
    <div
      ref={ref}
      className="absolute rounded-2xl shadow-q overflow-hidden flex flex-col"
      style={{
        left: win.x, top: win.y, width: win.width, height: win.height,
        zIndex: win.zIndex, background: '#FFFFFF',
        border: '2px solid #FFE0B2',
        transition: dragging ? 'none' : 'box-shadow 0.2s',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className="h-9 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing"
        style={{ background: 'linear-gradient(90deg, #FF9F43, #FECA57)' }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm text-white font-cn">{title}</span>
        <div className="flex gap-2">
          <button onClick={() => minimizeWindow(id)}
            className="w-4 h-4 rounded-full bg-yellow-300 hover:bg-yellow-400" />
          <button onClick={() => closeWindow(id)}
            className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}
