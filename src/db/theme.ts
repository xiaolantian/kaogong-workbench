import { getDB } from './database'

export interface ThemeRecord {
  themeId: string
  purchasedAt: string
  totalSpent: number
}

export async function initThemeTable(): Promise<void> {
  const db = await getDB()
  try {
    await db.add('themes', {
      themeId: '__init__',
      purchasedAt: '1970-01-01',
      totalSpent: 0,
    })
  } catch {
    /* table exists */
  }
}

export async function saveOwnedThemes(themeIds: string[]): Promise<void> {
  const db = await getDB()
  await db.clear('themes')
  for (const id of themeIds) {
    await db.add('themes', {
      themeId: id,
      purchasedAt: new Date().toISOString(),
      totalSpent: 0,
    })
  }
}

export async function getOwnedThemes(): Promise<string[]> {
  try {
    const db = await getDB()
    const rows = (await db.getAll('themes')) as ThemeRecord[]
    return rows.map(r => r.themeId).filter(id => id !== '__init__')
  } catch {
    return []
  }
}

export async function recordThemePurchase(themeId: string, cost: number): Promise<void> {
  const db = await getDB()
  try {
    await db.add('themes', {
      themeId,
      purchasedAt: new Date().toISOString(),
      totalSpent: cost,
    })
  } catch {
    /* already owned */
  }
}