import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Store, 
  Scissors, 
  Plus, 
  Smartphone, 
  Scale, 
  Search, 
  SlidersHorizontal,
  Armchair,
  RotateCcw,
  LogIn
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThemeSwitcherBar } from '../themes/ThemeSwitcherBar';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onOpenNewAppointmentModal: () => void;
  onOpenWhatsAppSimulator: () => void;
  onOpenColorCalculator: () => void;
  onOpenCommandPalette: () => void;
  onOpenBeforeAfterSlider: () => void;
  onOpenAuthScreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenNewAppointmentModal, 
  onOpenWhatsAppSimulator,
  onOpenColorCalculator,
  onOpenCommandPalette,
  onOpenBeforeAfterSlider,
  onOpenAuthScreen
}) => {
  const { 
    role, 
    setRole, 
    selectedDate, 
    setSelectedDate, 
    appointments, 
    whatsAppLogs, 
    resetDemoData,
    setActiveTab,
    currentUser,
    currentSalon,
    setIsOnboardingOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Salon Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('agenda')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-roseGold flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-950">
                  luu<span className="text-brand-500">.</span>
                </span>
                <Badge variant="luxury" className="hidden md:inline-flex">
                  {currentSalon.name}
                </Badge>
              </div>
              <p className="text-[11px] text-charcoal-500 hidden sm:block">
                Beauty-Tech & CRM Multi-Salón
              </p>
            </div>
          </div>

          {/* Global Search / Command Palette Bar (Cmd+K) */}
          <div 
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center space-x-2 bg-[#FAF8F5] hover:bg-brand-50/70 cursor-pointer px-4 py-2 rounded-2xl border border-brand-200/80 shadow-sm text-xs text-charcoal-500 transition-all w-48 lg:w-64"
          >
            <Search className="w-4 h-4 text-brand-600" />
            <span className="flex-1 truncate">Buscar...</span>
            <kbd className="font-mono bg-white px-2 py-0.5 rounded-lg border border-brand-200 text-[10px] text-charcoal-700 shadow-2xs">
              ⌘ K
            </kbd>
          </div>

          {/* Right Actions, Palette Switcher & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Palette Switcher Bar (Rhode, Matcha, Lilac, Noir) */}
            <ThemeSwitcherBar />

            {/* Quick WhatsApp Simulator Trigger */}
            <Button
              variant="whatsapp"
              size="sm"
              onClick={onOpenWhatsAppSimulator}
              className="relative flex items-center space-x-1.5"
              title="Abrir simulador de WhatsApp con clientes"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
              {whatsAppLogs.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5 sm:relative sm:top-auto sm:right-auto" />
              )}
            </Button>

            {/* Quick New Appointment Button */}
            {role !== 'client' && (
              <Button
                variant="luxury"
                size="sm"
                onClick={onOpenNewAppointmentModal}
                className="flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Nueva Cita</span>
              </Button>
            )}

            {/* Setup Wizard Button */}
            {currentUser && role !== 'client' && (
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs transition-all"
                title="Configurar módulos del salón"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Asistente</span>
              </button>
            )}

            {/* Portal Switcher Button for Client Testing */}
            <button
              onClick={() => setRole('client')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 transition-all"
              title="Probar vista de clienta"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Portal</span>
            </button>

            {/* User Profile Menu or Sign In */}
            {currentUser ? (
              <UserMenu />
            ) : (
              <Button
                variant="dark"
                size="sm"
                onClick={onOpenAuthScreen}
                className="flex items-center space-x-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </Button>
            )}

            {/* Reset Demo Data */}
            <button
              onClick={resetDemoData}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 rounded-lg transition-all hidden lg:block"
              title="Restablecer datos de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
