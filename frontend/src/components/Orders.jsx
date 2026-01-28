import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';

const Orders = () => {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/orders/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(t('ordersError'));
        }

        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Sipariş yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    const lang = localStorage.getItem('language') || 'tr';
    const localeMap = {
      en: 'en-US',
      tr: 'tr-TR',
      es: 'es-ES',
      de: 'de-DE',
      fr: 'fr-FR',
      ru: 'ru-RU',
      pt: 'pt-PT'
    };
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(localeMap[lang] || 'tr-TR', options);
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'processing':
        return t('processing');
      case 'shipped':
        return t('shipped');
      case 'delivered':
      case 'completed':
        return t('delivered');
      case 'cancelled':
        return t('cancelled');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-4 text-lg">{t('loadingOrders')}</p>
          </div>
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
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LanguageSelector />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">{t('myOrders')}</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">{t('noOrders')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              {t('startShopping')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const shippingAddress = typeof order.shippingAddress === 'string' 
                ? JSON.parse(order.shippingAddress) 
                : order.shippingAddress;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{t('orderNumber')} #{order.orderNumber}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                          {t('orderDate')}: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold mb-4">{t('orderDetails')}</h3>
                    <div className="space-y-3">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={item.product?.imageUrl || '/images/placeholder-product.png'}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.product?.name}</h4>
                              <p className="text-sm text-gray-500">
                                {item.quantity} {t('pieces')} × {formatPrice(item.price)} TL
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(Number(item.price) * item.quantity)} TL
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{t('total')}:</span>
                      <span className="text-xl font-bold text-amber-600">
                        {formatPrice(order.totalAmount)} TL
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/profile/orders/${order.id}`)}
                      className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {t('viewDetails')} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
