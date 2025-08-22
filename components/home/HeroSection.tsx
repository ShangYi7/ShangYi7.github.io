'use client'

// React hooks 導入
import { useState, useEffect } from 'react'
// Next.js 路由組件
import Link from 'next/link'
// UI 組件導入
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// 角色輪播配置
// 定義在首頁 Hero 區域輪播顯示的職業角色
const roles = [
  '前端開發者',      // Frontend Developer
  'UI/UX 設計師',    // UI/UX Designer
  '全端工程師',      // Full Stack Engineer
  '技術寫作者'       // Technical Writer
]

/**
 * 首頁 Hero 區域組件
 * 包含主要的歡迎信息、角色輪播、操作按鈕和統計卡片
 * 具有動畫效果和響應式設計
 */
export function HeroSection() {
  // 當前顯示的角色索引（用於輪播效果）
  const [currentRole, setCurrentRole] = useState(0)
  // 組件可見性狀態（用於進場動畫）
  const [isVisible, setIsVisible] = useState(false)

  // 組件掛載後的初始化邏輯
  useEffect(() => {
    setIsVisible(true)  // 觸發進場動畫

    // 設置角色輪播定時器，每3秒切換一次
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)

    // 清理定時器，避免內存洩漏
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* 背景漸變效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-transparent to-accent-600/10" />

      {/* 浮動裝飾元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 左上角浮動圓形 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" />
        {/* 右下角浮動圓形（延遲2秒動畫） */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        {/* 右側浮動圓形（延遲4秒動畫） */}
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* 主要內容容器 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 主要文字內容區域 */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* 主標題 */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              你好，我是{' '}
              <span className="gradient-text">
                ShangYi7
              </span>
            </h1>

            {/* 角色輪播顯示區域 */}
            <div className="text-2xl md:text-3xl text-gray-300 mb-8 h-12 flex items-center justify-center">
              <span className="inline-block transition-all duration-500 transform">
                {roles[currentRole]}
              </span>
            </div>

            {/* 個人簡介 */}
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              熱愛創造優雅的用戶體驗，專注於現代 Web 技術開發。
              透過程式碼與設計，將想法轉化為現實。
            </p>
          </div>

          {/* 操作按鈕組 */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* 了解更多按鈕 */}
            <Link href="/about">
              <Button size="lg" className="w-full sm:w-auto">
                了解更多
              </Button>
            </Link>
            {/* 閱讀文章按鈕 */}
            <Link href="/blog">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                閱讀文章
              </Button>
            </Link>
            {/* 查看專案按鈕 */}
            <Link href="/projects">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                查看專案
              </Button>
            </Link>
          </div>

          {/* 統計數據卡片區域 */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* 專案經驗統計卡片 */}
            <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-accent-400 mb-2">50+</div>
              <div className="text-gray-300">專案經驗</div>
            </Card>

            {/* 開發經驗統計卡片 */}
            <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-accent-400 mb-2">3+</div>
              <div className="text-gray-300">年開發經驗</div>
            </Card>

            {/* GitHub 貢獻統計卡片 */}
            <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-accent-400 mb-2">100+</div>
              <div className="text-gray-300">GitHub 貢獻</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}