import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePointsStore } from '../../store/pointsStore'
import { useSettingsStore } from '../../store/settingsStore'
import MascotFull from '../../components/mascot/MascotFull'
import { CalendarCheck, CircleCheck, Timer, Palette, LayoutGrid, ScrollText, Sun, Moon, Flower2, TreeDeciduous, Fish, Sparkles, Hourglass, Hexagon, Cat, Gift, TrendingUp, BarChart3, Repeat, Lock, Check, IceCreamCone, Sunrise, Rabbit, Gamepad2, Wand2 } from 'lucide-react'
import { ALL_THEMES, RARITY_LABEL, RARITY_DOT } from '../../data/themes'
import type { ThemeId, IconPack } from '../../types'

const SOURCE_ICON: Record<string, React.ComponentType<any>> = {
  check_in: CalendarCheck,
  study_time: Timer,
  task: CircleCheck,
  theme: Palette,
  icon_pack: LayoutGrid,
}

const SOURCE_LABEL: Record<string, string> = {
  check_in: '每日打卡',
  study_time: '专注学习',
  task: '完成任务',
  theme: '兑换主题',
  icon_pack: '兑换图标',
  welcome_bonus: '欢迎礼包',
}

const THEME_ICON: Record<ThemeId, React.ComponentType<any>> = {
  day: Sun,
  night: Moon,
  sakura: Flower2,
  forest: TreeDeciduous,
  ocean: Fish,
  galaxy: Sparkles,
}

const THEME_ICON_COLOR: Record<ThemeId, string> = {
  day: '#f59e0b',
  night: '#ffffff',
  sakura: '#be185d',
  forest: '#4caf50',
  ocean: '#60a5fa',
  galaxy: '#c4b5fd',
}

const THEME_PREVIEW: Record<ThemeId, string> = {
  day: 'linear-gradient(135deg, #faf7ff 0%, #f5f0ff 50%, #f0e6ff 100%)',
  night: 'linear-gradient(135deg, #14112a 0%, #1a1744 50%, #0f0d2e 100%)',
  sakura: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ee 50%, #ffd6e0 100%)',
  forest: 'linear-gradient(135deg, #f8fdfa 0%, #dde9e2 50%, #ecf5ef 100%)',
  ocean: 'linear-gradient(135deg, #07142a 0%, #0a2a5e 50%, #041128 100%)',
  galaxy: 'linear-gradient(135deg, #0c0a1a 0%, #1a0f3e 50%, #0a0814 100%)',
}

const ICON_PACKS = [
  { id: 'default', name: '默认', icon: Hourglass, color: '#6b7280', cost: 0 },
  { id: 'rainbow', name: '彩虹', icon: Sparkles, color: '#ec4899', cost: 50 },
  { id: 'minimal', name: '极简', icon: Hexagon, color: '#6366f1', cost: 50 },
  { id: 'animal', name: '动物', icon: Cat, color: '#d97706', cost: 50 },
  { id: 'candy', name: '糖果', icon: IceCreamCone, color: '#f43f5e', cost: 80 },
  { id: 'starry', name: '星愿', icon: Sparkles, color: '#8b5cf6', cost: 80 },
  { id: 'botanical', name: '草木', icon: Sunrise, color: '#22c55e', cost: 80 },
  { id: 'paws', name: '萌宠', icon: Rabbit, color: '#f97316', cost: 100 },
  { id: 'playful', name: '趣玩', icon: Gamepad2, color: '#0ea5e9', cost: 100 },
  { id: 'magic', name: '魔法', icon: Wand2, color: '#a855f7', cost: 120 },
] as const

export default function StoreModule() {
  const { balance, history, todayEarned, todayTasksDone, totalTasksDone, spendCount, isLoading, claimCheckIn, spendPoints, loadPoints } = usePointsStore()
  useEffect(() => { loadPoints() }, [])
  const {
    activeTheme, ownedThemes, iconPack, unlockedIconPacks,
    setActiveTheme, purchaseTheme, setIconPack, unlockIconPack,
  } = useSettingsStore()
  const [purchaseFeedback, setPurchaseFeedback] = useState<Record<string, string>>({})
  const [iconFeedback, setIconFeedback] = useState<{ id: string; type: 'info' | 'success' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string
    cost: number
    onConfirm: () => Promise<void> | void
  } | null>(null)
  const today = new Date().toISOString().split('T')[0]
  const checkInClaimed = history.some((t) => t.source === 'check_in' && t.date === today)

  const handleClaimCheckIn = async () => {
    await claimCheckIn()
  }

  const handleThemeAction = async (theme: ThemeId) => {
    if (ownedThemes.includes(theme)) {
      setActiveTheme(theme)
      return
    }
    const themeData = ALL_THEMES.find(t => t.id === theme)
    if (!themeData) return
    if (themeData.price === 0) {
      setActiveTheme(theme)
      return
    }
    setConfirmDialog({
      title: `确定兑换「${themeData.name}」主题？`,
      cost: themeData.price,
      onConfirm: async () => {
        setConfirmDialog(null)
        setPurchaseFeedback(prev => ({ ...prev, [theme]: 'buying' }))
        const result = await purchaseTheme(theme)
        if (result === 'success') {
          setPurchaseFeedback(prev => ({ ...prev, [theme]: 'success' }))
          setTimeout(() => setPurchaseFeedback(prev => ({ ...prev, [theme]: '' })), 2000)
        } else if (result === 'not_enough_points') {
          setPurchaseFeedback(prev => ({ ...prev, [theme]: 'insufficient' }))
          setTimeout(() => setPurchaseFeedback(prev => ({ ...prev, [theme]: '' })), 2500)
        }
      },
    })
  }

  const handleRedeemIconPack = async (item: { id: IconPack; name: string; cost: number }) => {
    if (unlockedIconPacks.includes(item.id)) {
      if (iconPack === item.id) {
        setIconFeedback({ id: item.id, type: 'info' })
        setTimeout(() => setIconFeedback(null), 2000)
        return
      }
      setIconPack(item.id)
      setIconFeedback({ id: item.id, type: 'success' })
      setTimeout(() => setIconFeedback(null), 2000)
      return
    }
    if (item.cost === 0) {
      setIconPack(item.id)
      setIconFeedback({ id: item.id, type: 'success' })
      setTimeout(() => setIconFeedback(null), 2000)
      return
    }
    setConfirmDialog({
      title: `确定兑换「${item.name}」图标皮肤？`,
      cost: item.cost,
      onConfirm: async () => {
        setConfirmDialog(null)
        const ok = await spendPoints(item.cost, 'icon_pack', `兑换图标：${item.name}`)
        if (ok) {
          unlockIconPack(item.id)
          setIconPack(item.id)
          setIconFeedback({ id: item.id, type: 'success' })
          setTimeout(() => setIconFeedback(null), 2000)
        } else {
          setIconFeedback({ id: item.id, type: 'info' })
          setTimeout(() => setIconFeedback(null), 2000)
        }
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 font-cn">
        积分加载中...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto overflow-x-visible p-1 relative" style={{ paddingRight: 6 }}>
      <div className="flex items-center gap-3">
        <MascotFull size={52} />
        <span className="font-cn text-lg font-bold text-gray-800">积分商城</span>
      </div>

      <div className="flex gap-3">
        <div className="soft-card p-4 flex-[2]">
          <h3 className="text-xs font-cn font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            积分概览
          </h3>
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-5 items-center justify-items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-cn text-gray-400">可用积分</span>
                <span className="text-xl font-en font-bold tabular-nums text-orange-600">{balance}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 self-center" />
              <div className="flex flex-col items-center gap-1">
                <TrendingUp size={12} color="#f97316" />
                <span className="text-[10px] font-cn text-gray-400">今日积分</span>
                <span className="text-xl font-en font-bold tabular-nums text-orange-600">{todayEarned}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 self-center" />
              <div className="flex flex-col items-center gap-1">
                <CircleCheck size={12} color="#22c55e" />
                <span className="text-[10px] font-cn text-gray-400">今日任务</span>
                <span className="text-xl font-en font-bold tabular-nums text-green-600">{todayTasksDone}</span>
              </div>
            </div>
            <div className="grid grid-cols-5 items-center justify-items-center">
              <div className="flex flex-col items-center gap-1">
                <BarChart3 size={12} color="#2563eb" />
                <span className="text-[10px] font-cn text-gray-400">完成总任务</span>
                <span className="text-xl font-en font-bold tabular-nums text-blue-600">{totalTasksDone}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 self-center" />
              <div className="flex flex-col items-center gap-1">
                <Repeat size={12} color="#7c3aed" />
                <span className="text-[10px] font-cn text-gray-400">兑换次数</span>
                <span className="text-xl font-en font-bold tabular-nums text-purple-600">{spendCount}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 self-center" />
              <div />
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="soft-card p-4 flex-1">
            <h3 className="text-xs font-cn font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <ScrollText size={14} strokeWidth={2} color="#6b7280" />
              近期记录
              <span className="text-[10px] font-cn text-gray-400 font-normal ml-auto">
                {history.length > 4 ? `共 ${history.length} 条` : ''}
              </span>
            </h3>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
              {history.map((txn) => {
                const SrcIcon = SOURCE_ICON[txn.source] || Gift
                return (
                  <div
                    key={txn.id}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg"
                    style={{ background: 'var(--card-alt)' }}
                  >
                    <span
                      className="text-sm font-en font-extrabold tabular-nums shrink-0 w-8 text-left"
                      style={{ color: txn.type === 'earn' ? '#15803d' : '#b91c1c' }}
                    >
                      {txn.amount >= 0 ? '+' : '-'}{Math.abs(txn.amount)}
                    </span>
                    <span className="shrink-0 w-4 flex items-center justify-center">
                      <SrcIcon size={14} strokeWidth={2} color="#6b7280" />
                    </span>
                    <span className="flex-1 text-xs font-cn text-gray-700 truncate">
                      {SOURCE_LABEL[txn.source] || txn.source}
                    </span>
                    <span className="text-[10px] font-en text-gray-400 shrink-0 tabular-nums">
                      {txn.date.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div
        className="soft-card p-4 flex items-center gap-3"
        style={{ background: 'var(--card-alt)' }}
      >
        <CalendarCheck
          size={28}
          strokeWidth={2}
          color={checkInClaimed ? '#22c55e' : '#f97316'}
        />
        <div className="flex-1">
          <span className="text-sm font-cn font-bold text-gray-800">
            {checkInClaimed ? '今日已领取' : '每日打卡'}
          </span>
          <p className="text-xs text-gray-500 font-cn">
            {checkInClaimed ? '明天再来领取吧~' : '每天第一次学习活动自动 +10 积分'}
          </p>
        </div>
        <button
          onClick={handleClaimCheckIn}
          disabled={checkInClaimed}
          className={`neo-btn px-4 py-2 text-sm font-cn ${checkInClaimed ? 'opacity-40' : 'primary'}`}
        >
          {checkInClaimed ? '已领取' : '+10'}
        </button>
      </div>

      {balance < 2000 && null}

      <div className="flex gap-2">
        <div className="soft-card flex-1 p-3 flex flex-col items-center gap-1">
          <CalendarCheck size={24} strokeWidth={1.5} color="#f97316" />
          <span className="text-xs font-cn text-gray-600">每日打卡</span>
          <span className="text-xl font-en font-bold text-orange-600 tabular-nums">+10</span>
        </div>
        <div className="soft-card flex-1 p-3 flex flex-col items-center gap-1">
          <CircleCheck size={24} strokeWidth={1.5} color="#22c55e" />
          <span className="text-xs font-cn text-gray-600">完成任务</span>
          <span className="text-xl font-en font-bold text-green-600 tabular-nums">+5</span>
        </div>
        <div className="soft-card flex-1 p-3 flex flex-col items-center gap-1">
          <Timer size={24} strokeWidth={1.5} color="#a855f7" />
          <span className="text-xs font-cn text-gray-600">学习30分钟</span>
          <span className="text-xl font-en font-bold text-purple-600 tabular-nums">+10</span>
        </div>
      </div>

      <div className="soft-card p-4">
        <h3 className="text-sm font-cn font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <Palette size={18} strokeWidth={2} color="#ec4899" />
          主题兑换
          <span className="text-[10px] font-cn text-gray-400 font-normal ml-auto">
            {ownedThemes.length}/6 已解锁
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {ALL_THEMES.map((t) => {
            const owned = ownedThemes.includes(t.id)
            const active = activeTheme === t.id
            const canAfford = balance >= t.price
            const Icon = THEME_ICON[t.id]
            const feedback = purchaseFeedback[t.id]
            const rarityColor = RARITY_DOT[t.rarity] || '#74b9ff'

            return (
              <button
                key={t.id}
                onClick={() => handleThemeAction(t.id)}
                disabled={feedback === 'buying'}
                className={`relative p-2.5 rounded-2xl border-2 flex gap-2 items-center overflow-hidden ${
                  active
                    ? 'border-purple-500 bg-purple-50'
                    : owned
                    ? 'border-green-300 bg-green-50 hover:border-green-500'
                    : canAfford
                    ? 'border-gray-200 bg-white hover:border-orange-300'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2"
                  style={{
                    background: THEME_PREVIEW[t.id],
                    borderColor: active ? '#7c3aed' : owned ? '#86efac' : '#e5e7eb',
                  }}
                >
                  <Icon size={16} strokeWidth={2} color={THEME_ICON_COLOR[t.id]} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-cn font-bold text-gray-800">{t.name}</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: rarityColor }}
                    />
                  </div>
                  <span className="text-[10px] font-cn text-gray-500 block leading-tight">
                    {t.rarity === 'free' ? '免费' : `${RARITY_LABEL[t.rarity]}`}
                  </span>
                </div>
                {active && (
                  <span className="shrink-0 text-purple-500 font-bold text-xs">使用中</span>
                )}
                {owned && !active && (
                  <Check size={16} strokeWidth={2.5} color="#22c55e" className="shrink-0" />
                )}
                {!owned && (
                  <span className="shrink-0 flex flex-col items-end">
                    <span className="text-[10px] font-cn text-gray-400 flex items-center gap-0.5">
                      <Lock size={9} strokeWidth={2} />
                      {t.price}
                    </span>
                  </span>
                )}
                {feedback === 'buying' && (
                  <span
                    className="absolute inset-0 flex items-center justify-center rounded-2xl"
                    style={{ background: 'color-mix(in srgb, var(--card-bg) 85%, transparent)' }}
                  >
                    <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
                {feedback === 'success' && (
                  <span className="absolute inset-0 bg-green-100/90 flex items-center justify-center rounded-2xl">
                    <span className="text-xs font-cn font-bold text-green-600">✓ 已解锁</span>
                  </span>
                )}
                {feedback === 'insufficient' && (
                  <span className="absolute inset-0 bg-red-50/90 flex items-center justify-center rounded-2xl">
                    <span className="text-[10px] font-cn font-bold text-red-500">积分不足</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-[10px] font-cn text-gray-400 mt-2.5 text-center">
          白天、黑夜免费开放 ｜ 樱花 100 · 森林 150 · 海洋 200 · 星河 300 积分
        </p>
      </div>

      <div className="soft-card p-4">
        <h3 className="text-sm font-cn font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <LayoutGrid size={18} strokeWidth={2} color="#3b82f6" />
          图标皮肤
          <span className="text-xs font-cn text-gray-400 font-normal ml-auto">
            默认免费 ｜ 50~120 积分
          </span>
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {ICON_PACKS.map((item) => {
            const unlocked = unlockedIconPacks.includes(item.id)
            const active = iconPack === item.id
            const canAfford = balance >= item.cost
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleRedeemIconPack(item)}
                className={`relative p-3 rounded-2xl border-2 flex flex-col items-center gap-1 ${
                  active
                    ? 'border-purple-500 bg-purple-50'
                    : unlocked
                    ? 'border-green-300 bg-green-50 hover:border-green-500'
                    : canAfford
                    ? 'border-gray-200 bg-white hover:border-orange-300'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Icon size={22} strokeWidth={1.5} color={active ? '#7c3aed' : item.color} />
                <span className="text-xs font-cn font-bold text-gray-800">
                  {item.name}
                </span>
                <span className="text-[10px] font-cn text-gray-500">
                  {active ? '使用中' : unlocked ? '已解锁' : item.cost === 0 ? '免费' : `${item.cost}`}
                </span>
                {iconFeedback?.id === item.id && iconFeedback.type === 'info' && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(243,244,246,0.92)' }}
                  >
                    <span className="text-[10px] font-cn font-bold text-gray-500">已是当前皮肤</span>
                  </span>
                )}
                {iconFeedback?.id === item.id && iconFeedback.type === 'success' && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(220,252,231,0.92)' }}
                  >
                    <span className="text-[10px] font-cn font-bold text-green-600">✓ 已切换</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      {confirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setConfirmDialog(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="soft-card w-80 p-5 flex flex-col gap-4"
            style={{ background: 'var(--card-bg)', borderRadius: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#fef3c7' }}
              >
                <Lock size={24} strokeWidth={2} color="#d97706" />
              </div>
              <h4 className="text-sm font-cn font-bold text-gray-800 text-center leading-relaxed">
                {confirmDialog.title}
              </h4>
              <p className="text-xs font-cn text-gray-500">
                将扣除 <span className="text-orange-600 font-bold">{confirmDialog.cost}</span> 积分
              </p>
              <p className="text-[10px] font-cn text-gray-400">
                当前可用积分：{balance}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 neo-btn px-4 py-2 text-xs font-cn"
              >
                取消
              </button>
              <button
                onClick={() => { confirmDialog.onConfirm() }}
                disabled={balance < confirmDialog.cost}
                className={`flex-1 neo-btn primary px-4 py-2 text-xs font-cn ${
                  balance < confirmDialog.cost ? 'opacity-50' : ''
                }`}
              >
                确认
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}