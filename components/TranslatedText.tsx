'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

interface TranslatedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: React.ReactNode;
  skipTranslation?: boolean;
  style?: React.CSSProperties;
}

/**
 * 翻譯文字組件
 * 自動將中文內容翻譯為目標語言
 */
export function TranslatedText({ 
  children, 
  className = '', 
  as: Component = 'span',
  fallback,
  skipTranslation = false,
  style
}: TranslatedTextProps) {
  const { language, translate, isTranslating } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 提取文字內容
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return node.toString();
    }
    if (React.isValidElement(node)) {
      if (node.props.children) {
        return extractText(node.props.children);
      }
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join('');
    }
    return '';
  };

  const originalText = extractText(children);

  useEffect(() => {
    const translateContent = async () => {
      // 如果跳過翻譯、沒有文字內容、或語言是中文，直接使用原文
      if (skipTranslation || !originalText.trim() || language === 'zh') {
        setTranslatedContent(originalText);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const translated = await translate(originalText, language);
        setTranslatedContent(translated);
      } catch (err) {
        console.error('Translation failed:', err);
        setError('翻譯失敗');
        setTranslatedContent(originalText); // 失敗時顯示原文
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [originalText, language, translate, skipTranslation]);

  // 如果正在翻譯且沒有快取內容，顯示載入狀態
  if (isLoading && !translatedContent) {
    return (
      <Component className={`${className} opacity-70`} style={style}>
        {fallback || (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {originalText}
          </motion.span>
        )}
      </Component>
    );
  }

  return (
    <Component className={className} style={style}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${language}-${originalText}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {translatedContent || originalText}
        </motion.span>
      </AnimatePresence>
      
      {/* 錯誤指示器 */}
      {error && (
        <span className="ml-1 text-red-400 text-xs" title={error}>
          ⚠
        </span>
      )}
    </Component>
  );
}

/**
 * 翻譯容器組件
 * 用於包裝包含多個文字元素的內容
 */
interface TranslatedContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TranslatedContainer({ children, className = '' }: TranslatedContainerProps) {
  const { language } = useLanguage();

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * MDX 內容翻譯組件
 * 專門處理 MDX 文章內容的翻譯
 */
interface TranslatedMDXProps {
  content: string;
  className?: string;
}

export function TranslatedMDX({ content, className = '' }: TranslatedMDXProps) {
  const { language, translate } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string>(content);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateMDX = async () => {
      if (language === 'zh' || !content.trim()) {
        setTranslatedContent(content);
        return;
      }

      setIsLoading(true);

      try {
        // 分段翻譯以提高準確性
        const paragraphs = content.split('\n\n');
        const translatedParagraphs = await Promise.all(
          paragraphs.map(async (paragraph) => {
            if (!paragraph.trim()) return paragraph;
            
            // 跳過代碼塊和特殊標記
            if (paragraph.startsWith('```') || paragraph.startsWith('---')) {
              return paragraph;
            }
            
            return await translate(paragraph, language);
          })
        );
        
        setTranslatedContent(translatedParagraphs.join('\n\n'));
      } catch (error) {
        console.error('MDX translation failed:', error);
        setTranslatedContent(content); // 失敗時使用原內容
      } finally {
        setIsLoading(false);
      }
    };

    translateMDX();
  }, [content, language, translate]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`mdx-${language}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={isLoading ? 'opacity-70' : ''}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: translatedContent }}
            className="prose prose-invert max-w-none"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* 載入指示器 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 px-3 py-2 bg-glass-bg border border-glass-border rounded-lg text-sm text-foreground-muted"
        >
          正在翻譯內容...
        </motion.div>
      )}
    </div>
  );
}