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
