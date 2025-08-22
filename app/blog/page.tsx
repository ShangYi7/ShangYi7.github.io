import { Suspense } from 'react'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts'
import { BlogClient } from '@/components/blog/BlogClient'

export const metadata = {
  title: 'Blog | ShangYi7',
  description: '技術文章與開發心得分享',
}

export default async function BlogPage() {
  const [allPosts, allCategories, allTags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags()
  ])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogClient 
        initialPosts={allPosts}
        categories={allCategories}
        tags={allTags}
      />
    </Suspense>
  )
}