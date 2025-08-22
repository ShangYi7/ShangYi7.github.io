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
  const handleSearch = async (query: string) => {
    setLoading(true)
    try {
      if (query.trim()) {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const results = await response.json()
          setFilteredPosts(results)
        } else {
          throw new Error('Search failed')
        }
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
  const handleCategoryFilter = async (category: string | null) => {
    setLoading(true)
    try {
      if (category) {
        const response = await fetch(`/api/posts/category?category=${encodeURIComponent(category)}`)
        if (response.ok) {
          const results = await response.json()
          setFilteredPosts(results)
        } else {
          throw new Error('Category filter failed')
        }
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
  const handleTagFilter = async (tag: string | null) => {
    setLoading(true)
    try {
      if (tag) {
        const response = await fetch(`/api/posts/tag?tag=${encodeURIComponent(tag)}`)
        if (response.ok) {
          const results = await response.json()
          setFilteredPosts(results)
        } else {
          throw new Error('Tag filter failed')
        }
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              技術文章
            </h1>
            <p className="text-gray-400 text-lg">
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