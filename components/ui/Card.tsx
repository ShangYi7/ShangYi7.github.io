// React forwardRef 導入
import { forwardRef } from 'react'
// 工具函數導入
import { cn } from '@/lib/utils'

/**
 * Card 組件的屬性接口
 * 繼承自原生 HTML div 元素的所有屬性
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 卡片樣式變體 */
  variant?: 'default' | 'light' | 'medium'
  /** 是否啟用懸停效果 */
  hover?: boolean
}

/**
 * Card 組件
 * 具有玻璃擬態效果的卡片容器組件
 * 支持多種樣式變體和可選的懸停效果
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // 基礎樣式：圓角、邊框、過渡效果
          'rounded-2xl border transition-all duration-300',
          // 樣式變體
          {
            'glass-card': variant === 'default', // 默認玻璃效果
            'glass-light shadow-md hover:shadow-lg': variant === 'light', // 淺色玻璃效果
            'glass-medium shadow-xl hover:shadow-2xl': variant === 'medium', // 中等玻璃效果
          },
          // 懸停效果
          {
            'hover:scale-[1.02] hover:shadow-xl cursor-pointer': hover, // 懸停時縮放和陰影
          },
          className // 外部傳入的自定義類名
        )}
        {...props}
      />
    )
  }
)
// 設置組件的顯示名稱，用於 React DevTools 調試
Card.displayName = 'Card'

/**
 * CardHeader 組件
 * 卡片的頭部區域，通常包含標題和描述
 */
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)} // 垂直佈局，間距和內邊距
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/**
 * CardTitle 組件
 * 卡片的主標題
 */
const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight text-white', className)} // 大標題樣式
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

/**
 * CardDescription 組件
 * 卡片的描述文字
 */
const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)} // 小字體，柔和顏色
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

/**
 * CardContent 組件
 * 卡片的主要內容區域
 */
const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} /> // 內邊距，頂部無邊距
  )
)
CardContent.displayName = 'CardContent'

/**
 * CardFooter 組件
 * 卡片的底部區域，通常包含操作按鈕
 */
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)} // 水平佈局，垂直居中，內邊距
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// 導出所有 Card 相關組件
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }