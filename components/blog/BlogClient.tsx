'use client'

import { useState } from 'react'
import { Post } from '@/lib/posts'
import { SearchAndFilter } from './SearchAndFilter'
import { PostList } from './PostList'

interface BlogClientProps {
  initialPosts: Post[]
  categories: string[]
  tags: string[]
}

export function BlogClient({ initialPosts, categories, tags }: BlogClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)

  // Handle search
  const handleSearch = (query: string) => {
    setLoading(true)
    try {
      if (query.trim()) {
        const searchQuery = query.toLowerCase()
        const results = initialPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery) ||
          post.summary.toLowerCase().includes(searchQuery) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        )
        setFilteredPosts(results)
      } else {
        setFilteredPosts(initialPosts)
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      setFilteredPosts(initialPosts)
    } finally {
      setLoading(false)
    }
  }

  // Handle category filter
  const handleCategoryFilter = (category: string | null) => {
    setLoading(true)
    try {
      if (category) {
        const results = initialPosts.filter(post => post.categories.includes(category))
        setFilteredPosts(results)
      } else {
        setFilteredPosts(initialPosts)
      }
    } catch (error) {
      console.error('Error filtering by category:', error)
      setFilteredPosts(initialPosts)
    } finally {
      setLoading(false)
    }
  }

  // Handle tag filter
  const handleTagFilter = (tag: string | null) => {
    setLoading(true)
    try {
      if (tag) {
        const results = initialPosts.filter(post => post.tags.includes(tag))
        setFilteredPosts(results)
      } else {
        setFilteredPosts(initialPosts)
      }
    } catch (error) {
      console.error('Error filtering by tag:', error)
      setFilteredPosts(initialPosts)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              技術文章
            </h1>
            <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
              分享開發經驗與技術心得
            </p>
          </div>

          {/* Search and filters */}
          <SearchAndFilter
            categories={categories}
            tags={tags}
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            onTagFilter={handleTagFilter}
          />

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          )}

          {/* Posts list */}
          <PostList posts={filteredPosts} />
        </div>
      </div>
    </div>
  )
}