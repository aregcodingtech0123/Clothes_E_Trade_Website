// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from '../i18n/LanguageContext';

// const Header = () => {
//   const { t } = useTranslation();
//   // Mobil menü için durum yönetimi
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <div className="relative">
//       {/* Arka plan resmi ve overlay */}
//       <div className="absolute inset-0">
//         <img
//           src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
//           alt="Giyim koleksiyonu"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-60"></div>
//       </div>

//       {/* Header içeriği */}
//       <header className="relative z-10">
//         {/* Navigasyon çubuğu */}
        

//         {/* Mobil menü */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-black bg-opacity-90">
//             <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   to={link.path}
//                   className="text-white hover:text-amber-400 transition duration-300"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Hero bölümü */}
//         <div className="container mx-auto py-32 px-4 text-center">
//           <div className="max-w-2xl mx-auto">
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               {t('updateStyle')}
//             </h1>
//             <h2 className="text-3xl md:text-4xl text-amber-400 mb-6">
//               {t('newSeasonCollection')}
//             </h2>
//             <p className="text-lg text-white mb-8">
//               {t('qualityFabrics')}
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Link
//                 to="/productsList"
//                 className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300"
//               >
//                 {t('exploreProducts')}
//               </Link>
//               <Link
//                 to="/discounted"
//                 className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-medium rounded-lg transition duration-300"
//               >
//                 {t('viewDiscounts')}
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// };

// export default Header;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ NAV LINKLER TANIMLANDI
  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/productsList' },
    { name: t('discounts'), path: '/discounted' },
    { name: t('orders'), path: '/orders' },
    { name: t('favorites'), path: '/favorites' },
    { name: t('contact'), path: '/contact' },
    { name: t('about'), path: '/about' },
  ];

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050"
          alt="Giyim koleksiyonu"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <header className="relative z-10">

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-amber-400 transition duration-300"
                  style={{ color: '#ffffff' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hero Section - Always white text regardless of theme */}
        <div className="container mx-auto py-32 px-4 text-center hero-section">
          <div className="max-w-2xl mx-auto">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#ffffff' }}
            >
              {t('updateStyle')}
            </h1>
            <h2 
              className="text-3xl md:text-4xl mb-6"
              style={{ color: '#f59e0b' }}
            >
              {t('newSeasonCollection')}
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ color: '#ffffff' }}
            >
              {t('qualityFabrics')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/productsList"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 font-medium rounded-lg transition"
                style={{ color: '#ffffff' }}
              >
                {t('exploreProducts')}
              </Link>

              <Link
                to="/discounted"
                className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black font-medium rounded-lg transition"
                style={{ color: '#ffffff' }}
              >
                {t('viewDiscounts')}
              </Link>
            </div>
          </div>
        </div>

      </header>
    </div>
  );
};

export default Header;
