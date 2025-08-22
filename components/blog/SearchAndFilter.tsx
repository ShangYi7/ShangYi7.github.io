'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { debounce } from '@/lib/utils'

interface SearchAndFilterProps {
  categories: string[]
  tags: string[]
  onSearch: (query: string) => void
  onCategoryFilter: (category: string | null) => void
  onTagFilter: (tag: string | null) => void
}

export function SearchAndFilter({
  categories,
  tags,
  onSearch,
  onCategoryFilter,
  onTagFilter,
}: SearchAndFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')
  const [isExpanded, setIsExpanded] = useState(false)

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    onSearch(query)
    updateURL({ q: query })
  }, 300)

  // Update URL with current filters
  const updateURL = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`/blog${query}`, { scroll: false })
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? '' : category
    setSelectedCategory(newCategory)
    onCategoryFilter(newCategory || null)
    updateURL({ category: newCategory })
  }

  // Handle tag selection
  const handleTagChange = (tag: string) => {
    const newTag = tag === selectedTag ? '' : tag
    setSelectedTag(newTag)
    onTagFilter(newTag || null)
    updateURL({ tag: newTag })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTag('')
    onSearch('')
    onCategoryFilter(null)
    onTagFilter(null)
    router.push('/blog', { scroll: false })
  }

  // Initialize filters from URL on mount
  useEffect(() => {
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const tag = searchParams.get('tag') || ''
    
    setSearchQuery(query)
    setSelectedCategory(category)
    setSelectedTag(tag)
    
    onSearch(query)
    onCategoryFilter(category || null)
    onTagFilter(tag || null)
  }, [searchParams, onSearch, onCategoryFilter, onTagFilter])

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag

  return (
    <Card className="p-6 mb-8">
      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>篩選選項</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--foreground-muted)' }}>分類</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-accent-500'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category ? 'var(--accent)' : 'var(--glass-bg)',
                    color: selectedCategory === category ? '#ffffff' : 'var(--foreground-muted)'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--foreground-muted)' }}>標籤</h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-accent-500'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: selectedTag === tag ? 'var(--accent)' : 'var(--glass-bg)',
                    color: selectedTag === tag ? '#ffffff' : 'var(--foreground-muted)'
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm">
                  搜尋: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm">
                  分類: {selectedCategory}
                </span>
              )}
              {selectedTag && (
                <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm">
                  標籤: #{selectedTag}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              清除篩選
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}