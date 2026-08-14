import type { ThemeConfig } from '../types'

export const ALL_THEMES: ThemeConfig[] = [
  {
    id: 'day',
    name: '白天',
    nameEn: 'Daylight',
    price: 0,
    rarity: 'free',
    desc: '清新明亮的默认主题，适合白天高效学习',
    cssClass: 'theme-day',
  },
  {
    id: 'night',
    name: '黑夜',
    nameEn: 'Midnight',
    price: 0,
    rarity: 'free',
    desc: '深色护眼模式，夜晚学习不刺眼',
    cssClass: 'theme-night',
  },
  {
    id: 'sakura',
    name: '樱花',
    nameEn: 'Sakura',
    price: 100,
    rarity: 'classic',
    desc: '春日落樱，粉色花瓣点缀每一处',
    cssClass: 'theme-sakura',
  },
  {
    id: 'forest',
    name: '森林',
    nameEn: 'Forest',
    price: 150,
    rarity: 'classic',
    desc: '清新森林，绿叶藤蔓点缀，明亮通透',
    cssClass: 'theme-forest',
  },
  {
    id: 'ocean',
    name: '海洋',
    nameEn: 'Ocean',
    price: 200,
    rarity: 'limited',
    desc: '浅蓝海洋，海洋生物点缀，清新通透',
    cssClass: 'theme-ocean',
  },
  {
    id: 'galaxy',
    name: '星河',
    nameEn: 'Galaxy',
    price: 300,
    rarity: 'legendary',
    desc: '紫色星云，金色星光点缀，稀有传说级主题',
    cssClass: 'theme-galaxy',
  },
]

export const FREE_THEMES = ['day', 'night'] as const

export function getThemeById(id: string): ThemeConfig | undefined {
  return ALL_THEMES.find(t => t.id === id)
}

export function getPremiumThemes(): ThemeConfig[] {
  return ALL_THEMES.filter(t => t.price > 0)
}

export const RARITY_LABEL: Record<string, string> = {
  free: '免费',
  classic: '经典',
  limited: '限定',
  legendary: '传说',
}

export const RARITY_DOT: Record<string, string> = {
  free: '#55efc4',
  classic: '#74b9ff',
  limited: '#a29bfe',
  legendary: '#fdcb6e',
}