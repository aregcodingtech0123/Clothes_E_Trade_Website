// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { LanguageProvider } from './i18n/LanguageContext';
// import HomePage from "./components/HomePage";
// import SignupPage from './components/SignUpPage';
// import LoginPage from './components/LoginPage';
// import SearchResultsPage from './components/SearchResultsPage';
// import AdminPanel from './components/adminpanelall/AdminPanel'
// import AdminUsers from './components/adminpanelall/adminusers/AdminPanelUsers';
// import AdminProducts from './components/adminpanelall/adminproducts/AdminPanelProducts';
// import AdminOrders from './components/adminpanelall/AdminPanelOrders';
// import AdminOrderDetail from './components/adminpanelall/AdminOrderDetail';
// import { AuthProvider } from "./components/AuthContext";
// import PreCheckout from './components/PreCheckOut';
// import OrderConfirmation from './components/OrderConfirmation';
// import PreOrders from './components/PreOrders'
// import ProductsList from './components/ProductsList';
// import  Contact  from './components/Contact';
// import AboutUs from './components/AboutUs';
// import AdminContactMessages from './components/adminpanelall/AdminContactMessages';
// import ProfilePage from './components/Profile';
// import ProductDetail from './components/ProductDetail';
// import UserOrderDetail from './components/OrderDetailForUser';
// import Orders from './components/Orders';
// import DiscountedProducts from './components/DiscountedProducts';
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div>
//           <ToastContainer />
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginPage/>} />
//             <Route path="/signup" element={<SignupPage/>} />
//             <Route path="/search" element={<SearchResultsPage />} />
//             <Route path="/adminpanel" element={<AdminPanel />} />
//             <Route path="/adminpanel/products" element={<AdminProducts />} />
//             <Route path="/adminpanel/users" element={<AdminUsers />} />
//             <Route path="/adminpanel/orders" element={<AdminOrders />} />
//             <Route path="/preCheckOut" element={<PreCheckout />} />
//             <Route path="/checkout/payment" element={<OrderConfirmation />} />
//             <Route path="/adminpanel/orders/:orderId" element={<AdminOrderDetail />} />
//             <Route path="/adminpanel/contactMessages" element={<AdminContactMessages/>}/>
//             <Route path="/preOrders" element={<PreOrders />} />
//             <Route path="/productsList" element={<ProductsList />} />
//             <Route path="/products/:id" element={<ProductDetail />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/discounted" element={<DiscountedProducts />} />

//             <Route path="/contact" element={<Contact />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path='/profile' element={<ProfilePage/>}/>
//             <Route path="/profile/orders/:orderId" element={<UserOrderDetail />} />
//             </Routes>
//           </div>
//         </AuthProvider>
//       </LanguageProvider>
//     </Router>
//   );
// }

// export default App;


// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from "./components/AuthContext";
import { FavoritesProvider } from "./components/FavoritesContext";

import HomePage from "./components/HomePage";
import SignupPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import SearchResultsPage from './components/SearchResultsPage';

import AdminPanel from './components/adminpanelall/AdminPanel';
import AdminUsers from './components/adminpanelall/adminusers/AdminPanelUsers';
import AdminProducts from './components/adminpanelall/adminproducts/AdminPanelProducts';
import AdminOrders from './components/adminpanelall/AdminPanelOrders';
import AdminOrderDetail from './components/adminpanelall/AdminOrderDetail';
import AdminContactMessages from './components/adminpanelall/AdminContactMessages';

import PreCheckout from './components/PreCheckOut';
import OrderConfirmation from './components/OrderConfirmation';
import PreOrders from './components/PreOrders';
import ProductsList from './components/ProductsList';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import ProfilePage from './components/Profile';
import ProductDetail from './components/ProductDetail';
import UserOrderDetail from './components/OrderDetailForUser';
import Orders from './components/Orders';
import DiscountedProducts from './components/DiscountedProducts';
import Favorites from './components/Favorites';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <ToastContainer />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            <Route path="/adminpanel" element={<AdminPanel />} />
            <Route path="/adminpanel/products" element={<AdminProducts />} />
            <Route path="/adminpanel/users" element={<AdminUsers />} />
            <Route path="/adminpanel/orders" element={<AdminOrders />} />
            <Route path="/adminpanel/orders/:orderId" element={<AdminOrderDetail />} />
            <Route path="/adminpanel/contactMessages" element={<AdminContactMessages />} />

            <Route path="/preCheckOut" element={<PreCheckout />} />
            <Route path="/checkout/payment" element={<OrderConfirmation />} />
            <Route path="/preOrders" element={<PreOrders />} />

            <Route path="/productsList" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/discounted" element={<DiscountedProducts />} />
            <Route path="/favorites" element={<Favorites />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/orders/:orderId" element={<UserOrderDetail />} />
          </Routes>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
