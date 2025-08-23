/**
 * 客戶端翻譯服務
 * 為 GitHub Pages 靜態部署提供翻譯功能
 */

export interface TranslationResult {
  translatedText: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
}

class ClientTranslationService {
  private readonly GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
  private readonly LIBRE_TRANSLATE_URL = 'https://libretranslate.de/translate';
  
  /**
   * 使用 Google Translate 免費 API 進行翻譯
   */
  private async translateWithGoogle(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang,
        tl: targetLang,
        dt: 't',
        q: text
      });

      const response = await fetch(`${this.GOOGLE_TRANSLATE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Google Translate API 回應格式: [[["translated text", "original text", null, null, 10]], null, "zh-cn"]
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
      
      throw new Error('Invalid response format from Google Translate');
    } catch (error) {
      console.error('Google Translate failed:', error);
      throw error;
    }
  }

  /**
   * 使用 LibreTranslate 作為備用翻譯服務
   */
  private async translateWithLibre(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const response = await fetch(this.LIBRE_TRANSLATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('LibreTranslate failed:', error);
      throw error;
    }
  }

  /**
   * 使用內建字典進行基本翻譯（作為最後備用方案）
   */
  private translateWithDictionary(text: string, targetLang: string): string {
    const dictionary: Record<string, Record<string, string>> = {
      en: {
        // 導航
        '首頁': 'Home',
        '關於': 'About',
        '專案': 'Projects',
        '部落格': 'Blog',
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
        '發布於': 'Published on',
        '更新於': 'Updated on',
        
        // 狀態
        '載入中...': 'Loading...',
        '錯誤': 'Error',
        '成功': 'Success',
        '失敗': 'Failed',
        '完成': 'Completed',
        '正在翻譯...': 'Translating...',
        
        // 頁面內容
        '歡迎來到我的網站': 'Welcome to my website',
        '這是我的個人部落格': 'This is my personal blog',
        '技術分享': 'Tech Sharing',
        '生活記錄': 'Life Records',
        '學習筆記': 'Study Notes',
        '專案展示': 'Project Showcase',
        
        // 時間相關
        '分鐘前': 'minutes ago',
        '小時前': 'hours ago',
        '天前': 'days ago',
        '週前': 'weeks ago',
        '月前': 'months ago',
        '年前': 'years ago',
        
        // 動作
        '點擊': 'Click',
        '查看': 'View',
        '編輯': 'Edit',
        '刪除': 'Delete',
        '新增': 'Add',
        '儲存': 'Save',
        '取消': 'Cancel',
        '確認': 'Confirm',
        
        // 描述
        '沒有找到相關內容': 'No related content found',
        '載入失敗': 'Failed to load',
        '網路錯誤': 'Network error',
        '請稍後再試': 'Please try again later'
      }
    };

    const targetDict = dictionary[targetLang];
    if (targetDict && targetDict[text]) {
      return targetDict[text];
    }

    // 如果字典中沒有找到，嘗試簡單的詞彙替換
    let result = text;
    if (targetDict) {
      Object.entries(targetDict).forEach(([zh, en]) => {
        result = result.replace(new RegExp(zh, 'g'), en);
      });
    }

    return result;
  }

  /**
   * 主要翻譯方法
   * 依序嘗試不同的翻譯服務
   */
  async translate(text: string, sourceLang: string = 'zh', targetLang: string = 'en'): Promise<TranslationResult> {
    // 如果目標語言是中文，直接返回原文
    if (targetLang === 'zh' || targetLang === 'zh-tw') {
      return {
        translatedText: text,
        sourceText: text,
        sourceLang,
        targetLang
      };
    }

    // 如果文字為空或只有空白，直接返回
    if (!text.trim()) {
      return {
        translatedText: text,
        sourceText: text,
        sourceLang,
        targetLang
      };
    }

    // 嘗試不同的翻譯方法
    const translationMethods = [
      () => this.translateWithGoogle(text, sourceLang, targetLang),
      () => this.translateWithLibre(text, sourceLang, targetLang),
      () => Promise.resolve(this.translateWithDictionary(text, targetLang))
    ];

    for (const method of translationMethods) {
      try {
        const translatedText = await method();
        return {
          translatedText,
          sourceText: text,
          sourceLang,
          targetLang
        };
      } catch (error) {
        console.warn('Translation method failed, trying next:', error);
        continue;
      }
    }

    // 如果所有方法都失敗，返回原文
    return {
      translatedText: text,
      sourceText: text,
      sourceLang,
      targetLang
    };
  }

  /**
   * 批量翻譯
   */
  async translateBatch(texts: string[], sourceLang: string = 'zh', targetLang: string = 'en'): Promise<TranslationResult[]> {
    const results = await Promise.allSettled(
      texts.map(text => this.translate(text, sourceLang, targetLang))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Translation failed for text ${index}:`, result.reason);
        return {
          translatedText: texts[index],
          sourceText: texts[index],
          sourceLang,
          targetLang
        };
      }
    });
  }
}

// 單例實例
export const clientTranslationService = new ClientTranslationService();

// 語言代碼映射
export const languageCodeMap: Record<string, string> = {
  'zh': 'zh',
  'zh-tw': 'zh',
  'zh-cn': 'zh',
  'en': 'en',
  'english': 'en',
  'chinese': 'zh'
};

/**
 * 標準化語言代碼
 */
export function normalizeLanguageCode(lang: string): string {
  const normalized = lang.toLowerCase();
  return languageCodeMap[normalized] || normalized;
}

/**
 * 檢測文字語言（簡單實現）
 */
export function detectLanguage(text: string): string {
  // 簡單的中文檢測
  const chineseRegex = /[\u4e00-\u9fff]/;
  if (chineseRegex.test(text)) {
    return 'zh';
  }
  
  // 預設為英文
  return 'en';
}