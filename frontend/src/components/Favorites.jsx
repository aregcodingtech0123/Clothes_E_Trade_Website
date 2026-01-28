import React from 'react';
import { useFavorites } from './FavoritesContext';
import { useTranslation } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';
import ProductCard from './ProductCard';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useTranslation();
  const { isLoggedIn, addToCart, user } = React.useContext(AuthContext);
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold mb-8">{t('myFavorites')}</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">{t('noFavorites')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              {t('startShopping')}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {favorites.length} {t('items')} {t('productsFound')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
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

export default Favorites;
