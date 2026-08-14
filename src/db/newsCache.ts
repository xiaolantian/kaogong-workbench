import { getDB } from './database'

export interface CachedNewsItem {
  link: string
  title: string
  description: string
  source_name: string
  category: string
  published: string
  fetchedAt: number
}

const CACHE_SETTINGS_KEY = 'news:lastFetch'
const CACHE_VERSION_KEY = 'news:cacheVersion'
const CACHE_VERSION = 3
const CACHE_MAX_ITEMS = 500
const CACHE_MAX_AGE_MS = 15 * 24 * 60 * 60 * 1000

export async function getFromCache(): Promise<CachedNewsItem[]> {
  const db = await getDB()
  const raw = db as any
  try {
    const version = await db.get('settings', CACHE_VERSION_KEY)
    if (!version || version.val !== String(CACHE_VERSION)) {
      await raw.clear('newsItems')
      await db.put('settings', { key: CACHE_VERSION_KEY, val: String(CACHE_VERSION) })
      return []
    }
    const items = (await raw.getAllFromIndex('newsItems', 'by-fetchedAt', null, CACHE_MAX_ITEMS)) as CachedNewsItem[]
    return items.reverse()
  } catch {
    return []
  }
}

export async function saveToCache(items: CachedNewsItem[]): Promise<number> {
  if (items.length === 0) return 0
  const db = await getDB()
  const raw = db as any
  const now = Date.now()
  let saved = 0
  for (const item of items) {
    try {
      await raw.put('newsItems', { ...item, fetchedAt: now })
      saved++
    } catch {
      // link conflict or other error, skip
    }
  }
  await setLastFetchTime(now)
  await evictByAge(raw)
  await evictOldest(raw)
  return saved
}

export async function setLastFetchTime(ts: number): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key: CACHE_SETTINGS_KEY, val: String(ts) })
}

export async function getLastFetchTime(): Promise<number | null> {
  const db = await getDB()
  try {
    const row = await db.get('settings', CACHE_SETTINGS_KEY)
    if (!row) return null
    const ts = parseInt(row.val, 10)
    return isNaN(ts) ? null : ts
  } catch {
    return null
  }
}

export async function clearCache(): Promise<void> {
  const db = await getDB()
  ;(db as any).clear('newsItems')
}

async function evictOldest(db: any): Promise<void> {
  try {
    const count = await db.count('newsItems')
    if (count <= CACHE_MAX_ITEMS) return
    const toDelete = count - CACHE_MAX_ITEMS
    const oldest = await db.getAllFromIndex('newsItems', 'by-fetchedAt', null, toDelete)
    for (const item of oldest) {
      await db.delete('newsItems', item.link)
    }
  } catch {
    // eviction failure is non-critical
  }
}

async function evictByAge(db: any): Promise<void> {
  try {
    const cutoff = Date.now() - CACHE_MAX_AGE_MS
    const all = (await db.getAllFromIndex('newsItems', 'by-fetchedAt', null, CACHE_MAX_ITEMS)) as CachedNewsItem[]
    for (const item of all) {
      if (item.fetchedAt < cutoff) {
        await db.delete('newsItems', item.link)
      } else {
        break
      }
    }
  } catch {
    // age eviction failure is non-critical
  }
}

export function isCacheStale(lastFetch: number | null, maxAgeMs: number = 30 * 60 * 1000): boolean {
  if (!lastFetch) return true
  return Date.now() - lastFetch > maxAgeMs
}

export function formatCacheTime(ts: number | null): string {
  if (!ts) return '—'
  const diff = Date.now() - ts
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function isNewerToday(item: CachedNewsItem): boolean {
  const today = new Date()
  const fetched = new Date(item.fetchedAt)
  return fetched.getFullYear() === today.getFullYear()
    && fetched.getMonth() === today.getMonth()
    && fetched.getDate() === today.getDate()
}