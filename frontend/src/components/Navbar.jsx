import React, { useState, useContext } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, X } from 'lucide-react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { isLoggedIn, logout, cartItems, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount = cartItems.length;

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm relative z-40" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo - Homepage link */}
          <a href="/" className="font-bold text-2xl hover:text-amber-600 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
            Peygwen
          </a>

          {/* Ana Navigasyon - Masaüstü */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-amber-600 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{t('home')}</a>
            <a href="/productsList" className="hover:text-amber-600 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>{t('products')}</a>
            {isLoggedIn && (
              <>
                <a href="/orders" className="hover:text-amber-600 transition-colors duration-200">{t('myOrders')}</a>
                <a href="/favorites" className="hover:text-amber-600 transition-colors duration-200">{t('favorites')}</a>
              </>
            )}
            <a href="/contact" className="hover:text-amber-600 transition-colors duration-200">{t('contact')}</a>
            <a href="/about" className="hover:text-amber-600 transition-colors duration-200">{t('about')}</a>
            {/* Admin panel linki */}
            {user?.isAdmin && (
              <a href="/adminpanel" className="hover:text-amber-600 transition-colors duration-200">{t('adminPanel')}</a>
            )}
          </div>

          {/* Sağ Kısım - Arama ve Kullanıcı İşlemleri */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Arama İkonu */}
            <button 
              onClick={toggleSearchBar}
              className="hover:text-amber-600 transition-colors duration-200"
              aria-label="Arama yap"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Kullanıcı giriş durumuna göre içerik */}
            {isLoggedIn ? (
              <>
                {/* Sepet İkonu */}
                <button 
                  onClick={() => navigate('/preCheckOut')}
                  className="relative hover:text-amber-600 transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Profil Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors duration-200"
                    aria-label="Profil menüsü"
                  >
                    <User className="h-6 w-6" />
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showProfileDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                      onMouseLeave={() => setShowProfileDropdown(false)}
                    >
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Giriş/Kayıt Butonları - Masaüstü */
              <div className="hidden md:flex space-x-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 hover:text-amber-600 transition-colors duration-200"
                >
                  {t('login')}
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200"
                >
                  {t('signup')}
                </button>
              </div>
            )}

            {/* Mobil Menü Butonu */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="hover:text-amber-600 transition-colors duration-200"
                aria-label="Mobil menü"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü İçeriği */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
              <a 
                href="/" 
                className="hover:text-amber-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('home')}
              </a>
              <a 
                href="/productsList" 
                className="hover:text-amber-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('products')}
              </a>
              {isLoggedIn && (
                <>
                  <a 
                    href="/orders" 
                    className="hover:text-amber-600 transition-colors duration-200 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('myOrders')}
                  </a>
                  <a 
                    href="/favorites" 
                    className="hover:text-amber-600 transition-colors duration-200 py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('favorites')}
                  </a>
                </>
              )}
              <a 
                href="/contact" 
                className="hover:text-amber-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('contact')}
              </a>
              <a 
                href="/about" 
                className="hover:text-amber-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('about')}
              </a>
              
              {/* Admin panel linki - Mobil */}
              {user?.isAdmin && (
                <a 
                  href="/adminpanel" 
                  className="hover:text-amber-600 transition-colors duration-200 py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('adminPanel')}
                </a>
              )}

              {/* Giriş/Kayıt Butonları - Mobil */}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-3 pt-2">
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setShowMobileMenu(false);
                    }}
                    className="px-4 py-2 hover:text-amber-600 transition-colors duration-200 text-left"
                  >
                    {t('login')}
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/signup');
                      setShowMobileMenu(false);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200 text-center"
                  >
                    {t('signup')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Arama Çubuğu */}
      <SearchBar 
        isVisible={showSearchBar} 
        onClose={toggleSearchBar} 
        onSearch={handleSearch}
      />
    </>
  );
}

export default Navbar;