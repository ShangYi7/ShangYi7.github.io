'use client'

import Link from 'next/link'
import { Github, ExternalLink, Star, GitFork, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { getGitHubRepos, getGitHubUser, type GitHubRepo } from '@/lib/github'
import { getPrivateProjects, type PrivateProject } from '@/lib/projects'
import { formatDate } from '@/lib/utils'
import { useState, useEffect } from 'react'

function GitHubStats({ user }: { user: any }) {
  if (!user) return null

  const stats = [
    { label: '公開存放庫', value: user.public_repos },
    { label: '關注數', value: user.followers },
    { label: '關注的用戶數', value: user.following },
    { label: '總星數', value: '1+' }, // 這將從所有存儲庫中計算
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
            <div className="text-sm text-foreground-muted">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RepositoryCard({ repo }: { repo: GitHubRepo }) {

  return (
    <Card hover className="group h-full flex flex-col">
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg group-hover:text-accent transition-colors duration-200 truncate">
            {repo.name}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm text-foreground-muted flex-shrink-0">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{repo.forks_count}</span>
            </div>
          </div>
        </div>

        <CardDescription className="line-clamp-3">
          {repo.description || '暫無描述'}
        </CardDescription>

        <div className="flex items-center gap-2 text-sm text-foreground-muted mt-2">
          <Calendar className="h-4 w-4" />
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          {repo.language && (
            <span className="px-3 py-1 text-xs rounded-full text-accent" style={{ backgroundColor: 'var(--glass-bg)' }}>
              {repo.language}
            </span>
          )}

          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
               <Link href={`/projects/${repo.owner.login}/${repo.name}`}>
                 <FileText className="h-4 w-4 mr-1" />
                 README
               </Link>
             </Button>
            
            <Button asChild variant="ghost" size="sm">
              <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </Link>
            </Button>

            {repo.homepage && (
              <Button asChild variant="ghost" size="sm">
                <Link href={repo.homepage} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 text-xs rounded text-foreground-muted"
                style={{ backgroundColor: 'var(--glass-bg)' }}
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="px-2 py-1 text-xs rounded text-foreground-muted" style={{ backgroundColor: 'var(--glass-bg)' }}>
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}


      </CardContent>
    </Card>
  )
}

function GitHubRepositories({ repos }: { repos: GitHubRepo[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(repos.length / itemsPerPage)
  
  // Calculate current page items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRepos = repos.slice(startIndex, endIndex)
  
  // Reset to page 1 when repos change
  useEffect(() => {
    setCurrentPage(1)
  }, [repos.length])
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRepos.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}
    </div>
  )
}

function PrivateProjectCard({ project }: { project: PrivateProject }) {
  return (
    <Card hover className="group h-full flex flex-col">
      <Link href={`/projects/private/${project.slug}`} className="flex-1 flex flex-col">
        <CardHeader className="flex-1">
          <CardTitle className="group-hover:text-accent transition-colors duration-200">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-full text-accent"
                style={{ backgroundColor: 'var(--glass-bg)' }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {project.github && (
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Link>
              </Button>
            )}

            {project.demo && (
              <Button 
                asChild 
                variant="accent" 
                size="sm" 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Demo
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default function ProjectsPage() {
  const [user, setUser] = useState<any>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [privateProjects, setPrivateProjects] = useState<PrivateProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [userData, reposData, privateProjectsData] = await Promise.all([
          getGitHubUser('ShangYi7'),
          getGitHubRepos(100), // 獲取更多儲存庫
          getPrivateProjects()
        ])
        
        setUser(userData)
        setRepos(reposData)
        setPrivateProjects(privateProjectsData)
      } catch (err) {
        setError('無法載入 GitHub 資料，請稍後再試。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">載入中...</p>
        </div>
      </div>
    )
  }

  if (error || !user || !repos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">載入失敗</h1>
          <p className="text-gray-400">{error || '無法載入 GitHub 資料，請稍後再試。'}</p>
        </div>
      </div>
    )
  }

  // 過濾出所有公開的倉庫
  const publicRepos = repos
    .filter(repo => !repo.private)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  // 獲取精選的私人專案
  const featuredPrivateProjects = privateProjects.filter(project => project.featured)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            我的<span className="gradient-text">專案</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            我構建、貢獻和開源的專案集合。
            從網站到開發工具，這裡是我一直在工作的內容。
            我喜歡分享我的知識和技術，並與其他開發者合作。
          </p>
        </div>

        {/* GitHub Stats */}
        <GitHubStats user={user} />

        {/* Featured Private Projects */}
        {featuredPrivateProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>精選專案</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredPrivateProjects.map((project) => (
                 <PrivateProjectCard key={project.slug} project={project} />
               ))}
            </div>
          </div>
        )}

        {/* All GitHub Repositories */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Github 公開儲存庫</h2>
              <p className="text-foreground-muted">
                探索我的所有公開存放庫
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="https://github.com/ShangYi7" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                查看 GitHub
              </Link>
            </Button>
          </div>

          <GitHubRepositories repos={publicRepos} />
        </div>

        {/* Call to Action */}
        <Card className="glass-medium mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              對合作感興趣嗎？
            </h3>
            <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
              我始終對興趣盎然的項目和合作開放。
              無論您有一個新項目或想為現有項目貢獻，
              讓我們一起構建一個令人驚豔的項目！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg">
                <Link href="mailto:contact@shangyi7.com">
                  聯繫我
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/ShangYi7" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  關注 GitHub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}