'use client';

import React from 'react';
import { TranslatedText, TranslatedContainer } from '@/components/TranslatedText';
import { useLanguage } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { Globe, Code, Zap, Heart } from 'lucide-react';

/**
 * 多語言功能演示頁面
 * 展示各種翻譯組件的使用方式
 */
export default function DemoPage() {
  const { language, isTranslating } = useLanguage();

  const features = [
    {
      icon: Globe,
      title: '即時翻譯',
      description: '使用 Google Translate API 提供高品質的即時翻譯服務，支援中英文無縫切換。'
    },
    {
      icon: Zap,
      title: '智能快取',
      description: '先進的快取機制確保翻譯結果快速載入，提升用戶體驗並減少 API 調用。'
    },
    {
      icon: Code,
      title: '開發友善',
      description: '簡潔的 API 設計讓開發者能夠輕鬆整合多語言功能到任何 React 組件中。'
    },
    {
      icon: Heart,
      title: '用戶體驗',
      description: '流暢的動畫效果和直觀的介面設計，為用戶提供愉悅的多語言瀏覽體驗。'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 頁面標題區域 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <TranslatedContainer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <TranslatedText 
                as="h1" 
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                多語言功能演示
              </TranslatedText>
              
              <TranslatedText 
                as="p" 
                className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto"
              >
                體驗我們強大的多語言系統，支援即時翻譯、智能快取和流暢的用戶體驗。
              </TranslatedText>
              
              <div className="flex items-center justify-center gap-4 text-sm text-foreground-muted">
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    language === 'zh' ? 'bg-green-400' : 'bg-blue-400'
                  }`} />
                  <TranslatedText>
                    當前語言: {language === 'zh' ? '中文' : 'English'}
                  </TranslatedText>
                </span>
                
                {isTranslating && (
                  <motion.span 
                    className="flex items-center gap-2 text-yellow-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <TranslatedText>翻譯中...</TranslatedText>
                  </motion.span>
                )}
              </div>
            </motion.div>
          </TranslatedContainer>
        </div>
      </section>

      {/* 功能特色區域 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <TranslatedContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <TranslatedText 
                as="h2" 
                className="text-3xl font-bold mb-4"
              >
                核心功能
              </TranslatedText>
              
              <TranslatedText 
                as="p" 
                className="text-foreground-muted max-w-2xl mx-auto"
              >
                我們的多語言系統提供了完整的解決方案，從技術實現到用戶體驗都經過精心設計。
              </TranslatedText>
            </motion.div>
          </TranslatedContainer>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <TranslatedContainer key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="p-6 rounded-xl bg-glass-bg border border-glass-border hover:border-glass-border-hover transition-all duration-300 group"
                  >
                    <div className="mb-4">
                      <Icon className="w-8 h-8 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    </div>
                    
                    <TranslatedText 
                      as="h3" 
                      className="text-lg font-semibold mb-3"
                    >
                      {feature.title}
                    </TranslatedText>
                    
                    <TranslatedText 
                      as="p" 
                      className="text-foreground-muted text-sm leading-relaxed"
                    >
                      {feature.description}
                    </TranslatedText>
                  </motion.div>
                </TranslatedContainer>
              );
            })}
          </div>
        </div>
      </section>

      {/* 使用示例區域 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <TranslatedContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <TranslatedText 
                as="h2" 
                className="text-3xl font-bold mb-4"
              >
                使用示例
              </TranslatedText>
              
              <TranslatedText 
                as="p" 
                className="text-foreground-muted"
              >
                以下是一些常見的使用場景和組件示例
              </TranslatedText>
            </motion.div>
          </TranslatedContainer>

          <div className="space-y-8">
            {/* 基本文字翻譯 */}
            <TranslatedContainer>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 rounded-xl bg-glass-bg border border-glass-border"
              >
                <TranslatedText as="h3" className="text-xl font-semibold mb-4">
                  基本文字翻譯
                </TranslatedText>
                
                <div className="space-y-2 text-foreground-muted">
                  <TranslatedText as="p">
                    這是一段普通的中文文字，會自動翻譯成目標語言。
                  </TranslatedText>
                  
                  <TranslatedText as="p">
                    翻譯組件支援各種 HTML 標籤，包括段落、標題、列表等。
                  </TranslatedText>
                </div>
              </motion.div>
            </TranslatedContainer>

            {/* 跳過翻譯示例 */}
            <TranslatedContainer>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-6 rounded-xl bg-glass-bg border border-glass-border"
              >
                <TranslatedText as="h3" className="text-xl font-semibold mb-4">
                  跳過翻譯示例
                </TranslatedText>
                
                <div className="space-y-2 text-foreground-muted">
                  <TranslatedText as="p" skipTranslation>
                    這段文字設定了 skipTranslation 屬性，不會被翻譯。
                  </TranslatedText>
                  
                  <TranslatedText as="p">
                    而這段文字會正常翻譯。
                  </TranslatedText>
                </div>
              </motion.div>
            </TranslatedContainer>

            {/* 載入狀態示例 */}
            <TranslatedContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="p-6 rounded-xl bg-glass-bg border border-glass-border"
              >
                <TranslatedText as="h3" className="text-xl font-semibold mb-4">
                  動畫效果
                </TranslatedText>
                
                <TranslatedText as="p" className="text-foreground-muted">
                  切換語言時，文字會有流暢的淡入淡出動畫效果，提升用戶體驗。
                </TranslatedText>
              </motion.div>
            </TranslatedContainer>
          </div>
        </div>
      </section>

      {/* 底部說明 */}
      <section className="py-16 px-4 border-t border-glass-border">
        <div className="max-w-4xl mx-auto text-center">
          <TranslatedContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <TranslatedText 
                as="p" 
                className="text-foreground-muted mb-4"
              >
                這個演示頁面展示了多語言系統的各種功能和使用方式。
              </TranslatedText>
              
              <TranslatedText 
                as="p" 
                className="text-sm text-foreground-muted"
              >
                嘗試點擊右上角的語言切換按鈕來體驗翻譯效果！
              </TranslatedText>
            </motion.div>
          </TranslatedContainer>
        </div>
      </section>
    </div>
  );
}