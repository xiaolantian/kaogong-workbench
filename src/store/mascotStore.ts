import { create } from 'zustand'
import { getDB } from '../db/database'
import { MascotMood } from '../types'

interface MascotStore {
  mood: MascotMood
  streak: number
  setMood: (mood: MascotMood) => void
  setStreak: (streak: number) => void
  computeStreak: () => Promise<void>
}

export const useMascotStore = create<MascotStore>((set) => ({
  mood: 'focus',
  streak: 0,
  setMood: (mood) => set({ mood }),
  setStreak: (streak) => set({ streak }),
  computeStreak: async () => {
    try {
      const db = await getDB()
      const sessions = await db.getAll('studySessions')
      const activities = await db.getAll('dailyActivity')
      const dates = new Set([
        ...sessions.map((s) => s.date),
        ...activities.map((a) => a.date),
      ])
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const d = new Date(today.getTime() - i * 86400000)
        const key = d.toISOString().split('T')[0]
        if (dates.has(key)) streak++
        else break
      }
      set({ streak })
    } catch {
      set({ streak: 0 })
    }
  },
}))
