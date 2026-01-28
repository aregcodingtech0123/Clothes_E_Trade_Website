import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useTranslateDBContent } from '../hooks/useTranslateDBContent';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';
import ProductCard from './ProductCard';

const DiscountedProducts = () => {
  const [products, setProducts] = useState([]);
  const [translatedProducts, setTranslatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, addToCart, user } = useContext(AuthContext);
  const { t, language } = useTranslation();
  const { translateProducts } = useTranslateDBContent();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products/discounted');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
        
        // Translate products immediately after fetching
        const translated = await translateProducts(data);
        setTranslatedProducts(translated);
      } catch (err) {
        console.error('Error loading discounted products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [translateProducts]);

  // Re-translate when language changes
  useEffect(() => {
    if (products.length > 0) {
      translateProducts(products).then(setTranslatedProducts);
    }
  }, [language, products, translateProducts]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const formatPrice = (price) => {
    if (price == null) return '0.00';
    const num = typeof price === 'object' && price.toString ? Number(price.toString()) : Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LanguageSelector />
        <div className="container mx-auto px-4 py-8 text-center min-h-screen">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-lg">{t('discountedProductsLoading')}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <LanguageSelector />
        <div className="container mx-auto px-4 py-8 text-center min-h-screen">
          <p className="text-lg text-red-500">{t('error')}: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            {t('tryAgain')}
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LanguageSelector />
      <div className="container mx-auto px-4 py-8 min-h-screen" style={{ color: 'var(--text-primary)' }}>
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          {t('discountedProducts')}
        </h1>

        {(translatedProducts.length === 0 && products.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {t('noDiscountedProducts')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p style={{ color: 'var(--text-secondary)' }}>
                {(translatedProducts.length || products.length)} {t('discountedProductsFound')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(translatedProducts.length > 0 ? translatedProducts : products).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showAdminControls={user?.isAdmin}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DiscountedProducts;
