import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }
    
    const results = await searchPosts(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}