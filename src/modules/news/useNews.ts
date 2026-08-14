import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  getFromCache,
  saveToCache,
  getLastFetchTime,
  isCacheStale,
  formatCacheTime,
  CachedNewsItem,
} from '../../db/newsCache'

export interface NewsItem {
  title: string
  description: string
  link: string
  source_name: string
  category: string
  published: string
  fetchedAt?: number
}

export interface RssSource {
  name: string
  url: string
  category: string
}

const RSS_SOURCES: RssSource[] = [
  { name: '中新网', url: 'http://www.chinanews.com.cn/rss/scroll-news.xml', category: '时政' },
  { name: '钛媒体', url: 'https://www.tmtpost.com/feed', category: '经济' },
  { name: '少数派', url: 'https://sspai.com/feed', category: '科技' },
  { name: '爱范儿', url: 'https://www.ifanr.com/feed', category: '科技' },
]

const FALLBACK_ITEMS: NewsItem[] = [
  {
    title: '暂无新闻数据',
    description: '点击刷新按钮获取最新时政新闻。内容会在后台自动更新，无需手动操作。',
    link: '',
    source_name: '系统',
    category: '时政',
    published: '—',
  },
]

const REFRESH_INTERVAL_MS = 30 * 60 * 1000
const FETCH_TIMEOUT_MS = 20000

function isTauri(): boolean {
  return typeof window !== 'undefined' && !!(window as any).__TAURI__
}

async function tauriInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  if (!isTauri()) return null
  try {
    const { invoke } = await import('@tauri-apps/api/core')
    return await invoke<T>(cmd, args)
  } catch {
    return null
  }
}

export function formatPublishedDate(dateStr: string): string {
  if (!dateStr || dateStr === '—') return '未知时间'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}

function parseRssXml(xml: string): NewsItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) return []

  const items: NewsItem[] = []
  const itemEls = doc.querySelectorAll('item')
  if (itemEls.length > 0) {
    for (let i = 0; i < Math.min(itemEls.length, 50); i++) {
      const el = itemEls[i]
      const title = el.querySelector('title')?.textContent?.trim()
      if (!title) continue
      const desc = el.querySelector('description')?.textContent?.trim() || ''
      const link = el.querySelector('link')?.textContent?.trim() || ''
      const pubDate = el.querySelector('pubDate')?.textContent?.trim() || ''
      items.push({ title, description: desc.slice(0, 200), link, source_name: '', category: '', published: pubDate })
    }
    return items
  }

  const entryEls = doc.querySelectorAll('entry')
  for (let i = 0; i < Math.min(entryEls.length, 50); i++) {
    const el = entryEls[i]
    const title = el.querySelector('title')?.textContent?.trim()
    if (!title) continue
    const summary = el.querySelector('summary')?.textContent?.trim() || el.querySelector('content')?.textContent?.trim() || ''
    const linkEl = el.querySelector('link')
    const link = linkEl?.getAttribute('href') || ''
    const published = el.querySelector('published')?.textContent?.trim() || el.querySelector('updated')?.textContent?.trim() || ''
    items.push({ title, description: summary.slice(0, 200), link, source_name: '', category: '', published })
  }
  return items
}

function inferCategory(link: string): string {
  if (!link) return '综合'
  try {
    const url = new URL(link)
    const segments = url.pathname.split('/').filter(Boolean)
    const seg = segments[0] || ''

    if (/^(gj|guoji|world|international|worldnews|international)/.test(seg)) return '国际'
    if (/^(cj|jingji|finance|economic|economy|finance)/.test(seg)) return '经济'
    if (/^(kj|keji|tech|science|technology|scitech|it|tech)/.test(seg)) return '科技'
    if (/^(sh|shizheng|politics|politics|politics|gn|guonei|dwq|shehui|social|shehui|tp|tpt)/.test(seg)) return '时政'
    if (/^(ty|sports|sports|sport)/.test(seg)) return '体育'
    if (/^(ent|entertainment|culture|cul|wenhua|arts)/.test(seg)) return '文化'
    if (/^(jk|jiankang|health|health)/.test(seg)) return '健康'
    if (/^(hr|huaren|huaer)/.test(seg)) return '华人'
    if (/^(mil|military)/.test(seg)) return '军事'
  } catch {}
  return '综合'
}

function isDevBrowser(): boolean {
  return typeof window !== 'undefined'
    && !isTauri()
    && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
}

async function fetchOneSource(url: string, sourceName: string, category: string): Promise<NewsItem[] | null> {
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    `https://corsproxy.org/?url=${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ]

  const urlsToTry = isDevBrowser()
    ? [`/api/fetch-rss?url=${encodeURIComponent(url)}`, ...proxies]
    : proxies

  for (const fetchUrl of urlsToTry) {
    try {
      const resp = await fetch(fetchUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
      if (!resp.ok) continue
      const text = await resp.text()
      if (!text || text.length < 100) continue
      const items = parseRssXml(text)
      if (items.length > 0) {
        return items.map(item => {
          const itemCategory = inferCategory(item.link) || category
          return { ...item, source_name: sourceName, category: itemCategory }
        })
      }
    } catch {
      continue
    }
  }
  return null
}

export async function prefetchNews(): Promise<number> {
  let fetchedItems: NewsItem[] = []

  if (isTauri()) {
    const results = await tauriInvoke<Array<{ source_name: string; items: NewsItem[]; error?: string }>>('fetch_all_sources')
    if (results) {
      fetchedItems = results.flatMap(r => r.items || [])
    }
  } else {
    const fetches = RSS_SOURCES.map(src => fetchOneSource(src.url, src.name, src.category))
    const results = await Promise.allSettled(fetches)
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        fetchedItems.push(...result.value)
      }
    }
  }

  if (fetchedItems.length > 0) {
    const cached: CachedNewsItem[] = fetchedItems.map(item => ({
      link: item.link,
      title: item.title,
      description: item.description,
      source_name: item.source_name,
      category: item.category,
      published: item.published,
      fetchedAt: Date.now(),
    }))
    return await saveToCache(cached)
  }
  return 0
}

export function useNews() {
  const [allItems, setAllItems] = useState<NewsItem[]>(FALLBACK_ITEMS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTimeState] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [viewMode, setViewMode] = useState<'all' | 'today'>('all')
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const visibilityRef = useRef(false)

  const loadCache = useCallback(async () => {
    setError(null)
    const cached = await getFromCache()
    const lastFetch = await getLastFetchTime()

    if (cached.length > 0) {
      setAllItems(cached.map(c => ({
        title: c.title,
        description: c.description,
        link: c.link,
        source_name: c.source_name,
        category: c.category,
        published: c.published,
        fetchedAt: c.fetchedAt,
      })))
    } else {
      setAllItems(FALLBACK_ITEMS)
    }
    setLastFetchTimeState(lastFetch)
  }, [])

  const doFetch = useCallback(async (silent: boolean = false) => {
    if (!silent) setLoading(true)
    setError(null)

    try {
      const saved = await prefetchNews()
      await loadCache()
      setLastFetchTimeState(Date.now())

      if (saved === 0) {
        setError('获取失败：RSS 源无法访问。建议在 Tauri 桌面端使用，或等待 RSS 服务恢复。')
      }
    } catch (e: any) {
      setError(e.message || '获取失败')
    } finally {
      setLoading(false)
    }
  }, [loadCache])

  useEffect(() => {
    const init = async () => {
      await loadCache()
      const lastFetch = await getLastFetchTime()
      if (isCacheStale(lastFetch)) {
        doFetch(true)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const checkAndFetch = async () => {
      if (!visibilityRef.current) return
      const lastFetch = await getLastFetchTime()
      if (isCacheStale(lastFetch, REFRESH_INTERVAL_MS)) {
        doFetch(true)
      }
    }

    const handleVisibility = () => {
      visibilityRef.current = document.visibilityState === 'visible'
      if (visibilityRef.current) checkAndFetch()
    }

    refreshTimerRef.current = setInterval(checkAndFetch, REFRESH_INTERVAL_MS)

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('news:refresh', checkAndFetch)

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('news:refresh', checkAndFetch)
    }
  }, [doFetch])

  const filteredItems = useMemo(() => {
    const today = new Date()
    return allItems.filter(item => {
      const matchesQuery =
        query.trim() === '' ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory =
        selectedCategory === '全部' || item.category === selectedCategory
      const matchesTime = viewMode === 'all' || (() => {
        if (!item.fetchedAt) return false
        const d = new Date(item.fetchedAt)
        return d.getFullYear() === today.getFullYear()
          && d.getMonth() === today.getMonth()
          && d.getDate() === today.getDate()
      })()
      return matchesQuery && matchesCategory && matchesTime
    })
  }, [allItems, query, selectedCategory, viewMode])

  const categories = useMemo(() => {
    const itemCats = allItems.length > 0 && allItems[0]?.title !== '暂无新闻数据'
      ? Array.from(new Set(allItems.map(i => i.category).filter(Boolean)))
      : Array.from(new Set(RSS_SOURCES.map(s => s.category)))
    return ['全部', ...itemCats]
  }, [allItems])

  const stale = isCacheStale(lastFetchTime, REFRESH_INTERVAL_MS)

  return {
    items: filteredItems,
    allItems,
    sources: RSS_SOURCES,
    loading,
    error,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    viewMode,
    setViewMode,
    lastFetchTime,
    stale,
    cacheTimeText: formatCacheTime(lastFetchTime),
    fetchAll: () => doFetch(false),
    isOnline: allItems.length > 0,
  }
}