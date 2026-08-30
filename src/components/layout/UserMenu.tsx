import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Store, 
  ChevronDown, 
  LogOut, 
  Check, 
  Plus, 
  Sparkles, 
  ShieldCheck,
  Scissors
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';

export const UserMenu: React.FC<{ onOpenRegisterSalon?: () => void }> = ({
  onOpenRegisterSalon
}) => {
  const { 
    currentUser, 
    currentSalon, 
    salons, 
    switchSalon, 
    logout, 
    role, 
    setRole,
    setActiveTab,
    setIsOnboardingOpen 
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!currentUser) return null;

  return (
    <div className="relative">
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-brand-50/60 border border-brand-200/70 shadow-sm transition-all text-left"
      >
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.name}
          size="sm"
        />
        
        <div className="hidden lg:block">
          <p className="text-xs font-bold text-charcoal-900 leading-tight">
            {currentUser.name}
          </p>
          <p className="text-[10px] text-brand-700 font-semibold truncate max-w-[120px]">
            {currentSalon.name}
          </p>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-200/80 p-3 z-50 animate-fade-in space-y-3">
            
            {/* User Info Header */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-brand-100 flex items-center space-x-3">
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-charcoal-950 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-charcoal-500 truncate">{currentUser.email}</p>
                <Badge variant="luxury" className="text-[9px] mt-1">
                  {currentUser.role === 'owner' ? 'Dueño de Salón' : 'Estilista Profesional'}
                </Badge>
              </div>
            </div>

            {/* Salons Switcher Group */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-2 mb-1.5">
                Salones / Peluquerías Activas
              </p>
              <div className="space-y-1">
                {salons.map((salon) => {
                  const isActive = salon.id === currentSalon.id;
                  return (
                    <button
                      key={salon.id}
                      onClick={() => {
                        switchSalon(salon.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200'
                          : 'hover:bg-[#FAF7F2] text-charcoal-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Store className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-charcoal-400'}`} />
                        <span className="truncate">{salon.name}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Switcher inside Menu */}
            <div className="pt-2 border-t border-brand-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-2 mb-1.5">
                Modo de Visualización
              </p>
              <div className="grid grid-cols-2 gap-1 bg-[#FAF7F2] p-1 rounded-xl">
                <button
                  onClick={() => setRole('admin')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    role === 'admin' ? 'bg-white text-charcoal-950 shadow-xs' : 'text-charcoal-500'
                  }`}
                >
                  Admin / Dueño
                </button>
                <button
                  onClick={() => {
                    setRole('stylist');
                    setActiveTab('stylists');
                    setIsOpen(false);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    role === 'stylist' ? 'bg-white text-brand-700 shadow-xs' : 'text-charcoal-500'
                  }`}
                >
                  Estilista
                </button>
              </div>
            </div>

            {/* Onboarding Wizard Action */}
            <div className="pt-2 border-t border-brand-100">
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Asistente de Configuración</span>
              </button>
            </div>

            {/* Logout Action */}
            <div className="pt-2 border-t border-brand-100">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
