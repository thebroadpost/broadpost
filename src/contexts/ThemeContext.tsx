import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'broadpost-theme';
const THEME_MIGRATION_KEY = 'broadpost-theme-migrated-v2';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // The resolved theme if 'system' is selected
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  actualTheme: 'light',
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const isMigrated = localStorage.getItem(THEME_MIGRATION_KEY) === '1';

    // One-time migration: force existing users to light mode.
    if (!isMigrated) {
      localStorage.setItem(THEME_MIGRATION_KEY, '1');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      return 'light';
    }

    return saved || 'light';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    let resolvedTheme: 'light' | 'dark';
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }
    
    setActualTheme(resolvedTheme);
    
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes if in system mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const isDark = e.matches;
      setActualTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
