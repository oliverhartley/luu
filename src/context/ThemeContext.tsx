import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModernTheme = 'rhode' | 'matcha' | 'lilac' | 'noir';

export interface ThemeOption {
  id: ModernTheme;
  name: string;
  subtitle: string;
  primaryColor: string;
  previewGradient: string;
  emoji: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'rhode',
    name: 'Rhode Sunset',
    subtitle: 'Terracota Cálido & Melocotón Glow',
    primaryColor: '#E07A5F',
    previewGradient: 'from-[#E07A5F] to-[#F4A261]',
    emoji: '🌸'
  },
  {
    id: 'matcha',
    name: 'Matcha & Pistachio',
    subtitle: 'Clean Girl & Spa Botánico',
    primaryColor: '#4A7C59',
    previewGradient: 'from-[#4A7C59] to-[#8FCB9B]',
    emoji: '🍵'
  },
  {
    id: 'lilac',
    name: 'Electric Lilac',
    subtitle: 'Orquídea & Ciruela Velvet',
    primaryColor: '#8338EC',
    previewGradient: 'from-[#8338EC] to-[#C77DFF]',
    emoji: '💜'
  },
  {
    id: 'noir',
    name: 'Noir Luxury',
    subtitle: 'Obsidiana & Oro Champagne',
    primaryColor: '#D4AF37',
    previewGradient: 'from-[#D4AF37] to-[#F3E5AB]',
    emoji: '✨'
  },
];

interface ThemeContextType {
  currentTheme: ModernTheme;
  setTheme: (theme: ModernTheme) => void;
  themeOptions: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ModernTheme>(() => {
    return (localStorage.getItem('pelu_theme') as ModernTheme) || 'rhode';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('pelu_theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: setCurrentTheme,
        themeOptions: THEME_OPTIONS
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
