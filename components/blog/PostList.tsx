'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface PostListProps {
  posts: Post[]
  postsPerPage?: number
}

export function PostList({ posts, postsPerPage = 9 }: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">沒有找到文章</h3>
        <p className="text-gray-400 mb-6">嘗試調整搜尋條件或清除篩選器</p>
      </div>
    )
  }

  return (
    <div>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentPosts.map((post) => (
          <Card 
            key={post.slug} 
            className="group hover:scale-105 transition-all duration-300 hover:bg-white/15 h-full flex flex-col"
          >
            <CardHeader className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <span>{post.readingTime} 分鐘</span>
              </div>
              
              <CardTitle className="text-xl group-hover:text-accent-400 transition-colors line-clamp-2 mb-3">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </CardTitle>
              
              <p className="text-gray-300 line-clamp-3 flex-1">
                {post.summary}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.slice(0, 2).map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded text-xs hover:bg-accent-500/30 transition-colors"
                    >
                      {category}
                    </Link>
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
                  {post.tags.slice(0, 4).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs hover:bg-white/10 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                  {post.tags.length > 4 && (
                    <span className="px-2 py-1 bg-white/5 text-gray-500 rounded text-xs">
                      +{post.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一頁
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                    ...
                  </span>
                )
              }
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      {/* Results info */}
      <div className="text-center mt-8 text-gray-400 text-sm">
        顯示第 {startIndex + 1} - {Math.min(endIndex, posts.length)} 篇，共 {posts.length} 篇文章
        {totalPages > 1 && (
          <span className="ml-2">（第 {currentPage} / {totalPages} 頁）</span>
        )}
      </div>
    </div>
  )
}