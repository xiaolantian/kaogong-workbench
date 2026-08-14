import type { ComponentType } from 'react'

export type MascotMood = 'focus' | 'sleepy' | 'happy' | 'sad' | 'celebrate'

export type ThemeId = 'day' | 'night' | 'sakura' | 'forest' | 'ocean' | 'galaxy'

export interface ThemeConfig {
  id: ThemeId
  name: string
  nameEn: string
  price: number
  rarity: 'free' | 'classic' | 'limited' | 'legendary'
  desc: string
  cssClass: string
}

export type ModuleId = 'timer' | 'flashcards' | 'planner' | 'quiz' | 'news' | 'store'

export type IconPack = 'default' | 'rainbow' | 'minimal' | 'animal' | 'candy' | 'starry' | 'botanical' | 'paws' | 'playful' | 'magic'

export interface DesktopIcon {
  id: ModuleId
  name: string
  icon: ComponentType<any>
}

export interface PointTransaction {
  id?: number
  amount: number
  source: string
  type: 'earn' | 'spend'
  note: string
  date: string
}