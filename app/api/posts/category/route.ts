import { NextRequest, NextResponse } from 'next/server'
import { getPostsByCategory } from '@/lib/posts'

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }
    
    const results = await getPostsByCategory(category)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Category filter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}