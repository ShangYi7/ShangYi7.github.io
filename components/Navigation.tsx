'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LanguageToggle, LanguageToggleCompact } from './LanguageToggle'

// 導航菜單配置
// 定義網站的主要導航項目
const navigation = [
  { name: 'Home', href: '/' },           // 首頁
  { name: 'About', href: '/about' },     // 關於頁面
  { name: 'Blog', href: '/blog' },       // 博客頁面
  { name: 'Projects', href: '/projects' }, // 項目頁面
  { name: 'Status', href: '/status' },   // 狀態頁面
]

/**
 * 導航欄組件
 * 提供網站的主要導航功能，包括：
 * - 響應式導航菜單（桌面版和移動版）
 * - 主題切換按鈕
 * - 當前頁面高亮顯示
 * - 玻璃擬態視覺效果
 */
export function Navigation() {
  const pathname = usePathname()              // 獲取當前路徑
  const [isOpen, setIsOpen] = useState(false) // 移動端菜單開關狀態

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        {/* 主導航容器：固定在頂部，使用玻璃擬態效果 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 網站 Logo */}
          <Link
            href="/"
            className="text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            ShangYi7
          </Link>

          {/* 桌面版導航菜單 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              // 判斷當前頁面是否為活躍狀態
              const isActive = pathname === item.href ||
                (item.href === '/blog' && pathname.startsWith('/blog'))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent glow'
                      : 'text-foreground-muted hover:text-accent'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--glass-bg)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* 語言切換按鈕 */}
            <LanguageToggle />
          </div>

          {/* 移動端控制區域 */}
          <div className="md:hidden flex items-center space-x-2">
            {/* 移動端語言切換按鈕 */}
            <LanguageToggleCompact />
            
            {/* 移動端菜單切換按鈕 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="glass-button p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移動端導航菜單 */}
      {isOpen && (
        <div className="md:hidden glass-medium border-t border-white/10 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              // 判斷當前頁面是否為活躍狀態
              const isActive = pathname === item.href ||
                (item.href === '/blog' && pathname.startsWith('/blog'))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-white/10 glow'
                      : 'text-foreground-muted hover:text-accent hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
    </>
  )
}