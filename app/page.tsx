// 首頁
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Github, ExternalLink, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getLatestPosts } from '@/lib/posts'
import { getGitHubRepos, getGitHubUser } from '@/lib/github'
import { formatDate, calculateReadingTime } from '@/lib/utils'

function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I&apos;m{' '}
              <span className="gradient-text animate-glow">
                ShangYi7
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              我是 ShangYi7,一名熱愛創新的開發者
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button asChild variant="accent" size="lg">
              <Link href="/about">
                了解有關我的更多信息
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                閱讀我的文章
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  )
}

async function LatestPosts() {
  const posts = await getLatestPosts(3)

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">最新文章</h2>
            <p className="text-foreground-muted">最近的想法和教程</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/blog">
              查看所有文章
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.slug} hover className="group">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{calculateReadingTime(post.content)} min read</span>
                </div>
                <CardTitle className="group-hover:text-accent transition-colors duration-200">
                  {post.title}
                </CardTitle>
                <CardDescription>
                  {post.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-white/10 rounded-full text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

async function GitHubActivity() {
  const [user, repos] = await Promise.all([
    getGitHubUser(),
    getGitHubRepos()
  ])

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">GitHub 活動</h2>
            <p className="text-foreground-muted">最近的項目和貢獻</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/projects">
              查看所有項目
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* GitHub Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{user.public_repos}</div>
              <div className="text-sm text-foreground-muted">公開倉庫</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{user.followers}</div>
              <div className="text-sm text-foreground-muted">關注數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{user.following}</div>
              <div className="text-sm text-foreground-muted">關注的用戶數</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Repositories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.slice(0, 4).map((repo) => (
            <Card key={repo.id} hover className="group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-accent transition-colors duration-200">
                    {repo.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-foreground-muted">
                    <Github className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                </div>
                <CardDescription>
                  {repo.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {repo.language && (
                    <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-accent">
                      {repo.language}
                    </span>
                  )}
                  <Button asChild variant="ghost" size="sm">
                    <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <Suspense fallback={
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-6 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      }>
        <LatestPosts />
      </Suspense>

      <Suspense fallback={
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      }>
        <GitHubActivity />
      </Suspense>
    </div>
  )
}