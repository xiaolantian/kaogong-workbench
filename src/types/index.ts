export type MascotMood = 'focus' | 'sleepy' | 'happy' | 'sad' | 'celebrate'

export type Theme = 'cream' | 'lightblue'

export type ModuleId = 'timer' | 'flashcards' | 'planner' | 'quiz' | 'news'

export interface WindowState {
  id: string
  moduleId: ModuleId
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
}

export interface DesktopIcon {
  id: ModuleId
  name: string
  x: number
  y: number
}
