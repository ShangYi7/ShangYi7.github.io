// React forwardRef 導入
import { forwardRef } from 'react'
// 工具函數導入
import { cn } from '@/lib/utils'

/**
 * Button 組件的屬性接口
 * 繼承自原生 HTML button 元素的所有屬性
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按鈕樣式變體 */
  variant?: 'default' | 'ghost' | 'outline' | 'accent'
  /** 按鈕尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否作為子元素渲染（用於 Link 等組件包裝） */
  asChild?: boolean
}

/**
 * Button 組件
 * 支持多種樣式變體和尺寸的可重用按鈕組件
 * 具有玻璃擬態效果和動畫過渡
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, children, ...props }, ref) => {
    // 組合按鈕的 CSS 類名
    const buttonClasses = cn(
      // 基礎樣式：佈局、字體、過渡效果、焦點和禁用狀態
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
      // 樣式變體
      {
        'glass-button hover:bg-white/20 hover:scale-105 active:scale-95': variant === 'default', // 默認玻璃效果
        'hover:bg-white/10 hover:text-white': variant === 'ghost', // 幽靈按鈕（透明背景）
        'border border-white/20 glass hover:border-accent/50': variant === 'outline', // 邊框按鈕
        'bg-accent text-black hover:bg-accent/90 glow-hover': variant === 'accent', // 強調色按鈕
      },
      // 尺寸變體
      {
        'h-8 px-3 text-sm': size === 'sm', // 小尺寸
        'h-10 px-4 py-2': size === 'md', // 中等尺寸（默認）
        'h-12 px-6 text-lg': size === 'lg', // 大尺寸
      },
      className // 外部傳入的自定義類名
    )

    // 如果 asChild 為 true，則將按鈕樣式應用到子元素上
    if (asChild && children) {
      // 克隆子元素並應用按鈕樣式類
      const child = children as React.ReactElement
      return (
        <child.type
          {...child.props}
          className={cn(buttonClasses, child.props?.className)}
          ref={ref}
          {...props}
        >
          {child.props.children}
        </child.type>
      )
    }

    // 默認渲染為 button 元素
    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
// 設置組件的顯示名稱，用於 React DevTools 調試
Button.displayName = 'Button'

// 導出 Button 組件
export { Button }