import { create } from 'zustand'
import {
  addPoints as dbAddPoints,
  getBalance,
  getHistory,
  hasPointsToday,
  getTodayEarned,
  getTodayTasksDone,
  getTotalTasksDone,
  getSpendCount,
} from '../db/points'
import type { PointTransaction } from '../types'

const POINTS_PER_CHECKIN = 10

interface PointsStore {
  balance: number
  history: PointTransaction[]
  todayEarned: number
  todayTasksDone: number
  totalTasksDone: number
  spendCount: number
  isLoading: boolean
  loadPoints: () => Promise<void>
  addPoints: (amount: number, source: string, note: string) => Promise<void>
  spendPoints: (amount: number, source: string, note: string) => Promise<boolean>
  claimCheckIn: () => Promise<boolean>
}

export const usePointsStore = create<PointsStore>((set, get) => ({
  balance: 0,
  history: [],
  todayEarned: 0,
  todayTasksDone: 0,
  totalTasksDone: 0,
  spendCount: 0,
  isLoading: true,

  loadPoints: async () => {
    const [balance, history, todayEarned, todayTasksDone, totalTasksDone, spendCount] = await Promise.all([
      getBalance(),
      getHistory(),
      getTodayEarned(),
      getTodayTasksDone(),
      getTotalTasksDone(),
      getSpendCount(),
    ])
    set({ balance, history, todayEarned, todayTasksDone, totalTasksDone, spendCount, isLoading: false })
  },

  addPoints: async (amount, source, note) => {
    await dbAddPoints(amount, source, 'earn', note)
    await get().loadPoints()
  },

  spendPoints: async (amount, source, note) => {
    const { balance } = get()
    if (balance < amount) return false
    await dbAddPoints(-amount, source, 'spend', note)
    await get().loadPoints()
    return true
  },

  claimCheckIn: async () => {
    const today = await hasPointsToday()
    if (today) return false
    await dbAddPoints(POINTS_PER_CHECKIN, 'check_in', 'earn', '每日打卡')
    await get().loadPoints()
    return true
  },
}))