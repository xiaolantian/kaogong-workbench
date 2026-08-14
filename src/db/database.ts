import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface AppDB extends DBSchema {
  studySessions: {
    key: number
    value: { id?: number; date: string; duration: number; moduleId: string }
    indexes: { 'by-date': string }
  }
  dailyActivity: {
    key: number
    value: { id?: number; date: string; source: string }
    indexes: { 'by-date': string }
  }
  flashcards: {
    key: number
    value: {
      front: string; back: string; category: string;
      easeFactor: number; interval: number; repetitions: number;
      nextReview: string; due: boolean
    }
    indexes: { 'by-due': number; 'by-category': string }
  }
  quizQuestions: {
    key: number
    value: { id?: number; question: string; options: string; answer: string; type: string; category: string }
    indexes: { 'by-category': string }
  }
  quizAttempts: {
    key: number
    value: { id?: number; questionId: number; isCorrect: boolean; date: string }
  }
  studyPlans: {
    key: number
    value: { id?: number; title: string; column: string; done: boolean; order: number }
  }
  newsNotes: {
    key: number
    value: { id?: number; title: string; content: string; date: string; tags: string }
  }
  newsItems: {
    key: string
    value: {
      link: string; title: string; description: string;
      source_name: string; category: string; published: string; fetchedAt: number
    }
    indexes: { 'by-fetchedAt': number; 'by-category': string; 'by-source': string }
  }
  pointsTransactions: {
    key: number
    value: { id?: number; amount: number; source: string; type: 'earn' | 'spend'; note: string; date: string }
    indexes: { 'by-date': string }
  }
  themes: {
    key: string
    value: { themeId: string; purchasedAt: string; totalSpent: number }
  }
  settings: {
    key: string
    value: { key: string; val: string }
  }
}

const DB_NAME = 'kaogong-db'
const DB_VERSION = 7

export async function getDB(): Promise<IDBPDatabase<AppDB>> {
  return openDB<AppDB>(DB_NAME, DB_VERSION, {
    async upgrade(db) {
      if (!db.objectStoreNames.contains('studySessions')) {
        const ss = db.createObjectStore('studySessions', { keyPath: 'id', autoIncrement: true })
        ss.createIndex('by-date', 'date')
      }
      if (!db.objectStoreNames.contains('dailyActivity')) {
        const da = db.createObjectStore('dailyActivity', { keyPath: 'id', autoIncrement: true })
        da.createIndex('by-date', 'date')
      }
      if (!db.objectStoreNames.contains('flashcards')) {
        const fc = db.createObjectStore('flashcards', { keyPath: 'id', autoIncrement: true })
        fc.createIndex('by-due', 'due')
        fc.createIndex('by-category', 'category')
      } else if (db.version < 2) {
        const oldStore = db.transaction('flashcards', 'readonly').objectStore('flashcards')
        const oldData = await oldStore.getAll()
        db.deleteObjectStore('flashcards')
        const fc = db.createObjectStore('flashcards', { keyPath: 'id', autoIncrement: true })
        fc.createIndex('by-due', 'due')
        fc.createIndex('by-category', 'category')
        for (const record of oldData) {
          fc.add(record)
        }
      }
      if (!db.objectStoreNames.contains('quizQuestions')) {
        const qq = db.createObjectStore('quizQuestions', { keyPath: 'id', autoIncrement: true })
        qq.createIndex('by-category', 'category')
      }
      if (!db.objectStoreNames.contains('quizAttempts')) {
        db.createObjectStore('quizAttempts', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('studyPlans')) {
        db.createObjectStore('studyPlans', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('newsNotes')) {
        db.createObjectStore('newsNotes', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('newsItems')) {
        const ni = db.createObjectStore('newsItems', { keyPath: 'link' })
        ni.createIndex('by-fetchedAt', 'fetchedAt')
        ni.createIndex('by-category', 'category')
        ni.createIndex('by-source', 'source_name')
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
      if (!db.objectStoreNames.contains('pointsTransactions')) {
        const pt = db.createObjectStore('pointsTransactions', { keyPath: 'id', autoIncrement: true })
        pt.createIndex('by-date', 'date')
      }
      if (!db.objectStoreNames.contains('themes')) {
        db.createObjectStore('themes', { keyPath: 'themeId' })
      }
    },
  })
}

export async function seedDefaultData() {
  const db = await getDB()
  const count = await db.count('flashcards')
  if (count === 0) {
    await seedFlashcards(db)
  }
  const qCount = await db.count('quizQuestions')
  if (qCount === 0) {
    await seedQuiz(db)
  }
}

async function seedFlashcards(db: IDBPDatabase<AppDB>) {
  const cards = [
    { front: '公务员考试分为哪两类？', back: '行政职业能力测验（行测）和申论', category: '基础常识' },
    { front: '行测包含哪五个模块？', back: '言语理解、数量关系、判断推理、资料分析、常识判断', category: '基础常识' },
    { front: '申论主要考查什么能力？', back: '阅读理解、综合分析、提出和解决问题、文字表达能力', category: '申论' },
    { front: '国家公务员局成立于哪一年？', back: '2006年', category: '时政常识' },
    { front: '《行政许可法》规定行政许可的实施主体有哪些？', back: '行政机关、经授权的组织、受委托的行政机关', category: '行政法' },
    { front: '行政处罚的种类有哪些？', back: '警告、罚款、没收违法所得、责令停产停业、暂扣或吊销许可证、行政拘留', category: '行政法' },
    { front: '中国梦的核心内涵是什么？', back: '国家富强、民族振兴、人民幸福', category: '时政常识' },
    { front: '申论写作中"总分总"结构的作用？', back: '开头亮观点、中间分论点论证、结尾升华总结，结构清晰易得分', category: '申论' },
  ]
  for (const c of cards) {
    await db.add('flashcards', {
      ...c,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: new Date().toISOString(),
      due: true,
    })
  }
}

async function seedQuiz(db: IDBPDatabase<AppDB>) {
  const questions = [
    { question: '以下哪项不属于行政法的基本原则？', options: 'A.合法行政 B.合理行政 C.诚实信用 D.等价有偿', answer: 'D', type: '单选', category: '行政法' },
    { question: '行测中"类比推理"属于哪个模块？', options: 'A.言语理解 B.判断推理 C.数量关系 D.资料分析', answer: 'B', type: '单选', category: '基础常识' },
    { question: '以下成语使用正确的是？', options: 'A.首当其冲 B.望其项背 C.差强人意 D.炙手可热', answer: 'C', type: '单选', category: '言语理解' },
    { question: '2+4+6+...+100的结果是？', options: 'A.2450 B.2550 C.2600 D.2700', answer: 'B', type: '单选', category: '数量关系' },
    { question: '下列哪项是必要条件假言命题？', options: 'A.只有P，才Q B.如果P，那么Q C.只要P，就Q D.当且仅当P，则Q', answer: 'A', type: '单选', category: '判断推理' },
    { question: '关于"十四五"规划，以下说法正确的是？', options: 'A.2020-2024年 B.2021-2025年 C.2022-2026年 D.2023-2027年', answer: 'B', type: '单选', category: '常识判断' },
  ]
  for (const q of questions) {
    await db.add('quizQuestions', q)
  }
}
