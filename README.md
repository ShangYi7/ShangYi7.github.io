# ShangYi7's Personal Website

一個使用 Next.js 14、TypeScript 和 Tailwind CSS 構建的現代化個人網站，採用玻璃擬態設計風格。

## ✨ 特色功能

- 🎨 **玻璃擬態設計** - 現代化的毛玻璃效果和深色主題
- 📱 **響應式設計** - 完美適配各種設備尺寸
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
│   └── ui/                 # UI 組件
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Input.tsx
├── content/                # 內容文件
│   └── posts/              # 部落格文章 (MDX)
├── lib/                    # 工具函數
│   ├── posts.ts            # 文章管理
│   ├── github.ts           # GitHub API
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