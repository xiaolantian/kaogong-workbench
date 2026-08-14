import { useState, useEffect, useRef } from 'react'
import { useMascotStore } from '../../store/mascotStore'
import MascotFull from '../../components/mascot/MascotFull'
import FlashcardCard from './FlashcardCard'
import FlashcardStats from './FlashcardStats'
import { getDueCards, getAllCards, markReviewed, addCard, importCards, resetAllDue } from '../../db/flashcard'
import type { Flashcard, RawCard } from '../../db/flashcard'

export default function FlashcardModule() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [newCategory, setNewCategory] = useState('时政常识')
  const [showAdd, setShowAdd] = useState(false)
  const [reviewAll, setReviewAll] = useState(false)
  const [totalCards, setTotalCards] = useState(0)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [showImportGuide, setShowImportGuide] = useState(false)
  const { setMood } = useMascotStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadCards = async () => {
    const data = reviewAll ? await getAllCards() : await getDueCards()
    setCards(data)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowRating(false)
  }

  const loadTotal = async () => {
    const all = await getAllCards()
    setTotalCards(all.length)
  }

  useEffect(() => {
    loadCards()
    loadTotal()
  }, [reviewAll])

  const current = cards[currentIndex]

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
    advance()
  }

  const advance = () => {
    const next = currentIndex + 1
    if (next < cards.length) setCurrentIndex(next)
    else { setCards([]); setCurrentIndex(0) }
  }

  const handleSkip = () => {
    setShowRating(false)
    setIsFlipped(false)
    advance()
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setShowRating(false)
    }
  }

  const handleAdd = async () => {
    if (!newFront || !newBack) return
    await addCard(newFront, newBack, newCategory)
    setNewFront(''); setNewBack(''); setShowAdd(false)
    await loadCards()
    loadTotal()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportResult(null)
    try {
      const text = await file.text()
      const parsed = parseCards(text, file.name)
      const count = await importCards(parsed)
      setImportResult(`成功导入 ${count} 张卡片`)
      await loadCards()
      loadTotal()
    } catch (err) {
      setImportResult(`导入失败：${err instanceof Error ? err.message : '格式错误'}`)
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const parseCards = (text: string, filename: string): RawCard[] => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (ext === 'json') {
      const data = JSON.parse(text)
      const arr = Array.isArray(data) ? data : data.cards || data.flashcards || []
      if (!Array.isArray(arr)) throw new Error('JSON 根节点必须是数组')
      return arr.filter((c: RawCard) => c.front || c.back)
    }
    // TSV / 文本格式：每行一张卡，用制表符或竖线分隔
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    return lines.map(line => {
      const parts = line.includes('\t') ? line.split('\t') : line.split('|')
      if (parts.length < 2) throw new Error(`第 "${line.slice(0, 20)}..." 格式不正确，需要 正面 | 背面`)
      return { front: parts[0].trim(), back: parts[1].trim(), category: parts[2]?.trim() || '自定义' }
    })
  }

  const handleResetAll = async () => {
    await resetAllDue()
    setReviewAll(true)
    await loadCards()
    loadTotal()
  }

  const handleToggleImport = () => {
    setShowImportGuide(!showImportGuide)
    setImportResult(null)
  }

  const jsonSample = `[
  {
    "front": "问题",
    "back": "答案",
    "category": "分类"
  }
]`

  const tsvSample = `问题	答案	分类
另一张卡正面	另一张卡背面	时政常识`

  const downloadSample = (format: 'json' | 'tsv') => {
    const sample = format === 'json'
      ? '[\n  {"front": "中国梦的核心内涵是什么？", "back": "国家富强、民族振兴、人民幸福", "category": "时政常识"},\n  {"front": "行测包含哪五个模块？", "back": "言语理解、数量关系、判断推理、资料分析、常识判断", "category": "基础常识"},\n  {"front": "行政处罚的种类有哪些？", "back": "警告、罚款、没收违法所得、责令停产停业、暂扣或吊销许可证、行政拘留", "category": "行政法"}\n]'
      : '中国梦的核心内涵是什么\t国家富强、民族振兴、人民幸福\t时政常识\n行测包含哪五个模块\t言语理解、数量关系、判断推理、资料分析、常识判断\t基础常识\n行政处罚的种类有哪些\t警告、罚款、没收违法所得、责令停产停业、暂扣或吊销许可证、行政拘留\t行政法'
    const ext = format === 'json' ? 'json' : 'tsv'
    const mime = format === 'json' ? 'application/json' : 'text/tab-separated-values'
    const blob = new Blob([sample], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `flashcard-sample.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  if (!current && cards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 h-full justify-center">
        <MascotFull size={120} />
        <div className="soft-card p-6 flex flex-col items-center gap-2">
          <p className="text-lg font-cn font-bold text-purple-600">
            {reviewAll ? '没有任何卡片' : '今天没有待复习的卡片！'}
          </p>
          <p className="text-sm text-gray-500">
            {reviewAll ? '导入或添加卡片后开始吧~' : `共 ${totalCards} 张卡片，试试全部复习或添加新卡片~`}
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setShowAdd(true)} className="neo-btn primary px-4 py-2 text-sm font-cn">
              + 添加卡片
            </button>
            <button onClick={handleToggleImport} className="neo-btn px-4 py-2 text-sm font-cn">
              📂 导入文件
            </button>
            {totalCards > 0 && (
              <button onClick={() => setReviewAll(true)} className="neo-btn px-4 py-2 text-sm font-cn">
                📚 全部复习
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.tsv,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto overflow-x-visible p-2" style={{ paddingRight: 4 }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-cn text-gray-600">
            <span className="font-en font-bold text-purple-600">{currentIndex + 1}</span>
            <span className="text-gray-400"> / {cards.length}</span>
            <span className="text-gray-400 ml-2">（全部 {totalCards} 张）</span>
          </span>
          <button
            onClick={() => setReviewAll(!reviewAll)}
            className={`pill px-2 py-1 text-xs font-cn ${reviewAll ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {reviewAll ? '📚 全部复习' : '📅 今日复习'}
          </button>
          <button onClick={handleResetAll} className="pill px-2 py-1 text-xs font-cn bg-orange-100 text-orange-700 hover:bg-orange-200">
            🔁 重新复习
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleToggleImport} className="pill px-2 py-1 text-xs font-cn bg-blue-100 text-blue-700 hover:bg-blue-200">
            {importing ? '⏳ 导入中...' : showImportGuide ? '✕ 关闭' : '📂 导入'}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="pill px-2 py-1 text-xs font-cn bg-green-100 text-green-700 hover:bg-green-200">
            {showAdd ? '✕ 关闭' : '+ 添加'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.tsv,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {importResult && (
        <div className={`text-xs font-cn text-center py-1 rounded-lg ${importResult.startsWith('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {importResult}
          <button onClick={() => setImportResult(null)} className="ml-2 underline">关闭</button>
        </div>
      )}

      {showImportGuide && (
        <div className="soft-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-cn text-purple-700">📂 导入卡片</h3>
            <button onClick={handleToggleImport} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <p className="text-xs text-gray-500 font-cn">
            将外部卡片批量导入。支持 <span className="font-en font-bold">.json</span>、<span className="font-en font-bold">.tsv</span>、<span className="font-en font-bold">.txt</span> 三种格式。
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold font-cn text-purple-600">JSON 格式</span>
                <button onClick={() => downloadSample('json')} className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-cn hover:bg-purple-200">
                  下载示例
                </button>
              </div>
              <pre className="text-[10px] font-en text-gray-600 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                <code>{jsonSample}</code>
              </pre>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold font-cn text-green-600">TSV / 文本</span>
                <button onClick={() => downloadSample('tsv')} className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-cn hover:bg-green-200">
                  下载示例
                </button>
              </div>
              <pre className="text-[10px] font-en text-gray-600 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                <code>{tsvSample}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="neo-btn primary flex-1 py-2 text-sm font-cn disabled:opacity-50"
            >
              {importing ? '⏳ 正在导入...' : '📂 选择文件'}
            </button>
            <button onClick={handleToggleImport} className="neo-btn px-4 py-2 text-sm font-cn">
              关闭
            </button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="soft-card p-4 flex flex-col gap-2">
          <input
            value={newFront}
            onChange={(e) => setNewFront(e.target.value)}
            placeholder="正面（问题）"
            className="soft-input"
          />
          <input
            value={newBack}
            onChange={(e) => setNewBack(e.target.value)}
            placeholder="背面（答案）"
            className="soft-input"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="soft-input"
          >
            <option value="时政常识">时政常识</option>
            <option value="行政法">行政法</option>
            <option value="申论">申论</option>
            <option value="基础常识">基础常识</option>
            <option value="言语理解">言语理解</option>
            <option value="数量关系">数量关系</option>
            <option value="判断推理">判断推理</option>
            <option value="资料分析">资料分析</option>
            <option value="自定义">自定义</option>
          </select>
          <button onClick={handleAdd} className="neo-btn primary px-4 py-2 text-sm font-cn">
            添加卡片
          </button>
        </div>
      )}

      <FlashcardCard
        card={current}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        showRating={showRating}
        onRate={handleRate}
      />

      {/* 翻页导航 */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="neo-btn px-4 py-2 text-sm font-cn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ 上一张
        </button>
        <button onClick={handleSkip} className="neo-btn px-4 py-2 text-sm font-cn bg-gray-100 text-gray-600 hover:bg-gray-200">
          ⏭ 跳过
        </button>
        <button
          onClick={advance}
          disabled={currentIndex >= cards.length - 1}
          className="neo-btn primary px-4 py-2 text-sm font-cn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          下一张 ▶
        </button>
      </div>

      <FlashcardStats dueCount={cards.length} />
    </div>
  )
}