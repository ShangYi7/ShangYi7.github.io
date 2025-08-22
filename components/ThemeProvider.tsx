'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// ThemeProvider 組件的 Props 類型定義
type ThemeProviderProps = {
  children: React.ReactNode    // 子組件
}

// 主題上下文狀態類型定義 - 僅支援深色模式
type ThemeProviderState = {
  theme: 'dark'                         // 固定為深色主題
}

// 初始狀態：固定為深色主題
const initialState: ThemeProviderState = {
  theme: 'dark',
}

// 創建主題上下文
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * 主題提供者組件
 * 固定使用深色主題，確保整個應用保持一致的深色風格
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // 組件是否已掛載（用於避免 SSR 水合問題）
  const [mounted, setMounted] = useState(false)

  // 組件掛載時設置深色主題
  useEffect(() => {
    setMounted(true)
    const root = window.document.documentElement
    root.classList.remove('light')  // 移除可能存在的亮色主題
    root.classList.add('dark')      // 添加深色主題
  }, [])

  // 提供給子組件的上下文值 - 固定為深色主題
  const value = {
    theme: 'dark' as const,
  }

  // 在水合完成前不渲染子组件，避免服务器端和客户端不匹配
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        <div suppressHydrationWarning>{children}</div>
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * 主題 Hook
 * 用於在組件中獲取深色主題狀態
 * 必須在 ThemeProvider 組件內部使用
 * 
 * @returns {ThemeProviderState} 包含固定的深色主題
 * @throws {Error} 如果在 ThemeProvider 外部使用會拋出錯誤
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  // 檢查是否在 ThemeProvider 內部使用
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}