import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useFavorites } from './FavoritesContext';
import { useTranslation } from '../i18n/LanguageContext';
import { AuthContext } from './AuthContext';
import { useTranslateDBContent } from '../hooks/useTranslateDBContent';

const ProductCard = ({ product, onAddToCart, onEdit, onDelete, showAdminControls = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const { isLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { translateProduct } = useTranslateDBContent();
  const [showAdminMenu, setShowAdminMenu] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(product.imageUrl || product.image || '/images/placeholder.png');
  const [translatedProduct, setTranslatedProduct] = useState(product);

  // Translate product content when product or language changes
  useEffect(() => {
    translateProduct(product).then(setTranslatedProduct);
  }, [product, translateProduct]);

  // Sync imageUrl when products get imageUrl attached (runtime)
  useEffect(() => {
    setImageUrl(product.imageUrl || product.image || '/images/placeholder.png');
  }, [product.name, product.imageUrl, product.image]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    toggleFavorite(product);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(e, product);
    }
  };

  const isFav = isFavorite(product.id);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Heart Icon - Top Right */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 left-2 z-20 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label={isFav ? t('removeFromFavorites') : t('addToFavorites')}
      >
        <Heart
          className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Admin Controls - Top Right (if admin) */}
      {showAdminControls && (
        <div className="absolute top-2 right-2 z-10">
          <div className="dropdown relative">
            <button
              className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAdminMenu(!showAdminMenu);
              }}
            >
              <MoreVertical size={18} />
            </button>

            {showAdminMenu && (
              <div
                className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                onMouseLeave={() => setShowAdminMenu(false)}
              >
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(product);
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t('edit')}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(product.id);
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('delete')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Link
        to={`/products/${product.id}`}
        className="block"
      >
            <div className="h-64 bg-gray-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name || t('product')}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                  setImageUrl('/images/placeholder.png');
                }}
              />
            </div>

        <div className="p-4" style={{ color: 'var(--text-primary)' }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              {translatedProduct.name || product.name}
            </h3>
            <span className="bg-amber-500 text-white force-white-text text-xs px-2 py-1 rounded">
              {typeof translatedProduct.brand === 'string'
                ? translatedProduct.brand
                : translatedProduct.brand?.name || product.brand?.name || t('brandNotSpecified')}
            </span>
          </div>

          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {typeof translatedProduct.category === 'string'
              ? translatedProduct.category.charAt(0).toUpperCase() + translatedProduct.category.slice(1)
              : translatedProduct.category?.name 
                ? translatedProduct.category.name.charAt(0).toUpperCase() + translatedProduct.category.name.slice(1)
                : product.category?.name 
                  ? product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)
                  : t('category')}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {product.discountPrice != null ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 line-through text-sm">
                    {Number(product.price || 0).toFixed(2)} TL
                  </span>
                  <span className="text-red-600 font-bold">
                    {Number(product.discountPrice || 0).toFixed(2)} TL
                  </span>
                </div>
              ) : (
                <span className="text-amber-600 font-bold">
                  {Number(product.price || 0).toFixed(2)} TL
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCartClick}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white force-white-text text-sm rounded transition-colors"
            >
              {t('addToCart')}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
