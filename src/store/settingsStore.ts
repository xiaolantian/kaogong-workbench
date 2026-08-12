import { create } from 'zustand'
import { Theme } from '../types'

interface SettingsStore {
  theme: Theme
  wallpaper: string
  setTheme: (theme: Theme) => void
  setWallpaper: (url: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  theme: 'cream',
  wallpaper: 'default',
  setTheme: (theme) => set({ theme }),
  setWallpaper: (url) => set({ wallpaper: url }),
}))
