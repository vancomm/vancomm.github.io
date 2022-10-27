import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Nestable } from '../types/utils';

interface ThemeInterface {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeInterface | null>(null);

export function ThemeProvider({ children }: Nestable) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [dark, setDark] = useState(prefersDark);

  const applyTheme = () => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggle = () => {
    setDark((state) => !state);
  };

  useLayoutEffect(() => {
    applyTheme();
  }, [dark]);

  const value = { dark, toggle };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext)!;
}

export default ThemeContext;
