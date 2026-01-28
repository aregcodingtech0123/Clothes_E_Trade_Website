import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';
import ProductCard from './ProductCard';
import { AuthContext } from './AuthContext';
import { useTranslation } from '../i18n/LanguageContext';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, addToCart, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL'den arama terimini al
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || queryParams.get('query') || '';
    setSearchQuery(query);
    
    if (query) {
      fetchSearchResults(query);
    } else {
      setIsLoading(false);
    }
  }, [location]);

  // Backend API isteği
  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      // Sanitize search query
      const sanitizedQuery = query.trim().substring(0, 100);
      const response = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(sanitizedQuery)}`);
      
      if (!response.ok) {
        throw new Error(t('searchError') || 'Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <>
      <Navbar />
      <LanguageSelector />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">{t('searchResults')}: "{searchQuery}"</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                showAdminControls={user?.isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">"{searchQuery}" {t('noSearchResults')}</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResultsPage;