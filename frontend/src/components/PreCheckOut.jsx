// // import React, { useContext } from 'react';
// // import { Link, useNavigate } from 'react-router-dom'; // useNavigate eklendi
// // import { AuthContext } from './AuthContext';
// // import Navbar from './Navbar';
// // import Footer from './Footer';

// // const PreCheckout = () => {
// //   const { cartItems } = useContext(AuthContext);
// //   const navigate = useNavigate(); // Navigasyon için

// //   //const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// //   const subtotal = (cartItems || []).reduce((sum, item) => {
// //     if (!item) return sum;
    
// //     // Price handling
// //     let price = 0;
// //     if (typeof item.price === 'number') {
// //       price = item.price;
// //     } else if (typeof item.price === 'string') {
// //       price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
// //     }
    
// //     // Quantity handling
// //     const quantity = Number(item.quantity) || 0;
    
// //     return sum + (price * quantity);
// //   }, 0);
  
// //   const shippingFee = subtotal > 500 ? 0 : 29.99;
// //   const total = subtotal + shippingFee;

// //   const handlePaymentClick = () => {
// //     // Burada istersen form doğrulaması da yapılabilir
// //     navigate('/checkout/payment'); // Yönlendirme yapılıyor
// //   };

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="container mx-auto px-4 py-8 min-h-screen">
// //         <h1 className="text-3xl font-bold mb-8">Sipariş Özeti</h1>
        
// //         <div className="flex flex-col lg:flex-row gap-8">
// //           {/* Ürünler */}
// //           <div className="lg:w-2/3">
// //             <div className="bg-white rounded-lg shadow p-6 mb-6">
// //               <h2 className="text-xl font-semibold mb-4">Sepetiniz</h2>
              
// //               {cartItems.length === 0 ? (
// //                 <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır</p>
// //               ) : (
// //                 <div className="divide-y divide-gray-200">
// //                   {cartItems.map((item) => {
// //                     const price = Number(item.price) || 0;
// //                     return (
// //                       <div key={item.id} className="py-4 flex">
// //                         <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
// //                           <img 
// //                             src={item.imageUrl}  // imageUrl olarak değiştirildi
// //                             alt={item.name} 
// //                             className="w-full h-full object-cover"
// //                           />
// //                         </div>
// //                         <div className="ml-4 flex-1">
// //                           <h3 className="font-medium">{item.name}</h3>
// //                           <p className="text-gray-600 text-sm">{item.brand.name}</p> {/* brand.name olarak değiştirildi */}
// //                           <div className="mt-2 flex justify-between items-center">
// //                             <span className="text-amber-600 font-semibold">{price.toFixed(2)} TL</span>
// //                             <span className="text-gray-500">Adet: {item.quantity}</span>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Teslimat Bilgileri */}
// //             <div className="bg-white rounded-lg shadow p-6 mb-6">
// //               <h2 className="text-xl font-semibold mb-4">Teslimat Bilgileri</h2>
// //               <form className="space-y-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
// //                     <input 
// //                       type="text" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
// //                     <input 
// //                       type="text" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
// //                   <textarea 
// //                     rows="3"
// //                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                     required
// //                   ></textarea>
// //                 </div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
// //                     <input 
// //                       type="text" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
// //                     <input 
// //                       type="tel" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //               </form>
// //             </div>

// //             {/* Ödeme Bilgileri */}
// //             <div className="bg-white rounded-lg shadow p-6">
// //               <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
// //               <form className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
// //                   <input 
// //                     type="text" 
// //                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                     placeholder="Ad Soyad"
// //                     required
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
// //                   <input 
// //                     type="text" 
// //                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                     placeholder="1234 1234 1234 1234"
// //                     required
// //                   />
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
// //                     <input 
// //                       type="text" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       placeholder="AA/YY"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
// //                     <input 
// //                       type="text" 
// //                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
// //                       placeholder="123"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>

// //           {/* Sipariş Özeti & Ödeme Yap Butonu */}
// //           <div className="lg:w-1/3">
// //             <div className="bg-white rounded-lg shadow p-6 sticky top-4">
// //               <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
// //               <div className="space-y-3 mb-6">
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Ara Toplam</span>
// //                   <span>{subtotal.toFixed(2)} TL</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Kargo</span>
// //                   <span>{shippingFee.toFixed(2)} TL</span>
// //                 </div>
// //                 <div className="border-t pt-3 flex justify-between font-semibold text-lg">
// //                   <span>Toplam</span>
// //                   <span className="text-amber-600">{total.toFixed(2)} TL</span>
// //                 </div>
// //               </div>

// //               {/* Yönlendirme yapan buton */}
// //               <button
// //                 type="button" // Form submit değil, yönlendirme yapılacak
// //                 onClick={handlePaymentClick}
// //                 className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-md transition-colors"
// //               >
// //                 Ödeme Yap
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <Footer />
// //     </>
// //   );
// // };

// // export default PreCheckout;

// import React, { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';
// import Navbar from './Navbar';
// import Footer from './Footer';

// const PreCheckout = () => {
//   const { cartItems, token, clearCart } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState(null);
//   console.log("The token for precheckout: ",token)
//   const subtotal = (cartItems || []).reduce((sum, item) => {
//     if (!item) return sum;
    
//     let price = 0;
//     if (typeof item.price === 'number') {
//       price = item.price;
//     } else if (typeof item.price === 'string') {
//       price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
//     }
    
//     const quantity = Number(item.quantity) || 0;
//     return sum + (price * quantity);
//   }, 0);
  
//   const shippingFee = subtotal > 500 ? 0 : 29.99;
//   const total = subtotal + shippingFee;

//   const handlePaymentClick = async () => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       // Sipariş verilerini hazırla
//       const orderData = {
//         orderItems: cartItems.map(item => ({
//           product: item.id,
//           name: item.name,
//           price: item.price,
//           imageUrl: item.imageUrl,
//           quantity: item.quantity,
//           brand: item.brand?.name || ''
//         })),
//         shippingAddress: {
//           fullName: document.querySelector('input[name="fullName"]')?.value || '',
//           addressLine1: document.querySelector('textarea[name="address"]')?.value || '',
//           city: document.querySelector('input[name="city"]')?.value || '',
//           phone: document.querySelector('input[name="phone"]')?.value || ''
//         },
//         paymentMethod: 'credit_card',
//         itemsPrice: subtotal,
//         shippingPrice: shippingFee,
//         totalPrice: total
//       };

//       const response = await fetch('http://localhost:5000/api/orders', {
//         method: 'POST',
//         headers: {
          
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(orderData)
//       });

//       if (!response.ok) {
//         throw new Error('Sipariş oluşturulamadı');
//       }

//       const data = await response.json();
      
//       // Sepeti temizle
//       clearCart();
      
//       // Sipariş onay sayfasına yönlendir
//       navigate('/checkout/payment', { state: { order: data } });
//     } catch (err) {
//       setError(err.message || 'Sipariş işlemi sırasında bir hata oluştu');
//       console.error('Sipariş hatası:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 min-h-screen">
//         <h1 className="text-3xl font-bold mb-8">Sipariş Özeti</h1>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Ürünler */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-lg shadow p-6 mb-6">
//               <h2 className="text-xl font-semibold mb-4">Sepetiniz</h2>
              
//               {cartItems.length === 0 ? (
//                 <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır</p>
//               ) : (
//                 <div className="divide-y divide-gray-200">
//                   {cartItems.map((item) => {
//                     const price = Number(item.price) || 0;
//                     return (
//                       <div key={item.id} className="py-4 flex">
//                         <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
//                           <img 
//                             src={item.imageUrl}
//                             alt={item.name} 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="ml-4 flex-1">
//                           <h3 className="font-medium">{item.name}</h3>
//                           <p className="text-gray-600 text-sm">{item.brand?.name}</p>
//                           <div className="mt-2 flex justify-between items-center">
//                             <span className="text-amber-600 font-semibold">{price.toFixed(2)} TL</span>
//                             <span className="text-gray-500">Adet: {item.quantity}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Teslimat Bilgileri */}
//             <div className="bg-white rounded-lg shadow p-6 mb-6">
//               <h2 className="text-xl font-semibold mb-4">Teslimat Bilgileri</h2>
//               <form className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
//                   <input 
//                     type="text" 
//                     name="fullName"
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
//                   <textarea 
//                     rows="3"
//                     name="address"
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     required
//                   ></textarea>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
//                     <input 
//                       type="text" 
//                       name="city"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
//                     <input 
//                       type="tel" 
//                       name="phone"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Ödeme Bilgileri */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
//               <form className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
//                   <input 
//                     type="text" 
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     placeholder="Ad Soyad"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
//                   <input 
//                     type="text" 
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     placeholder="1234 1234 1234 1234"
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
//                     <input 
//                       type="text" 
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       placeholder="AA/YY"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                     <input 
//                       type="text" 
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       placeholder="123"
//                       required
//                     />
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Sipariş Özeti & Ödeme Yap Butonu */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow p-6 sticky top-4">
//               <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Ara Toplam</span>
//                   <span>{subtotal.toFixed(2)} TL</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Kargo</span>
//                   <span>{shippingFee.toFixed(2)} TL</span>
//                 </div>
//                 <div className="border-t pt-3 flex justify-between font-semibold text-lg">
//                   <span>Toplam</span>
//                   <span className="text-amber-600">{total.toFixed(2)} TL</span>
//                 </div>
//               </div>

//               <button
//                 onClick={handlePaymentClick}
//                 disabled={isProcessing || cartItems.length === 0}
//                 className={`w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-md transition-colors ${
//                   isProcessing || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {isProcessing ? 'İşleniyor...' : 'Ödeme Yap'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default PreCheckout;

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useFavorites } from './FavoritesContext';
import { useTranslation } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageSelector from './LanguageSelector';
import CartItemDeleteModal from './CartItemDeleteModal';
import { Minus, Plus, Trash2 } from 'lucide-react';

const PreCheckout = () => {
  const { cartItems, token, clearCart, updateCartItemQuantity, removeFromCart } = useContext(AuthContext);
  const { addToFavorites } = useFavorites();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Fetch last completed order's delivery info
  useEffect(() => {
    const fetchLastDeliveryInfo = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/orders/last-delivery-info', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.shippingAddress) {
            const addr = data.data.shippingAddress;
            setFormData(prev => ({
              ...prev,
              fullName: addr.fullName || '',
              address: addr.address || '',
              city: addr.city || '',
              phone: addr.phone || ''
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching last delivery info:', err);
      }
    };

    fetchLastDeliveryInfo();
  }, [token]);

  // Subtotal hesaplama
  const subtotal = (cartItems || []).reduce((sum, item) => {
    if (!item) return sum;
    let price = 0;
    if (typeof item.price === 'number') {
      price = item.price;
    } else if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    }
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 29.99;
  const total = subtotal + shippingFee;

  // Form input değişikliklerini yönet
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Credit card number formatting
    if (name === 'cardNumber') {
      const numbersOnly = value.replace(/\s/g, '').replace(/\D/g, '');
      const formatted = numbersOnly.match(/.{1,4}/g)?.join(' ') || numbersOnly;
      if (numbersOnly.length <= 16) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Expiration date formatting (MM/YY)
    if (name === 'expiryDate') {
      const numbersOnly = value.replace(/\D/g, '');
      let formatted = numbersOnly;
      if (numbersOnly.length >= 2) {
        formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4);
      }
      if (numbersOnly.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // CVV - numbers only
    if (name === 'cvv') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 3) {
        setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form validasyonu
  const validateForm = () => {
    const { fullName, address, city, phone, cardName, cardNumber, expiryDate, cvv } = formData;
    if (!fullName || !address || !city || !phone || !cardName || !cardNumber || !expiryDate || !cvv) {
      setError(t('pleaseFillAllFields'));
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setError(t('invalidCardNumber'));
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError(t('invalidExpiryDate'));
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError(t('invalidCVV'));
      return false;
    }
    return true;
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleRemoveFromCart = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleRemoveAndAddToFavorites = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      addToFavorites(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(itemId, newQuantity);
  };

  // Ödeme işlemi
  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      setError(t('loginRequired'));
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone
        },
        paymentMethod: 'credit_card'
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || t('orderErrorOccurred'));
      }

      const data = await response.json();
      clearCart();
      navigate('/checkout/payment', { state: { order: data.data } });
    } catch (err) {
      setError(err.message || t('orderErrorOccurred'));
      console.error('Sipariş hatası:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <LanguageSelector />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">{t('orderSummary')}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ürünler */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('yourCart')}</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-600">{t('cartEmpty')}</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const price = Number(item.price) || 0;
                    const itemTotal = price * item.quantity;
                    return (
                      <div key={item.id} className="py-4 flex items-start">
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl || '/placeholder-image.jpg'} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <Link 
                            to={`/products/${item.id}`}
                            className="font-medium hover:text-amber-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-600 text-sm">{item.brand?.name || t('brandNotSpecified')}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 rounded border hover:bg-gray-100"
                                aria-label={t('decreaseQuantity')}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-gray-700 font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 rounded border hover:bg-gray-100"
                                aria-label={t('increaseQuantity')}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-amber-600 font-semibold">{itemTotal.toFixed(2)} TL</span>
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                aria-label={t('removeFromCart')}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Teslimat Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('deliveryInfo')}</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                  <textarea 
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('paymentInfo')}</h2>
              <form className="space-y-4" onSubmit={handlePaymentClick}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardName')}</label>
                  <input 
                    type="text" 
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder={t('fullName')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardNumber')}</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="1234 1234 1234 1234"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('expiryDate')}</label>
                    <input 
                      type="text" 
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('cvv')}</label>
                    <input 
                      type="text" 
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className={`w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-md transition-colors ${
                    isProcessing || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? t('processingOrder') : t('placeOrder')}
                </button>
              </form>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span>{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">{t('free')}</span>
                    ) : (
                      `${shippingFee.toFixed(2)} TL`
                    )}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded">
                    {t('freeShippingMessage')} {FREE_SHIPPING_THRESHOLD} TL. {FREE_SHIPPING_THRESHOLD - subtotal.toFixed(2)} TL {t('addMoreForFreeShipping')}!
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>{t('total')}</span>
                  <span className="text-amber-600">{total.toFixed(2)} TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartItemDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onRemove={handleRemoveFromCart}
        onRemoveAndAddToFavorites={handleRemoveAndAddToFavorites}
        productName={itemToDelete?.name || ''}
      />
      <Footer />
    </>
  );
};

export default PreCheckout;