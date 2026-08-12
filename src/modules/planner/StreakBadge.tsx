interface Props { streak: number }

export default function StreakBadge({ streak }: Props) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100">
      <span className="text-sm">🔥</span>
      <span className="text-xs font-cn text-orange-700">{streak} 天</span>
    </div>
  )
}