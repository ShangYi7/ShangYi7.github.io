'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// 主題類型定義：支持深色和淺色兩種模式
type Theme = 'dark' | 'light'

// ThemeProvider 組件的 Props 類型定義
type ThemeProviderProps = {
  children: React.ReactNode    // 子組件
  defaultTheme?: Theme         // 默認主題，可選
  storageKey?: string         // localStorage 存儲鍵名，可選
}

// 主題上下文狀態類型定義
type ThemeProviderState = {
  theme: Theme                           // 當前主題
  setTheme: (theme: Theme) => void      // 設置主題的函數
}

// 初始狀態：默認為深色主題
const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
}

// 創建主題上下文
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * 主題提供者組件
 * 負責管理整個應用的主題狀態，支持深色/淺色模式切換
 * 並將主題設置持久化到 localStorage
 */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',     // 默認使用深色主題
  storageKey = 'theme',      // localStorage 中的存儲鍵名
  ...props
}: ThemeProviderProps) {
  // 當前主題狀態
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  // 組件是否已掛載（用於避免 SSR 水合問題）
  const [mounted, setMounted] = useState(false)

  // 組件掛載時從 localStorage 讀取保存的主題設置
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Theme
    if (stored) {
      setTheme(stored)
    }
  }, [])

  // 當主題改變時，更新 HTML 根元素的 class
  useEffect(() => {
    if (!mounted) return  // 避免 SSR 水合不匹配
    
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')  // 移除舊主題
    root.classList.add(theme)               // 添加新主題
  }, [theme, mounted])

  // 提供給子組件的上下文值
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)  // 持久化到 localStorage
      setTheme(theme)                         // 更新狀態
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * 主題 Hook
 * 用於在組件中獲取和操作主題狀態
 * 必須在 ThemeProvider 組件內部使用
 * 
 * @returns {ThemeProviderState} 包含當前主題和設置主題函數的對象
 * @throws {Error} 如果在 ThemeProvider 外部使用會拋出錯誤
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  // 檢查是否在 ThemeProvider 內部使用
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}