import { create } from 'zustand'
import { WindowState, DesktopIcon, ModuleId } from '../types'

const initialWindows: WindowState[] = []

const initialIcons: DesktopIcon[] = [
  { id: 'timer', name: '专注时刻', x: 40, y: 40 },
  { id: 'flashcards', name: '知识卡卡', x: 40, y: 160 },
  { id: 'planner', name: '今日计划', x: 40, y: 280 },
  { id: 'quiz', name: '题题大作战', x: 40, y: 400 },
  { id: 'news', name: '新闻早报', x: 40, y: 520 },
]

interface DesktopStore {
  windows: WindowState[]
  activeWindowId: string | null
  icons: DesktopIcon[]
  nextZIndex: number
  openWindow: (moduleId: ModuleId) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  minimizeWindow: (id: string) => void
  updateIcons: (icons: DesktopIcon[]) => void
}

const windowConfig: Record<ModuleId, { title: string; w: number; h: number }> = {
  timer: { title: '专注时刻', w: 560, h: 480 },
  flashcards: { title: '知识卡卡', w: 600, h: 440 },
  planner: { title: '今日计划', w: 700, h: 500 },
  quiz: { title: '题题大作战', w: 640, h: 520 },
  news: { title: '新闻早报', w: 560, h: 480 },
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: initialWindows,
  activeWindowId: null,
  icons: initialIcons,
  nextZIndex: 100,

  openWindow: (moduleId) => {
    const existing = get().windows.find(w => w.moduleId === moduleId && !w.minimized)
    if (existing) {
      set(state => ({ activeWindowId: existing.id }))
      return
    }
    const cfg = windowConfig[moduleId]
    const offset = get().windows.length * 30
    const id = `${moduleId}-${Date.now()}`
    const win: WindowState = {
      id,
      moduleId,
      title: cfg.title,
      x: 120 + offset,
      y: 80 + offset,
      width: cfg.w,
      height: cfg.h,
      zIndex: get().nextZIndex,
      minimized: false,
    }
    set(state => ({
      windows: [...state.windows, win],
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  closeWindow: (id) => set(state => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  focusWindow: (id) => set(state => ({
    activeWindowId: id,
    windows: state.windows.map(w =>
      w.id === id ? { ...w, zIndex: state.nextZIndex, minimized: false } : w
    ),
    nextZIndex: state.nextZIndex + 1,
  })),

  moveWindow: (id, x, y) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
  })),

  minimizeWindow: (id) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, minimized: true } : w),
    activeWindowId: null,
  })),

  updateIcons: (icons) => set({ icons }),
}))
