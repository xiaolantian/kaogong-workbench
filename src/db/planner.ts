import { getDB } from './database'

export interface StudyPlan {
  id: number
  title: string
  column: 'today' | 'week' | 'done'
  done: boolean
  order: number
}

export async function getPlans(): Promise<StudyPlan[]> {
  const db = await getDB()
  return db.getAll('studyPlans') as unknown as StudyPlan[]
}

export async function addPlan(title: string, column: 'today' | 'week') {
  const db = await getDB()
  const plans = await getPlans()
  const order = plans.filter(p => p.column === column).length
  const id = await db.add('studyPlans', { title, column, done: false, order })
  return id as number
}

export async function updatePlan(id: number, updates: Partial<StudyPlan>) {
  const db = await getDB()
  const plan = await db.get('studyPlans', id) as StudyPlan | undefined
  if (!plan) return
  await db.put('studyPlans', { ...plan, ...updates })
}

export async function deletePlan(id: number) {
  const db = await getDB()
  await db.delete('studyPlans', id)
}

export async function markDayActive() {
  try {
    const db = await getDB()
    const today = new Date().toISOString().split('T')[0]
    const records = await db.getAll('dailyActivity')
    if (!records.some((r: { date: string }) => r.date === today)) {
      await db.add('dailyActivity', { date: today, source: 'plan' })
    }
  } catch {
    // dailyActivity store might not exist yet
  }
}

export async function getActiveDates(): Promise<string[]> {
  try {
    const db = await getDB()
    const records = await db.getAll('dailyActivity')
    return records.map((r: { date: string }) => r.date)
  } catch {
    return []
  }
}
