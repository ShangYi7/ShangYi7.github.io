'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage, Language, languageNames } from './LanguageProvider';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages: Language[] = ['zh', 'en'];

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 語言切換按鈕 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all duration-200 text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTranslating}
      >
        <Globe 
          size={16} 
          className={`transition-transform duration-200 ${
            isTranslating ? 'animate-spin' : ''
          }`} 
        />
        <span className="text-sm font-medium">
          {languageNames[language]}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs"
        >
          ▼
        </motion.div>
      </motion.button>

      {/* 下拉選單 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* 選單內容 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 py-2 bg-glass-bg border border-glass-border rounded-lg shadow-lg backdrop-blur-md z-20 min-w-[120px]"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-glass-hover ${
                    language === lang
                      ? 'text-accent font-medium'
                      : 'text-foreground'
                  }`}
                  whileHover={{ x: 4 }}
                  disabled={isTranslating}
                >
                  <div className="flex items-center justify-between">
                    <span>{languageNames[lang]}</span>
                    {language === lang && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-accent rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 翻譯中指示器 */}
      <AnimatePresence>
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 簡化版語言切換按鈕（用於移動端或空間有限的地方）
export function LanguageToggleCompact({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage, isTranslating } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`flex items-center justify-center w-10 h-10 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all duration-200 text-foreground ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isTranslating}
      title={`切換到 ${languageNames[language === 'zh' ? 'en' : 'zh']}`}
    >
      <Globe 
        size={16} 
        className={`transition-transform duration-200 ${
          isTranslating ? 'animate-spin' : ''
        }`} 
      />
      
      {/* 語言指示器 */}
      <div className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-accent text-background text-xs rounded font-medium">
        {language.toUpperCase()}
      </div>
      
      {/* 翻譯中指示器 */}
      <AnimatePresence>
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 -left-1 w-3 h-3 bg-accent rounded-full animate-pulse"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}