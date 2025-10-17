'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Globe, ExternalLink } from 'lucide-react'
import { TranslatedText, TranslatedContainer } from '@/components/TranslatedText'
import Link from 'next/link'
import { getStatusColorClass, getStatusText, formatResponseTime, type ServiceStatus } from '@/lib/external-status'

/**
 * Status 頁面組件
 * 顯示個人狀態（GitHub、WakaTime）和外部服務狀態
 */
export default function StatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const [externalServices, setExternalServices] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // 獲取所有狀態數據
  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    
    try {
      const [externalResult] = await Promise.allSettled([
        fetch('/api/status/external').then(res => res.json())
      ])
      
      // 處理外部服務結果
      if (externalResult.status === 'fulfilled' && externalResult.value.services) {
        setExternalServices(externalResult.value.services)
      } else {
        console.error('External services error:', externalResult.status === 'fulfilled' ? externalResult.value.error : externalResult.reason)
      }
      
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch status data:', error)
      setError('Failed to load status data')
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }, [])

  // 刷新所有狀態
  const refreshAllStatus = () => {
    fetchAllData()
  }

  // 初始載入數據
  useEffect(() => {
    setIsClient(true)
    fetchAllData()
  }, [])

  // 自動刷新邏輯
  useEffect(() => {
    // 設置自動刷新（每 5 分鐘）
    const interval = setInterval(() => {
      if (!loading) {
        fetchAllData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loading, fetchAllData]);

  // 頁面可見性變化時重新獲取數據
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading) {
        fetchAllData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading, fetchAllData]);

  return (
    <TranslatedContainer>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              <TranslatedText>狀態監控</TranslatedText>
            </h1>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              <TranslatedText>即時監控個人服務狀態和外部依賴服務的運行情況</TranslatedText>
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                onClick={refreshAllStatus}
                disabled={isRefreshing}
                className="glass hover:glass-hover"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <TranslatedText>刷新狀態</TranslatedText>
              </Button>
              <span className="text-sm text-foreground-muted">
                <TranslatedText>最後更新：</TranslatedText>
                {isClient ? lastRefresh.toLocaleTimeString() : '--:--:--'}
              </span>
            </div>
          </div>



          {/* 外部服務狀態 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-accent" />
              <TranslatedText>外部服務狀態</TranslatedText>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalServices.length > 0 ? (
                externalServices.map((service, index) => (
                  <Card key={index} className="glass border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {service.url ? (
                            <Link 
                              href={service.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                            >
                              <span>{service.name}</span>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <span>{service.name}</span>
                          )}
                        </div>
                        <Badge className={`${getStatusColorClass(service.status)} text-white border-0`}>
                          <TranslatedText>{service.status === 'operational' ? '所有系統運作正常' : getStatusText(service.status)}</TranslatedText>
                        </Badge>
                      </CardTitle>
                      {service.description && (
                        <CardDescription>{service.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 子服務狀態 */}
                        {service.subServices && service.subServices.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-foreground mb-3">
                              <TranslatedText>服務組件狀態：</TranslatedText>
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {service.subServices.map((subService, subIndex) => (
                                <div key={subIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                                  <span className="text-sm font-medium text-foreground">
                                    {subService.name}
                                  </span>
                                  <div className={`flex items-center text-sm ${
                                    subService.status === 'operational' 
                                      ? 'text-green-400'
                                      : subService.status === 'degraded'
                                      ? 'text-yellow-400'
                                      : 'text-red-400'
                                  }`}>
                                    {subService.status === 'operational' ? '✅' : 
                                     subService.status === 'degraded' ? '⚠️' : '❌'}
                                    <span className="ml-1">{subService.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          {service.responseTime && (
                            <div className="text-sm text-foreground-muted">
                              <TranslatedText>響應時間：</TranslatedText>
                              {formatResponseTime(service.responseTime)}
                            </div>
                          )}
                          <div className="text-sm text-foreground-muted">
                            <TranslatedText>最後檢查：</TranslatedText>
                            {isClient && service.lastChecked ? new Date(service.lastChecked).toLocaleString() : '載入中...'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : loading ? (
                <div className="col-span-full text-center py-8 text-foreground-muted">
                  <div className="animate-pulse">
                    <TranslatedText>載入中...</TranslatedText>
                  </div>
                </div>
              ) : (
                <div className="col-span-full text-center py-8 text-red-400">
                  <TranslatedText>載入失敗</TranslatedText>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TranslatedContainer>
  )
}