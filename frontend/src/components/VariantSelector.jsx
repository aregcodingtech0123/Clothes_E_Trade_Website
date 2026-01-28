import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const VariantSelector = ({ product, selectedVariant, onVariantChange }) => {
  const { t } = useTranslation();
  const [localVariant, setLocalVariant] = useState(selectedVariant || {});

  if (!product || !product.variants) {
    return null;
  }

  const variants = typeof product.variants === 'string' 
    ? JSON.parse(product.variants) 
    : product.variants;

  const handleVariantChange = (key, value) => {
    const newVariant = { ...localVariant, [key]: value };
    setLocalVariant(newVariant);
    if (onVariantChange) {
      onVariantChange(newVariant);
    }
  };

  const renderSizeSelector = () => {
    if (!variants.sizes || !Array.isArray(variants.sizes)) return null;

    // Enforce exact sizes based on product type
    const productType = product.productType || (product.category?.slug || '').toLowerCase();
    let allowedSizes = variants.sizes;

    if (productType === 'clothing') {
      // Clothing: Only S, M, L, XL
      allowedSizes = variants.sizes.filter(size => ['S', 'M', 'L', 'XL'].includes(size.toUpperCase()));
      // If no valid sizes, use default
      if (allowedSizes.length === 0) {
        allowedSizes = ['S', 'M', 'L', 'XL'];
      }
    } else if (productType === 'shoes') {
      // Shoes: EU sizes up to 45
      allowedSizes = variants.sizes.filter(size => {
        const sizeNum = parseInt(size.replace(/\D/g, ''));
        return sizeNum >= 35 && sizeNum <= 45;
      });
      // If no valid sizes, use default EU range
      if (allowedSizes.length === 0) {
        allowedSizes = Array.from({ length: 11 }, (_, i) => `EU ${35 + i}`);
      }
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('size')}:
        </label>
        <div className="flex flex-wrap gap-2">
          {allowedSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleVariantChange('size', size)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                localVariant.size === size
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-amber-500' 
              }`}
              style={{ 
                color: localVariant.size === size ? 'white' : 'var(--text-primary)' 
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGenderSelector = () => {
    if (!variants.gender || !Array.isArray(variants.gender)) return null;

    // Enforce exact gender options: Men / Women only
    const allowedGenders = variants.gender.filter(g => 
      ['Men', 'Women', 'men', 'women', 'Man', 'Woman'].includes(g)
    ).map(g => {
      // Normalize to Men/Women
      if (g.toLowerCase() === 'man' || g.toLowerCase() === 'men') return 'Men';
      if (g.toLowerCase() === 'woman' || g.toLowerCase() === 'women') return 'Women';
      return g;
    });

    // Remove duplicates and ensure Men/Women order
    const uniqueGenders = [...new Set(allowedGenders)];
    const orderedGenders = ['Men', 'Women'].filter(g => uniqueGenders.includes(g));

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('gender')}:
        </label>
        <div className="flex flex-wrap gap-2">
          {orderedGenders.map((gender) => (
            <button
              key={gender}
              onClick={() => handleVariantChange('gender', gender)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                localVariant.gender === gender
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-amber-500'
              }`}
              style={{ 
                color: localVariant.gender === gender ? 'white' : 'var(--text-primary)' 
              }}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderJewelrySizeSelector = () => {
    if (!variants.jewelrySizes || !Array.isArray(variants.jewelrySizes)) return null;

    // Jewelry: Use international standard measurements
    // Accept ring sizes (US, EU, UK standards) and necklace lengths (cm/inches)
    const allowedSizes = variants.jewelrySizes.filter(size => {
      const sizeStr = String(size).toUpperCase();
      // Ring sizes: US 5-10, EU 50-65, UK J-Z, or numeric
      if (/^(US|EU|UK)\s*\d+/.test(sizeStr) || /^\d+/.test(sizeStr)) return true;
      // Necklace lengths: cm or inches (e.g., "16cm", "18\"", "20 inches")
      if (/\d+\s*(cm|"|inches?)/i.test(sizeStr)) return true;
      // Standard sizes: Small, Medium, Large, etc.
      if (['SMALL', 'MEDIUM', 'LARGE', 'XS', 'S', 'M', 'L', 'XL'].includes(sizeStr)) return true;
      return true; // Allow all for flexibility, but validate format
    });

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('size')}:
        </label>
        <div className="flex flex-wrap gap-2">
          {allowedSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleVariantChange('size', size)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                localVariant.size === size
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-amber-500'
              }`}
              style={{ 
                color: localVariant.size === size ? 'white' : 'var(--text-primary)' 
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Determine which selectors to show based on product type
  const productType = product.productType || (product.category?.slug || '').toLowerCase();

  return (
    <div className="mt-4">
      {productType === 'clothing' && renderSizeSelector()}
      {productType === 'shoes' && (
        <>
          {renderGenderSelector()}
          {renderSizeSelector()}
        </>
      )}
      {(productType === 'jewelry' || productType === 'jewellery') && renderJewelrySizeSelector()}
    </div>
  );
};

export default VariantSelector;
