const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'ShangYi7'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'ShangYi7-Website',
}

if (GITHUB_TOKEN) {
  headers['Authorization'] = `token ${GITHUB_TOKEN}`
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string
  company: string | null
  blog: string | null
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
  homepage: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  visibility: string
  default_branch: string
  fork: boolean
  readme?: string | null
}

export interface GitHubReadme {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  content: string
  encoding: string
}

export interface GitHubEvent {
  id: string
  type: string
  actor: {
    id: number
    login: string
    display_login: string
    gravatar_id: string
    url: string
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

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'GitHubAPIError'
  }
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new GitHubAPIError(
        `GitHub API error: ${response.statusText}`,
        response.status
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw error
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('GitHub API request timeout:', endpoint)
      throw new GitHubAPIError('GitHub API request timeout')
    }
    
    console.error('GitHub API fetch error:', error)
    throw new GitHubAPIError('Failed to fetch from GitHub API')
  }
}

export async function getGitHubUser(): Promise<GitHubUser> {
  try {
    return await fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`)
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    // Return fallback data
    return {
      login: GITHUB_USERNAME,
      id: 0,
      avatar_url: '',
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      name: 'ShangYi7',
      company: null,
      blog: null,
      location: 'Taiwan',
      email: null,
      bio: 'Passionate developer',
      public_repos: 10,
      public_gists: 0,
      followers: 50,
      following: 30,
      created_at: '2020-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
    }
  }
}

export async function getGitHubRepos(limit: number = 100): Promise<GitHubRepo[]> {
  try {
    const repos = await fetchGitHub<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}`
    )
    
    // Filter out forks except for important ones (like github.io repos) and sort by a combination of stars and recent activity
    return repos
      .filter(repo => {
        // Keep non-fork repos
        if (!repo.fork) return true
        // Keep github.io repos even if they are forks
        if (repo.name.includes('.github.io')) return true
        // Keep forks with significant activity (stars or recent updates)
        if (repo.stargazers_count > 0 || new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return true
        return false
      })
      .sort((a, b) => {
        // Primary sort: by stars (descending)
        const starDiff = b.stargazers_count - a.stargazers_count
        if (starDiff !== 0) return starDiff
        
        // Secondary sort: by update time (most recent first)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    // Return fallback data
    return [
      {
        id: 1,
        name: 'personal-website',
        full_name: `${GITHUB_USERNAME}/personal-website`,
        description: 'My personal website and blog built with Next.js',
        html_url: `https://github.com/${GITHUB_USERNAME}/personal-website`,
        homepage: 'https://shangyi7.github.io',
        language: 'TypeScript',
        stargazers_count: 15,
        watchers_count: 15,
        forks_count: 3,
        open_issues_count: 0,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
        topics: ['nextjs', 'typescript', 'tailwindcss', 'blog'],
        visibility: 'public',
        default_branch: 'main',
        fork: false,
      },
      {
        id: 2,
        name: 'react-components',
        full_name: `${GITHUB_USERNAME}/react-components`,
        description: 'A collection of reusable React components',
        html_url: `https://github.com/${GITHUB_USERNAME}/react-components`,
        homepage: null,
        language: 'JavaScript',
        stargazers_count: 8,
        watchers_count: 8,
        forks_count: 2,
        open_issues_count: 1,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: new Date().toISOString(),
        pushed_at: new Date().toISOString(),
        topics: ['react', 'components', 'ui'],
        visibility: 'public',
        default_branch: 'main',
        fork: false,
      },
    ]
  }
}

export async function getGitHubEvents(limit: number = 10): Promise<GitHubEvent[]> {
  try {
    const events = await fetchGitHub<GitHubEvent[]>(
      `/users/${GITHUB_USERNAME}/events/public?per_page=${limit}`
    )
    
    // Filter for interesting event types
    const interestingEvents = ['PushEvent', 'CreateEvent', 'ReleaseEvent', 'PublicEvent']
    
    return events.filter(event => interestingEvents.includes(event.type))
  } catch (error) {
    console.error('Error fetching GitHub events:', error)
    return []
  }
}

export async function getGitHubContributions(): Promise<{
  totalContributions: number
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number
      date: string
    }>
  }>
}> {
  // This would require GitHub GraphQL API or scraping
  // For now, return mock data
  return {
    totalContributions: 365,
    weeks: [],
  }
}

// Get repository languages
export async function getRepoLanguages(repoName: string): Promise<Record<string, number>> {
  try {
    return await fetchGitHub<Record<string, number>>(
      `/repos/${GITHUB_USERNAME}/${repoName}/languages`
    )
  } catch (error) {
    console.error(`Error fetching languages for ${repoName}:`, error)
    return {}
  }
}

// Get repository topics
export async function getRepoTopics(repoName: string): Promise<string[]> {
  try {
    const response = await fetchGitHub<{ names: string[] }>(
      `/repos/${GITHUB_USERNAME}/${repoName}/topics`
    )
    return response.names
  } catch (error) {
    console.error(`Error fetching topics for ${repoName}:`, error)
    return []
  }
}

// Get total stars across all repositories
export async function getTotalStars(): Promise<number> {
  try {
    const repos = await getGitHubRepos(100) // Get more repos for accurate count
    return repos.reduce((total, repo) => total + repo.stargazers_count, 0)
  } catch (error) {
    console.error('Error calculating total stars:', error)
    return 0
  }
}

export async function getRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const readme = await fetchGitHub<GitHubReadme>(`/repos/${owner}/${repo}/readme`)
    
    if (readme.encoding === 'base64') {
      // 使用正確的方法解碼 UTF-8 編碼的 base64 內容
      const base64Content = readme.content.replace(/\s/g, '')
      
      // 在 Node.js 環境中使用 Buffer，在瀏覽器環境中使用 TextDecoder
      if (typeof Buffer !== 'undefined') {
        // Node.js 環境（伺服器端）
        return Buffer.from(base64Content, 'base64').toString('utf-8')
      } else {
        // 瀏覽器環境（客戶端）
        try {
          const binaryString = atob(base64Content)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          return new TextDecoder('utf-8').decode(bytes)
        } catch (decodeError) {
          console.error('Error decoding base64 content:', decodeError)
          // 降級處理：嘗試直接使用 atob
          return atob(base64Content)
        }
      }
    }
    
    return readme.content
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error)
    return null
  }
}

export async function getGitHubReposWithReadme(limit: number = 100): Promise<GitHubRepo[]> {
  try {
    const repos = await getGitHubRepos(limit)
    
    // For performance, we'll load README on demand rather than fetching all at once
    return repos.map(repo => ({ ...repo, readme: null }))
  } catch (error) {
    console.error('Error fetching GitHub repos with README:', error)
    return []
  }
}