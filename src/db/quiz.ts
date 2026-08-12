import { getDB } from './database'

export interface QuizQuestion {
  id: number
  question: string
  options: string
  answer: string
  type: string
  category: string
}

export async function getQuestions(category?: string): Promise<QuizQuestion[]> {
  const db = await getDB()
  if (category) {
    return db.getAllFromIndex('quizQuestions', 'by-category', IDBKeyRange.only(category)) as Promise<QuizQuestion[]>
  }
  return db.getAll('quizQuestions') as Promise<QuizQuestion[]>
}

export async function saveAttempt(questionId: number, isCorrect: boolean) {
  const db = await getDB()
  return db.add('quizAttempts', { questionId, isCorrect, date: new Date().toISOString() })
}

export async function addQuestion(q: Omit<QuizQuestion, 'id'>) {
  const db = await getDB()
  return db.add('quizQuestions', q)
}
