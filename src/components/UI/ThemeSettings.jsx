import React, { useState } from 'react';
import { FiSettings, FiX, FiCheck, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/themecontext.jsx';

const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeName, setTheme, availableThemes } = useTheme();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Auto close after selection for better UX
    setTimeout(() => setIsOpen(false), 300);
  };

  const getThemeIcon = (themeId) => {
    switch (themeId) {
      case 'dark':
        return <FiMoon className="w-5 h-5" />;
      case 'blue':
        return <FiSun className="w-5 h-5" />;
      default:
        return <FiSettings className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl ${theme.colors.cardBg} ${theme.colors.cardBorder} border backdrop-blur-md ${theme.colors.textPrimary} hover:${theme.colors.cardBgHover} transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400`}
        aria-label="Theme Settings"
      >
        <FiSettings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute top-full right-0 mt-2 w-80 z-50 animate-fade-in">
            <div className={`${theme.colors.cardBg} ${theme.colors.cardBorder} border rounded-2xl backdrop-blur-xl p-6 shadow-2xl`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
                  Theme Settings
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg ${theme.colors.textSecondary} hover:${theme.colors.textPrimary} hover:bg-white/10 transition-all duration-200`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Options */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium ${theme.colors.textSecondary} mb-3`}>
                  Choose Theme
                </h4>
                
                {Object.entries(availableThemes).map(([themeId, themeConfig]) => (
                  <button
                    key={themeId}
                    onClick={() => handleThemeChange(themeId)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      themeName === themeId
                        ? `${theme.colors.cardBgHover} ${theme.colors.cardBorderHover} border-2`
                        : `${theme.colors.cardBg} ${theme.colors.cardBorder} hover:${theme.colors.cardBgHover}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${themeId === 'dark' ? 'bg-gray-700' : 'bg-blue-500/20'}`}>
                        {getThemeIcon(themeId)}
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${theme.colors.textPrimary}`}>
                          {themeConfig.name}
                        </div>
                        <div className={`text-sm ${theme.colors.textMuted}`}>
                          {themeId === 'dark' ? 'Dark mode theme' : 'Blue gradient theme'}
                        </div>
                      </div>
                    </div>
                    
                    {themeName === themeId && (
                      <div className={`p-1 rounded-full ${theme.colors.buttonSuccess}`}>
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Theme Preview */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className={`text-sm font-medium ${theme.colors.textSecondary} mb-3`}>
                  Preview
                </h4>
                <div className={`p-4 rounded-xl ${theme.colors.cardBg} ${theme.colors.cardBorder} border`}>
                  <div className={`text-sm ${theme.colors.textPrimary} mb-2`}>
                    Sample Card
                  </div>
                  <div className={`text-xs ${theme.colors.textSecondary} mb-3`}>
                    This is how your theme will look
                  </div>
                  <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded-lg text-xs ${theme.colors.buttonPrimary} text-white`}>
                      Primary
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs ${theme.colors.buttonSecondary} text-white`}>
                      Secondary
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`mt-4 text-xs ${theme.colors.textMuted} text-center`}>
                Theme preference is saved automatically
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSettings;
