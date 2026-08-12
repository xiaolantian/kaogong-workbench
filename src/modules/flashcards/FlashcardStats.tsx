interface Props { dueCount: number }

export default function FlashcardStats({ dueCount }: Props) {
  const days = [30, 15, 7, 3, 1, 0]
  const curve = days.map((d) => ({
    day: d,
    retention: Math.round((100 * Math.exp(-d / 30)))
  }))

  return (
    <div className="mt-2 p-3 rounded-xl bg-gray-50">
      <h4 className="text-xs font-cn text-gray-600 mb-1">遗忘曲线（复习越多遗忘越慢）</h4>
      <div className="flex items-end gap-0.5 h-8">
        {curve.map((p, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full rounded-t bg-mint"
              style={{ height: `${Math.max(4, p.retention)}%` }} />
            <span className="text-[9px] text-gray-400">{p.day}d</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-center">
        待复习 {dueCount} 张 · SM-2 算法自动安排
      </p>
    </div>
  )
}
