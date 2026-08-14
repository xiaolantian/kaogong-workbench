import { getDB } from './database'
import type { PointTransaction } from '../types'

export async function cleanUpDirtyData(): Promise<void> {
  const db = await getDB()
  const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
  const dirtySources = new Set(['dev', 'theme_shop'])
  const dirty = all.filter((t) => dirtySources.has(t.source))
  const existingBonus = all.filter((t) => t.source === 'welcome_bonus')

  if (dirty.length === 0) return

  const hasDevBonus = dirty.some((t) => t.source === 'dev')
  const dirtyAmount = dirty.reduce((sum, t) => sum + t.amount, 0)

  for (const t of [...dirty, ...existingBonus]) {
    if (t.id !== undefined) await db.delete('pointsTransactions', t.id)
  }

  const bonus = hasDevBonus ? 2000 : (dirtyAmount > 0 ? dirtyAmount : 0)
  if (bonus > 0) {
    await db.add('pointsTransactions', {
      amount: bonus,
      source: 'welcome_bonus',
      type: 'earn',
      note: '欢迎礼包',
      date: new Date().toISOString().split('T')[0],
    })
  }
}

export async function addPoints(
  amount: number,
  source: string,
  type: 'earn' | 'spend',
  note: string
): Promise<number> {
  const db = await getDB()
  const id = await db.add('pointsTransactions', {
    amount,
    source,
    type,
    note,
    date: new Date().toISOString().split('T')[0],
  })
  return id as number
}

export async function getBalance(): Promise<number> {
  try {
    const db = await getDB()
    const txns = (await db.getAll('pointsTransactions')) as PointTransaction[]
    return txns.reduce((sum, t) => sum + t.amount, 0)
  } catch {
    return 0
  }
}

export async function getHistory(limit = 20): Promise<PointTransaction[]> {
  try {
    const db = await getDB()
    const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
    all.sort((a, b) => b.date.localeCompare(a.date))
    return all.slice(0, limit)
  } catch {
    return []
  }
}

export async function hasPointsToday(): Promise<boolean> {
  try {
    const db = await getDB()
    const today = new Date().toISOString().split('T')[0]
    const count = await db.countFromIndex('pointsTransactions', 'by-date', IDBKeyRange.only(today))
    return count > 0
  } catch {
    return false
  }
}

export async function getTodayEarned(): Promise<number> {
  try {
    const db = await getDB()
    const today = new Date().toISOString().split('T')[0]
    const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
    return all
      .filter((t) => t.date === today && t.type === 'earn')
      .reduce((s, t) => s + t.amount, 0)
  } catch {
    return 0
  }
}

export async function getTodayTasksDone(): Promise<number> {
  try {
    const db = await getDB()
    const today = new Date().toISOString().split('T')[0]
    const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
    return all.filter((t) => t.date === today && t.source === 'task' && t.type === 'earn').length
  } catch {
    return 0
  }
}

export async function getTotalTasksDone(): Promise<number> {
  try {
    const db = await getDB()
    const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
    return all.filter((t) => t.source === 'task' && t.type === 'earn').length
  } catch {
    return 0
  }
}

export async function getSpendCount(): Promise<number> {
  try {
    const db = await getDB()
    const all = (await db.getAll('pointsTransactions')) as PointTransaction[]
    return all.filter((t) => t.type === 'spend').length
  } catch {
    return 0
  }
}