// 外部服務狀態監控
// 用於檢查外部服務的運行狀態

export interface ExternalService {
  name: string
  url: string
  checkUrl?: string
  description: string
  icon?: string
}

export interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  description: string
  lastChecked: string
  responseTime?: number
  subServices?: SubServiceStatus[]
}

export interface SubServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  description: string
}

// 外部服務配置
export const EXTERNAL_SERVICES: ExternalService[] = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    checkUrl: 'https://api.github.com/rate_limit',
    description: 'GitHub 代碼託管平台',
    icon: 'github'
  },
  {
    name: 'Cfx.re',
    url: 'https://cfx.re',
    checkUrl: 'https://status.cfx.re',
    description: 'FiveM/RedM 遊戲平台',
    icon: 'gamepad-2'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    checkUrl: 'https://api.vercel.com/v1/status',
    description: 'Vercel 部署平台',
    icon: 'triangle'
  },
  {
    name: 'Cloudflare',
    url: 'https://cloudflare.com',
    checkUrl: 'https://www.cloudflarestatus.com/api/v2/status.json',
    description: 'Cloudflare CDN 服務',
    icon: 'cloud'
  }
]

/**
 * 檢查單個服務狀態
 */
export async function checkServiceStatus(service: ExternalService): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 秒超時
    
    const response = await fetch(service.checkUrl || service.url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'ShangYi7-Status-Page'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      return {
        name: service.name,
        status: 'operational',
        description: 'All systems operational',
        lastChecked: new Date().toISOString(),
        responseTime
      }
    } else if (response.status >= 500) {
      return {
        name: service.name,
        status: 'outage',
        description: `Server error (${response.status})`,
        lastChecked: new Date().toISOString(),
        responseTime
      }
    } else {
      return {
        name: service.name,
        status: 'degraded',
        description: `Service issues (${response.status})`,
        lastChecked: new Date().toISOString(),
        responseTime
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        name: service.name,
        status: 'outage',
        description: 'Request timeout',
        lastChecked: new Date().toISOString(),
        responseTime
      }
    }
    
    return {
      name: service.name,
      status: 'outage',
      description: 'Unable to reach service',
      lastChecked: new Date().toISOString(),
      responseTime
    }
  }
}

/**
 * 檢查所有外部服務狀態
 */
export async function checkAllServicesStatus(): Promise<ServiceStatus[]> {
  const promises = EXTERNAL_SERVICES.map(service => 
    checkServiceStatus(service).catch(error => {
      console.error(`Error checking ${service.name}:`, error)
      return {
        name: service.name,
        status: 'outage' as const,
        description: 'Status check failed',
        lastChecked: new Date().toISOString()
      }
    })
  )
  
  return Promise.all(promises)
}

/**
 * 獲取特定服務的詳細狀態（針對有專門狀態頁面的服務）
 */
export async function getDetailedServiceStatus(serviceName: string): Promise<ServiceStatus | null> {
  switch (serviceName.toLowerCase()) {
    case 'github':
      return await getGitHubDetailedStatus()
    case 'cfx.re':
      return await getCfxReDetailedStatus()
    default:
      return null
  }
}

/**
 * 獲取 GitHub 詳細狀態
 */
async function getGitHubDetailedStatus(): Promise<ServiceStatus> {
  try {
    const response = await fetch('https://www.githubstatus.com/api/v2/status.json', {
      headers: {
        'User-Agent': 'ShangYi7-Status-Page'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const status = data.status?.indicator || 'unknown'
      
      let mappedStatus: 'operational' | 'degraded' | 'outage'
      let description = data.status?.description || 'Unknown status'
      
      switch (status) {
        case 'none':
          mappedStatus = 'operational'
          description = 'All systems operational'
          break
        case 'minor':
        case 'major':
          mappedStatus = 'degraded'
          break
        case 'critical':
          mappedStatus = 'outage'
          break
        default:
          mappedStatus = 'degraded'
      }
      
      return {
        name: 'GitHub',
        status: mappedStatus,
        description,
        lastChecked: new Date().toISOString()
      }
    }
    
    throw new Error('Failed to fetch GitHub status')
  } catch (error) {
    return {
      name: 'GitHub',
      status: 'outage',
      description: 'Unable to fetch status',
      lastChecked: new Date().toISOString()
    }
  }
}

/**
 * 獲取 Cfx.re 詳細狀態
 */
async function getCfxReDetailedStatus(): Promise<ServiceStatus> {
  try {
    // 嘗試獲取 Cfx.re 狀態頁面的詳細信息
    const response = await fetch('https://status.cfx.re/api/v2/status.json', {
      headers: {
        'User-Agent': 'ShangYi7-Status-Page'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // 定義 Cfx.re 的子服務
      const subServices: SubServiceStatus[] = [
        { name: 'CnL', status: 'operational', description: '運作正常' },
        { name: 'Forums', status: 'operational', description: '運作正常' },
        { name: 'FiveM', status: 'operational', description: '運作正常' },
        { name: 'Policy', status: 'operational', description: '運作正常' },
        { name: 'Server List Frontend', status: 'operational', description: '運作正常' },
        { name: 'RedM', status: 'operational', description: '運作正常' },
        { name: 'Keymaster', status: 'operational', description: '運作正常' },
        { name: 'Runtime', status: 'operational', description: '運作正常' },
        { name: 'Cfx.re Platform Server (FXServer)', status: 'operational', description: '運作正常' },
        { name: 'IDMS', status: 'operational', description: '運作正常' },
        { name: 'Portal', status: 'operational', description: '運作正常' }
      ]
      
      // 根據 API 回應判斷整體狀態
      const overallStatus = data.status?.indicator === 'none' ? 'operational' : 
                           data.status?.indicator === 'minor' ? 'degraded' : 'outage'
      
      return {
        name: 'Cfx.re',
        status: overallStatus,
        description: data.status?.description || 'All systems operational',
        lastChecked: new Date().toISOString(),
        subServices
      }
    } else {
      // 如果狀態 API 不可用，回退到基本檢查
      const fallbackResponse = await fetch('https://cfx.re', {
        method: 'HEAD',
        headers: {
          'User-Agent': 'ShangYi7-Status-Page'
        }
      })
      
      const subServices: SubServiceStatus[] = [
        { name: 'CnL', status: 'operational', description: '運作正常' },
        { name: 'Forums', status: 'operational', description: '運作正常' },
        { name: 'FiveM', status: 'operational', description: '運作正常' },
        { name: 'Policy', status: 'operational', description: '運作正常' },
        { name: 'Server List Frontend', status: 'operational', description: '運作正常' },
        { name: 'RedM', status: 'operational', description: '運作正常' },
        { name: 'Keymaster', status: 'operational', description: '運作正常' },
        { name: 'Runtime', status: 'operational', description: '運作正常' },
        { name: 'Cfx.re Platform Server (FXServer)', status: 'operational', description: '運作正常' },
        { name: 'IDMS', status: 'operational', description: '運作正常' },
        { name: 'Portal', status: 'operational', description: '運作正常' }
      ]
      
      if (fallbackResponse.ok) {
        return {
          name: 'Cfx.re',
          status: 'operational',
          description: 'All systems operational',
          lastChecked: new Date().toISOString(),
          subServices
        }
      } else {
        return {
          name: 'Cfx.re',
          status: 'degraded',
          description: `Service issues (${fallbackResponse.status})`,
          lastChecked: new Date().toISOString(),
          subServices: subServices.map(s => ({ ...s, status: 'degraded' as const }))
        }
      }
    }
  } catch (error) {
    const subServices: SubServiceStatus[] = [
      { name: 'CnL', status: 'outage', description: '無法連接' },
      { name: 'Forums', status: 'outage', description: '無法連接' },
      { name: 'FiveM', status: 'outage', description: '無法連接' },
      { name: 'Policy', status: 'outage', description: '無法連接' },
      { name: 'Server List Frontend', status: 'outage', description: '無法連接' },
      { name: 'RedM', status: 'outage', description: '無法連接' },
      { name: 'Keymaster', status: 'outage', description: '無法連接' },
      { name: 'Runtime', status: 'outage', description: '無法連接' },
      { name: 'Cfx.re Platform Server (FXServer)', status: 'outage', description: '無法連接' },
      { name: 'IDMS', status: 'outage', description: '無法連接' },
      { name: 'Portal', status: 'outage', description: '無法連接' }
    ]
    
    return {
      name: 'Cfx.re',
      status: 'outage',
      description: 'Unable to reach service',
      lastChecked: new Date().toISOString(),
      subServices
    }
  }
}

/**
 * 格式化響應時間
 */
export function formatResponseTime(responseTime?: number): string {
  if (!responseTime) return 'N/A'
  
  if (responseTime < 1000) {
    return `${responseTime}ms`
  } else {
    return `${(responseTime / 1000).toFixed(1)}s`
  }
}

/**
 * 獲取狀態顏色類名
 */
export function getStatusColorClass(status: 'operational' | 'degraded' | 'outage'): string {
  switch (status) {
    case 'operational':
      return 'bg-green-500'
    case 'degraded':
      return 'bg-yellow-500'
    case 'outage':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * 獲取狀態文字
 */
export function getStatusText(status: 'operational' | 'degraded' | 'outage'): string {
  switch (status) {
    case 'operational':
      return '正常運行'
    case 'degraded':
      return '部分異常'
    case 'outage':
      return '服務中斷'
    default:
      return '未知狀態'
  }
}