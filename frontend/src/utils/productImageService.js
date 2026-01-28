// Fetches product images from free public APIs (FakeStoreAPI-first).
// - Products are fetched from OUR backend first.
// - Then we attach a relevant imageUrl at runtime (no DB persistence).
// - Uses localStorage + in-memory caches to avoid excessive calls.
//
// Providers:
// 1) FakeStoreAPI: https://fakestoreapi.com/ (best for clothing/jewelry/electronics)
// 2) DummyJSON (fallback): https://dummyjson.com/products (used mainly for shoes, because FakeStore lacks shoes)

const PLACEHOLDER_URL = '/images/placeholder.png';

// localStorage cache (per product name)
const LS_CACHE_KEY = 'external_product_image_cache_v1';
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// in-memory caches (per provider category)
const categoryProductsCache = new Map(); // key: `${provider}:${category}` -> { ts, items }

function now() {
  return Date.now();
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadLsCache() {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(LS_CACHE_KEY);
  return safeJsonParse(raw, {}) || {};
}

function saveLsCache(cacheObj) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cacheObj));
  } catch {
    // ignore quota / storage errors
  }
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  const t = normalize(text);
  if (!t) return [];
  return t.split(' ').filter(Boolean);
}

// Very small synonym/intent hints (programmatic, not per-item hardcoding)
const KEYWORDS = {
  shoes: ['ayakkabi', 'sneaker', 'spor', 'krampon', 'bot', 'topuk', 'loafer', 'terlik', 'shoe'],
  jewelry: ['kolye', 'yuzuk', 'bileklik', 'kupe', 'altin', 'gumus', 'jewelry', 'necklace', 'ring', 'bracelet', 'earring'],
  clothing: ['kazak', 'tisort', 'tshirt', 'gomlek', 'pantolon', 'ceket', 'elbise', 'etek', 'hoodie', 'sweat', 'sweater', 'dress', 'shirt', 'jeans'],
  women: ['kadin', 'bayan', 'women', 'female'],
  men: ['erkek', 'men', 'male'],
};

function includesAny(haystackTokens, needles) {
  const set = new Set(haystackTokens);
  return needles.some((k) => set.has(k));
}

function inferIntent(product) {
  const categoryName =
    typeof product?.category === 'string' ? product.category : product?.category?.name || product?.category?.slug || '';

  const combined = `${product?.name || ''} ${categoryName} ${product?.productType || ''}`;
  const tokens = tokenize(combined);

  const isShoes = includesAny(tokens, KEYWORDS.shoes) || normalize(product?.productType) === 'shoes';
  const isJewelry = includesAny(tokens, KEYWORDS.jewelry) || normalize(product?.productType) === 'jewelry';
  const isClothing = includesAny(tokens, KEYWORDS.clothing) || normalize(product?.productType) === 'clothing';

  const gender = includesAny(tokens, KEYWORDS.women) ? 'women' : includesAny(tokens, KEYWORDS.men) ? 'men' : null;

  const type = isShoes ? 'shoes' : isJewelry ? 'jewelry' : isClothing ? 'clothing' : 'other';
  return { type, gender, tokens };
}

function pickProviderCategory(intent) {
  // Prefer FakeStore where possible.
  // FakeStore categories: "men's clothing", "women's clothing", "jewelery", "electronics"
  // DummyJSON categories include: "mens-shoes", "womens-shoes", "womens-jewellery", "mens-shirts", etc.

  if (intent.type === 'shoes') {
    return {
      provider: 'dummyjson',
      category: intent.gender === 'women' ? 'womens-shoes' : 'mens-shoes',
    };
  }

  if (intent.type === 'jewelry') {
    return {
      provider: 'fakestore',
      category: 'jewelery',
      fallback: { provider: 'dummyjson', category: 'womens-jewellery' },
    };
  }

  if (intent.type === 'clothing') {
    const fsCat = intent.gender === 'women' ? "women's clothing" : "men's clothing";
    return {
      provider: 'fakestore',
      category: fsCat,
      // If fakestore fails, dummyjson gives us plenty of clothing images.
      fallback: { provider: 'dummyjson', category: intent.gender === 'women' ? 'womens-dresses' : 'mens-shirts' },
    };
  }

  // Other → try electronics first (neutral), else a generic dummyjson category.
  return {
    provider: 'fakestore',
    category: 'electronics',
    fallback: { provider: 'dummyjson', category: 'tops' },
  };
}

function scoreCandidate(ourTokens, candidateTitle) {
  const candidateTokens = tokenize(candidateTitle);
  if (candidateTokens.length === 0 || ourTokens.length === 0) return 0;

  const candSet = new Set(candidateTokens);
  let score = 0;
  for (const t of ourTokens) {
    if (candSet.has(t)) score += 3;
  }

  // tiny synonym boosts (still programmatic)
  const synonyms = {
    ayakkabi: ['shoe', 'sneaker'],
    spor: ['sport', 'sneaker'],
    kazak: ['sweater'],
    tisort: ['tshirt', 'shirt'],
    gomlek: ['shirt'],
    kolye: ['necklace'],
    yuzuk: ['ring'],
    bileklik: ['bracelet'],
    kupe: ['earring'],
    gumus: ['silver'],
    altin: ['gold'],
  };

  for (const [k, syns] of Object.entries(synonyms)) {
    if (ourTokens.includes(k) && syns.some((s) => candSet.has(s))) score += 2;
  }

  return score;
}

async function fetchCategoryProducts(provider, category) {
  const key = `${provider}:${category}`;
  const cached = categoryProductsCache.get(key);
  if (cached && now() - cached.ts < CACHE_TTL_MS) return cached.items;

  let items = [];
  try {
    if (provider === 'fakestore') {
      const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error(`FakeStore category fetch failed: ${res.status}`);
      items = await res.json();
    } else if (provider === 'dummyjson') {
      const res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=100`);
      if (!res.ok) throw new Error(`DummyJSON category fetch failed: ${res.status}`);
      const data = await res.json();
      items = Array.isArray(data?.products) ? data.products : [];
    }
  } catch {
    items = [];
  }

  categoryProductsCache.set(key, { ts: now(), items });
  return items;
}

function getImageFromItem(provider, item) {
  if (!item) return null;
  if (provider === 'fakestore') return item.image || null;
  if (provider === 'dummyjson') return item.thumbnail || (Array.isArray(item.images) ? item.images[0] : null);
  return null;
}

async function resolveImageForProduct(product) {
  const name = product?.name || '';
  const normalizedName = normalize(name);
  if (!normalizedName) return null;

  const intent = inferIntent(product);
  const mapping = pickProviderCategory(intent);

  // Try primary provider
  const primaryItems = await fetchCategoryProducts(mapping.provider, mapping.category);
  const primaryBest = pickBestItem(intent.tokens, primaryItems, mapping.provider);
  const primaryUrl = getImageFromItem(mapping.provider, primaryBest);
  if (primaryUrl) return primaryUrl;

  // Fallback provider/category
  if (mapping.fallback) {
    const fallbackItems = await fetchCategoryProducts(mapping.fallback.provider, mapping.fallback.category);
    const fallbackBest = pickBestItem(intent.tokens, fallbackItems, mapping.fallback.provider);
    const fallbackUrl = getImageFromItem(mapping.fallback.provider, fallbackBest);
    if (fallbackUrl) return fallbackUrl;
  }

  return null;
}

function pickBestItem(tokens, items, provider) {
  if (!Array.isArray(items) || items.length === 0) return null;

  let best = items[0];
  let bestScore = -1;

  for (const item of items) {
    const title = provider === 'fakestore' ? item?.title : item?.title || item?.name;
    const s = scoreCandidate(tokens, title || '');
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }

  return best;
}

/**
 * Attach external imageUrl to products (runtime only).
 * - Uses localStorage caching by normalized product name.
 * - Fetches per-category lists once (in-memory).
 */
export async function attachExternalImagesToProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return products || [];

  const lsCache = loadLsCache();
  const updated = [];

  // First pass: apply cache and collect missing
  const missing = [];
  for (const p of products) {
    const key = normalize(p?.name);
    const cached = key ? lsCache[key] : null;
    const valid = cached && cached.url && now() - cached.ts < CACHE_TTL_MS;

    if (p?.imageUrl) {
      updated.push(p);
      continue;
    }

    if (valid) {
      updated.push({ ...p, imageUrl: cached.url });
    } else {
      missing.push(p);
      updated.push(p);
    }
  }

  if (missing.length === 0) return updated;

  // Resolve missing images (sequential to be gentle; can be batched later)
  for (const p of missing) {
    const key = normalize(p?.name);
    if (!key) continue;
    const url = await resolveImageForProduct(p);
    const finalUrl = url || PLACEHOLDER_URL;
    lsCache[key] = { url: finalUrl, ts: now() };

    const idx = updated.findIndex((x) => x?.id === p?.id);
    if (idx !== -1) updated[idx] = { ...updated[idx], imageUrl: finalUrl };
  }

  saveLsCache(lsCache);
  return updated;
}

export function getPlaceholderImageUrl() {
  return PLACEHOLDER_URL;
}

