import Link from 'next/link'
import { getGitHubUser, getGitHubRepos, getGitHubEvents } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Event type icons
function getEventIcon(eventType: string) {
  switch (eventType) {
    case 'PushEvent':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      )
    case 'CreateEvent':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    case 'ReleaseEvent':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
  }
}

function getEventDescription(event: any) {
  switch (event.type) {
    case 'PushEvent':
      const commitCount = event.payload?.commits?.length || 1
      return `推送了 ${commitCount} 個提交到 ${event.repo.name}`
    case 'CreateEvent':
      return `創建了 ${event.payload?.ref_type || 'repository'} ${event.repo.name}`
    case 'ReleaseEvent':
      return `發布了版本 ${event.payload?.release?.tag_name || 'release'} 到 ${event.repo.name}`
    case 'PublicEvent':
      return `公開了倉庫 ${event.repo.name}`
    default:
      return `在 ${event.repo.name} 進行了活動`
  }
}

export async function GitHubActivity() {
  try {
    const [user, repos, events] = await Promise.all([
      getGitHubUser(),
      getGitHubRepos(6),
      getGitHubEvents(8)
    ])

    return (
      <section className="py-20 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                GitHub 動態
              </h2>
              <p className="text-gray-400 text-lg">
                開源專案與程式碼貢獻
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* GitHub Stats */}
              <div className="lg:col-span-1">
                <Card className="p-6 h-fit">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      {user.avatar_url && (
                        <img
                          src={user.avatar_url}
                          alt={user.name || user.login}
                          className="w-16 h-16 rounded-full border-2 border-accent-500/30"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {user.name || user.login}
                        </h3>
                        <p className="text-gray-400">@{user.login}</p>
                      </div>
                    </div>
                    {user.bio && (
                      <p className="text-gray-300 mb-4">{user.bio}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-400">
                          {user.public_repos}
                        </div>
                        <div className="text-sm text-gray-400">倉庫</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-400">
                          {user.followers}
                        </div>
                        <div className="text-sm text-gray-400">追蹤者</div>
                      </div>
                    </div>
                    
                    <Link href={user.html_url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">
                        查看 GitHub 個人檔案
                        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Popular Repos */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Activity */}
                {events.length > 0 && (
                  <Card className="p-6">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground mb-4">
                        最近活動
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {events.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex-shrink-0 mt-1 text-accent-400">
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300">
                                {getEventDescription(event)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(event.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Popular Repositories */}
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground mb-4">
                      熱門專案
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {repos.slice(0, 4).map((repo) => (
                        <div key={repo.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-foreground truncate">
                              <Link 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-accent-400 transition-colors"
                              >
                                {repo.name}
                              </Link>
                            </h4>
                            <div className="flex items-center text-xs text-gray-400 ml-2">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {repo.stargazers_count}
                            </div>
                          </div>
                          
                          {repo.description && (
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {repo.language && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-accent-400 mr-1" />
                                {repo.language}
                              </span>
                            )}
                            <span>{formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Link href="/projects">
                        <Button variant="outline">
                          查看所有專案
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading GitHub activity:', error)
    
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                GitHub 動態
              </h2>
              <p className="text-gray-400 text-lg">
                開源專案與程式碼貢獻
              </p>
            </div>
            
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">無法載入 GitHub 資料</h3>
              <p className="text-gray-400 mb-6">請稍後再試，或直接前往 GitHub 查看</p>
              <Link href="https://github.com/ShangYi7" target="_blank" rel="noopener noreferrer">
                <Button>
                  前往 GitHub
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>
            </Card>
          </div>
        </div>
      </section>
    )
  }
}