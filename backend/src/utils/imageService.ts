// Image service for fetching product images from Unsplash API
// Uses caching to avoid unnecessary API calls

interface ImageCache {
  [key: string]: {
    url: string;
    timestamp: number;
  };
}

const imageCache: ImageCache = {};
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'your-unsplash-access-key';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

/**
 * Fetches a product image from Unsplash based on product name
 * Uses caching to avoid repeated API calls
 */
export const getProductImage = async (productName: string): Promise<string | null> => {
  try {
    // Check cache first
    const cacheKey = productName.toLowerCase().trim();
    const cached = imageCache[cacheKey];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }

    // If no API key or using default, return null (fallback to placeholder)
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key') {
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
        imageCache[cacheKey] = {
          url: imageUrl,
          timestamp: Date.now(),
        };
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
 * Clears expired cache entries
 */
export const clearExpiredCache = (): void => {
  const now = Date.now();
  Object.keys(imageCache).forEach(key => {
    if (now - imageCache[key].timestamp >= CACHE_DURATION) {
      delete imageCache[key];
    }
  });
};
