import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  Package, 
  BarChart3, 
  Armchair,
  CheckCircle,
  AlertTriangle,
  Scissors,
  UserCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    role, 
    appointments, 
    selectedDate, 
    inventory, 
    campaigns 
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const arrivedCount = appointments.filter(
    (a) => a.date === selectedDate && a.status === 'arrived'
  ).length;

  const lowStockCount = inventory.filter(
    (i) => i.currentStock <= i.minStockAlert
  ).length;

  const activeCampaignsCount = campaigns.filter((c) => c.isActive).length;

  const navItems = [
    {
      id: 'agenda',
      label: 'Agenda & Citas',
      icon: Calendar,
      badge: arrivedCount > 0 ? `${arrivedCount} en sala` : undefined,
      badgeColor: 'bg-emerald-500 text-white animate-pulse'
    },
    {
      id: 'stylists',
      label: 'Peluqueras & Estación',
      icon: UserCheck,
      badge: arrivedCount > 0 ? `${arrivedCount} en sala` : undefined,
      badgeColor: 'bg-brand-100 text-brand-800 font-bold'
    },
    {
      id: 'floorplan',
      label: 'Mapa de Sillones',
      icon: Armchair,
      badge: 'En vivo',
      badgeColor: 'bg-brand-100 text-brand-800 font-bold'
    },
    {
      id: 'clients',
      label: 'Clientes & Fórmulas',
      icon: Users,
    },
    {
      id: 'inventory',
      label: 'Productos & POS',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'services',
      label: 'Servicios & Tarifas',
      icon: Scissors,
    },
    {
      id: 'marketing',
      label: 'Fidelización & WhatsApp',
      icon: Sparkles,
      badge: `${activeCampaignsCount} activas`,
      badgeColor: 'bg-brand-100 text-brand-700'
    },
    {
      id: 'analytics',
      label: 'Métricas & KPIs',
      icon: BarChart3,
    },
  ];

  if (role === 'client') {
    return null;
  }

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-100/80 p-4 space-y-6 shrink-0 min-h-[calc(100vh-5rem)]">
        
        {/* Salon Branch Info Card */}
        <div className="bg-gradient-to-br from-brand-50 via-roseGold-light to-champagne-light p-4 rounded-2xl border border-brand-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Salón Abierto</p>
          </div>
          <h4 className="font-serif font-bold text-charcoal-900 mt-1">luu. Vitacura</h4>
          <p className="text-xs text-charcoal-600 mt-0.5">Av. Alonso de Córdova 3820</p>
          
          {arrivedCount > 0 && (
            <div className="mt-3 pt-2.5 border-t border-brand-200/60 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>En Recepción:</span>
              </span>
              <span className="bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                {arrivedCount} {arrivedCount === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-2">
            Módulos de Gestión
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                    : 'text-charcoal-700 hover:bg-brand-50/60 hover:text-brand-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Low Stock Footer Warning if any */}
        {lowStockCount > 0 && (
          <div 
            onClick={() => setActiveTab('inventory')}
            className="cursor-pointer bg-amber-50 hover:bg-amber-100/80 p-3 rounded-xl border border-amber-200 text-amber-900 transition-all flex items-center space-x-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Stock bajo ({lowStockCount} items)</p>
              <p className="text-[11px] text-amber-700">Revisar reposición</p>
            </div>
          </div>
        )}

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-100 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {/* 1. Agenda */}
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'agenda' ? 'text-brand-600 font-bold' : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Agenda</span>
          {arrivedCount > 0 && (
            <span className="absolute top-0 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
          )}
        </button>

        {/* 2. Sillones */}
        <button
          onClick={() => setActiveTab('floorplan')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'floorplan' ? 'text-brand-600 font-bold' : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Armchair className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Sillones</span>
        </button>

        {/* 3. Clientes */}
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'clients' ? 'text-brand-600 font-bold' : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Clientes</span>
        </button>

        {/* 4. PRODUCTOS & POS (Directo y visible en mobile!) */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'inventory' ? 'text-brand-600 font-bold' : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Productos</span>
          {lowStockCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* 5. MÁS (Menú completo para servicios, marketing, métricas) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            ['services', 'marketing', 'analytics'].includes(activeTab) || isMobileMenuOpen
              ? 'text-brand-600 font-bold'
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Más</span>
          {activeCampaignsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </nav>

      {/* Mobile "Más Módulos" Slide-up Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-t-3xl p-5 shadow-2xl border-t border-brand-100 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                <h3 className="font-serif text-lg font-bold text-charcoal-950">Todos los Módulos</h3>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white font-bold shadow-md'
                        : 'bg-[#FAF8F5] hover:bg-brand-50 text-charcoal-800 border border-brand-100/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-brand-600 shadow-2xs border border-brand-100'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-tight">{item.label}</p>
                        <p className={`text-[10px] ${isActive ? 'text-white/80' : 'text-charcoal-500'}`}>
                          {item.id === 'inventory' 
                            ? 'Inventario, código de barras & POS' 
                            : item.id === 'services' 
                            ? 'Catálogo de servicios y precios' 
                            : item.id === 'marketing' 
                            ? 'Campañas automáticas y WhatsApp' 
                            : item.id === 'analytics' 
                            ? 'Métricas y reportes financieros' 
                            : 'Gestión del salón'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-charcoal-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
