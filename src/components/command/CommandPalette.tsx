import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  User, 
  Calendar, 
  Scissors, 
  Package, 
  Sparkles, 
  Scale, 
  Smartphone, 
  Plus, 
  ArrowRight,
  X
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewAppointment: () => void;
  onOpenColorCalculator: () => void;
  onOpenWhatsAppSimulator: () => void;
  onViewClientProfile: (clientId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenNewAppointment,
  onOpenColorCalculator,
  onOpenWhatsAppSimulator,
  onViewClientProfile
}) => {
  const { clients, appointments, services, setActiveTab } = useApp();
  const [query, setQuery] = useState<string>('');

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-charcoal-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-xl w-full overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-brand-100 flex items-center space-x-3">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar clienta, servicio, fórmula o comando rápido... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base font-medium text-charcoal-950 placeholder:text-charcoal-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4">
          
          {/* Quick Actions Group */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 mb-1.5">
              Acciones Rápidas
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenNewAppointment();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-brand-50 text-xs font-semibold text-charcoal-800 transition-all"
              >
                <span className="flex items-center space-x-2.5">
                  <Plus className="w-4 h-4 text-brand-600" />
                  <span>Agendar Nueva Cita Multi-Servicio</span>
                </span>
                <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md">
                  Nueva Cita
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenColorCalculator();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-brand-50 text-xs font-semibold text-charcoal-800 transition-all"
              >
                <span className="flex items-center space-x-2.5">
                  <Scale className="w-4 h-4 text-brand-600" />
                  <span>Báscula Digital & Calculadora de Tinte (1:1.5 / 1:2)</span>
                </span>
                <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md">
                  Báscula
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsAppSimulator();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-50 text-xs font-semibold text-emerald-950 transition-all"
              >
                <span className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Abrir Simulador de WhatsApp & Encuestas</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  WhatsApp
                </span>
              </button>
            </div>
          </div>

          {/* Clients Matching */}
          {matchedClients.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 mb-1.5">
                Clientas ({matchedClients.length})
              </p>
              <div className="space-y-1">
                {matchedClients.slice(0, 4).map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      onClose();
                      onViewClientProfile(client.id);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-brand-50 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-charcoal-900">{client.name}</p>
                        <p className="text-[11px] text-charcoal-500">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {client.tags.slice(0, 2).map((t, i) => (
                        <span key={i} className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-100">
                          {t}
                        </span>
                      ))}
                      <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Matching */}
          {matchedServices.length > 0 && query && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 mb-1.5">
                Servicios ({matchedServices.length})
              </p>
              <div className="space-y-1">
                {matchedServices.slice(0, 3).map((serv) => (
                  <div
                    key={serv.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] text-xs"
                  >
                    <div>
                      <p className="font-bold text-charcoal-900">{serv.name}</p>
                      <p className="text-[10px] text-charcoal-500">{serv.durationMinutes} min</p>
                    </div>
                    <span className="font-bold text-brand-800">${serv.price.toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] p-3 border-t border-brand-100 flex items-center justify-between text-[11px] text-charcoal-500">
          <span>Usa las flechas o haz clic para seleccionar</span>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-brand-200">ESC para cerrar</span>
        </div>

      </div>
    </div>
  );
};
