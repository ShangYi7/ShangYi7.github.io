// WakaTime API 服務
// 用於獲取編程時間統計數據

export interface WakaTimeLanguage {
  name: string
  total_seconds: number
  percent: number
  digital: string
  text: string
  hours: number
  minutes: number
}

export interface WakaTimeEditor {
  name: string
  total_seconds: number
  percent: number
  digital: string
  text: string
  hours: number
  minutes: number
}

export interface WakaTimeOperatingSystem {
  name: string
  total_seconds: number
  percent: number
  digital: string
  text: string
  hours: number
  minutes: number
}

export interface WakaTimeStats {
  data: {
    username: string
    user_id: string
    total_seconds: number
    total_seconds_including_other_language: number
    daily_average: number
    daily_average_including_other_language: number
    languages: WakaTimeLanguage[]
    editors: WakaTimeEditor[]
    operating_systems: WakaTimeOperatingSystem[]
    dependencies: any[]
    machines: any[]
    projects: any[]
    categories: any[]
    grand_total: {
      hours: number
      minutes: number
      total_seconds: number
      digital: string
      decimal: string
      text: string
    }
    range: {
      start: string
      end: string
      start_date: string
      end_date: string
      start_text: string
      end_text: string
      timezone: string
    }
  }
}

export interface ProcessedWakaTimeStats {
  totalTime: string
  dailyAverage: string
  topLanguages: Array<{
    name: string
    percent: number
    time: string
  }>
  topEditors: Array<{
    name: string
    percent: number
    time: string
  }>
  lastUpdated: string
  isAvailable: boolean
}

const WAKATIME_API_BASE = 'https://wakatime.com/api/v1'
const API_KEY = process.env.WAKATIME_API_KEY || ''

/**
 * 格式化秒數為可讀時間格式
 */
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${totalSeconds}s`
  }
}

/**
 * 獲取 WakaTime 最近 7 天統計數據
 */
export async function getWakaTimeStats(): Promise<ProcessedWakaTimeStats> {
  try {
    const response = await fetch(`${WAKATIME_API_BASE}/users/current/stats/last_7_days?api_key=${API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ShangYi7-Status-Page'
      },
      next: { revalidate: 1800 } // 30 分鐘快取
    })

    if (!response.ok) {
      console.warn(`WakaTime API responded with status ${response.status}`)
      return {
        totalTime: 'N/A',
        dailyAverage: 'N/A',
        topLanguages: [],
        topEditors: [],
        lastUpdated: new Date().toISOString(),
        isAvailable: false
      }
    }

    const data: WakaTimeStats = await response.json()
    
    return {
      totalTime: data.data.grand_total.text || formatDuration(data.data.total_seconds),
      dailyAverage: formatDuration(data.data.daily_average),
      topLanguages: data.data.languages.slice(0, 5).map(lang => ({
        name: lang.name,
        percent: Math.round(lang.percent * 100) / 100,
        time: lang.text
      })),
      topEditors: data.data.editors.slice(0, 3).map(editor => ({
        name: editor.name,
        percent: Math.round(editor.percent * 100) / 100,
        time: editor.text
      })),
      lastUpdated: new Date().toISOString(),
      isAvailable: true
    }
  } catch (error) {
    console.error('Error fetching WakaTime stats:', error)
    return {
      totalTime: 'Error',
      dailyAverage: 'Error',
      topLanguages: [],
      topEditors: [],
      lastUpdated: new Date().toISOString(),
      isAvailable: false
    }
  }
}

/**
 * 檢查 WakaTime API 狀態
 */
export async function checkWakaTimeStatus(): Promise<{
  status: 'operational' | 'degraded' | 'outage'
  description: string
  lastChecked: string
}> {
  try {
    const response = await fetch(`${WAKATIME_API_BASE}/users/current?api_key=${API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ShangYi7-Status-Page'
      }
    })

    if (response.ok) {
      return {
        status: 'operational',
        description: 'WakaTime API is operational',
        lastChecked: new Date().toISOString()
      }
    } else if (response.status === 401) {
      return {
        status: 'degraded',
        description: 'API key authentication failed',
        lastChecked: new Date().toISOString()
      }
    } else {
      return {
        status: 'degraded',
        description: `API responding with status ${response.status}`,
        lastChecked: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      status: 'outage',
      description: 'Unable to reach WakaTime API',
      lastChecked: new Date().toISOString()
    }
  }
}

/**
 * 獲取 WakaTime 用戶資料（用於驗證 API 連接）
 */
export async function getWakaTimeUser(): Promise<any> {
  try {
    const response = await fetch(`${WAKATIME_API_BASE}/users/current?api_key=${API_KEY}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ShangYi7-Status-Page'
      },
      next: { revalidate: 3600 } // 1 小時快取
    })

    if (!response.ok) {
      throw new Error(`WakaTime API error: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching WakaTime user:', error)
    throw error
  }
}