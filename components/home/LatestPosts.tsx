import Link from 'next/link'
import { getLatestPosts } from '@/lib/posts'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export async function LatestPosts() {
  const posts = await getLatestPosts(6)

  if (posts.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                最新文章
              </h2>
              <p className="text-gray-400 text-lg">
                分享技術心得與開發經驗
              </p>
            </div>
            
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">尚未發布文章</h3>
              <p className="text-gray-400 mb-6">即將分享更多技術文章，敬請期待！</p>
              <Link href="/blog">
                <Button>前往部落格</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              最新文章
            </h2>
            <p className="text-gray-400 text-lg">
              分享技術心得與開發經驗
            </p>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => (
              <Card 
                key={post.slug} 
                className="group hover:scale-105 transition-all duration-300 hover:bg-white/15"
              >
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span>{post.readingTime} 分鐘</span>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-accent-400 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  
                  {/* Categories */}
                  {post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded text-xs"
                        >
                          {category}
                        </span>
                      ))}
                      {post.categories.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                          +{post.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 text-gray-500 rounded text-xs">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View all posts button */}
          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline">
                查看所有文章
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}