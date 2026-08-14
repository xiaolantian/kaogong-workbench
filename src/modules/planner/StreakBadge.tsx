import { Flame } from 'lucide-react'

interface Props { streak: number }

export default function StreakBadge({ streak }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: 'var(--card-bg)',
        border: '2px solid #f5a623',
        boxShadow: '3px 3px 0 #f5a623',
      }}
    >
      <Flame size={16} color="#ea580c" strokeWidth={2} />
      <span className="text-xs font-cn font-bold text-orange-700">
        连续 <span className="font-en">{streak}</span> 天
      </span>
    </div>
  )
}
