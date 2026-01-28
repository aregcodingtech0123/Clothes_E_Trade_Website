import React from 'react';
import Navbar from './Navbar';
import LanguageSelector from './LanguageSelector';

const AppLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <LanguageSelector />
      {children}
    </>
  );
};

export default AppLayout;
