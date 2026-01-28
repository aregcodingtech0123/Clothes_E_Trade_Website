import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    setDragOffset(startX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const threshold = rect.width / 2;
    
    // If dragged past threshold, toggle theme
    if ((theme === 'light' && currentX > threshold) || 
        (theme === 'dark' && currentX < threshold)) {
      toggleTheme();
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, theme]);

  const sliderPosition = theme === 'dark' ? 'translate-x-full' : 'translate-x-0';

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-amber-500" />
      <button
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-amber-200'
        }`}
        onClick={toggleTheme}
        onMouseDown={handleMouseDown}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${sliderPosition}`}
          style={{
            transform: isDragging && dragOffset > 0 
              ? `translateX(${Math.min(Math.max(dragOffset - 10, 0), 24)}px)` 
              : sliderPosition === 'translate-x-full' ? 'translateX(28px)' : 'translateX(0px)'
          }}
        />
      </button>
      <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    </div>
  );
};

export default ThemeToggle;
