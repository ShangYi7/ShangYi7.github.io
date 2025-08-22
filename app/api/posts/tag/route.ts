import { NextRequest, NextResponse } from 'next/server'
import { getPostsByTag } from '@/lib/posts'

export async function GET(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get('tag')
    
    if (!tag) {
      return NextResponse.json({ error: 'Tag parameter is required' }, { status: 400 })
    }
    
    const results = await getPostsByTag(tag)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Tag filter API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}