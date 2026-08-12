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
