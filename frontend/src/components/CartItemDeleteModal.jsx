import React from 'react';
import { X, Trash2, Heart } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

const CartItemDeleteModal = ({ isOpen, onClose, onRemove, onRemoveAndAddToFavorites, productName }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{t('confirmRemove')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-600 mb-4">
            {productName}
          </p>

          <div className="space-y-2">
            <button
              onClick={() => {
                onRemove();
                onClose();
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('removeFromCart')}
            </button>

            <button
              onClick={() => {
                onRemoveAndAddToFavorites();
                onClose();
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              <Heart className="h-4 w-4 mr-2" />
              {t('removeAndAddToFavorites')}
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemDeleteModal;
