import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useFavorites } from './FavoritesContext';
import { useTranslation } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';
import ProductCard from './ProductCard';
import { Heart, Minus, Plus } from 'lucide-react';
import VariantSelector from './VariantSelector';
import { getProductImage } from '../utils/imageService';
import { useTranslateDBContent } from '../hooks/useTranslateDBContent';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, addToCart } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const { translateProduct, translateProducts } = useTranslateDBContent();
  const [product, setProduct] = useState(null);
  const [translatedProduct, setTranslatedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [translatedRelatedProducts, setTranslatedRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
        
        // Translate product content immediately after fetching
        const translated = await translateProduct(data);
        setTranslatedProduct(translated);
        
        // Fetch product image if not available
        if (!data.imageUrl && data.name) {
          const fetchedImage = await getProductImage(data.name);
          if (fetchedImage) {
            setImageUrl(fetchedImage);
          }
        } else {
          setImageUrl(data.imageUrl);
        }
        
        // Fetch related products
        if (data.category) {
          const categoryId = typeof data.category === 'string' ? data.category : data.category.id;
          const relatedResponse = await fetch(
            `http://localhost:5000/api/products?category=${categoryId}&limit=4`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.filter(p => p.id !== data.id);
            setRelatedProducts(filtered);
            // Translate related products
            const translatedRelated = await translateProducts(filtered);
            setTranslatedRelatedProducts(translatedRelated);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, translateProduct, translateProducts]);

  // Re-translate when language changes
  useEffect(() => {
    if (product) {
      translateProduct(product).then(setTranslatedProduct);
    }
    if (relatedProducts.length > 0) {
      translateProducts(relatedProducts).then(setTranslatedRelatedProducts);
    }
  }, [product, relatedProducts, translateProduct, translateProducts]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // Use translated product for cart, but keep original for data integrity
    const cartItem = {
      ...(translatedProduct || product),
      variant: Object.keys(selectedVariant).length > 0 ? selectedVariant : null
    };
    addToCart(cartItem, quantity);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    toggleFavorite(product);
  };

  const displayProduct = translatedProduct || product;
  const finalPrice = displayProduct?.discountPrice != null 
    ? Number(displayProduct.discountPrice) 
    : Number(displayProduct?.price || 0);
  const totalPrice = finalPrice * quantity;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-2 text-lg" style={{ color: 'var(--text-primary)' }}>
          {t('loadingProductDetails')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500">
          {t('errorLoadingProduct')}: {error}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          {t('goBack') || t('back')}
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {t('productNotFound')}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          {t('goBack') || t('back')}
        </button>
      </div>
    );
  }

  return (
    <>
        <Navbar/>
        <LanguageSelector />
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden relative">
                  <button
                    onClick={handleFavoriteClick}
                    className="absolute top-4 right-4 z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    aria-label={isFavorite(product?.id) ? t('removeFromFavorites') : t('addToFavorites')}
                  >
                    <Heart
                      className={`h-6 w-6 ${isFavorite(product?.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                  </button>
                  <img 
                    src={imageUrl || product.imageUrl || product.image || '/images/placeholder.png'} 
                    alt={product.name} 
                    className="w-full h-full object-cover max-h-[500px]"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                      setImageUrl('/images/placeholder.png');
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4" style={{ color: 'var(--text-primary)' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {displayProduct?.name || product?.name}
                </h1>
                
                <span className="bg-amber-500 text-white force-white-text px-3 py-1 rounded-full text-sm inline-block">
                    {typeof displayProduct?.brand === 'string' 
                      ? displayProduct.brand 
                      : displayProduct?.brand?.name || product?.brand?.name || t('brandNotSpecified')}
                </span>

                <p style={{ color: 'var(--text-secondary)' }}>
                    {typeof displayProduct?.category === 'string' 
                    ? displayProduct.category.charAt(0).toUpperCase() + displayProduct.category.slice(1)
                    : displayProduct?.category?.name 
                      ? displayProduct.category.name.charAt(0).toUpperCase() + displayProduct.category.name.slice(1)
                        : product?.category?.name
                        ? product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)
                        : t('category')
                    }
                </p>

                <div className="text-2xl">
                  {displayProduct?.discountPrice != null ? (
                    <div className="flex items-center space-x-3">
                      <span className="line-through text-xl" style={{ color: 'var(--text-secondary)' }}>
                        {Number(displayProduct.price || product?.price || 0).toFixed(2)} TL
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold text-2xl">
                        {Number(displayProduct.discountPrice || 0).toFixed(2)} TL
                      </span>
                    </div>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {Number(displayProduct?.price || product?.price || 0).toFixed(2)} TL
                    </span>
                  )}
                </div>

                {displayProduct?.description && (
                    <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t('description')}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {displayProduct.description}
                    </p>
                    </div>
                )}

                {/* Variant Selector */}
                <VariantSelector 
                  product={displayProduct || product} 
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4 pt-4">
                  <label className="text-sm font-medium text-gray-700">{t('quantity')}:</label>
                  <div className="flex items-center space-x-2 border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-md"
                      aria-label={t('decreaseQuantity')}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-md"
                      aria-label={t('increaseQuantity')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-lg font-semibold text-amber-600">
                    {t('total')}: {totalPrice.toFixed(2)} TL
                  </div>
                </div>

                <div className="pt-4">
                    <button 
                    onClick={handleAddToCart}
                    className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white force-white-text rounded-lg transition-colors"
                    >
                    {t('addToCart')}
                    </button>
                </div>

                {product.specifications && (
                    <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {t('specifications')}
                    </h3>
                    <ul className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="flex border-b border-gray-100 py-2">
                            <span className="text-gray-600 w-1/3">{key}</span>
                            <span className="w-2/3">{value}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>
            </div>

            {(translatedRelatedProducts.length > 0 || relatedProducts.length > 0) && (
                <div className="mt-12">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  {t('relatedProducts')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(translatedRelatedProducts.length > 0 ? translatedRelatedProducts : relatedProducts).map((relatedProduct) => (
                      <ProductCard
                        key={relatedProduct.id}
                        product={relatedProduct}
                        onAddToCart={(e, product) => {
                          e.preventDefault();
                          if (!isLoggedIn) {
                            navigate('/login');
                            return;
                          }
                          addToCart(product);
                        }}
                      />
                    ))}
                </div>
                </div>
            )}
        </div>
        <Footer/>

    </>

  );
};

export default ProductDetail;