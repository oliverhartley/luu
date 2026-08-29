import React, { useState } from 'react';
import { useTheme, ModernTheme } from '../../context/ThemeContext';
import { Palette, Sparkles, Check, ChevronDown } from 'lucide-react';

export const ThemeSwitcherBar: React.FC = () => {
  const { currentTheme, setTheme, themeOptions } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const activeOption = themeOptions.find((t) => t.id === currentTheme) || themeOptions[0];

  return (
    <div className="relative">
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-brand-200/70 bg-white/90 shadow-sm text-xs font-semibold text-charcoal-800 hover:bg-brand-50/80 transition-all"
        title="Cambiar Paleta Cromática Moderna"
      >
        <span className="text-sm">{activeOption.emoji}</span>
        <span className="hidden sm:inline">{activeOption.name}</span>
        <span
          className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
          style={{ backgroundColor: activeOption.primaryColor }}
        />
        <ChevronDown className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-200/80 p-2 z-50 animate-fade-in space-y-1">
            <div className="px-3 py-2 border-b border-brand-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                Paletas Modernas v3.0
              </p>
            </div>

            {themeOptions.map((opt) => {
              const isSelected = opt.id === currentTheme;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all ${
                    isSelected
                      ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200/80 shadow-2xs'
                      : 'hover:bg-[#FAF8F5] text-charcoal-700 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{opt.emoji}</span>
                    <div className="text-left">
                      <p className="font-bold text-charcoal-900 leading-tight">{opt.name}</p>
                      <p className="text-[10px] text-charcoal-500">{opt.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <div
                      className={`w-4 h-4 rounded-full shadow-inner ring-1 ring-black/10 bg-gradient-to-tr ${opt.previewGradient}`}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
};
