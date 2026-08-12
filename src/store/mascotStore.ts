import { create } from 'zustand'
import { MascotMood } from '../types'

interface MascotStore {
  mood: MascotMood
  streak: number
  setMood: (mood: MascotMood) => void
  setStreak: (streak: number) => void
}

export const useMascotStore = create<MascotStore>((set) => ({
  mood: 'focus',
  streak: 0,
  setMood: (mood) => set({ mood }),
  setStreak: (streak) => set({ streak }),
}))
