import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Star, GitFork, Calendar, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getRepoReadme, getGitHubRepos, type GitHubRepo } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

// 為靜態導出生成參數
export async function generateStaticParams() {
  try {
    const repos = await getGitHubRepos()
    return repos.map((repo) => ({
      owner: repo.owner.login,
      repo: repo.name,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// 使用 MDXRemoteSerializeResult 類型

export default async function RepoReadmePage({ 
  params 
}: { 
  params: { owner: string; repo: string } 
}) {
  const { owner, repo: repoName } = params

  try {
    // 獲取儲存庫資訊
    const repos = await getGitHubRepos()
    const repo = repos.find(r => 
      r.owner.login === owner && r.name === repoName
    )

    if (!repo) {
      notFound()
    }

    // 獲取 README 內容
    let readmeContent: string | null = null
    try {
      const readme = await getRepoReadme(owner, repoName)
      if (readme) {
        try {
          // 使用 remark 將 Markdown 轉換為 HTML
          const processedContent = await remark()
            .use(remarkGfm)
            .use(remarkHtml, { sanitize: false })
            .process(readme)
          
          let htmlContent = processedContent.toString()
          
          // 清理可能導致問題的 HTML 屬性
          htmlContent = htmlContent
            .replace(/xmlns:[^=]*="[^"]*"/g, '') // 移除 xmlns 屬性
            .replace(/\s+/g, ' ') // 標準化空白字符
            .trim()
          
          readmeContent = htmlContent
        } catch (parseError) {
          console.error('Error parsing README content:', parseError)
          // 如果解析失敗，嘗試作為純文本顯示
          readmeContent = `<pre>${readme.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
        }
      }
    } catch (error) {
      console.error('Error fetching README:', error)
      // README 載入失敗不影響頁面顯示
    }

    return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回專案列表
            </Link>
          </Button>
        </div>

        {/* 儲存庫資訊卡片 */}
        {repo && (
          <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {repo.name}
                  </CardTitle>
                  <p className="text-white/80 mb-4">{repo.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {repo.stargazers_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {repo.forks_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(repo.updated_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  {repo.homepage && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={repo.homepage} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* README 內容 */}
        {readmeContent ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                README.md
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: readmeContent }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">此儲存庫沒有 README 文件</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error in RepoReadmePage:', error)
    notFound()
  }
}