import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getPrivateProjectBySlug, type PrivateProject } from '@/lib/projects'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function PrivateProjectPage({ params }: PageProps) {
  const project = await getPrivateProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回專案列表
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {project.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            {project.description}
          </p>

          {/* Project Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>開始日期：{formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>完成日期：{formatDate(project.endDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: project.status === '已完成' ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: project.status === '已完成' ? 'var(--success)' : 'var(--warning)'
                }}
              >
                {project.status}
              </span>
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full text-accent"
                style={{ backgroundColor: 'var(--glass-bg)' }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {project.github && (
              <Button asChild variant="ghost">
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  查看代碼
                </Link>
              </Button>
            )}
            {project.demo && (
              <Button asChild variant="accent">
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  查看演示
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Project Content */}
        <Card>
          <CardHeader>
            <CardTitle>專案詳情</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
              style={{
                '--tw-prose-body': 'var(--foreground)',
                '--tw-prose-headings': 'var(--foreground)',
                '--tw-prose-links': 'var(--accent)',
                '--tw-prose-bold': 'var(--foreground)',
                '--tw-prose-counters': 'var(--muted-foreground)',
                '--tw-prose-bullets': 'var(--muted-foreground)',
                '--tw-prose-hr': 'var(--border)',
                '--tw-prose-quotes': 'var(--muted-foreground)',
                '--tw-prose-quote-borders': 'var(--border)',
                '--tw-prose-captions': 'var(--muted-foreground)',
                '--tw-prose-code': 'var(--accent)',
                '--tw-prose-pre-code': 'var(--foreground)',
                '--tw-prose-pre-bg': 'var(--glass-bg)',
                '--tw-prose-th-borders': 'var(--border)',
                '--tw-prose-td-borders': 'var(--border)'
              } as React.CSSProperties}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 生成靜態路徑
export async function generateStaticParams() {
  // 由於使用靜態數據，直接返回已知的 slug
  return [
    { slug: 'ai-chatbot' },
    { slug: 'e-commerce-platform' }
  ]
}