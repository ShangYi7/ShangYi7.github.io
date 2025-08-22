import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { calculateReadingTime } from './utils'

export interface PostFrontmatter {
  title: string
  date: string
  categories: string[]
  tags: string[]
  summary: string
  draft?: boolean
  author?: string
  image?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
  htmlContent: string
  readingTime: number
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

// Ensure posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

export function getPostSlugs(): string[] {
  try {
    const files = fs.readdirSync(postsDirectory)
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace(/\.mdx$/, ''))
  } catch (error) {
    console.warn('Posts directory not found, returning empty array')
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Process markdown to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkHtml)
      .process(content)
    
    const htmlContent = processedContent.toString()
    const readingTime = calculateReadingTime(content)
    
    return {
      slug,
      content,
      htmlContent,
      readingTime,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      categories: data.categories || [],
      tags: data.tags || [],
      summary: data.summary || '',
      draft: data.draft || false,
      author: data.author,
      image: data.image,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs()
  const posts = await Promise.all(
    slugs.map(slug => getPostBySlug(slug))
  )
  
  return posts
    .filter((post): post is Post => post !== null && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getLatestPosts(limit: number = 5): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => 
    post.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  )
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

export async function searchPosts(query: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  const searchTerm = query.toLowerCase()
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.summary.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.categories.some(category => category.toLowerCase().includes(searchTerm))
  )
}

export function getAllCategories(): string[] {
  try {
    const slugs = getPostSlugs()
    const categories = new Set<string>()
    
    slugs.forEach(slug => {
      try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((category: string) => categories.add(category))
        }
      } catch (error) {
        console.error(`Error reading categories from ${slug}:`, error)
      }
    })
    
    return Array.from(categories).sort()
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}

export function getAllTags(): string[] {
  try {
    const slugs = getPostSlugs()
    const tags = new Set<string>()
    
    slugs.forEach(slug => {
      try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => tags.add(tag))
        }
      } catch (error) {
        console.error(`Error reading tags from ${slug}:`, error)
      }
    })
    
    return Array.from(tags).sort()
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}

// Get adjacent posts for navigation
export async function getAdjacentPosts(currentSlug: string): Promise<{
  previous: Post | null
  next: Post | null
}> {
  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug)
  
  if (currentIndex === -1) {
    return { previous: null, next: null }
  }
  
  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  }
}