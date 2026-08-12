import { useMascotStore } from '../../store/mascotStore'

interface Props {
  size?: number
}

export default function MascotAvatar({ size = 60 }: Props) {
  const { mood } = useMascotStore()

  const eyeStyle = mood === 'sleepy' ? 'M0 0 L8 0' : 'M0 0 Q4 -4 8 0'
  const mouthStyle = mood === 'happy' || mood === 'celebrate'
    ? 'M-8 6 Q0 14 8 6'
    : mood === 'sad'
      ? 'M-6 10 Q0 4 6 10'
      : 'M-4 8 L4 8'

  return (
    <svg width={size} height={size} viewBox="-40 -40 80 80" className="inline-block">
      <style>{`
        @keyframes breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
        @keyframes blink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        .mascot-body { animation: breathe 2s ease-in-out infinite; transform-origin: center bottom; }
        .mascot-eye { animation: blink 4s ease-in-out infinite; transform-origin: center; }
      `}</style>
      <g className="mascot-body">
        <ellipse cx="0" cy="10" rx="24" ry="22" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2"/>
        <polygon points="-20,-12 -28,-28 -12,-16" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2"/>
        <polygon points="20,-12 28,-28 12,-16" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2"/>
        <polygon points="-18,-10 -24,-22 -14,-14" fill="#FFCC80"/>
        <polygon points="18,-10 24,-22 14,-14" fill="#FFCC80"/>
        <ellipse cx="-8" cy="4" rx="4" ry="5" fill="#333" className="mascot-eye"/>
        <ellipse cx="8" cy="4" rx="4" ry="5" fill="#333" className="mascot-eye"/>
        <path d={eyeStyle} fill="none" stroke="#333" strokeWidth="1.5" className="mascot-eye"/>
        <circle cx="0" cy="12" r="2" fill="#FF6B6B"/>
        <path d={mouthStyle} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
        <path d="M-16 0 L-22 -2 M-16 4 L-22 4 M16 0 L22 -2 M16 4 L22 4" stroke="#333" strokeWidth="1"/>
      </g>
      {mood === 'focus' && (
        <path d="M-22 -25 L22 -25 L18 -32 L-18 -32 Z" fill="#2C3E50"/>
      )}
    </svg>
  )
}
