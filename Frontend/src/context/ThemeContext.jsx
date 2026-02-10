import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

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
  
  // Instead of throwing error, return default light theme
  if (!context) {
    console.warn('useTheme must be used within ThemeProvider. Using default light theme.');
    return {
      isDarkMode: false,
      toggleTheme: () => console.warn('ThemeProvider not found'),
      theme: lightTheme
    };
  }
  
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
      return false;
    }
  });

  // Get current theme based on isDarkMode
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error in theme effect:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
