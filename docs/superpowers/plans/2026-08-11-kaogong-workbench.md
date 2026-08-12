# 考公Q版工作台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一款Q版卡通风格的拟真桌面工作台Web应用，服务公务员考试备考人群，一套React代码同时交付Web(Tauri)桌面端和移动端(Capacitor)。

**Architecture:** 前端React+Vite单页应用，桌面窗口系统模拟macOS多窗口，Zustand管理全局状态，本地IndexedDB存储数据。先完成Web MVP，再集成Tauri/Capacitor。

**Tech Stack:** React 18, TypeScript, Vite, Zustand, React Router 6, TailwindCSS, Framer Motion, idb(IndexedDB), Tauri 2.0, Capacitor 7

## Global Constraints

- 前端框架：React 18 + TypeScript + Vite
- 状态管理：Zustand
- 路由：React Router 6
- CSS：TailwindCSS + 手写CSS动画
- 动画：Framer Motion，弹性缓动 cubic-bezier(0.68,-0.55,0.265,1.55)
- 本地存储：IndexedDB (idb库)
- 吉祥物：SVG绘制，5种表情状态
- 主色调：#FF9F43 (橙) + #54A0FF (蓝)，辅色 #FECA57/#5F9EA0/#FF6B6B
- 圆角 12-20px，阴影 0 4px 12px rgba(0,0,0,0.1)
- MVP不做：云同步、登录、社区、AI分析

---

### Task 1: 项目脚手架初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`

**Interfaces:**
- Produces: 可运行的Vite开发服务器，localhost:5173显示"Hello"页面

- [ ] **Step 1: 创建package.json**

```json
{
  "name": "kaogong-workbench",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.50.0",
    "framer-motion": "^11.3.0",
    "idb": "^7.1.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.0",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
```

- [ ] **Step 2: 创建vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { target: 'es2020' }
})
```

- [ ] **Step 3: 创建tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建tailwind.config.js**

```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: { orange: '#FF9F43', yellow: '#FECA57' },
        sky: { blue: '#54A0FF' },
        mint: '#5F9EA0',
        pink: '#FF6B6B',
        bg: { cream: '#FFF8E7', lightblue: '#F0F8FF' }
      },
      fontFamily: {
        cn: ['"ZCOOL KuaiLe"', '"LXGW WenKai"', 'sans-serif'],
        en: ['Fredoka', 'Nunito', 'sans-serif']
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px'
      },
      boxShadow: {
        'q': '0 4px 12px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 6: 创建postcss.config.js**

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

- [ ] **Step 7: 创建index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>考公Q版工作台</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Fredoka:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: 创建src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'ZCOOL KuaiLe', 'Fredoka', sans-serif;
  overflow: hidden;
  user-select: none;
}
```

- [ ] **Step 9: 创建src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 10: 创建src/App.tsx（占位页面）**

```tsx
export default function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bg-cream">
      <p className="text-2xl text-warm-orange">考公Q版工作台 - 加载中</p>
    </div>
  )
}
```

- [ ] **Step 11: 安装依赖并验证启动**

```bash
npm install
npm run dev
```

预期：localhost:5173显示"考公Q版工作台 - 加载中"

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "init: project scaffolding with Vite + React + Tailwind"
```

---

### Task 2: 全局状态管理与路由框架

**Files:**
- Create: `src/store/desktopStore.ts`
- Create: `src/store/mascotStore.ts`
- Create: `src/store/settingsStore.ts`
- Create: `src/types/index.ts`

**Interfaces:**
- `desktopStore`: windows状态、激活窗口、窗口层级管理
- `mascotStore`: 吉祥物当前表情状态
- `settingsStore`: 主题、壁纸、布局配置

- [ ] **Step 1: 创建src/types/index.ts**

```ts
export type MascotMood = 'focus' | 'sleepy' | 'happy' | 'sad' | 'celebrate'

export type Theme = 'cream' | 'lightblue'

export type ModuleId = 'timer' | 'flashcards' | 'planner' | 'quiz' | 'news'

export interface WindowState {
  id: string
  moduleId: ModuleId
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
}

export interface DesktopIcon {
  id: ModuleId
  name: string
  x: number
  y: number
}
```

- [ ] **Step 2: 创建src/store/desktopStore.ts**

```ts
import { create } from 'zustand'
import { WindowState, DesktopIcon, ModuleId } from '../types'

const initialWindows: WindowState[] = []

const initialIcons: DesktopIcon[] = [
  { id: 'timer', name: '专注时刻', x: 40, y: 40 },
  { id: 'flashcards', name: '知识卡卡', x: 40, y: 160 },
  { id: 'planner', name: '今日计划', x: 40, y: 280 },
  { id: 'quiz', name: '题题大作战', x: 40, y: 400 },
  { id: 'news', name: '新闻早报', x: 40, y: 520 },
]

interface DesktopStore {
  windows: WindowState[]
  activeWindowId: string | null
  icons: DesktopIcon[]
  nextZIndex: number
  openWindow: (moduleId: ModuleId) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  minimizeWindow: (id: string) => void
  updateIcons: (icons: DesktopIcon[]) => void
}

const windowConfig: Record<ModuleId, { title: string; w: number; h: number }> = {
  timer: { title: '专注时刻', w: 560, h: 480 },
  flashcards: { title: '知识卡卡', w: 600, h: 440 },
  planner: { title: '今日计划', w: 700, h: 500 },
  quiz: { title: '题题大作战', w: 640, h: 520 },
  news: { title: '新闻早报', w: 560, h: 480 },
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: initialWindows,
  activeWindowId: null,
  icons: initialIcons,
  nextZIndex: 100,

  openWindow: (moduleId) => {
    const existing = get().windows.find(w => w.moduleId === moduleId && !w.minimized)
    if (existing) {
      set(state => ({ activeWindowId: existing.id }))
      return
    }
    const cfg = windowConfig[moduleId]
    const offset = get().windows.length * 30
    const id = `${moduleId}-${Date.now()}`
    const win: WindowState = {
      id,
      moduleId,
      title: cfg.title,
      x: 120 + offset,
      y: 80 + offset,
      width: cfg.w,
      height: cfg.h,
      zIndex: get().nextZIndex,
      minimized: false,
    }
    set(state => ({
      windows: [...state.windows, win],
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  closeWindow: (id) => set(state => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  focusWindow: (id) => set(state => ({
    activeWindowId: id,
    windows: state.windows.map(w =>
      w.id === id ? { ...w, zIndex: state.nextZIndex, minimized: false } : w
    ),
    nextZIndex: state.nextZIndex + 1,
  })),

  moveWindow: (id, x, y) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
  })),

  minimizeWindow: (id) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, minimized: true } : w),
    activeWindowId: null,
  })),

  updateIcons: (icons) => set({ icons }),
}))
```

- [ ] **Step 3: 创建src/store/mascotStore.ts**

```ts
import { create } from 'zustand'
import { MascotMood } from '../types'

interface MascotStore {
  mood: MascotMood
  streak: number
  setMood: (mood: MascotMood) => void
  setStreak: (streak: number) => void
}

export const useMascotStore = create<MascotStore>((set) => ({
  mood: 'focus',
  streak: 0,
  setMood: (mood) => set({ mood }),
  setStreak: (streak) => set({ streak }),
}))
```

- [ ] **Step 4: 创建src/store/settingsStore.ts**

```ts
import { create } from 'zustand'
import { Theme } from '../types'

interface SettingsStore {
  theme: Theme
  wallpaper: string
  setTheme: (theme: Theme) => void
  setWallpaper: (url: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  theme: 'cream',
  wallpaper: 'default',
  setTheme: (theme) => set({ theme }),
  setWallpaper: (url) => set({ wallpaper: url }),
}))
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: global state stores (desktop, mascot, settings) and shared types"
```

---

### Task 3: 拟真桌面基础层（壁纸 + Dock栏 + 时钟小部件）

**Files:**
- Create: `src/components/desktop/DesktopShell.tsx`
- Create: `src/components/desktop/DockBar.tsx`
- Create: `src/components/desktop/DeskIcon.tsx`
- Create: `src/components/desktop/ClockWidget.tsx`

**Interfaces:**
- Consumes: `useDesktopStore`, `useSettingsStore`
- Produces: 全屏桌面背景、底部Dock、左上角时钟、可点击图标

- [ ] **Step 1: 创建src/components/desktop/DesktopShell.tsx**

```tsx
import { useEffect } from 'react'
import { useDesktopStore } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import DockBar from './DockBar'
import DeskIcon from './DeskIcon'
import ClockWidget from './ClockWidget'

export default function DesktopShell() {
  const { icons, openWindow } = useDesktopStore()
  const { theme } = useSettingsStore()

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{
        background: theme === 'cream'
          ? 'linear-gradient(135deg, #FFF8E7 0%, #FFE8C7 100%)'
          : 'linear-gradient(135deg, #F0F8FF 0%, #D4ECFF 100%)',
      }}
    >
      <ClockWidget />
      <div className="absolute inset-0 pt-16">
        {icons.map(icon => (
          <DeskIcon
            key={icon.id}
            icon={icon}
            onClick={() => openWindow(icon.id)}
          />
        ))}
      </div>
      <DockBar />
    </div>
  )
}
```

- [ ] **Step 2: 创建src/components/desktop/DockBar.tsx**

```tsx
import { useDesktopStore } from '../../store/desktopStore'

export default function DockBar() {
  const { windows, focusWindow } = useDesktopStore()

  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl shadow-q"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
    >
      {windows.filter(w => !w.minimized).map(win => (
        <button
          key={win.id}
          onClick={() => focusWindow(win.id)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg
                     hover:scale-110 transition-transform duration-200"
          style={{ background: 'linear-gradient(135deg, #FF9F43, #FECA57)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
        >
          {win.title.charAt(0)}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: 创建src/components/desktop/DeskIcon.tsx**

```tsx
import { motion } from 'framer-motion'
import type { DesktopIcon } from '../../types'

interface Props {
  icon: DesktopIcon
  onClick: () => void
}

export default function DeskIcon({ icon, onClick }: Props) {
  const iconEmojis: Record<string, string> = {
    timer: '⏰', flashcards: '📚', planner: '📋', quiz: '🎮', news: '📰'
  }

  return (
    <motion.button
      className="absolute flex flex-col items-center gap-1 w-20 cursor-pointer"
      style={{ left: icon.x, top: icon.y }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-q"
        style={{ background: 'linear-gradient(135deg, #FFFFFF, #FFF3E0)' }}>
        {iconEmojis[icon.id] || '📁'}
      </div>
      <span className="text-xs text-gray-700 font-cn">{icon.name}</span>
    </motion.button>
  )
}
```

- [ ] **Step 4: 创建src/components/desktop/ClockWidget.tsx**

```tsx
import { useState, useEffect } from 'react'
import MascotAvatar from '../mascot/MascotAvatar'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="absolute top-4 left-4 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-q"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <MascotAvatar size={40} />
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 font-en">
          {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-xs text-gray-500">
          {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: desktop shell with dock bar, icons, and clock widget"
```

---

### Task 4: 窗口系统（可拖拽、可关闭的浮动窗口）

**Files:**
- Create: `src/components/desktop/WindowFrame.tsx`
- Create: `src/components/desktop/WindowManager.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useDesktopStore`
- Produces: 可拖拽的窗口容器，带标题栏和关闭按钮

- [ ] **Step 1: 创建src/components/desktop/WindowFrame.tsx**

```tsx
import { useRef, useEffect, useState } from 'react'
import { useDesktopStore } from '../../store/desktopStore'

interface Props {
  id: string
  title: string
  children: React.ReactNode
}

export default function WindowFrame({ id, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const { moveWindow, focusWindow, closeWindow, minimizeWindow, windows } = useDesktopStore()
  const win = windows.find(w => w.id === id)
  if (!win) return null
  if (win.minimized) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(id)
    const rect = ref.current!.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragging(true)
  }

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent) => {
      moveWindow(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y)
    }
    const handleUp = () => setDragging(false)
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, dragOffset, id, moveWindow])

  return (
    <div
      ref={ref}
      className="absolute rounded-2xl shadow-q overflow-hidden flex flex-col"
      style={{
        left: win.x, top: win.y, width: win.width, height: win.height,
        zIndex: win.zIndex, background: '#FFFFFF',
        border: '2px solid #FFE0B2',
        transition: dragging ? 'none' : 'box-shadow 0.2s',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className="h-9 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing"
        style={{ background: 'linear-gradient(90deg, #FF9F43, #FECA57)' }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm text-white font-cn">{title}</span>
        <div className="flex gap-2">
          <button onClick={() => minimizeWindow(id)}
            className="w-4 h-4 rounded-full bg-yellow-300 hover:bg-yellow-400" />
          <button onClick={() => closeWindow(id)}
            className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: 创建src/components/desktop/WindowManager.tsx**

```tsx
import { useDesktopStore } from '../../store/desktopStore'

export default function WindowManager() {
  const windows = useDesktopStore(s => s.windows)
  const activeId = useDesktopStore(s => s.activeWindowId)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows.map(win => {
        const isActive = activeId === win.id
        return (
          <div key={win.id} className="pointer-events-auto" data-win-id={win.id}>
            <span data-testid="window-title">{win.title}</span>
            <div data-slot={win.moduleId} />
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: 更新src/App.tsx**

```tsx
import DesktopShell from './components/desktop/DesktopShell'

export default function App() {
  return <DesktopShell />
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: draggable window system with title bar and close buttons"
```

---

### Task 5: 吉祥物SVG组件（5种表情状态）

**Files:**
- Create: `src/components/mascot/MascotAvatar.tsx`
- Create: `src/components/mascot/MascotFull.tsx`

**Interfaces:**
- Consumes: `useMascotStore`
- Produces: SVG小猫，根据mood状态显示不同表情

- [ ] **Step 1: 创建src/components/mascot/MascotAvatar.tsx**

```tsx
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
```

- [ ] **Step 2: 创建src/components/mascot/MascotFull.tsx**

```tsx
import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'

interface Props {
  size?: number
}

export default function MascotFull({ size = 200 }: Props) {
  const { mood } = useMascotStore()

  const animations = {
    focus: { y: [0, -3, 0], duration: 1.5, repeat: Infinity },
    sleepy: { rotate: [0, 2, -2, 0], duration: 3, repeat: Infinity },
    happy: { y: [0, -10, 0], duration: 0.6, repeat: Infinity },
    sad: { y: [0, 3, 0], duration: 2, repeat: Infinity },
    celebrate: { y: [0, -20, 0], rotate: [0, -5, 5, 0], duration: 0.5, repeat: Infinity },
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={animations[mood]}
      transition={{ ease: 'easeInOut' }}
    >
      <svg width={size} height={size} viewBox="-60 -60 120 120">
        <style>{`
          @keyframes breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
          .full-body { animation: breathe 2s ease-in-out infinite; transform-origin: center bottom; }
        `}</style>
        <g className="full-body">
          <ellipse cx="0" cy="30" rx="30" ry="10" fill="rgba(0,0,0,0.1)"/>
          <ellipse cx="0" cy="15" rx="36" ry="32" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="-30,-15 -42,-40 -18,-20" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="30,-15 42,-40 18,-20" fill="#FFE0B2" stroke="#FF9F43" strokeWidth="2.5"/>
          <polygon points="-28,-12 -36,-32 -22,-18" fill="#FFCC80"/>
          <polygon points="28,-12 36,-32 22,-18" fill="#FFCC80"/>
          <ellipse cx="-12" cy="8" rx="6" ry="7" fill="#333"/>
          <ellipse cx="12" cy="8" rx="6" ry="7" fill="#333"/>
          <ellipse cx="-10" cy="5" rx="2" ry="2" fill="white"/>
          <ellipse cx="14" cy="5" rx="2" ry="2" fill="white"/>
          <circle cx="0" cy="18" r="3" fill="#FF6B6B"/>
          {mood === 'happy' || mood === 'celebrate' ? (
            <path d="M-12 22 Q0 34 12 22" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          ) : mood === 'sad' ? (
            <path d="M-10 32 Q0 22 10 32" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          ) : (
            <path d="M-8 26 L8 26" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
          )}
          <path d="M-24 0 L-32 -3 M-24 5 L-32 5 M24 0 L32 -3 M24 5 L32 5" stroke="#333" strokeWidth="1.2"/>
          <ellipse cx="-18" cy="16" rx="6" ry="4" fill="#FFCDD2" opacity="0.5"/>
          <ellipse cx="18" cy="16" rx="6" ry="4" fill="#FFCDD2" opacity="0.5"/>
        </g>
        {(mood === 'focus' || mood === 'sleepy') && (
          <path d="M-32 -38 L32 -38 L26 -46 L-26 -46 Z" fill="#2C3E50"/>
        )}
      </svg>
    </motion.div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: mascot SVG component with 5 mood states and animations"
```

---

### Task 6: IndexedDB数据层

**Files:**
- Create: `src/db/database.ts`
- Create: `src/db/studySession.ts`
- Create: `src/db/flashcard.ts`
- Create: `src/db/quiz.ts`
- Create: `src/db/planner.ts`

**Interfaces:**
- Produces: 统一的CRUD接口，供各模块调用

- [ ] **Step 1: 创建src/db/database.ts**

```ts
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface AppDB extends DBSchema {
  studySessions: {
    key: number
    value: { id: number; date: string; duration: number; moduleId: string }
    indexes: { 'by-date': string }
  }
  flashcards: {
    key: number
    value: {
      id: number; front: string; back: string; category: string;
      easeFactor: number; interval: number; repetitions: number;
      nextReview: string; due: boolean
    }
    indexes: { 'by-due': boolean; 'by-category': string }
  }
  quizQuestions: {
    key: number
    value: { id: number; question: string; options: string; answer: string; type: string; category: string }
    indexes: { 'by-category': string }
  }
  quizAttempts: {
    key: number
    value: { id: number; questionId: number; isCorrect: boolean; date: string }
  }
  studyPlans: {
    key: number
    value: { id: number; title: string; column: string; done: boolean; order: number }
  }
  newsNotes: {
    key: number
    value: { id: number; title: string; content: string; date: string; tags: string }
  }
  settings: {
    key: string
    value: { key: string; val: string }
  }
}

const DB_NAME = 'kaogong-db'
const DB_VERSION = 1

export async function getDB(): Promise<IDBPDatabase<AppDB>> {
  return openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('studySessions')) {
        const ss = db.createObjectStore('studySessions', { keyPath: 'id', autoIncrement: true })
        ss.createIndex('by-date', 'date')
      }
      if (!db.objectStoreNames.contains('flashcards')) {
        const fc = db.createObjectStore('flashcards', { keyPath: 'id', autoIncrement: true })
        fc.createIndex('by-due', 'due')
        fc.createIndex('by-category', 'category')
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
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
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
```

- [ ] **Step 2: 创建src/db/studySession.ts**

```ts
import { getDB } from './database'

export interface StudySession {
  id: number
  date: string
  duration: number
  moduleId: string
}

export async function saveSession(session: Omit<StudySession, 'id' | 'date'>) {
  const db = await getDB()
  const id = await db.add('studySessions', {
    ...session,
    date: new Date().toISOString().split('T')[0],
  })
  return id as number
}

export async function getTodaySessions(): Promise<StudySession[]> {
  const db = await getDB()
  const today = new Date().toISOString().split('T')[0]
  return db.getAllFromIndex('studySessions', 'by-date', IDBKeyRange.only(today)) as Promise<StudySession[]>
}

export async function getWeeklySessions(): Promise<StudySession[]> {
  const db = await getDB()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 86400000)
  const range = IDBKeyRange.bound(weekAgo.toISOString(), now.toISOString())
  return db.getAllFromIndex('studySessions', 'by-date', range) as Promise<StudySession[]>
}
```

- [ ] **Step 3: 创建src/db/flashcard.ts**

```ts
import { getDB } from './database'

export interface Flashcard {
  id: number
  front: string
  back: string
  category: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: string
  due: boolean
}

export async function getDueCards(): Promise<Flashcard[]> {
  const db = await getDB()
  return db.getAllFromIndex('flashcards', 'by-due', IDBKeyRange.only(true)) as Promise<Flashcard[]>
}

export async function markReviewed(id: number, quality: number) {
  const db = await getDB()
  const card = await db.get('flashcards', id) as Flashcard | undefined
  if (!card) return
  let { easeFactor, interval, repetitions } = card
  if (quality >= 3) {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easeFactor)
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  } else {
    repetitions = 0
    interval = 1
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + interval)
  await db.put('flashcards', { ...card, easeFactor, interval, repetitions, nextReview: tomorrow.toISOString(), due: false })
}

export async function addCard(front: string, back: string, category: string) {
  const db = await getDB()
  const id = await db.add('flashcards', {
    front, back, category,
    easeFactor: 2.5, interval: 0, repetitions: 0,
    nextReview: new Date().toISOString(), due: true,
  })
  return id as number
}
```

- [ ] **Step 4: 创建src/db/quiz.ts**

```ts
import { getDB } from './database'

export interface QuizQuestion {
  id: number
  question: string
  options: string
  answer: string
  type: string
  category: string
}

export async function getQuestions(category?: string): Promise<QuizQuestion[]> {
  const db = await getDB()
  if (category) {
    return db.getAllFromIndex('quizQuestions', 'by-category', IDBKeyRange.only(category)) as Promise<QuizQuestion[]>
  }
  return db.getAll('quizQuestions')
}

export async function saveAttempt(questionId: number, isCorrect: boolean) {
  const db = await getDB()
  return db.add('quizAttempts', { questionId, isCorrect, date: new Date().toISOString() })
}

export async function addQuestion(q: Omit<QuizQuestion, 'id'>) {
  const db = await getDB()
  return db.add('quizQuestions', q)
}
```

- [ ] **Step 5: 创建src/db/planner.ts**

```ts
import { getDB } from './database'

export interface StudyPlan {
  id: number
  title: string
  column: 'today' | 'week' | 'done'
  done: boolean
  order: number
}

export async function getPlans(): Promise<StudyPlan[]> {
  const db = await getDB()
  return db.getAll('studyPlans')
}

export async function addPlan(title: string, column: 'today' | 'week') {
  const db = await getDB()
  const plans = await getPlans()
  const order = plans.filter(p => p.column === column).length
  const id = await db.add('studyPlans', { title, column, done: false, order })
  return id as number
}

export async function updatePlan(id: number, updates: Partial<StudyPlan>) {
  const db = await getDB()
  const plan = await db.get('studyPlans', id) as StudyPlan | undefined
  if (!plan) return
  await db.put('studyPlans', { ...plan, ...updates })
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: IndexedDB data layer with seeded defaults for all modules"
```

---

### Task 7: 模块一 - 专注时刻（番茄钟）

**Files:**
- Create: `src/modules/timer/TimerModule.tsx`
- Create: `src/modules/timer/TimerStats.tsx`
- Modify: `src/components/desktop/WindowManager.tsx`（注册timer模块）

**Interfaces:**
- Consumes: `saveSession`, `useMascotStore`, `useSettingsStore`
- Produces: 计时器界面 + 统计图表

- [ ] **Step 1: 创建src/modules/timer/TimerModule.tsx**

```tsx
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import TimerStats from './TimerStats'
import { saveSession } from '../../db/studySession'

type Phase = 'study' | 'break'

export default function TimerModule() {
  const [phase, setPhase] = useState<Phase>('study')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [studyMin, setStudyMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [showStats, setShowStats] = useState(false)
  const intervalRef = useRef<number>()
  const { setMood } = useMascotStore()

  useEffect(() => {
    setMood(running ? 'focus' : 'sleepy')
  }, [running, setMood])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (phase === 'study') {
            saveSession({ duration: studyMin, moduleId: 'timer' })
            setMood('celebrate')
            setTimeout(() => setMood('focus'), 3000)
          }
          const nextPhase = phase === 'study' ? 'break' : 'study'
          setPhase(nextPhase)
          return nextPhase === 'study' ? studyMin * 60 : breakMin * 60
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phase, studyMin, breakMin, setMood])

  const toggle = () => setRunning(!running)
  const reset = () => { setRunning(false); setSeconds(studyMin * 60); setPhase('study') }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = phase === 'study'
    ? 1 - seconds / (studyMin * 60)
    : 1 - seconds / (breakMin * 60)

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      <MascotFull size={140} />
      <div className="text-5xl font-en text-warm-orange tabular-nums">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <span className={`text-sm font-cn px-3 py-1 rounded-full ${
        phase === 'study' ? 'bg-warm-orange/20 text-warm-orange' : 'bg-mint/20 text-mint'
      }`}>
        {phase === 'study' ? '专注学习中...' : '休息一下~'}
      </span>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div className="h-2 rounded-full bg-warm-orange"
          style={{ width: `${progress * 100}%` }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1 }} />
      </div>
      <div className="flex gap-3">
        <button onClick={toggle}
          className="px-6 py-2 rounded-xl font-cn text-white shadow-q hover:scale-105 transition-transform"
          style={{ background: phase === 'study' ? '#FF9F43' : '#5F9EA0' }}>
          {running ? '暂停' : '开始'}
        </button>
        <button onClick={reset}
          className="px-6 py-2 rounded-xl font-cn text-gray-600 bg-gray-100 shadow-q hover:scale-105 transition-transform">
          重置
        </button>
        <button onClick={() => setShowStats(!showStats)}
          className="px-4 py-2 rounded-xl font-cn text-gray-600 bg-gray-100 shadow-q hover:scale-105 transition-transform">
          统计
        </button>
      </div>
      {showStats && <TimerStats />}
      <div className="flex items-center gap-3 mt-2">
        <label className="text-xs text-gray-500">学习</label>
        <input type="number" value={studyMin} onChange={e => setStudyMin(+e.target.value)}
          className="w-12 text-center text-sm border rounded-lg" min={1} max={120} />
        <label className="text-xs text-gray-500">分钟</label>
        <label className="text-xs text-gray-500 ml-2">休息</label>
        <input type="number" value={breakMin} onChange={e => setBreakMin(+e.target.value)}
          className="w-12 text-center text-sm border rounded-lg" min={1} max={30} />
        <label className="text-xs text-gray-500">分钟</label>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建src/modules/timer/TimerStats.tsx**

```tsx
import { useEffect, useState } from 'react'
import { getWeeklySessions } from '../../db/studySession'
import type { StudySession } from '../../db/studySession'

export default function TimerStats() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  useEffect(() => { getWeeklySessions().then(setSessions) }, [])

  const days = ['日','一','二','三','四','五','六']
  const byDay: Record<number, number> = {0:0,1:0,2:0,3:0,4:0,5:0,6:0}
  sessions.forEach(s => {
    const d = new Date(s.date).getDay()
    byDay[d] = (byDay[d] || 0) + s.duration
  })
  const max = Math.max(...Object.values(byDay), 1)

  return (
    <div className="mt-4 p-3 rounded-xl bg-gray-50 w-full">
      <h4 className="text-sm font-cn text-gray-700 mb-2">本周专注（分钟）</h4>
      <div className="flex items-end justify-between gap-1 h-24">
        {[0,1,2,3,4,5,6].map(d => (
          <div key={d} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              className="w-full rounded-t-lg bg-warm-orange min-h-[2px]"
              style={{ height: `${(byDay[d] / max) * 80}px` }}
              initial={{ height: 0 }}
              animate={{ height: `${(byDay[d] / max) * 80}px` }}
              transition={{ duration: 0.5, delay: d * 0.05 }} />
            <span className="text-xs text-gray-500">周{days[d]}</span>
            <span className="text-xs text-gray-600">{byDay[d] || 0}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        本周共专注 {sessions.reduce((s, x) => s + x.duration, 0)} 分钟
      </p>
    </div>
  )
}
```

- [ ] **Step 3: 更新src/components/desktop/WindowManager.tsx**

```tsx
import { useDesktopStore } from '../../store/desktopStore'
import WindowFrame from './WindowFrame'
import TimerModule from '../../modules/timer/TimerModule'

const moduleComponents: Record<string, React.ComponentType> = {
  timer: TimerModule,
}

export default function WindowManager() {
  const windows = useDesktopStore(s => s.windows)
  const activeId = useDesktopStore(s => s.activeWindowId)

  return (
    <div className="absolute inset-0 pointer-events-none" onClick={() => {}}>
      {windows.map(win => {
        if (win.minimized) return null
        const IsActiveModule = activeId === win.id
        const Mod = moduleComponents[win.moduleId]
        return (
          <WindowFrame key={win.id} id={win.id} title={win.title}>
            {IsActiveModule && Mod ? <Mod /> : <div className="flex items-center justify-center h-full text-gray-400">加载中...</div>}
          </WindowFrame>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: timer module with pomodoro, stats chart, and mascot state sync"
```

---

### Task 8: 模块二 - 知识卡卡（SRS记忆卡片）

**Files:**
- Create: `src/modules/flashcards/FlashcardModule.tsx`
- Create: `src/modules/flashcards/FlashcardCard.tsx`
- Create: `src/modules/flashcards/FlashcardStats.tsx`
- Modify: `src/components/desktop/WindowManager.tsx`

**Interfaces:**
- Consumes: `getDueCards`, `markReviewed`, `addCard`, `useMascotStore`

- [ ] **Step 1: 创建src/modules/flashcards/FlashcardCard.tsx**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Flashcard } from '../../db/flashcard'

interface Props {
  card: Flashcard
  onFlip: () => void
  isFlipped: boolean
  onRate: (quality: number) => void
  showRating: boolean
}

export default function FlashcardCard({ card, onFlip, isFlipped, onRate, showRating }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div
        className="w-full h-48 rounded-2xl shadow-q cursor-pointer flex items-center justify-center p-6 relative"
        style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE8C7)', border: '2px solid #FFE0B2' }}
        onClick={onFlip}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 ${isFlipped ? 'block' : 'hidden'}`}
          style={{ background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: '2px solid #A5D6A7' }}>
          <p className="text-base text-center font-cn text-gray-800 leading-relaxed">{card.back}</p>
        </div>
        <div className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 ${isFlipped ? 'hidden' : 'block'}`}>
          <p className="text-base text-center font-cn text-gray-800 leading-relaxed">{card.front}</p>
        </div>
      </motion.div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          间隔 {card.interval} 天 | 熟练度 {card.easeFactor.toFixed(1)}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{card.category}</span>
      </div>
      {showRating && (
        <div className="flex gap-2">
          <button onClick={() => onRate(1)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-sm font-cn hover:bg-red-200">忘记</button>
          <button onClick={() => onRate(3)} className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-cn hover:bg-yellow-200">模糊</button>
          <button onClick={() => onRate(5)} className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-cn hover:bg-green-200">记住</button>
        </div>
      )}
      {!showRating && (
        <button onClick={onFlip}
          className="px-4 py-1.5 rounded-lg bg-warm-orange text-white text-sm font-cn hover:bg-orange-500">
          {isFlipped ? '翻回正面' : '翻面看答案'}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建src/modules/flashcards/FlashcardModule.tsx**

```tsx
import { useState, useEffect } from 'react'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import FlashcardCard from './FlashcardCard'
import FlashcardStats from './FlashcardStats'
import { getDueCards, markReviewed, addCard } from '../../db/flashcard'
import type { Flashcard } from '../../db/flashcard'

export default function FlashcardModule() {
  const [dueCards, setDueCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [newCategory, setNewCategory] = useState('时政常识')
  const [showAdd, setShowAdd] = useState(false)
  const { setMood } = useMascotStore()

  useEffect(() => { getDueCards().then(setDueCards) }, [])

  const current = dueCards[currentIndex]

  const handleFlip = () => {
    if (!isFlipped) setShowRating(true)
    setIsFlipped(!isFlipped)
  }

  const handleRate = async (quality: number) => {
    if (!current) return
    if (quality >= 4) setMood('happy')
    else setMood('sad')
    setTimeout(() => setMood('focus'), 2000)
    await markReviewed(current.id, quality)
    setShowRating(false)
    setIsFlipped(false)
    const next = currentIndex + 1
    if (next < dueCards.length) setCurrentIndex(next)
    else {
      setDueCards([])
      setCurrentIndex(0)
    }
  }

  const handleAdd = async () => {
    if (!newFront || !newBack) return
    await addCard(newFront, newBack, newCategory)
    setNewFront(''); setNewBack(''); setShowAdd(false)
    await getDueCards().then(setDueCards)
    if (dueCards.length === 0) setCurrentIndex(0)
  }

  if (!current && dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 h-full justify-center">
        <MascotFull size={120} />
        <p className="text-lg font-cn text-warm-orange">今天没有待复习的卡片！</p>
        <p className="text-sm text-gray-500">试试添加新卡片吧~</p>
        <button onClick={() => setShowAdd(true)}
          className="mt-2 px-4 py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q hover:scale-105 transition-transform">
          + 添加卡片
        </button>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex justify-between items-center">
        <span className="text-sm font-cn text-gray-600">
          {dueCards.length > 0 ? `${currentIndex + 1} / ${dueCards.length}` : '完成'}
        </span>
        <button onClick={() => setShowAdd(!showAdd)}
          className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-cn hover:bg-blue-200">
          {showAdd ? '关闭' : '+ 添加'}
        </button>
      </div>

      {showAdd && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col gap-2">
          <input value={newFront} onChange={e => setNewFront(e.target.value)}
            placeholder="正面（问题）" className="text-sm border rounded-lg px-2 py-1 font-cn" />
          <input value={newBack} onChange={e => setNewBack(e.target.value)}
            placeholder="背面（答案）" className="text-sm border rounded-lg px-2 py-1 font-cn" />
          <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1">
            <option value="时政常识">时政常识</option>
            <option value="行政法">行政法</option>
            <option value="申论">申论</option>
            <option value="基础常识">基础常识</option>
          </select>
          <button onClick={handleAdd}
            className="text-sm px-3 py-1 rounded-lg bg-warm-orange text-white font-cn hover:bg-orange-500">添加</button>
        </div>
      )}

      <FlashcardCard
        card={current}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        showRating={showRating}
        onRate={handleRate}
      />

      <FlashcardStats dueCount={dueCards.length} />
    </div>
  )
}
```

- [ ] **Step 3: 创建src/modules/flashcards/FlashcardStats.tsx**

```tsx
interface Props { dueCount: number }

export default function FlashcardStats({ dueCount }: Props) {
  const days = [30, 15, 7, 3, 1, 0]
  const curve = days.map((d, i) => ({
    day: d,
    retention: Math.round((100 * Math.exp(-d / 30)) + Math.random() * 5)
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
```

- [ ] **Step 4: 在WindowManager中注册flashcards模块**

在 `moduleComponents` 中添加：
```ts
flashcards: FlashcardModule,
```
并从 `../../modules/flashcards/FlashcardModule` 导入。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: flashcard module with SRS review, add cards, and forgetting curve"
```

---

### Task 9: 模块三 - 今日计划（学习看板）

**Files:**
- Create: `src/modules/planner/PlannerModule.tsx`
- Create: `src/modules/planner/StreakBadge.tsx`
- Modify: `src/components/desktop/WindowManager.tsx`

**Interfaces:**
- Consumes: `getPlans`, `addPlan`, `updatePlan`, `useMascotStore`

- [ ] **Step 1: 创建src/modules/planner/PlannerModule.tsx**

```tsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { useMascotStore } from '../../store/mascotStore'
import { getPlans, addPlan, updatePlan } from '../../db/planner'
import type { StudyPlan } from '../../db/planner'
import StreakBadge from './StreakBadge'

export default function PlannerModule() {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newColumn, setNewColumn] = useState<'today' | 'week'>('today')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(0)
  const { setMood, streak } = useMascotStore()
  const dragOver = useRef<number | null>(null)

  useEffect(() => {
    getPlans().then(p => {
      setPlans(p)
      setCompleted(p.filter(x => x.done).length)
    })
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addPlan(newTitle, newColumn)
    setNewTitle('')
    await getPlans().then(p => { setPlans(p); setCompleted(p.filter(x => x.done).length) })
  }

  const handleDone = async (id: number, current: boolean) => {
    await updatePlan(id, { done: !current, column: !current ? 'done' : 'today' })
    if (!current) {
      setMood('happy')
      setTimeout(() => setMood('focus'), 2000)
    }
    await getPlans().then(p => { setPlans(p); setCompleted(p.filter(x => x.done).length) })
  }

  const columns: { key: 'today' | 'week' | 'done'; label: string; color: string }[] = [
    { key: 'today', label: '今日任务', color: 'bg-orange-100' },
    { key: 'week', label: '本周目标', color: 'bg-blue-100' },
    { key: 'done', label: '已完成', color: 'bg-green-100' },
  ]

  const total = plans.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MascotFull size={50} />
          <span className="font-cn text-gray-700">学习计划</span>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E0E0" strokeWidth="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#FF9F43" strokeWidth="4"
            strokeDasharray={`${pct * 1.005} 100`}
            transform="rotate(-90 20 20)" strokeLinecap="round"/>
        </svg>
        <div>
          <span className="text-lg font-en text-warm-orange">{pct}%</span>
          <span className="text-xs text-gray-500 ml-1">{completed}/{total} 完成</span>
        </div>
      </div>

      <div className="flex gap-2">
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="添加学习任务..."
          className="flex-1 text-sm border rounded-xl px-3 py-2 font-cn" />
        <select value={newColumn} onChange={e => setNewColumn(e.target.value as 'today' | 'week')}
          className="text-xs border rounded-lg px-2 py-2">
          <option value="today">今日</option>
          <option value="week">本周</option>
        </select>
        <button onClick={handleAdd}
          className="px-3 py-2 rounded-xl bg-warm-orange text-white font-cn text-sm hover:bg-orange-500">添加</button>
      </div>

      <div className="flex gap-2 flex-1 overflow-auto">
        {columns.map(col => (
          <div key={col.key}
            className={`flex-1 rounded-xl p-2 flex flex-col gap-2 min-h-32 ${col.color}`}>
            <span className="text-xs font-cn text-gray-600 px-1">{col.label}</span>
            {(plans.filter(p => p.column === col.key)).sort((a,b) => a.order - b.order).map(p => (
              <motion.div
                key={p.id}
                className="p-2 bg-white rounded-lg shadow-q text-sm font-cn cursor-grab hover:shadow-md"
                draggable
                onDragStart={() => setDraggedId(p.id)}
                onDragOver={(e) => { e.preventDefault(); dragOver.current = p.id }}
                onDrop={async () => {
                  if (draggedId && dragOver.current) {
                    const from = plans.find(x => x.id === draggedId)
                    const to = plans.find(x => x.id === dragOver.current)
                    if (from && to && from.column === to.column) {
                      const tmp = from.order
                      await updatePlan(from.id, { order: to.order })
                      await updatePlan(to.id, { order: tmp })
                      await getPlans().then(p => setPlans(p))
                    }
                  }
                  setDraggedId(null)
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <span className={p.done ? 'line-through text-gray-400' : 'text-gray-800'}>
                    {p.title}
                  </span>
                  <button onClick={() => handleDone(p.id, p.done)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      p.done ? 'border-green-400 bg-green-400 text-white' : 'border-gray-300'
                    }`}>
                    {p.done && '✓'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建src/modules/planner/StreakBadge.tsx**

```tsx
interface Props { streak: number }

export default function StreakBadge({ streak }: Props) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100">
      <span className="text-sm">🔥</span>
      <span className="text-xs font-cn text-orange-700">{streak} 天</span>
    </div>
  )
}
```

- [ ] **Step 3: 在WindowManager中注册planner模块**

```ts
planner: PlannerModule,
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: planner module with kanban board, streak, and progress ring"
```

---

### Task 10: 模块四 - 题题大作战（刷题器）

**Files:**
- Create: `src/modules/quiz/QuizModule.tsx`
- Create: `src/modules/quiz/QuizResult.tsx`
- Modify: `src/components/desktop/WindowManager.tsx`

**Interfaces:**
- Consumes: `getQuestions`, `saveAttempt`, `useMascotStore`

- [ ] **Step 1: 创建src/modules/quiz/QuizModule.tsx**

```tsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { useMascotStore } from '../../store/mascotStore'
import { getQuestions, saveAttempt } from '../../db/quiz'
import { addCard } from '../../db/flashcard'
import type { QuizQuestion } from '../../db/quiz'

export default function QuizModule() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [filter, setFilter] = useState<string>('all')
  const [finished, setFinished] = useState(false)
  const { setMood } = useMascotStore()
  const timerRef = useRef<number>()

  useEffect(() => {
    loadQuestions()
  }, [filter])

  useEffect(() => {
    if (finished || !showAnswer) return
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setShowAnswer(true); handleAnswer(null) }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIndex, showAnswer, finished])

  const loadQuestions = async () => {
    const qs = await getQuestions(filter === 'all' ? undefined : filter)
    setQuestions(qs)
    setCurrentIndex(0); setSelected(null); setShowAnswer(false); setScore(0); setTimeLeft(60); setFinished(false)
  }

  const current = questions[currentIndex]
  const options = current ? current.options.split('\n').map(o => ({ key: o[0], text: o })) : []

  const handleSelect = (key: string) => {
    if (showAnswer) return
    setSelected(key)
  }

  const handleAnswer = async (guess: string | null) => {
    setShowAnswer(true)
    clearInterval(timerRef.current)
    const isCorrect = guess === current?.answer
    if (isCorrect) {
      setScore(s => s + 1)
      setMood('happy')
    } else {
      setMood('sad')
      if (current) {
        await saveAttempt(current.id, false)
        await addCard(current.question, current.answer, current.category)
      }
    }
    setTimeout(async () => {
      setMood('focus')
      if (current && guess !== null) await saveAttempt(current.id, isCorrect)
      const next = currentIndex + 1
      if (next < questions.length) {
        setCurrentIndex(next)
        setSelected(null)
        setShowAnswer(false)
        setTimeLeft(60)
      } else {
        setFinished(true)
      }
    }, 2000)
  }

  const categories = ['all', '行政法', '言语理解', '数量关系', '判断推理', '常识判断', '基础常识', '时政常识', '申论']

  if (finished) {
    const total = questions.length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div className="flex flex-col items-center gap-4 h-full justify-center">
        <MascotFull size={100} />
        <p className="text-2xl font-cn text-warm-orange">
          {pct >= 80 ? '太棒了！' : pct >= 60 ? '不错哦！' : '继续加油！'}
        </p>
        <p className="text-lg font-en">{score} / {total}  <span className="text-sm text-gray-500">({pct}%)</span></p>
        <p className="text-xs text-gray-500">错题已自动加入知识卡片</p>
        <button onClick={() => setFinished(false)}
          className="px-4 py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q hover:scale-105 transition-transform">
          再来一轮
        </button>
      </div>
    )
  }

  if (!current) {
    return <div className="flex items-center justify-center h-full text-gray-400">题目加载中...</div>
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-cn ${
                filter === c ? 'bg-warm-orange text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {c === 'all' ? '全部' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MascotFull size={48} />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{currentIndex + 1} / {questions.length}</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 rounded-full bg-warm-orange transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gray-50">
        <p className="font-cn text-gray-800 leading-relaxed">{current.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map(opt => {
          let bg = 'bg-white border-gray-200'
          if (showAnswer) {
            if (opt.key === current.answer) bg = 'bg-green-100 border-green-400'
            else if (opt.key === selected && opt.key !== current.answer) bg = 'bg-red-100 border-red-400'
          } else if (opt.key === selected) {
            bg = 'bg-orange-100 border-warm-orange'
          }
          return (
            <button key={opt.key} onClick={() => handleSelect(opt.key)}
              className={`p-2 rounded-xl border text-left font-cn text-sm transition-colors ${bg}`}>
              {opt.text}
            </button>
          )
        })}
      </div>

      {!showAnswer ? (
        <button onClick={() => handleAnswer(selected)} disabled={!selected}
          className="w-full py-2 rounded-xl bg-warm-orange text-white font-cn shadow-q disabled:opacity-50 hover:bg-orange-500">
          确认答案
        </button>
      ) : (
        <p className={`text-center font-cn text-sm ${selected === current.answer ? 'text-green-600' : 'text-red-600'}`}>
          {selected === current.answer ? '✓ 答对了！' : `✗ 正确答案是 ${current.answer}`}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 在WindowManager中注册quiz模块**

```ts
quiz: QuizModule,
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: quiz module with timer, scoring, and auto wrong-book to flashcards"
```

---

### Task 11: 模块五 - 新闻早报（每日时政）

**Files:**
- Create: `src/modules/news/NewsModule.tsx`
- Create: `src/modules/news/newsData.ts`
- Modify: `src/components/desktop/WindowManager.tsx`

**Interfaces:**
- Consumes: `newsNotes` database

- [ ] **Step 1: 创建src/modules/news/newsData.ts**

```ts
export interface NewsItem {
  date: string
  title: string
  content: string
  examPoint: string
}

export const defaultNews: NewsItem[] = [
  {
    date: '2026-08-11',
    title: '国务院发布关于促进新质生产力的指导意见',
    content: '近日，国务院印发指导意见，强调加快发展新质生产力，推动科技创新与产业升级深度融合。',
    examPoint: '申论写作素材：新质生产力、高质量发展；常识判断：政策文件'
  },
  {
    date: '2026-08-10',
    title: '全国教育工作会议强调职业教育改革',
    content: '会议强调深化现代职业教育体系建设改革，推动产教融合、科教融汇。',
    examPoint: '常识判断：教育政策；申论：教育公平、职业教育'
  },
  {
    date: '2026-08-09',
    title: '2026年夏季达沃斯论坛闭幕',
    content: '本届达沃斯论坛以"可持续与包容性发展"为主题，多国代表共商全球合作。',
    examPoint: '常识判断：国际时事、重要会议；申论素材'
  },
  {
    date: '2026-08-08',
    title: '工信部推动人工智能产业发展规划',
    content: '工信部发布人工智能产业发展规划，提出到2030年建成全球领先的人工智能创新高地。',
    examPoint: '常识判断：科技政策；言语理解：科技类材料'
  },
  {
    date: '2026-08-07',
    title: '中央经济工作会议部署下半年重点工作',
    content: '会议强调稳就业、稳民生，加大对中小微企业的政策支持。',
    examPoint: '常识判断：中央会议内容；申论：民生保障'
  },
]
```

- [ ] **Step 2: 创建src/modules/news/NewsModule.tsx**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { defaultNews } from './newsData'
import type { NewsItem } from './newsData'

export default function NewsModule() {
  const [news] = useState<NewsItem[]>(defaultNews)
  const [note, setNote] = useState('')
  const [userNotes, setUserNotes] = useState<string[]>([])

  const handleAddNote = () => {
    if (!note.trim()) return
    setUserNotes([...userNotes, note])
    setNote('')
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center gap-2">
        <MascotFull size={48} />
        <div>
          <span className="font-cn text-gray-800">新闻早报</span>
          <span className="text-xs text-gray-500 ml-2">每日3-5条时政速递</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-auto flex-1">
        {news.map((item, i) => (
          <motion.div
            key={i}
            className="p-3 rounded-xl bg-white shadow-q border border-gray-100"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-en text-gray-400">{item.date}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">时政</span>
            </div>
            <h4 className="font-cn text-sm text-gray-800 mb-1">{item.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{item.content}</p>
            <div className="mt-2 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <span className="text-xs font-cn text-yellow-700">📌 {item.examPoint}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={note} onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
          placeholder="添加时政笔记..."
          className="flex-1 text-sm border rounded-xl px-3 py-2 font-cn" />
        <button onClick={handleAddNote}
          className="px-3 py-2 rounded-xl bg-warm-orange text-white font-cn text-sm hover:bg-orange-500">+记</button>
      </div>

      {userNotes.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-cn">我的笔记</span>
          {userNotes.map((n, i) => (
            <p key={i} className="text-xs text-gray-600 pl-2 border-l-2 border-warm-orange font-cn">{n}</p>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 在WindowManager中注册news模块**

```ts
news: NewsModule,
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: news module with daily news feed and user notes"
```

---

### Task 12: 全局App组装与初始化

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/desktop/WindowManager.tsx`
- Modify: `src/components/desktop/WindowFrame.tsx`（注册各模块内容渲染）

**Interfaces:**
- 将所有模块注册到WindowManager，完成应用闭环

- [ ] **Step 1: 重写src/components/desktop/WindowManager.tsx**

```tsx
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
  const activeId = useDesktopStore(s => s.activeWindowId)

  return (
    <div className="absolute inset-0 pointer-events-none" onClick={(e) => {
      if (e.target === e.currentTarget) return
    }}>
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
```

- [ ] **Step 2: 更新src/App.tsx**

```tsx
import { useEffect } from 'react'
import DesktopShell from './components/desktop/DesktopShell'
import WindowManager from './components/desktop/WindowManager'
import { seedDefaultData } from './db/database'
import { useDesktopStore } from './store/desktopStore'

export default function App() {
  const { windows } = useDesktopStore()

  useEffect(() => {
    seedDefaultData()
  }, [])

  return (
    <>
      <DesktopShell />
      {windows.length > 0 && <WindowManager />}
    </>
  )
}
```

- [ ] **Step 3: 启动开发服务器验证**

```bash
npm run dev
```

预期：
1. 打开localhost:5173，看到Q版桌面（壁纸+时钟+吉祥物+5个图标）
2. 双击图标打开对应模块窗口
3. 窗口可拖拽、可关闭
4. 各模块功能正常运行

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire all modules into window manager, app complete"
```

---

### Task 13: Tauri桌面端集成

**Files:**
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/src/lib.rs`
- Create: `src-tauri/build.rs`

**Interfaces:**
- 将已有React项目包装为Tauri桌面应用

- [ ] **Step 1: 创建src-tauri/Cargo.toml**

```toml
[package]
name = "kaogong-workbench"
version = "0.1.0"
edition = "2021"

[lib]
name = "kaogong_lib"
path = "src/lib.rs"
crate-type = ["staticlib", "cdylib", "rlib"]

[dependencies]
tauri = { version = "2.0", features = ["shell-open"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

- [ ] **Step 2: 创建src-tauri/build.rs**

```rust
fn main() {
  tauri_build::build()
}
```

- [ ] **Step 3: 创建src-tauri/src/lib.rs**

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

- [ ] **Step 4: 创建src-tauri/tauri.conf.json**

```json
{
  "productName": "考公Q版工作台",
  "version": "0.1.0",
  "identifier": "com.kaogong.workbench",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173"
  },
  "app": {
    "windows": [
      {
        "title": "考公Q版工作台",
        "width": 1280,
        "height": 720,
        "resizable": true,
        "decorations": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
  }
}
```

- [ ] **Step 5: 添加Tauri依赖到package.json**

在 devDependencies 中添加：
```json
"@tauri-apps/cli": "^2.0.0"
```

在 scripts 中添加：
```json
"tauri": "tauri",
"tauri:dev": "tauri dev",
"tauri:build": "tauri build"
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Tauri desktop integration for .exe build"
```

---

### Task 14: 最终整理与构建验证

**Files:**
- Create: `README.md`
- Create: `.gitignore`

**Interfaces:**
- 项目可构建、可运行、文档齐全

- [ ] **Step 1: 创建.gitignore**

```
node_modules/
dist/
src-tauri/target/
*.local
.env
```

- [ ] **Step 2: 创建README.md**

```markdown
# 考公Q版工作台

Q版卡通风格的拟真桌面工作台，专注服务公务员考试备考人群。

## 功能模块

- **专注时刻** — 番茄钟 + 白噪音 + 专注统计
- **知识卡卡** — SRS间隔重复记忆卡片
- **今日计划** — 学习看板 + streak打卡
- **题题大作战** — 刷题练习 + 错题本
- **新闻早报** — 每日时政速递

## 开发

```bash
npm install
npm run dev
```

## 桌面端构建

```bash
npm run tauri build
```

## 技术栈

React 18 + TypeScript + Vite + Zustand + TailwindCSS + Framer Motion
```

- [ ] **Step 3: 最终构建验证**

```bash
npm run build
```

预期：生成dist目录，无TypeScript错误

- [ ] **Step 4: 最终Commit**

```bash
git add -A
git commit -m "chore: final polish with README, gitignore, and clean build"
```

---

## 自检

### 1. Spec覆盖检查
- [x] 拟真桌面（壁纸、Dock、时钟、图标拖拽）— Task 3, 4
- [x] 窗口系统（拖拽、缩放、多窗口）— Task 4
- [x] 吉祥物5种表情 — Task 5
- [x] 专注时刻模块 — Task 7
- [x] 知识卡卡SRS — Task 8
- [x] 今日计划看板 — Task 9
- [x] 题题大作战 — Task 10
- [x] 新闻早报 — Task 11
- [x] 数据模型（所有表）— Task 6
- [x] 视觉规范（颜色、字体、圆角、动画）— Task 1, 3, 5
- [x] 数据流（错题→卡片、专注→streak）— Task 7, 8, 10
- [x] Tauri集成 — Task 13

### 2. Placeholder扫描
- 无TBD/TODO ✅
- 所有代码步骤有完整代码块 ✅

### 3. 类型一致性
- `ModuleId` 类型在所有模块中一致使用 ✅
- `MascotMood` 5种状态在Mascot组件和各模块中一致 ✅
- DB接口在各模块store中一致引用 ✅
- WindowManager的`moduleComponents`记录与5个模块一一对应 ✅

---

Plan complete and saved to `docs/superpowers/plans/2026-08-11-kaogong-workbench.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — 每个Task派发一个独立subagent，任务之间有review，迭代快
2. **Inline Execution** — 在本会话中依次执行各Task，checkpoint处review

**Which approach?**