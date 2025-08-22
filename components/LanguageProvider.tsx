'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translationCache } from '@/lib/translationCache';

// 支援的語言類型
export type Language = 'zh' | 'en';

// Context 狀態介面
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string, targetLang?: Language) => Promise<string>;
  isTranslating: boolean;
}

// 預設 Context 值
const defaultContextValue: LanguageContextType = {
  language: 'zh',
  setLanguage: () => {},
  translate: async () => '',
  isTranslating: false,
};

// 建立 Context
const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

// localStorage 鍵名
const LANGUAGE_KEY = 'preferred-language';

/**
 * 語言提供者組件
 * 管理全域語言狀態和翻譯功能
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [isTranslating, setIsTranslating] = useState(false);

  // 初始化語言設定
  useEffect(() => {
    // 從 localStorage 讀取語言偏好
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // 設定語言並儲存到 localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  // 翻譯函數
  const translate = async (text: string, targetLang?: Language): Promise<string> => {
    const target = targetLang || language;
    
    // 如果目標語言是中文，直接返回原文
    if (target === 'zh') {
      return text;
    }

    // 如果文字為空或只有空白，直接返回
    if (!text.trim()) {
      return text;
    }

    // 檢查快取
    const cachedTranslation = translationCache.get(text, target);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    setIsTranslating(true);

    try {
      // 呼叫翻譯 API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          source: 'zh',
          target: target,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // 儲存到快取
      translationCache.set(text, translatedText, target);

      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // 翻譯失敗時返回原文
    } finally {
      setIsTranslating(false);
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    translate,
    isTranslating,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook 用於使用語言 Context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 語言顯示名稱
export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
};

// 語言代碼對應
export const languageCodes: Record<Language, string> = {
  zh: 'zh-tw',
  en: 'en',
};