import { useEffect, useRef, useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import { seedDefaultData } from './db/database'
import { cleanUpDirtyData } from './db/points'
import { getFromCache } from './db/newsCache'
import { getQuestions } from './db/quiz'
import { getDueCards } from './db/flashcard'
import { usePointsStore } from './store/pointsStore'
import { useMascotStore } from './store/mascotStore'
import { useSettingsStore } from './store/settingsStore'
import type { QuizQuestion } from './db/quiz'
import type { Flashcard } from './db/flashcard'
import type { CachedNewsItem } from './db/newsCache'

interface PreloadedData {
  questions: QuizQuestion[]
  flashcards: Flashcard[]
  newsItems: CachedNewsItem[]
}

export default function App() {
  const [preloaded, setPreloaded] = useState<PreloadedData | null>(null)
  const initialized = useRef(false)
  const { activeTheme } = useSettingsStore()

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    const allThemeClasses = [
      'theme-day', 'theme-night', 'theme-sakura', 'theme-forest', 'theme-ocean', 'theme-galaxy',
    ]
    root.classList.remove(...allThemeClasses)
    root.classList.add(`theme-${activeTheme}`)
  }, [activeTheme])

  useEffect(() => {
    const init = async () => {
      try { await cleanUpDirtyData() } catch {}
      await seedDefaultData()
      usePointsStore.getState().loadPoints()
      useMascotStore.getState().computeStreak()

      const results = await Promise.allSettled([
        getQuestions(),
        getDueCards(),
        getFromCache(),
      ]) as [
        PromiseSettledResult<QuizQuestion[]>,
        PromiseSettledResult<Flashcard[]>,
        PromiseSettledResult<CachedNewsItem[]>,
      ]
      const questions = results[0].status === 'fulfilled' ? results[0].value : []
      const flashcards = results[1].status === 'fulfilled' ? results[1].value : []
      const newsItems = results[2].status === 'fulfilled' ? results[2].value : []

      if (!initialized.current) {
        initialized.current = true
        setPreloaded({ questions, flashcards, newsItems })
      }
    }

    const timer = setTimeout(() => {
      if (!initialized.current) {
        initialized.current = true
        setPreloaded({ questions: [], flashcards: [], newsItems: [] })
      }
    }, 5000)

    void init().then(() => clearTimeout(timer))
  }, [])

  if (!preloaded) {
    return (
      <div
        className="flex items-center justify-center h-screen w-screen"
        style={{
          background: 'linear-gradient(135deg, #faf7ff 0%, #f5f0ff 50%, #f0e6ff 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500 font-cn">应用启动中...</span>
        </div>
      </div>
    )
  }

  return <AppLayout preloaded={preloaded} />
}