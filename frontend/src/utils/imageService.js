// Frontend image service for fetching product images from Unsplash API
// Uses localStorage for caching to avoid unnecessary API calls

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

/**
 * Gets cached image from localStorage
 */
const getCachedImage = (productName) => {
  try {
    const cacheKey = `product_image_${productName.toLowerCase().trim()}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return url;
      }
      // Remove expired cache
      localStorage.removeItem(cacheKey);
    }
  } catch (error) {
    console.error('Error reading image cache:', error);
  }
  return null;
};

/**
 * Caches image URL in localStorage
 */
const cacheImage = (productName, url) => {
  try {
    const cacheKey = `product_image_${productName.toLowerCase().trim()}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      url,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Error caching image:', error);
  }
};

/**
 * Fetches a product image from Unsplash based on product name
 * Uses localStorage caching to avoid repeated API calls
 */
export const getProductImage = async (productName) => {
  try {
    // Check cache first
    const cached = getCachedImage(productName);
    if (cached) {
      return cached;
    }

    // If no API key, return null (fallback to placeholder)
    if (!UNSPLASH_ACCESS_KEY) {
      return null;
    }

    // Fetch from Unsplash
    const searchQuery = encodeURIComponent(productName);
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${searchQuery}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls?.regular || data.results[0].urls?.small;
      
      if (imageUrl) {
        // Cache the result
        cacheImage(productName, imageUrl);
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
};

/**
 * Clears expired cache entries from localStorage
 */
export const clearExpiredImageCache = () => {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('product_image_')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now - cached.timestamp >= CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
};
