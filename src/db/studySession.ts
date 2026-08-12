import { getDB } from './database'

export interface StudySession {
  id: number
  date: string
  duration: number
  moduleId: string
}

export async function saveSession(session: Omit<StudySession, 'id' | 'date'>) {
  const db = await getDB()
  const id = await db.add('studySessions', {
    ...session,
    date: new Date().toISOString().split('T')[0],
  })
  return id as number
}

export async function getTodaySessions(): Promise<StudySession[]> {
  const db = await getDB()
  const today = new Date().toISOString().split('T')[0]
  return db.getAllFromIndex('studySessions', 'by-date', IDBKeyRange.only(today)) as Promise<StudySession[]>
}

export async function getWeeklySessions(): Promise<StudySession[]> {
  const db = await getDB()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 86400000)
  const range = IDBKeyRange.bound(weekAgo.toISOString(), now.toISOString())
  return db.getAllFromIndex('studySessions', 'by-date', range) as Promise<StudySession[]>
}
