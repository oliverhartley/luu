import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Sparkles, 
  Scissors, 
  Clock, 
  DollarSign, 
  Check, 
  Search, 
  Flame, 
  Droplet, 
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Appointment, AppointmentItem, Service } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface AddServiceToAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  defaultProfessionalId?: string;
}

// Popular instant salon add-ons
const QUICK_ADDONS = [
  {
    name: 'Tratamiento de Queratina Express',
    category: 'hair',
    price: 28000,
    durationMinutes: 45,
    icon: Flame,
    color: 'from-amber-500/20 to-amber-600/20 text-amber-800 border-amber-200'
  },
  {
    name: 'Lavado de Pelo & Masaje Capilar Relax',
    category: 'hair',
    price: 12000,
    durationMinutes: 20,
    icon: Droplet,
    color: 'from-sky-500/20 to-blue-600/20 text-sky-800 border-sky-200'
  },
  {
    name: 'Ampolla Nutritiva & Hidratación Profunda',
    category: 'hair',
    price: 16000,
    durationMinutes: 15,
    icon: Sparkles,
    color: 'from-purple-500/20 to-pink-600/20 text-purple-800 border-purple-200'
  },
  {
    name: 'Matiz Express / Baño de Brillo',
    category: 'hair',
    price: 24000,
    durationMinutes: 30,
    icon: Scissors,
    color: 'from-rose-500/20 to-red-600/20 text-rose-800 border-rose-200'
  },
  {
    name: 'Corte de Puntas / Despunte Saludable',
    category: 'hair',
    price: 18000,
    durationMinutes: 25,
    icon: Scissors,
    color: 'from-emerald-500/20 to-teal-600/20 text-emerald-800 border-emerald-200'
  },
  {
    name: 'Brushing & Peinado Ondas',
    category: 'hair',
    price: 22000,
    durationMinutes: 30,
    icon: Sparkles,
    color: 'from-orange-500/20 to-amber-600/20 text-orange-800 border-orange-200'
  }
];

export const AddServiceToAppointmentModal: React.FC<AddServiceToAppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  defaultProfessionalId
}) => {
  const { services, professionals, addServiceToAppointment, removeServiceFromAppointment } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'catalog' | 'custom'>('quick');
  const [selectedProfId, setSelectedProfId] = useState<string>('');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  
  // Custom form
  const [customName, setCustomName] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number>(20000);
  const [customDuration, setCustomDuration] = useState<number>(30);

  // Set default professional when modal opens or appointment changes
  React.useEffect(() => {
    if (appointment) {
      if (defaultProfessionalId) {
        setSelectedProfId(defaultProfessionalId);
      } else if (appointment.items.length > 0) {
        setSelectedProfId(appointment.items[0].professionalId);
      } else if (professionals.length > 0) {
        setSelectedProfId(professionals[0].id);
      }
    }
  }, [appointment, defaultProfessionalId, professionals]);

  if (!isOpen || !appointment) return null;

  const currentProf = professionals.find((p) => p.id === selectedProfId) || professionals[0];

  const handleAddQuickService = (addon: typeof QUICK_ADDONS[0]) => {
    const item: AppointmentItem = {
      serviceId: 'srv-addon-' + Date.now(),
      serviceName: addon.name,
      professionalId: currentProf?.id || 'prof-1',
      professionalName: currentProf?.name || 'Estilista',
      durationMinutes: addon.durationMinutes,
      price: addon.price
    };
    addServiceToAppointment(appointment.id, item);
  };

  const handleAddCatalogService = (srv: Service) => {
    const item: AppointmentItem = {
      serviceId: srv.id,
      serviceName: srv.name,
      professionalId: currentProf?.id || 'prof-1',
      professionalName: currentProf?.name || 'Estilista',
      durationMinutes: srv.durationMinutes,
      price: srv.price
    };
    addServiceToAppointment(appointment.id, item);
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const item: AppointmentItem = {
      serviceId: 'srv-custom-' + Date.now(),
      serviceName: customName.trim(),
      professionalId: currentProf?.id || 'prof-1',
      professionalName: currentProf?.name || 'Estilista',
      durationMinutes: Number(customDuration) || 30,
      price: Number(customPrice) || 0
    };
    addServiceToAppointment(appointment.id, item);
    setCustomName('');
  };

  const filteredCatalog = services.filter((s) =>
    s.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    s.description?.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
              Agregar Servicios a la Atención
            </h3>
            <p className="text-xs text-charcoal-600 mt-0.5">
              Clienta: <strong className="text-charcoal-900">{appointment.clientName}</strong> · Cita de las {appointment.startTime} hrs
            </p>
          </div>
        </div>

        {/* Current Services & Live Ticket Summary */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/80 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Servicios en la cita actual ({appointment.items.length})
            </span>
            <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Total Actual: ${appointment.totalPrice.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {appointment.items.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-brand-100 text-xs shadow-2xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  <span className="font-semibold text-charcoal-800 truncate">{item.serviceName}</span>
                  <span className="text-[10px] text-charcoal-500 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-brand-200/60 shrink-0">
                    {item.professionalName.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-bold text-charcoal-900">${item.price.toLocaleString('es-CL')}</span>
                  {appointment.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceFromAppointment(appointment.id, idx)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover servicio"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Stylist for new services */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-brand-50/50 rounded-2xl border border-brand-100">
          <label className="text-xs font-bold text-charcoal-700 flex items-center space-x-1.5">
            <Scissors className="w-3.5 h-3.5 text-brand-600" />
            <span>Peluquera que realiza el servicio:</span>
          </label>
          <select
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-brand-200 rounded-xl font-semibold text-charcoal-800 focus:outline-none"
          >
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-brand-200 mb-4">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'quick'
                ? 'border-brand-500 text-brand-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Adicionales Frecuentes</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'catalog'
                ? 'border-brand-500 text-brand-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Catálogo del Salón</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'custom'
                ? 'border-brand-500 text-brand-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Personalizado</span>
          </button>
        </div>

        {/* Tab 1: Quick Addons */}
        {activeTab === 'quick' && (
          <div className="space-y-3">
            <p className="text-xs text-charcoal-500">
              Toca para añadir inmediatamente al ticket de la clienta:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_ADDONS.map((addon, i) => {
                const Icon = addon.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleAddQuickService(addon)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left bg-gradient-to-r ${addon.color} hover:brightness-95 transition-all shadow-2xs group`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-charcoal-900 truncate">{addon.name}</p>
                        <p className="text-[11px] text-charcoal-600">{addon.durationMinutes} min</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-xs font-bold text-charcoal-950">${addon.price.toLocaleString('es-CL')}</p>
                      <span className="inline-flex items-center text-[10px] font-bold text-brand-600 bg-white/90 px-1.5 py-0.5 rounded-md mt-0.5 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        + Añadir
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Catalog Services */}
        {activeTab === 'catalog' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar servicio en el catálogo (ej. Masaje, Lavado, Balayage)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {filteredCatalog.length === 0 ? (
                <p className="text-xs text-charcoal-500 text-center py-6">No se encontraron servicios</p>
              ) : (
                filteredCatalog.map((srv) => (
                  <div
                    key={srv.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-brand-100 hover:border-brand-300 bg-white hover:bg-brand-50/40 transition-all text-xs"
                  >
                    <div className="truncate mr-3">
                      <h5 className="font-bold text-charcoal-900 truncate">{srv.name}</h5>
                      <p className="text-[11px] text-charcoal-500">{srv.durationMinutes} minutos · {srv.category}</p>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="font-bold text-charcoal-950">${srv.price.toLocaleString('es-CL')}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddCatalogService(srv)}
                        className="text-xs py-1 h-7"
                      >
                        + Agregar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Custom Service */}
        {activeTab === 'custom' && (
          <form onSubmit={handleAddCustomService} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Nombre del Servicio Adicional
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="ej. Queratina Flash en mechones, Matiz Extra, etc."
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Precio ($CLP)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Duración Adicional (min)
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="luxury"
              className="w-full mt-2"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Agregar Servicio a la Cita
            </Button>
          </form>
        )}

        {/* Footer info & Done button */}
        <div className="mt-6 pt-4 border-t border-brand-100 flex items-center justify-between">
          <p className="text-[11px] text-charcoal-500">
            Los servicios agregados se reflejarán automáticamente en el ticket de cobro.
          </p>
          <Button
            type="button"
            variant="dark"
            onClick={onClose}
          >
            Listo / Cerrar
          </Button>
        </div>

      </div>
    </div>
  );
};
