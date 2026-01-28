import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { translations } from '../i18n/translations';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const getCurrentLanguage = () => {
    return localStorage.getItem('language') || 'tr';
  };

  const t = (key) => {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || key;
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const addToFavorites = (product) => {
    if (!isLoggedIn) {
      toast.error(t('loginRequired'));
      return;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      return;
    }

    setFavorites(prev => [...prev, product]);
    toast.success(t('productAddedToFavorites'));
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
    toast.success(t('productRemovedFromFavorites'));
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isFavorite,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
