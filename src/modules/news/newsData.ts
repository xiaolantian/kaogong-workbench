export interface NewsItem {
  date: string
  title: string
  content: string
  examPoint: string
}

export const defaultNews: NewsItem[] = [
  {
    date: '2026-08-11',
    title: '国务院发布关于促进新质生产力的指导意见',
    content: '近日，国务院印发指导意见，强调加快发展新质生产力，推动科技创新与产业升级深度融合。',
    examPoint: '申论写作素材：新质生产力、高质量发展；常识判断：政策文件'
  },
  {
    date: '2026-08-10',
    title: '全国教育工作会议强调职业教育改革',
    content: '会议强调深化现代职业教育体系建设改革，推动产教融合、科教融汇。',
    examPoint: '常识判断：教育政策；申论：教育公平、职业教育'
  },
  {
    date: '2026-08-09',
    title: '2026年夏季达沃斯论坛闭幕',
    content: '本届达沃斯论坛以"可持续与包容性发展"为主题，多国代表共商全球合作。',
    examPoint: '常识判断：国际时事、重要会议；申论素材'
  },
  {
    date: '2026-08-08',
    title: '工信部推动人工智能产业发展规划',
    content: '工信部发布人工智能产业发展规划，提出到2030年建成全球领先的人工智能创新高地。',
    examPoint: '常识判断：科技政策；言语理解：科技类材料'
  },
  {
    date: '2026-08-07',
    title: '中央经济工作会议部署下半年重点工作',
    content: '会议强调稳就业、稳民生，加大对中小微企业的政策支持。',
    examPoint: '常识判断：中央会议内容；申论：民生保障'
  },
]
