import { getDB } from './database'

export interface Flashcard {
  id: number
  front: string
  back: string
  category: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: string
  due: boolean
}

export async function getDueCards(): Promise<Flashcard[]> {
  const db = await getDB()
  return db.getAllFromIndex('flashcards', 'by-due', IDBKeyRange.only(true)) as Promise<Flashcard[]>
}

export async function markReviewed(id: number, quality: number) {
  const db = await getDB()
  const card = await db.get('flashcards', id) as Flashcard | undefined
  if (!card) return
  let { easeFactor, interval, repetitions } = card
  if (quality >= 3) {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easeFactor)
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  } else {
    repetitions = 0
    interval = 1
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + interval)
  await db.put('flashcards', { ...card, easeFactor, interval, repetitions, nextReview: tomorrow.toISOString(), due: false })
}

export async function addCard(front: string, back: string, category: string) {
  const db = await getDB()
  const id = await db.add('flashcards', {
    front, back, category,
    easeFactor: 2.5, interval: 0, repetitions: 0,
    nextReview: new Date().toISOString(), due: true,
  })
  return id as number
}
