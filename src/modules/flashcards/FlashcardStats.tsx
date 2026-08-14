interface Props { dueCount: number }

export default function FlashcardStats({ dueCount }: Props) {
  const days = [30, 15, 7, 3, 1, 0]
  const curve = days.map((d) => ({
    day: d,
    retention: Math.round(100 * Math.exp(-d / 30)),
  }))

  return (
    <div className="soft-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-cn text-gray-600 font-bold">
          📉 遗忘曲线
        </h4>
        <span className="text-[10px] text-gray-400 font-cn">
          待复习 <span className="font-en font-bold text-purple-600">{dueCount}</span> 张
        </span>
      </div>
      <div className="flex items-end gap-0.5 h-12">
        {curve.map((p, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-t"
              style={{
                height: `${Math.max(6, p.retention)}%`,
                background: `hsl(${140 + i * 15}, 70%, 70%)`,
              }}
            />
            <span className="text-[9px] text-gray-400">{p.day}d</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center font-cn">
        SM-2 算法自动安排复习计划
      </p>
    </div>
  )
}
