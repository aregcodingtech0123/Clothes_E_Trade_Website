import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { languages } from '../i18n/translations';

const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2 flex justify-end">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
