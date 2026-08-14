import { useEffect, useMemo, useRef, useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function makeStars() {
  const rand = seededRandom(20260814)
  const stars: { x: number; y: number; size: number; color: string; opacity: number; twinkleDur: number; twinkleDelay: number }[] = []
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#fbbf24', '#f0abfc', '#c084fc']
  for (let i = 0; i < 180; i++) {
    const size = rand()
    let s: number, c: string
    if (size < 0.72) { s = 1; c = colors[0] }
    else if (size < 0.90) { s = 1.5; c = colors[0] }
    else if (size < 0.96) { s = 2; c = colors[1] }
    else if (size < 0.99) { s = 2.5; c = colors[2] }
    else { s = 3; c = colors[3] }
    stars.push({
      x: Math.round(rand() * 1920),
      y: Math.round(rand() * 1080),
      size: s,
      color: c,
      opacity: 0.4 + rand() * 0.6,
      twinkleDur: 2 + rand() * 5,
      twinkleDelay: -rand() * 7,
    })
  }
  return stars
}

function makeNebulaClouds() {
  return [
    { x: 12, y: 18, w: 360, h: 240, color: 'rgba(240,71,140,0.22)', dur: 32, delay: 0 },
    { x: 68, y: 55, w: 320, h: 260, color: 'rgba(251,191,36,0.16)', dur: 28, delay: -4 },
    { x: 45, y: 38, w: 280, h: 220, color: 'rgba(192,132,252,0.20)', dur: 36, delay: -8 },
    { x: 78, y: 14, w: 220, h: 180, color: 'rgba(240,71,140,0.12)', dur: 30, delay: -12 },
    { x: 18, y: 74, w: 200, h: 160, color: 'rgba(251,191,36,0.10)', dur: 34, delay: -6 },
    { x: 52, y: 82, w: 180, h: 140, color: 'rgba(192,132,252,0.14)', dur: 40, delay: -10 },
  ]
}

function makeShootingStars() {
  return [
    { delay: 0,   dur: 4.8, angle: 45, x: 4,  y: -10, tailColor: 'rgba(240,171,252,0.7)',  tailLen: 180, twinkleDur: 5 },
    { delay: 3.2, dur: 5.5, angle: 45, x: 22, y: -10, tailColor: 'rgba(251,191,36,0.65)', tailLen: 200, twinkleDur: 4 },
    { delay: 6.8, dur: 5.2, angle: 45, x: 38, y: -10, tailColor: 'rgba(192,132,252,0.7)', tailLen: 160, twinkleDur: 6 },
    { delay: 9.5, dur: 6.0, angle: 45, x: 8,  y: 6,   tailColor: 'rgba(240,171,252,0.65)', tailLen: 220, twinkleDur: 4.5 },
    { delay: 2.0, dur: 5.0, angle: 45, x: -4, y: 58,  tailColor: 'rgba(255,255,255,0.75)',tailLen: 200, twinkleDur: 4.2 },
  ]
}

export default function GalaxyBackground() {
  const { activeTheme } = useSettingsStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(false)
    if (activeTheme === 'galaxy') {
      setTimeout(() => setMounted(true), 10)
    }
  }, [activeTheme])

  const stars = useMemo(makeStars, [])
  const nebulae = useMemo(makeNebulaClouds, [])
  const shooters = useMemo(makeShootingStars, [])

  if (activeTheme !== 'galaxy') return null

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 120% 80% at 50% 120%, rgba(67,20,150,0.5) 0%, transparent 60%),' +
          'radial-gradient(ellipse 100% 60% at 30% -10%, rgba(124,58,237,0.4) 0%, transparent 55%)',
      }}
    >
      {/* 星云云雾层 */}
      {nebulae.map((n, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: n.w,
            height: n.h,
            background: `radial-gradient(ellipse at center, ${n.color} 0%, transparent 70%)`,
            filter: 'blur(30px)',
            opacity: mounted ? 1 : 0,
            transition: `opacity 1.5s ease ${i * 0.2}s`,
            animation: `galaxy-nebula-pulse ${n.dur}s ease-in-out ${n.delay}s infinite alternate`,
          }}
        />
      ))}

      {' '}

      {/* 静态繁星层（box-shadow 高性能） */}
      <div
        className="absolute inset-0"
        style={{
          width: 2,
          height: 2,
          borderRadius: '50%',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease 0.3s',
          animation: 'galaxy-star-twinkle-base 6s ease-in-out infinite alternate',
          boxShadow: stars
            .filter(s => s.size === 1)
            .map(s => `${s.x}px ${s.y}px 0 ${s.color}`)
            .join(', '),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          width: 1,
          height: 1,
          borderRadius: '50%',
          opacity: mounted ? 0.8 : 0,
          transition: 'opacity 1.2s ease 0.5s',
          animation: 'galaxy-star-twinkle-1 4s ease-in-out infinite alternate',
          boxShadow: stars
            .filter(s => s.size === 1.5)
            .map(s => `${s.x}px ${s.y}px 1px ${s.color}`)
            .join(', '),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          width: 1,
          height: 1,
          borderRadius: '50%',
          opacity: mounted ? 0.9 : 0,
          transition: 'opacity 1.2s ease 0.7s',
          animation: 'galaxy-star-twinkle-2 3s ease-in-out infinite alternate',
          boxShadow: stars
            .filter(s => s.size >= 2)
            .map(s => `${s.x}px ${s.y}px 2px ${s.color}`)
            .join(', '),
        }}
      />

      {/* 独立闪烁亮点 */}
      {stars
        .filter(s => s.size >= 2.5)
        .map((s, i) => (
          <span
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              boxShadow: `0 0 ${s.size * 3}px ${s.color}, 0 0 ${s.size * 6}px ${s.color}`,
              opacity: mounted ? s.opacity : 0,
              transition: `opacity 1.5s ease ${0.3 + i * 0.1}s`,
              animation: `galaxy-star-pulse ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite`,
            }}
          />
        ))}

      {/* 流星层 */}
      {shooters.map((ss, i) => (
        <div
          key={`shooter-${i}`}
          className="absolute"
          style={{
            left: `${ss.x}%`,
            top: `${ss.y}%`,
            width: 4,
            height: 4,
            borderRadius: '50%',
            transformOrigin: 'center',
            animation: `galaxy-meteor-move-${i} ${ss.dur}s cubic-bezier(0.42, 0, 0.58, 1) ${ss.delay}s infinite`,
            opacity: 0,
            zIndex: 5,
          }}
        >
          <div
            className="absolute"
            style={{
              width: ss.tailLen,
              height: 2,
              right: '100%',
              top: 1,
              margin: '0 0 0 0',
              background: `linear-gradient(90deg, transparent 0%, ${ss.tailColor} 50%, rgba(255,255,255,0.9) 92%, #ffffff 100%)`,
              borderRadius: '1px',
              filter: 'blur(0.3px)',
              transform: `rotate(${ss.angle}deg)`,
              transformOrigin: '100% 50%',
              opacity: 0.9,
              animation: `galaxy-meteor-tail-${i} ${ss.dur}s cubic-bezier(0.42, 0, 0.58, 1) ${ss.delay}s infinite`,
            }}
          />
          <div
            className="absolute"
            style={{
              right: -4,
              top: -4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: `radial-gradient(circle, #ffffff 0%, ${ss.tailColor} 40%, transparent 70%)`,
              filter: 'blur(1px)',
              opacity: 0.5,
              animation: `galaxy-meteor-halo-${i} ${ss.dur}s cubic-bezier(0.42, 0, 0.58, 1) ${ss.delay}s infinite`,
            }}
          />
          <div
            className="absolute"
            style={{
              right: -1,
              top: -1,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: `radial-gradient(circle, #ffffff 0%, ${ss.tailColor} 60%, transparent 80%)`,
              boxShadow: `0 0 6px ${ss.tailColor}, 0 0 12px ${ss.tailColor}`,
              animation: `galaxy-meteor-sparkle-${i} ${ss.twinkleDur}s ease-in-out ${ss.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
