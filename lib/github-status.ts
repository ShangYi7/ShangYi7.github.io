// GitHub 狀態 API 服務
// 用於獲取 GitHub 用戶統計和活動數據

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  pushed_at: string
  created_at: string
}

export interface GitHubEvent {
  id: string
  type: string
  actor: {
    id: number
    login: string
    avatar_url: string
  }
  repo: {
    id: number
    name: string
    url: string
  }
  payload: any
  public: boolean
  created_at: string
}

export interface GitHubStats {
  user: GitHubUser
  totalStars: number
  totalForks: number
  totalCommits: number
  lastActivity: string
  recentRepos: GitHubRepo[]
  recentEvents: GitHubEvent[]
}

const GITHUB_API_BASE = 'https://api.github.com'
const USERNAME = 'ShangYi7'

/**
 * 獲取 GitHub 用戶基本信息
 */
export async function getGitHubUser(): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ShangYi7-Status-Page'
    },
    next: { revalidate: 300 } // 5 分鐘快取
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 獲取用戶的公開倉庫
 */
export async function getUserRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}/repos?sort=updated&per_page=10`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ShangYi7-Status-Page'
    },
    next: { revalidate: 300 } // 5 分鐘快取
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 獲取用戶的公開活動事件
 */
export async function getUserEvents(): Promise<GitHubEvent[]> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}/events/public?per_page=30`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ShangYi7-Status-Page'
    },
    next: { revalidate: 180 } // 3 分鐘快取
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub events: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 計算總星數和分叉數
 */
function calculateRepoStats(repos: GitHubRepo[]) {
  return repos.reduce(
    (acc, repo) => ({
      totalStars: acc.totalStars + repo.stargazers_count,
      totalForks: acc.totalForks + repo.forks_count
    }),
    { totalStars: 0, totalForks: 0 }
  )
}

/**
 * 計算提交數（從事件中估算）
 */
function calculateCommitCount(events: GitHubEvent[]): number {
  return events.filter(event => event.type === 'PushEvent').reduce((count, event) => {
    return count + (event.payload?.commits?.length || 0)
  }, 0)
}

/**
 * 獲取最後活動時間
 */
function getLastActivity(events: GitHubEvent[]): string {
  if (events.length === 0) return 'No recent activity'
  
  const lastEvent = events[0]
  const date = new Date(lastEvent.created_at)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Less than an hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} weeks ago`
}

/**
 * 獲取完整的 GitHub 統計數據
 */
export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const [user, repos, events] = await Promise.all([
      getGitHubUser(),
      getUserRepos(),
      getUserEvents()
    ])

    const { totalStars, totalForks } = calculateRepoStats(repos)
    const totalCommits = calculateCommitCount(events)
    const lastActivity = getLastActivity(events)

    return {
      user,
      totalStars,
      totalForks,
      totalCommits,
      lastActivity,
      recentRepos: repos.slice(0, 5),
      recentEvents: events.slice(0, 10)
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    throw error
  }
}

/**
 * 檢查 GitHub API 狀態
 */
export async function checkGitHubStatus(): Promise<{
  status: 'operational' | 'degraded' | 'outage'
  description: string
  lastChecked: string
}> {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ShangYi7-Status-Page'
      }
    })

    if (response.ok) {
      return {
        status: 'operational',
        description: 'All systems operational',
        lastChecked: new Date().toISOString()
      }
    } else {
      return {
        status: 'degraded',
        description: `API responding with status ${response.status}`,
        lastChecked: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      status: 'outage',
      description: 'Unable to reach GitHub API',
      lastChecked: new Date().toISOString()
    }
  }
}