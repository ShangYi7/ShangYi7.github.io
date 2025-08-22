import { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Github, ExternalLink, Star, GitFork, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getGitHubRepos, getGitHubUser } from '@/lib/github'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore ShangYi7\'s projects and open-source contributions on GitHub.',
}

const featuredProjects = [
  {
    name: 'Personal Website',
    description: 'A modern personal website and blog built with Next.js 14, TypeScript, and Tailwind CSS featuring glassmorphism design.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    github: 'https://github.com/ShangYi7/shangyi7.github.io',
    demo: 'https://shangyi7.github.io',
    featured: true
  },
  {
    name: 'React Component Library',
    description: 'A comprehensive React component library with TypeScript support, Storybook documentation, and automated testing.',
    technologies: ['React', 'TypeScript', 'Storybook', 'Jest'],
    github: 'https://github.com/ShangYi7/react-components',
    demo: 'https://shangyi7-components.vercel.app',
    featured: true
  },
  {
    name: 'Task Management App',
    description: 'A full-stack task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io'],
    github: 'https://github.com/ShangYi7/task-manager',
    demo: 'https://task-manager-shangyi7.vercel.app',
    featured: true
  }
]

async function GitHubStats() {
  const user = await getGitHubUser()
  
  const stats = [
    { label: 'Public Repositories', value: user.public_repos },
    { label: 'Followers', value: user.followers },
    { label: 'Following', value: user.following },
    { label: 'Total Stars', value: '50+' }, // This would be calculated from all repos
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

async function GitHubRepositories() {
  const repos = await getGitHubRepos()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <Card key={repo.id} hover className="group h-full flex flex-col">
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
              {repo.description || 'No description available'}
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
              <div className="flex flex-wrap gap-1">
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
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            A collection of projects I&apos;ve built, contributed to, and open-sourced.
            From web applications to developer tools, here&apos;s what I&apos;ve been working on.
          </p>
        </div>

        {/* GitHub Stats */}
        <Suspense fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="h-8 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <GitHubStats />
        </Suspense>

        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.name} hover className="group h-full flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle className="group-hover:text-accent transition-colors duration-200">
                    {project.name}
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
                    <Button asChild variant="ghost" size="sm" className="flex-1">
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Link>
                    </Button>
                    
                    {project.demo && (
                      <Button asChild variant="accent" size="sm" className="flex-1">
                        <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All GitHub Repositories */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>All Repositories</h2>
              <p className="text-foreground-muted">
                Explore all my public repositories on GitHub
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="https://github.com/ShangYi7" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse h-48">
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
          }>
            <GitHubRepositories />
          </Suspense>
        </div>

        {/* Call to Action */}
        <Card className="glass-medium mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Interested in collaborating?
            </h3>
            <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
              I&apos;m always open to interesting projects and collaborations. 
              Whether you have an idea for a new project or want to contribute to existing ones, 
              let&apos;s build something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg">
                <Link href="mailto:contact@shangyi7.com">
                  Get In Touch
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/ShangYi7" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  Follow on GitHub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}