import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '../i18n/LanguageContext';

// Get language from context - will be updated when language changes
let currentLanguage = 'en';

// Translation cache to avoid repeated API calls
const translationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for translating database content at runtime
 * Translates product names, descriptions, categories, brands, etc.
 */
export const useTranslateDBContent = () => {
  const { language } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Update current language for cache invalidation
  useEffect(() => {
    currentLanguage = language;
    // Clear cache when language changes to force re-translation
    translationCache.clear();
  }, [language]);

  /**
   * Translate a single text string
   */
  const translateText = useCallback(async (text, contentType = 'text') => {
    if (!text || typeof text !== 'string' || language === 'en') {
      return text; // No translation needed for English or empty text
    }

    // Check cache first
    const cacheKey = `${language}:${text}:${contentType}`;
    const cached = translationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.translated;
    }

    try {
      setIsTranslating(true);
      
      // TODO: Replace with actual translation API call
      // For now, using a mock translation service
      // In production, integrate with Google Translate API, DeepL, or similar
      
      // Mock translation - in production, replace with actual API call
      const translated = await mockTranslate(text, language);
      
      // Cache the result
      translationCache.set(cacheKey, {
        translated,
        timestamp: Date.now()
      });

      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original on error
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  /**
   * Translate multiple texts in batch
   */
  const translateBatch = useCallback(async (texts, contentType = 'text') => {
    if (!texts || texts.length === 0 || language === 'en') {
      return texts;
    }

    const results = await Promise.all(
      texts.map(text => translateText(text, contentType))
    );
    
    return results;
  }, [language, translateText]);

  /**
   * Translate a product object
   */
  const translateProduct = useCallback(async (product) => {
    if (!product || language === 'en') {
      return product;
    }

    const [name, description, categoryName, brandName] = await Promise.all([
      translateText(product.name, 'product-name'),
      product.description ? translateText(product.description, 'product-description') : null,
      product.category?.name ? translateText(product.category.name, 'category') : null,
      product.brand?.name ? translateText(product.brand.name, 'brand') : null,
    ]);

    return {
      ...product,
      name,
      description: description || product.description,
      category: product.category ? {
        ...product.category,
        name: categoryName || product.category.name
      } : product.category,
      brand: product.brand ? {
        ...product.brand,
        name: brandName || product.brand.name
      } : product.brand,
    };
  }, [language, translateText]);

  /**
   * Translate an array of products
   */
  const translateProducts = useCallback(async (products) => {
    if (!products || products.length === 0 || language === 'en') {
      return products;
    }

    return Promise.all(products.map(product => translateProduct(product)));
  }, [language, translateProduct]);

  /**
   * Clear translation cache
   */
  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  return {
    translateText,
    translateBatch,
    translateProduct,
    translateProducts,
    clearCache,
    isTranslating,
  };
};

/**
 * Translation function - Returns original text until API integration
 * TODO: Replace with actual translation API call in production
 * 
 * For production, integrate with:
 * - Google Translate API
 * - DeepL API
 * - Azure Translator
 * - Or your own translation service
 */
async function mockTranslate(text, targetLang) {
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // TODO: Replace with actual translation API call:
  // try {
  //   const response = await fetch('/api/translate', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text, targetLang })
  //   });
  //   const data = await response.json();
  //   return data.translatedText || text;
  // } catch (error) {
  //   console.error('Translation API error:', error);
  //   return text;
  // }
  
  // For now, return original text (no prefix)
  // This allows the app to work while waiting for API integration
  return text;
}

/**
 * Hook that automatically translates content when language changes
 */
export const useAutoTranslateDBContent = (content, contentType = 'text') => {
  const { translateText } = useTranslateDBContent();
  const [translatedContent, setTranslatedContent] = useState(content);

  useEffect(() => {
    if (content) {
      translateText(content, contentType).then(setTranslatedContent);
    } else {
      setTranslatedContent(content);
    }
  }, [content, contentType, translateText]);

  return translatedContent;
};
