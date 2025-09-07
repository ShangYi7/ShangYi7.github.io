import { NextResponse } from 'next/server';
import { getGitHubUser, getUserRepos, getUserEvents, checkGitHubStatus } from '@/lib/github-status';

export async function GET() {
  try {
    const [userInfo, repos, events, apiStatus] = await Promise.allSettled([
      getGitHubUser(),
      getUserRepos(),
      getUserEvents(),
      checkGitHubStatus()
    ]);

    // 處理用戶信息
    const user = userInfo.status === 'fulfilled' ? userInfo.value : null;
    
    // 處理倉庫信息
    const repositories = repos.status === 'fulfilled' ? repos.value : [];
    
    // 處理事件信息
    const recentEvents = events.status === 'fulfilled' ? events.value : [];
    
    // 處理 API 狀態
    const githubApiStatus = apiStatus.status === 'fulfilled' ? apiStatus.value : false;

    // 計算統計數據
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const publicRepos = repositories.length;
    
    // 計算最近提交數（最近 30 天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCommits = recentEvents.filter(event => 
      event.type === 'PushEvent' && 
      new Date(event.created_at) > thirtyDaysAgo
    ).length;

    // 獲取最後活動時間
    const lastActivity = recentEvents.length > 0 
      ? new Date(recentEvents[0].created_at).toISOString()
      : null;

    const response = {
      isAvailable: githubApiStatus && user !== null,
      user: user ? {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos
      } : null,
      stats: {
        totalStars,
        totalForks,
        publicRepos,
        recentCommits,
        followers: user?.followers || 0,
        following: user?.following || 0
      },
      lastActivity,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { 
        isAvailable: false, 
        error: 'Failed to fetch GitHub data',
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 設置 ISR revalidate
export const revalidate = 300; // 5 分鐘