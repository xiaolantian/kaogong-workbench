import { useDesktopStore } from '../../store/desktopStore'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import OceanBackground from './OceanBackground'
import GalaxyBackground from './GalaxyBackground'
import TimerModule from '../../modules/timer/TimerModule'
import FlashcardModule from '../../modules/flashcards/FlashcardModule'
import PlannerModule from '../../modules/planner/PlannerModule'
import QuizModule from '../../modules/quiz/QuizModule'
import NewsModule from '../../modules/news/NewsModule'
import StoreModule from '../../modules/store/StoreModule'
import type { ModuleId } from '../../types'
import type { QuizQuestion } from '../../db/quiz'
import type { Flashcard } from '../../db/flashcard'
import type { CachedNewsItem } from '../../db/newsCache'

interface PreloadedData {
  questions: QuizQuestion[]
  flashcards: Flashcard[]
  newsItems: CachedNewsItem[]
}

interface AppLayoutProps {
  preloaded: PreloadedData
}

const modules: Record<ModuleId, React.ComponentType<any>> = {
  timer: TimerModule,
  flashcards: FlashcardModule,
  planner: PlannerModule,
  quiz: QuizModule,
  news: NewsModule,
  store: StoreModule,
}

export default function AppLayout({ preloaded }: AppLayoutProps) {
  const { activeModuleId } = useDesktopStore()
  const ModuleComponent = modules[activeModuleId]
  const moduleProps: Record<string, unknown> = {}
  if (activeModuleId === 'quiz') moduleProps.preloaded = preloaded.questions
  else if (activeModuleId === 'flashcards') moduleProps.preloaded = preloaded.flashcards
  else if (activeModuleId === 'news') moduleProps.preloaded = preloaded.newsItems

  return (
    <div className="flex h-screen w-screen overflow-hidden relative z-10">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col h-full">
        <div className="md:hidden">
          <Header />
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-16 pb-20 md:px-6 md:pt-6 md:pb-6 lg:px-8 lg:pt-8 lg:pb-8 relative"
        >
          <OceanBackground />
          <GalaxyBackground />
          <div className="relative z-10 max-w-5xl mx-auto h-full">
            {ModuleComponent ? (
              <ModuleComponent {...moduleProps} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-cn">
                模块加载中...
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
