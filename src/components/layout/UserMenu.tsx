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
  Scissors,
  Trash2,
  HelpCircle,
  Database,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DeleteAccountModal } from './DeleteAccountModal';
import { isTestEnv, getAppEnvironment } from '../../lib/env';
import { cloneProdToTest } from '../../lib/firestoreSync';

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
    setIsOnboardingOpen,
    setIsTutorialOpen 
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const [cloneStatus, setCloneStatus] = useState<string | null>(null);

  if (!currentUser) return null;

  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const isEligibleForAccountDeletion = userEmail === 'oliver@harliz.com' || userEmail === 'fran@harliz.com';

  const handleCloneFromProd = async () => {
    if (!window.confirm('¿Deseas clonar los datos actuales de Producción hacia tu ambiente de TEST? Esto reemplazará tus datos de prueba con una copia fresca de producción sin alterar producción.')) {
      return;
    }
    setIsCloning(true);
    setCloneStatus(null);
    try {
      const res = await cloneProdToTest();
      setCloneStatus(res.message);
      if (res.success) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (e: any) {
      setCloneStatus('Error al clonar');
    } finally {
      setIsCloning(false);
    }
  };

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

            {/* Feature Tutorial Action */}
            <div className="pt-2 border-t border-brand-100">
              <button
                onClick={() => {
                  setIsTutorialOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Tutorial de Funcionalidades</span>
              </button>
            </div>

            {/* Onboarding Wizard Action */}
            <div className="pt-2 border-t border-brand-100">
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-charcoal-700 hover:bg-brand-50 border border-brand-100 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Asistente de Configuración</span>
              </button>
            </div>

            {/* Environment Status Card */}
            <div className="pt-2 border-t border-brand-100">
              <div className={`p-2.5 rounded-xl border text-left ${
                isTestEnv() 
                  ? 'bg-amber-50/80 border-amber-200/80 text-amber-900' 
                  : 'bg-emerald-50/60 border-emerald-200/70 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold flex items-center gap-1.5">
                    {isTestEnv() ? '🧪 Entorno TEST' : '🟢 Entorno Producción'}
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/70">
                    {isTestEnv() ? 'test_*' : 'live'}
                  </span>
                </div>
                <p className="text-[10px] leading-tight opacity-80">
                  {isTestEnv() 
                    ? '100% funcional. Datos aislados de lo que Francisca revisa.' 
                    : 'Base de datos principal activa.'}
                </p>

                {isTestEnv() && isEligibleForAccountDeletion && (
                  <button
                    type="button"
                    onClick={handleCloneFromProd}
                    disabled={isCloning}
                    className="mt-2 w-full flex items-center justify-center space-x-1.5 py-1 px-2 rounded-lg text-[10px] font-bold text-amber-900 bg-white/90 hover:bg-white border border-amber-300/70 shadow-2xs transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCloning ? 'animate-spin text-amber-600' : ''}`} />
                    <span>{isCloning ? 'Clonando datos...' : 'Clonar datos de Producción a Test'}</span>
                  </button>
                )}
                {cloneStatus && (
                  <p className="text-[9px] text-amber-800 font-semibold mt-1 text-center">
                    {cloneStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-2 border-t border-brand-100">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-charcoal-700 hover:bg-brand-50 transition-all"
              >
                <LogOut className="w-4 h-4 text-charcoal-500" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {/* Delete Account Action - ONLY visible for oliver@harliz.com and fran@harliz.com */}
            {isEligibleForAccountDeletion && (
              <div className="pt-2 border-t border-red-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-bold text-red-600 bg-red-50/70 hover:bg-red-100 border border-red-200/80 transition-all group shadow-2xs"
                >
                  <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span>Eliminar Cuenta</span>
                </button>
              </div>
            )}

          </div>
        </>
      )}

      {/* Confirmation Modal to Delete Account */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
};
