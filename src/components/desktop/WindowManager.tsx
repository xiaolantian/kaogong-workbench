import { useDesktopStore } from '../../store/desktopStore'
import WindowFrame from './WindowFrame'
import TimerModule from '../../modules/timer/TimerModule'
import FlashcardModule from '../../modules/flashcards/FlashcardModule'
import PlannerModule from '../../modules/planner/PlannerModule'
import QuizModule from '../../modules/quiz/QuizModule'
import NewsModule from '../../modules/news/NewsModule'

const moduleComponents: Record<string, React.ComponentType> = {
  timer: TimerModule,
  flashcards: FlashcardModule,
  planner: PlannerModule,
  quiz: QuizModule,
  news: NewsModule,
}

export default function WindowManager() {
  const windows = useDesktopStore(s => s.windows)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows.map(win => {
        if (win.minimized) return null
        const Mod = moduleComponents[win.moduleId]
        return (
          <WindowFrame key={win.id} id={win.id} title={win.title}>
            {Mod ? <Mod /> : <div className="p-4 text-gray-400">模块加载中...</div>}
          </WindowFrame>
        )
      })}
    </div>
  )
}