import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme configurations
const themes = {
  blue: {
    name: 'Dark',
    id: 'blue',
    colors: {
      // Background gradients
      primary: 'from-[#000000] via-[#000000] to-[#000000]',
      secondary: 'from-indigo-700/40 via-indigo-500/10 to-transparent',
      
      // Card backgrounds
      cardBg: 'bg-white/10',
      cardBgHover: 'bg-white/20',
      cardBorder: 'border-white/20',
      cardBorderHover: 'border-white/30',
      
      // Text colors
      textPrimary: 'text-white',
      textSecondary: 'text-blue-200',
      textTertiary: 'text-blue-100',
      textMuted: 'text-blue-300',
      
      // Button colors
      buttonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-500',
      buttonSecondary: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      buttonDanger: 'bg-gradient-to-r from-red-500 to-pink-500',
      buttonSuccess: 'bg-gradient-to-r from-green-500 to-emerald-500',
      
      // Input colors
      inputBg: 'bg-white/30',
      inputBgFocus: 'focus:bg-white/50',
      inputBorder: 'border-white/20',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder:text-blue-200',
      
      // Accent colors
      accent: 'text-blue-400',
      accentHover: 'hover:text-blue-300',
      
      // Status colors
      success: 'text-emerald-400',
      error: 'text-rose-400',
      warning: 'text-yellow-400',
      
      // Ambient effects
      ambientPurple: 'bg-purple-500',
      ambientBlue: 'bg-blue-400',
    }
  },
  dark: {
    name: 'Dark Blue',
    id: 'dark',
    colors: {
      // Background gradients
      primary: 'from-gray-900 via-gray-800 to-black',
      secondary: 'from-gray-800/40 via-gray-700/10 to-transparent',
      
      // Card backgrounds
      cardBg: 'bg-gray-800/50',
      cardBgHover: 'bg-gray-700/50',
      cardBorder: 'border-gray-600/30',
      cardBorderHover: 'border-gray-500/40',
      
      // Text colors
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textTertiary: 'text-gray-400',
      textMuted: 'text-gray-500',
      
      // Button colors
      buttonPrimary: 'bg-gradient-to-r from-gray-700 to-gray-600',
      buttonSecondary: 'bg-gradient-to-r from-gray-600 to-gray-500',
      buttonDanger: 'bg-gradient-to-r from-red-600 to-red-500',
      buttonSuccess: 'bg-gradient-to-r from-green-600 to-green-500',
      
      // Input colors
      inputBg: 'bg-gray-700/50',
      inputBgFocus: 'focus:bg-gray-600/50',
      inputBorder: 'border-gray-600/30',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder:text-gray-400',
      
      // Accent colors
      accent: 'text-gray-300',
      accentHover: 'hover:text-white',
      
      // Status colors
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      
      // Ambient effects
      ambientPurple: 'bg-gray-700',
      ambientBlue: 'bg-gray-600',
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme must be used within a ThemeProvider');
    return {
      theme: themes.blue,
      themeName: 'blue',
      setTheme: () => {},
      toggleTheme: () => {},
      availableThemes: themes
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('blue');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-theme', themeName);
    
    // Add theme class to document root for global CSS if needed
    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName]);

  const setTheme = (newTheme) => {
    if (themes[newTheme]) {
      setThemeName(newTheme);
    }
  };

  const toggleTheme = () => {
    const currentIndex = Object.keys(themes).indexOf(themeName);
    const nextIndex = (currentIndex + 1) % Object.keys(themes).length;
    const nextTheme = Object.keys(themes)[nextIndex];
    setTheme(nextTheme);
  };

  const value = {
    theme: themes[themeName],
    themeName,
    setTheme,
    toggleTheme,
    availableThemes: themes
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`min-h-screen transition-all duration-500 ease-in-out bg-gradient-to-br ${themes[themeName].colors.primary}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
