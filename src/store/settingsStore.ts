import { create } from 'zustand'
import { ThemeId, IconPack } from '../types'
import { FREE_THEMES, getThemeById } from '../data/themes'
import { usePointsStore } from './pointsStore'
import { recordThemePurchase } from '../db/theme'

const STORAGE_KEY = 'kaogong-settings-v2'

interface SettingsBase {
  activeTheme: ThemeId
  ownedThemes: ThemeId[]
  iconPack: IconPack
  unlockedIconPacks: IconPack[]
}

interface SettingsState extends SettingsBase {
  loadData: () => void
  saveData: () => void
  setActiveTheme: (theme: ThemeId) => void
  toggleFreeTheme: () => void
  purchaseTheme: (theme: ThemeId) => Promise<'success' | 'not_enough_points' | 'already_owned'>
  setIconPack: (pack: IconPack) => void
  unlockIconPack: (pack: IconPack) => void
}

function getDefaultState(): SettingsBase {
  return {
    activeTheme: 'day' as ThemeId,
    ownedThemes: ['day', 'night', 'sakura', 'forest', 'ocean', 'galaxy'] as ThemeId[],
    iconPack: 'default' as IconPack,
    unlockedIconPacks: ['default'] as IconPack[],
  }
}

function loadFromStorage(): SettingsBase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const parsed = JSON.parse(raw)
    const storedTheme = parsed.activeTheme || parsed.theme
    const activeTheme = (storedTheme && getThemeById(storedTheme))
      ? storedTheme
      : 'day'
    const ownedThemes = Array.isArray(parsed.ownedThemes)
      ? parsed.ownedThemes.filter((id: string) => getThemeById(id))
      : (Array.isArray(parsed.unlockedThemes)
          ? parsed.unlockedThemes.filter((id: string) => getThemeById(id))
          : ['day', 'night'])
    if (!ownedThemes.includes('day')) ownedThemes.unshift('day')
    if (!ownedThemes.includes('night')) ownedThemes.push('night')
    return {
      activeTheme,
      ownedThemes,
      iconPack: parsed.iconPack || 'default',
      unlockedIconPacks: parsed.unlockedIconPacks || ['default'],
    }
  } catch {
    return getDefaultState()
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadFromStorage(),

  loadData: () => {
    const saved = loadFromStorage()
    set({ ...saved })
  },

  saveData: () => {
    const { activeTheme, ownedThemes, iconPack, unlockedIconPacks } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeTheme,
      ownedThemes,
      iconPack,
      unlockedIconPacks,
    }))
  },

  setActiveTheme: (theme) => {
    const { ownedThemes } = get()
    if (FREE_THEMES.includes(theme as never) || ownedThemes.includes(theme)) {
      set({ activeTheme: theme })
      get().saveData()
    }
  },

  toggleFreeTheme: () => {
    const { activeTheme } = get()
    const next = activeTheme === 'day' ? 'night' : 'day'
    set({ activeTheme: next })
    get().saveData()
  },

  purchaseTheme: async (theme) => {
    const { ownedThemes } = get()
    const config = getThemeById(theme)
    if (!config) return 'not_enough_points'
    if (ownedThemes.includes(theme)) return 'already_owned'

    const points = usePointsStore.getState()
    if (points.balance < config.price) return 'not_enough_points'

    const success = await points.spendPoints(config.price, 'theme', `购买主题：${config.name}`)
    if (success) {
      const newOwned = [...ownedThemes, theme]
      set({ ownedThemes: newOwned, activeTheme: theme })
      get().saveData()
      await recordThemePurchase(theme, config.price)
      return 'success'
    }
    return 'not_enough_points'
  },

  setIconPack: (pack) => {
    set({ iconPack: pack })
    get().saveData()
  },

  unlockIconPack: (pack) => {
    set(state => ({
      unlockedIconPacks: state.unlockedIconPacks.includes(pack)
        ? state.unlockedIconPacks
        : [...state.unlockedIconPacks, pack],
    }))
    get().saveData()
  },
}))