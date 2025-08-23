// 由於使用靜態導出，改為直接定義私人專案數據
// 在實際部署時，可以考慮使用構建時腳本來生成這些數據

export interface PrivateProject {
  slug: string
  title: string
  description: string
  technologies: string[]
  status: string
  startDate: string
  endDate?: string
  featured: boolean
  type: 'private' | 'public'
  image?: string
  demo?: string | null
  github?: string | null
  content: string
  excerpt?: string
}

// 靜態私人專案數據
const privateProjectsData: PrivateProject[] = [
  {
    slug: 'ai-chatbot',
    title: 'AI 智能聊天機器人',
    description: '一個基於 GPT-4 的智能聊天機器人，支援多輪對話、上下文理解和個性化回應。',
    technologies: ['Next.js', 'TypeScript', 'OpenAI API', 'Tailwind CSS', 'Prisma'],
    status: '開發中',
    startDate: '2024-01-15',
    endDate: undefined,
    featured: true,
    type: 'private',
    image: '/images/projects/ai-chatbot.png',
    demo: null,
    github: null,
    content: '<h1>AI 智能聊天機器人</h1><p>這是一個基於最新 GPT-4 技術的智能聊天機器人...</p>',
    excerpt: '一個基於 GPT-4 的智能聊天機器人，支援多輪對話、上下文理解和個性化回應，採用 Next.js 和 TypeScript 開發...'
  },
  {
    slug: 'e-commerce-platform',
    title: '電商平台系統',
    description: '一個全棧電商平台，包含商品管理、訂單處理、支付整合和用戶管理等完整功能。',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
    status: '已完成',
    startDate: '2023-08-01',
    endDate: '2024-02-15',
    featured: true,
    type: 'private',
    image: '/images/projects/ecommerce.png',
    demo: null,
    github: null,
    content: '<h1>電商平台系統</h1><p>這是一個為中小企業設計的完整電商解決方案...</p>',
    excerpt: '一個全棧電商平台，包含商品管理、訂單處理、支付整合和用戶管理等完整功能，採用現代化技術棧開發...'
  }
]

export async function getPrivateProjects(): Promise<PrivateProject[]> {
  // 按 featured 和日期排序
  return privateProjectsData.sort((a, b) => {
    // 優先顯示 featured 專案
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    
    // 然後按開始日期排序（最新的在前）
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
}

export async function getPrivateProjectBySlug(slug: string): Promise<PrivateProject | null> {
  return privateProjectsData.find(project => project.slug === slug) || null
}

export function getFeaturedPrivateProjects(limit: number = 3): Promise<PrivateProject[]> {
  return getPrivateProjects().then(projects => 
    projects.filter(project => project.featured).slice(0, limit)
  )
}