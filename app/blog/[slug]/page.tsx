import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts, getAdjacentPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | ShangYi7 Blog`,
    description: post.summary,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author || 'ShangYi7' }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'ShangYi7'],
      tags: post.tags,
      images: post.image ? [{
        url: post.image,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.image ? [post.image] : undefined,
    },
  }
}

// Table of Contents component
function TableOfContents({ content }: { content: string }) {
  // Extract headings from markdown content
  const headings = content.match(/^#{1,6}\s+(.+)$/gm) || []
  
  if (headings.length === 0) return null

  const tocItems = headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 1
    const text = heading.replace(/^#+\s+/, '')
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    return { level, text, id }
  })

  return (
    <Card className="sticky top-8 p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">目錄</h3>
      <nav className="space-y-2">
        {tocItems.map((item, index) => (
          <a
            key={index}
            href={`#${item.id}`}
            className={`block text-sm text-gray-300 hover:text-white transition-colors ${
              item.level === 1 ? 'font-medium' :
              item.level === 2 ? 'ml-4' :
              item.level === 3 ? 'ml-8' :
              'ml-12'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </Card>
  )
}

// Post navigation component
function PostNavigation({ previous, next }: { previous: any, next: any }) {
  if (!previous && !next) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      {previous && (
        <Card className="p-6 hover:bg-white/15 transition-colors">
          <div className="text-sm text-gray-400 mb-2">上一篇</div>
          <Link href={`/blog/${previous.slug}`} className="group">
            <h3 className="text-lg font-medium text-white group-hover:text-accent-400 transition-colors">
              {previous.title}
            </h3>
            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {previous.summary}
            </p>
          </Link>
        </Card>
      )}
      
      {next && (
        <Card className="p-6 hover:bg-white/15 transition-colors md:text-right">
          <div className="text-sm text-gray-400 mb-2">下一篇</div>
          <Link href={`/blog/${next.slug}`} className="group">
            <h3 className="text-lg font-medium text-white group-hover:text-accent-400 transition-colors">
              {next.title}
            </h3>
            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {next.summary}
            </p>
          </Link>
        </Card>
      )}
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const { previous, next } = await getAdjacentPosts(params.slug)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back to blog link */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                ← 返回文章列表
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3">
              <article>
                {/* Post header */}
                <header className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime} 分鐘閱讀</span>
                    {post.author && (
                      <>
                        <span>•</span>
                        <span>作者：{post.author}</span>
                      </>
                    )}
                  </div>

                  {/* Categories */}
                  {post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${encodeURIComponent(category)}`}
                          className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm hover:bg-accent-500/30 transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </header>

                {/* Post content */}
                <Card className="p-8">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <MDXRemote
                      source={post.content}
                      options={{
                        mdxOptions: {
                          remarkPlugins: [remarkGfm],
                          rehypePlugins: [
                            rehypeSlug,
                            [rehypeAutolinkHeadings, {
                              behavior: 'wrap',
                              properties: {
                                className: ['anchor'],
                              },
                            }],
                            rehypeHighlight,
                          ],
                        },
                      }}
                    />
                  </div>
                </Card>
              </article>

              {/* Post navigation */}
              <PostNavigation previous={previous} next={next} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TableOfContents content={post.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}