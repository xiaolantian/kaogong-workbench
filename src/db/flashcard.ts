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

export interface RawCard {
  front: string
  back: string
  category?: string
}

export async function getAllCards(): Promise<Flashcard[]> {
  const db = await getDB()
  return (await db.getAll('flashcards')) as unknown as Flashcard[]
}

export async function getDueCards(): Promise<Flashcard[]> {
  const db = await getDB()
  try {
    return (await db.getAllFromIndex('flashcards', 'by-due', IDBKeyRange.only(true))) as unknown as Flashcard[]
  } catch {
    const all = await db.getAll('flashcards') as unknown as Flashcard[]
    return all.filter(c => c.due === true)
  }
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

export async function importCards(raw: RawCard[]): Promise<number> {
  const db = await getDB()
  let count = 0
  for (const c of raw) {
    if (!c.front.trim() || !c.back.trim()) continue
    await db.add('flashcards', {
      front: c.front.trim(),
      back: c.back.trim(),
      category: c.category?.trim() || '自定义',
      easeFactor: 2.5, interval: 0, repetitions: 0,
      nextReview: new Date().toISOString(), due: true,
    })
    count += 1
  }
  return count
}

export async function resetAllDue(): Promise<void> {
  const db = await getDB()
  const all = await db.getAll('flashcards') as unknown as Flashcard[]
  for (const card of all) {
    await db.put('flashcards', { ...card, due: true, nextReview: new Date().toISOString() })
  }
}
