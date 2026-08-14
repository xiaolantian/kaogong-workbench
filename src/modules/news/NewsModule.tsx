import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import MascotFull from '../../components/mascot/MascotFull'
import { Landmark, Globe, TrendingUp, FlaskConical, Shield, Palette, Heart, Dumbbell, MapPin, ClipboardList, GraduationCap, Wifi, RotateCw, NotepadText, AlertTriangle, Clock, Bell, Inbox, Search, X } from 'lucide-react'
import { useNews, formatPublishedDate } from './useNews'
import type { CachedNewsItem } from '../../db/newsCache'

const NEWS_COLORS = [
  { accent: '#6c5ce7', bg: '#ede7ff' },
  { accent: '#74b9ff', bg: '#e3f2fd' },
  { accent: '#ff7675', bg: '#ffe8e8' },
  { accent: '#ffd93d', bg: '#fff8e1' },
  { accent: '#55efc4', bg: '#e8f8f0' },
]

const CATEGORY_ICON: Record<string, React.ComponentType<any>> = {
  '时政': Landmark,
  '国际': Globe,
  '经济': TrendingUp,
  '科技': FlaskConical,
  '军事': Shield,
  '文化': Palette,
  '健康': Heart,
  '体育': Dumbbell,
  '华人': MapPin,
  '综合': ClipboardList,
  '教育': GraduationCap,
}

export default function NewsModule({ preloaded = [] }: { preloaded?: CachedNewsItem[] } = {}) {
  const {
    items,
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
    cacheTimeText,
    fetchAll,
    isOnline,
  } = useNews()

  const displayItems = useMemo(() => {
    if (items.length > 0 && items[0]?.title !== '暂无新闻数据') return items
    if (preloaded.length > 0) return preloaded
    return items
  }, [items, preloaded])

  const [note, setNote] = useState('')
  const [userNotes, setUserNotes] = useState<string[]>([])

  const handleAddNote = () => {
    if (!note.trim()) return
    setUserNotes([...userNotes, note])
    setNote('')
  }

  const handleOpenLink = (url: string) => {
    if (!url) return
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      import('@tauri-apps/plugin-shell').then(({ open }) => {
        open(url)
      })
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 h-full overflow-y-auto overflow-x-visible p-1 sm:p-2" style={{ paddingRight: 4 }}>
      <div className="flex items-center gap-2 sm:gap-3">
        <MascotFull size={36} />
        <div className="flex-1 min-w-0">
          <span className="font-cn text-base sm:text-lg font-bold text-gray-800">新闻早报</span>
          <span className="text-xs text-gray-500 ml-2 font-cn">每日时政速递</span>
        </div>
        <span className="text-xs text-gray-400 font-cn shrink-0 hidden sm:flex" title="最后更新">
          <span className="flex items-center gap-1"><Clock size={12} strokeWidth={2} />{cacheTimeText}</span>
        </span>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 shrink-0"
          title="立即刷新"
        >
          <RotateCw size={12} strokeWidth={2} className={loading ? 'animate-spin' : ''} />
        </button>
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${stale ? 'bg-yellow-400' : 'bg-green-400'}`}
          title={stale ? '内容已过期，正在后台更新' : '内容是最新的'}
        />
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索新闻标题或内容..."
          className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-cn placeholder-gray-400 focus:outline-none soft-input relative"
          style={{ boxSizing: 'border-box' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={12} strokeWidth={2} />
          </button>
        )}
        <Search size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-cn shrink-0">视图</span>
          <button
            onClick={() => setViewMode('all')}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-cn transition-all ${
              viewMode === 'all'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <Wifi size={12} strokeWidth={2} />所有
            </span>
          </button>
          <button
            onClick={() => setViewMode('today')}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-cn transition-all ${
              viewMode === 'today'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <Bell size={12} strokeWidth={2} />今日
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap pb-1">
          <span className="text-xs text-gray-400 font-cn shrink-0">分类</span>
          {categories.map((cat) => {
            const CatIcon = CATEGORY_ICON[cat]
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-cn transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-purple-700 font-bold'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {CatIcon ? (
                  <span className="flex items-center gap-1">
                    <CatIcon size={12} strokeWidth={2} />
                    {cat}
                  </span>
                ) : (
                  cat
                )}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-red-50 border border-red-100">
          <AlertTriangle size={14} strokeWidth={2} color="#dc2626" />
          <span className="text-xs text-red-600 font-cn flex-1">{error}</span>
          <button
            onClick={fetchAll}
            className="text-xs text-red-600 font-cn hover:underline shrink-0"
          >
            重试
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50">
          <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-xs text-purple-600 font-cn">正在更新...</span>
        </div>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto overflow-x-visible flex-1 min-h-0 py-1" style={{ paddingRight: 4 }}>
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
            <Inbox size={32} strokeWidth={1.5} />
            <span className="text-xs font-cn">
              {query ? '没有找到相关新闻' : '暂无新闻'}
            </span>
            <button
              onClick={fetchAll}
              className="mt-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-cn hover:bg-purple-200"
            >
              <span className="flex items-center gap-1">
                <RotateCw size={12} strokeWidth={2} />获取新闻
              </span>
            </button>
          </div>
        ) : (
          displayItems.map((item, i) => {
            const nc = NEWS_COLORS[i % NEWS_COLORS.length]
            return (
              <motion.div
                key={i}
                className="soft-card p-2 sm:p-3 flex gap-2 sm:gap-3 shrink-0 hover:shadow-md transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                onClick={() => handleOpenLink(item.link)}
              >
                <div
                  className="w-1 rounded-full shrink-0"
                  style={{ background: nc.accent }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] sm:text-xs font-cn text-gray-400 truncate mr-2">
                      {formatPublishedDate(item.published) || item.source_name}
                    </span>
                    <span
                      className="pill text-[10px] sm:text-xs shrink-0"
                      style={{ background: nc.bg, color: nc.accent }}
                    >
                      {item.category || item.source_name || '新闻'}
                    </span>
                  </div>
                  <h4 className="font-cn text-xs sm:text-sm font-bold text-gray-800 mb-0.5 leading-snug">
                    {item.title}
                  </h4>
                  <p
                    className="text-[11px] sm:text-xs text-gray-600 leading-relaxed"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          placeholder="添加时政笔记..."
          className="soft-input flex-1 text-xs sm:text-sm"
        />
        <button
          onClick={handleAddNote}
          className="neo-btn primary px-3 py-1.5 text-xs font-cn shrink-0"
        >
          + 记笔记
        </button>
      </div>

      {userNotes.length > 0 && (
        <div className="soft-card p-2 sm:p-3 flex flex-col gap-1 shrink-0 max-h-32 overflow-y-auto overflow-x-visible">
          <span className="text-xs text-gray-500 font-cn font-bold flex items-center gap-1.5">
            <NotepadText size={12} strokeWidth={2} />我的笔记 ({userNotes.length})
          </span>
          {userNotes.map((n, i) => (
            <p
              key={i}
              className="text-xs text-gray-600 pl-2 border-l-2 font-cn"
              style={{ borderColor: 'var(--accent)' }}
            >
              {n}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}