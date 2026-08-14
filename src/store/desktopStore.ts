import { create } from 'zustand'
import {
  Hourglass, Sun, Clock, Bug,
  Puzzle, Brain, BookOpen,
  Map, Compass, Star, Target, Book,
  Globe, Newspaper, Signal,
  Award, Medal, BadgeCheck, Trophy,
  Palette, Radio, FileText, BookHeart,
  IceCreamCone, Cookie, Lollipop, CakeSlice, CupSoda, ShoppingBag,
  Sparkles, StarHalf, Gem,
  Sunrise, Leaf, Sprout, Flower2, CloudSun, Wheat,
  Fish, Bird, Rabbit, Cat, Dog,
  Gamepad2, Dice5, Rocket, Bomb, Megaphone, Gift,
  Wand2, Flame, Moon,
} from 'lucide-react'
import type { DesktopIcon, ModuleId, IconPack } from '../types'

const initialIcons: DesktopIcon[] = [
  { id: 'timer', name: '专注时刻', icon: Hourglass },
  { id: 'flashcards', name: '知识卡卡', icon: Puzzle },
  { id: 'planner', name: '今日计划', icon: Map },
  { id: 'quiz', name: '题题大作战', icon: Target },
  { id: 'news', name: '新闻早报', icon: Newspaper },
  { id: 'store', name: '积分商城', icon: Award },
]

export const ICON_PACKS: Record<IconPack, Record<ModuleId, React.ComponentType<any>>> = {
  default:    { timer: Hourglass, flashcards: Puzzle, planner: Map, quiz: Target, news: Newspaper, store: Award },
  rainbow:    { timer: Sun, flashcards: Globe, planner: Star, quiz: Palette, news: Radio, store: Medal },
  minimal:    { timer: Clock, flashcards: Brain, planner: Compass, quiz: Book, news: FileText, store: BadgeCheck },
  animal:     { timer: Bug, flashcards: BookOpen, planner: Book, quiz: BookHeart, news: Signal, store: Trophy },
  candy:      { timer: IceCreamCone, flashcards: Cookie, planner: Lollipop, quiz: CakeSlice, news: CupSoda, store: ShoppingBag },
  starry:     { timer: Star, flashcards: Sparkles, planner: StarHalf, quiz: Compass, news: Radio, store: Gem },
  botanical:  { timer: Sunrise, flashcards: Leaf, planner: Sprout, quiz: Flower2, news: CloudSun, store: Wheat },
  paws:       { timer: Fish, flashcards: Bird, planner: Rabbit, quiz: Bug, news: Cat, store: Dog },
  playful:    { timer: Gamepad2, flashcards: Dice5, planner: Rocket, quiz: Bomb, news: Megaphone, store: Gift },
  magic:      { timer: Wand2, flashcards: Sparkles, planner: Flame, quiz: Moon, news: Sun, store: Gem },
}

interface DesktopStore {
  activeModuleId: ModuleId
  icons: DesktopIcon[]
  setActiveModule: (id: ModuleId) => void
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  activeModuleId: 'timer',
  icons: initialIcons,

  setActiveModule: (id) => set({ activeModuleId: id }),
}))