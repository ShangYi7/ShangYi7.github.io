/**
 * 翻譯快取管理工具
 * 提供高效的翻譯結果快取和檢索功能
 */

export interface CacheEntry {
  text: string;
  translation: string;
  language: string;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  totalEntries: number;
  cacheSize: number; // in bytes
  hitRate: number;
  oldestEntry: number;
  newestEntry: number;
}

class TranslationCache {
  private readonly CACHE_KEY = 'translation_cache';
  private readonly MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_ENTRIES = 1000;
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private cache: Map<string, CacheEntry> = new Map();
  private hits = 0;
  private misses = 0;

  constructor() {
    this.loadFromStorage();
    this.startCleanupTimer();
  }

  /**
   * 生成快取鍵
   */
  private generateKey(text: string, targetLanguage: string): string {
    // 使用簡單的雜湊函數來生成鍵
    const hash = this.simpleHash(text + targetLanguage);
    return `${targetLanguage}:${hash}`;
  }

  /**
   * 簡單雜湊函數
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 從 localStorage 載入快取
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data.entries || []);
        this.hits = data.hits || 0;
        this.misses = data.misses || 0;

        // 清理過期條目
        this.cleanupExpired();
      }
    } catch (error) {
      console.warn('Failed to load translation cache:', error);
      this.cache.clear();
    }
  }

  /**
   * 保存快取到 localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        hits: this.hits,
        misses: this.misses,
        lastSaved: Date.now()
      };

      const serialized = JSON.stringify(data);

      // 檢查大小限制
      if (serialized.length > this.MAX_CACHE_SIZE) {
        this.evictOldEntries();
        return this.saveToStorage(); // 遞歸調用以重新嘗試
      }

      localStorage.setItem(this.CACHE_KEY, serialized);
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
      // 如果儲存失敗，嘗試清理快取
      this.evictOldEntries();
    }
  }

  /**
   * 獲取翻譯（如果存在於快取中）
   */
  get(text: string, targetLanguage: string): string | null {
    const key = this.generateKey(text, targetLanguage);
    const entry = this.cache.get(key);

    if (entry) {
      // 檢查是否過期
      if (Date.now() - entry.timestamp > this.CACHE_EXPIRY) {
        this.cache.delete(key);
        this.misses++;
        return null;
      }

      // 更新訪問統計
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.hits++;

      return entry.translation;
    }

    this.misses++;
    return null;
  }

  /**
   * 設置翻譯快取
   */
  set(text: string, translation: string, targetLanguage: string): void {
    const key = this.generateKey(text, targetLanguage);
    const now = Date.now();

    const entry: CacheEntry = {
      text,
      translation,
      language: targetLanguage,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    };

    this.cache.set(key, entry);

    // 檢查快取大小限制
    if (this.cache.size > this.MAX_ENTRIES) {
      this.evictOldEntries();
    }

    // 定期保存到 localStorage
    this.debouncedSave();
  }

  /**
   * 清理過期條目
   */
  private cleanupExpired(): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const expiredKeys: string[] = [];

    try {
      Array.from(this.cache.entries()).forEach(([key, entry]) => {
        if (entry && typeof entry.timestamp === 'number' && now - entry.timestamp > this.CACHE_EXPIRY) {
          expiredKeys.push(key);
        }
      });

      expiredKeys.forEach(key => this.cache.delete(key));
    } catch (error) {
      console.warn('Error during cache cleanup:', error);
    }
  }

  /**
   * 驅逐舊條目（LRU策略）
   */
  private evictOldEntries(): void {
    const entries = Array.from(this.cache.entries());

    // 按最後訪問時間排序
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    // 刪除最舊的 20% 條目
    const toDelete = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toDelete; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * 防抖保存
   */
  private saveTimeout: NodeJS.Timeout | null = null;
  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.saveToStorage();
    }, 1000); // 1秒後保存
  }

  /**
   * 啟動清理定時器
   */
  private startCleanupTimer(): void {
    if (typeof window === 'undefined') return;

    // 每小時清理一次過期條目
    setInterval(() => {
      this.cleanupExpired();
      this.saveToStorage();
    }, 60 * 60 * 1000);
  }

  /**
   * 獲取快取統計
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);

    return {
      totalEntries: this.cache.size,
      cacheSize: JSON.stringify(Array.from(this.cache.entries())).length,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }

  /**
   * 清空快取
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CACHE_KEY);
    }
  }

  /**
   * 預熱快取（批量添加常用翻譯）
   */
  preload(translations: Array<{ text: string; translation: string; language: string }>): void {
    translations.forEach(({ text, translation, language }) => {
      this.set(text, translation, language);
    });
  }
}

// 單例實例
export const translationCache = new TranslationCache();

// 常用翻譯預設
export const commonTranslations = {
  zh: {
    // 導航
    '首頁': 'Home',
    '關於': 'About',
    '專案': 'Projects',
    '文章': 'Articles',
    '聯絡': 'Contact',

    // 常用詞彙
    '閱讀更多': 'Read More',
    '返回': 'Back',
    '下一頁': 'Next',
    '上一頁': 'Previous',
    '搜尋': 'Search',
    '標籤': 'Tags',
    '分類': 'Categories',
    '日期': 'Date',
    '作者': 'Author',

    // 狀態
    '載入中...': 'Loading...',
    '錯誤': 'Error',
    '成功': 'Success',
    '失敗': 'Failed',
    '完成': 'Completed'
  }
};

// 初始化預設翻譯
if (typeof window !== 'undefined') {
  const preloadTranslations = Object.entries(commonTranslations.zh).map(
    ([text, translation]) => ({
      text,
      translation,
      language: 'en'
    })
  );

  translationCache.preload(preloadTranslations);
}