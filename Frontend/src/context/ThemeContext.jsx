import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Define theme colors
const lightTheme = {
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  hover: '#f3f4f6'
};

const darkTheme = {
  background: '#111827',
  card: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  hover: '#374151'
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Get current theme based on isDarkMode
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const html = document.documentElement;
    
    // Force remove and add class
    html.classList.remove('light', 'dark');
    
    if (isDarkMode) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.add('light');
      html.setAttribute('data-theme', 'light');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Force reflow
    void html.offsetHeight;
    
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
