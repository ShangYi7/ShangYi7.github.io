# ShangYi7's Personal Website

一個使用 Next.js 14、TypeScript 和 Tailwind CSS 構建的現代化個人網站，採用玻璃擬態設計風格。

## ✨ 特色功能

- 🎨 **玻璃擬態設計** - 現代化的毛玻璃效果和深色主題
- 📱 **響應式設計** - 完美適配各種設備尺寸
- 🌐 **多語言支持** - 中英文切換，智能翻譯，本地緩存
- 📝 **MDX 部落格系統** - 支援 Markdown 和 React 組件
- 🔍 **搜尋和篩選** - 文章搜尋、分類和標籤篩選
- 🚀 **性能優化** - 代碼分割、圖片懶載入、SEO 優化
- 📊 **GitHub 整合** - 自動展示 GitHub 專案和活動
- 🎯 **TypeScript** - 完整的類型安全
- 💨 **Tailwind CSS** - 實用優先的 CSS 框架

## 🛠️ 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **內容**: MDX (Markdown + JSX)
- **多語言**: Google Translate API, React Context
- **動畫**: Framer Motion
- **部署**: GitHub Pages
- **API**: GitHub REST API
- **圖標**: Lucide React
- **字體**: Inter (Google Fonts)

## 📁 專案結構

```
.
├── app/                    # Next.js App Router
│   ├── about/              # 關於頁面
│   ├── blog/               # 部落格頁面
│   │   └── [slug]/         # 動態文章頁面
│   ├── projects/           # 專案頁面
│   ├── globals.css         # 全域樣式
│   ├── layout.tsx          # 根佈局
│   └── page.tsx            # 首頁
├── components/             # React 組件
│   ├── home/               # 首頁組件
│   │   ├── HeroSection.tsx
│   │   ├── LatestPosts.tsx
│   │   └── GitHubActivity.tsx
│   ├── blog/               # 部落格組件
│   │   ├── SearchAndFilter.tsx
│   │   └── PostList.tsx
│   ├── LanguageProvider.tsx # 語言管理 Context
│   ├── LanguageToggle.tsx   # 語言切換按鈕
│   ├── TranslatedText.tsx   # 翻譯組件
│   └── ui/                 # UI 組件
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Input.tsx
├── content/                # 內容文件
│   └── posts/              # 部落格文章 (MDX)
├── lib/                    # 工具函數
│   ├── posts.ts            # 文章管理
│   ├── github.ts           # GitHub API
│   ├── translationCache.ts # 翻譯緩存管理
│   └── utils.ts            # 通用工具
├── public/                 # 靜態資源
└── styles/                 # 樣式文件
```

## 🚀 快速開始

### 環境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/ShangYi7/shangyi7.github.io.git
   cd shangyi7.github.io
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **環境變數設置**

   創建 `.env.local` 文件：
   ```env
   # GitHub 配置 (可選)
   NEXT_PUBLIC_GITHUB_USERNAME=你的GitHub用戶名
   GITHUB_TOKEN=你的GitHub個人訪問令牌

   # Google Translate API (可選，用於多語言功能)
   GOOGLE_TRANSLATE_API_KEY=你的Google翻譯API密鑰
   ```

4. **啟動開發服務器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

5. **訪問網站**

   打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 🌐 多語言功能

### 語言切換

網站支援中英文切換，用戶可以通過導航欄右上角的語言切換按鈕在中文和英文之間切換。

展示：http://localhost:3000/demo

### 翻譯組件

#### TranslatedText 組件

用於翻譯單個文本內容：

```tsx
import { TranslatedText } from '@/components/TranslatedText'

// 基本使用
<TranslatedText text="你好，世界！" />

// 自定義樣式
<TranslatedText
  text="歡迎來到我的網站"
  className="text-lg font-bold"
/>

// 跳過翻譯（保持原文不變）
<TranslatedText
  text="API Key"
  skipTranslation={true}
/>
```

#### TranslatedContainer 組件

用於翻譯包含多個文本元素的容器：

```tsx
import { TranslatedContainer } from '@/components/TranslatedText'

<TranslatedContainer>
  <h1>關於我</h1>
  <p>這是一段介紹文字</p>
  <span>更多信息</span>
</TranslatedContainer>

// 跳過翻譯整個容器
<TranslatedContainer skipTranslation={true}>
  <h1>Technical Terms</h1>
  <p>API, SDK, JSON</p>
</TranslatedContainer>
```

#### TranslatedMDX 組件

專門用於翻譯 MDX 文章內容：

```tsx
import { TranslatedMDX } from '@/components/TranslatedText'

<TranslatedMDX>
  <MDXContent />
</TranslatedMDX>

// 跳過翻譯 MDX 內容
<TranslatedMDX skipTranslation={true}>
  <MDXContent />
</TranslatedMDX>
```

### skipTranslation 屬性

所有翻譯組件都支援 `skipTranslation` 屬性，用於跳過翻譯：

- **用途**: 保持技術術語、品牌名稱、代碼等內容不被翻譯
- **適用場景**: API 名稱、專有名詞、代碼片段、已經是英文的內容
- **使用方式**: 設置 `skipTranslation={true}` 即可

```tsx
// 示例：保持技術術語不被翻譯
<TranslatedText text="React Hook" skipTranslation={true} />
<TranslatedText text="TypeScript" skipTranslation={true} />
<TranslatedText text="Next.js" skipTranslation={true} />
```

### 翻譯緩存

系統自動緩存翻譯結果到 localStorage，提高性能並減少 API 調用：

- **智能緩存**: 自動緩存翻譯結果
- **過期管理**: 7天後自動清理過期緩存
- **LRU 策略**: 當緩存達到限制時自動清理最少使用的項目
- **統計功能**: 提供緩存命中率和使用統計

### 語言管理 Hook

使用 `useLanguage` Hook 管理語言狀態：

```tsx
import { useLanguage } from '@/components/LanguageProvider'

function MyComponent() {
  const {
    language,
    setLanguage,
    translate,
    isTranslating
  } = useLanguage()

  return (
    <div>
      <p>當前語言: {language}</p>
      <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
        切換語言
      </button>
      {isTranslating && <p>翻譯中...</p>}
    </div>
  )
}
```

## 📝 內容管理

### 添加新文章

1. 在 `content/posts/` 目錄下創建新的 `.mdx` 文件
2. 添加 frontmatter 元數據：

```mdx
---
title: "文章標題"
date: "2024-01-01"
categories: ["技術", "教學"]
tags: ["React", "Next.js", "TypeScript"]
summary: "文章摘要描述"
draft: false
---

# 文章內容

這裡是文章的 Markdown 內容...
```

### 支援的 Frontmatter 欄位

- `title`: 文章標題 (必填)
- `date`: 發布日期 (必填)
- `categories`: 分類陣列
- `tags`: 標籤陣列
- `summary`: 文章摘要
- `draft`: 是否為草稿 (true/false)

## 🎨 自定義樣式

### 玻璃擬態效果

專案使用自定義的玻璃擬態樣式，主要 CSS 類別：

- `.glass`: 基本玻璃效果
- `.glass-card`: 卡片玻璃效果
- `.glass-nav`: 導航欄玻璃效果

### 顏色系統

```css
:root {
  --color-accent: 64 224 208;      /* 主色調 */
  --color-accent-dark: 0 206 209;  /* 深色主色調 */
  --color-background: 15 23 42;    /* 背景色 */
  --color-surface: 30 41 59;       /* 表面色 */
}
```

## 🔧 配置選項

### GitHub 整合

要啟用 GitHub 功能，需要設置環境變數：

1. `NEXT_PUBLIC_GITHUB_USERNAME`: 你的 GitHub 用戶名
2. `GITHUB_TOKEN`: GitHub 個人訪問令牌 (可選，用於提高 API 限制)

### 多語言配置

要啟用多語言翻譯功能，需要設置 Google Translate API：

1. **獲取 API 密鑰**:
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 創建新項目或選擇現有項目
   - 啟用 Google Translate API
   - 創建 API 密鑰

2. **設置環境變數**:
   ```env
   GOOGLE_TRANSLATE_API_KEY=你的Google翻譯API密鑰
   ```

3. **功能特性**:
   - 支援中英文雙向翻譯
   - 智能緩存機制，減少 API 調用
   - 自動檢測和翻譯中文內容
   - 保持原有格式和樣式

**注意**: 如果未設置 API 密鑰，翻譯功能將使用預設的常用翻譯對照表，功能會受到限制。

### SEO 配置

在 `app/layout.tsx` 中修改網站元數據：

```typescript
export const metadata: Metadata = {
  title: '你的名字',
  description: '你的網站描述',
  // ... 其他 SEO 設置
}
```

## 📦 構建和部署

### 本地構建

```bash
npm run build
npm run start
```

### GitHub Pages 部署

1. 確保 `next.config.js` 中的設置正確：
   ```javascript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. 推送到 GitHub 倉庫
3. 在 GitHub 倉庫設置中啟用 GitHub Pages
4. 選擇 GitHub Actions 作為部署來源

### 其他部署平台

- **Vercel**: 連接 GitHub 倉庫即可自動部署
- **Netlify**: 支援 Next.js 靜態導出
- **Cloudflare Pages**: 支援 Next.js 應用

## 🧪 開發指南

### 可用腳本

```bash
npm run dev          # 啟動開發服務器
npm run build        # 構建生產版本
npm run start        # 啟動生產服務器
npm run lint         # 執行 ESLint 檢查
npm run type-check   # 執行 TypeScript 類型檢查
```

### 代碼規範

- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 規則
- 使用 Prettier 進行代碼格式化
- 組件使用 PascalCase 命名
- 文件使用 kebab-case 命名

### 性能優化

- 使用 `React.memo` 優化組件重渲染
- 使用 `useMemo` 和 `useCallback` 優化計算和函數
- 圖片使用 Next.js Image 組件進行優化
- 代碼分割和懶載入
- 翻譯結果智能緩存，減少 API 調用
- 防抖機制避免頻繁翻譯請求

### 多語言開發

#### 測試多語言功能

訪問 `/demo` 頁面可以測試完整的多語言功能：

```bash
npm run dev
# 訪問 http://localhost:3001/demo
```

#### 添加新語言支持

1. **擴展語言類型**:
   ```typescript
   // 在 LanguageProvider.tsx 中
   export type Language = 'zh' | 'en' | 'ja' // 添加日文支持
   ```

2. **更新翻譯 API**:
   ```typescript
   // 在 app/api/translate/route.ts 中添加新語言邏輯
   ```

3. **添加語言選項**:
   ```typescript
   // 在 LanguageToggle.tsx 中添加新的語言選項
   ```

#### 自定義翻譯邏輯

可以通過修改 `translationCache.ts` 來自定義翻譯行為：

```typescript
// 添加自定義翻譯對照表
const customTranslations = {
  '你的文本': 'Your Text',
  // 更多翻譯對照
}
```

## 🤝 貢獻指南

1. Fork 這個專案
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權

這個專案使用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 圖標庫
- [MDX](https://mdxjs.com/) - Markdown 處理
- [GitHub API](https://docs.github.com/en/rest) - 數據來源

## 📞 聯繫方式

- GitHub: [@ShangYi7](https://github.com/ShangYi7)
- Email: your.email@example.com
- Website: [https://shangyi7.github.io](https://shangyi7.github.io)

---

⭐ 如果這個專案對你有幫助，請給它一個星星！