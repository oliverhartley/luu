import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Lock, 
  Unlock, 
  Calendar, 
  Sparkles, 
  Scissors, 
  FileText, 
  Image as ImageIcon, 
  Heart, 
  DollarSign,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { Client, TechnicalFormula } from '../../types';

interface ClientProfileModalProps {
  clientId: string | null;
  onClose: () => void;
  onOpenNewFormula: (clientId: string) => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  clientId,
  onClose,
  onOpenNewFormula
}) => {
  const { clients, appointments, role } = useApp();

  const client = clients.find((c) => c.id === clientId);
  const [activeSubTab, setActiveSubTab] = useState<'formulas' | 'history' | 'photos'>('formulas');

  if (!clientId || !client) return null;

  const clientAppointments = appointments.filter((a) => a.clientId === client.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-3xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Client Header & Bio */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-brand-100">
          <img
            src={client.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
            alt={client.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 className="font-serif text-2xl font-bold text-charcoal-950">{client.name}</h3>
              {client.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-600 mt-1.5">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>{client.phone}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>{client.email}</span>
              </span>
              {client.birthday && (
                <span className="flex items-center space-x-1 text-pink-700 font-medium">
                  <span>🎂 Cumpleaños: {client.birthday}</span>
                </span>
              )}
            </div>

            {client.notes && (
              <p className="text-xs text-charcoal-700 bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-xl mt-2 italic">
                Nota de Salón: "{client.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 text-center">
            <p className="text-[10px] uppercase font-bold text-charcoal-500">Visitas Totales</p>
            <p className="text-lg font-bold text-charcoal-900 mt-0.5">{client.totalVisits} citas</p>
          </div>
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 text-center">
            <p className="text-[10px] uppercase font-bold text-charcoal-500">Total Invertido</p>
            <p className="text-lg font-bold text-brand-800 mt-0.5">${client.totalSpent.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 text-center">
            <p className="text-[10px] uppercase font-bold text-charcoal-500">Ticket Promedio</p>
            <p className="text-lg font-bold text-charcoal-900 mt-0.5">${client.avgTicket.toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center justify-between border-b border-brand-100 mb-4 pb-2">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveSubTab('formulas')}
              className={`pb-2 text-xs sm:text-sm font-semibold transition-all relative ${
                activeSubTab === 'formulas'
                  ? 'text-brand-600 border-b-2 border-brand-500 font-bold'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              Fórmulas & Recetas Técnicas ({client.formulas.length})
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`pb-2 text-xs sm:text-sm font-semibold transition-all relative ${
                activeSubTab === 'history'
                  ? 'text-brand-600 border-b-2 border-brand-500 font-bold'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              Historial de Visitas ({clientAppointments.length})
            </button>
          </div>

          {activeSubTab === 'formulas' && (
            <button
              onClick={() => onOpenNewFormula(client.id)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Fórmula</span>
            </button>
          )}
        </div>

        {/* Tab 1: Formulas & Technical Recipes */}
        {activeSubTab === 'formulas' && (
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {client.formulas.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF8F5] rounded-2xl border border-brand-100">
                <FileText className="w-8 h-8 text-brand-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-charcoal-800">Sin fórmulas registradas aún</p>
                <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-0.5">
                  Registra los gramos de tinte, volúmenes de oxidante o códigos de esmalte para garantizar que el resultado sea siempre reproducible.
                </p>
                <button
                  onClick={() => onOpenNewFormula(client.id)}
                  className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-xl"
                >
                  Registrar Primera Fórmula
                </button>
              </div>
            ) : (
              client.formulas.map((form) => (
                <div
                  key={form.id}
                  className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-charcoal-900 text-sm">{form.serviceName}</span>
                        {form.isPrivate ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            <Lock className="w-2.5 h-2.5 mr-1" />
                            Confidencial
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                            <Unlock className="w-2.5 h-2.5 mr-1" />
                            Compartida
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        Por {form.professionalName} · {form.date}
                      </p>
                    </div>
                  </div>

                  {/* Hair Formula Specifics */}
                  {(form.rootFormula || form.lengthsFormula) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {form.rootFormula && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100">
                          <span className="font-bold text-charcoal-700 block text-[11px]">🎨 Fórmula Raíz / Base:</span>
                          <span className="font-mono text-brand-900 font-semibold">{form.rootFormula}</span>
                        </div>
                      )}
                      {form.lengthsFormula && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100">
                          <span className="font-bold text-charcoal-700 block text-[11px]">✨ Largos / Matiz:</span>
                          <span className="font-mono text-brand-900 font-semibold">{form.lengthsFormula}</span>
                        </div>
                      )}
                      {form.developerVol && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100">
                          <span className="font-bold text-charcoal-700 block text-[11px]">🧪 Oxidante / Revelador:</span>
                          <span>{form.developerVol} ({form.processingTimeMinutes || 35} min exposición)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nail Polish Formula Specifics */}
                  {(form.baseType || form.polishBrandAndCode) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {form.polishBrandAndCode && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100">
                          <span className="font-bold text-charcoal-700 block text-[11px]">💅 Esmalte & Código:</span>
                          <span className="font-semibold text-brand-900">{form.polishBrandAndCode}</span>
                        </div>
                      )}
                      {form.baseType && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100">
                          <span className="font-bold text-charcoal-700 block text-[11px]">🛡️ Base / Técnica:</span>
                          <span>{form.baseType}</span>
                        </div>
                      )}
                      {form.nailArtDetails && (
                        <div className="bg-white p-2.5 rounded-xl border border-brand-100 sm:col-span-2">
                          <span className="font-bold text-charcoal-700 block text-[11px]">💎 Diseño Nail Art:</span>
                          <span>{form.nailArtDetails}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {form.generalNotes && (
                    <p className="text-xs text-charcoal-600 italic bg-white p-2 rounded-xl border border-brand-100">
                      Observación: "{form.generalNotes}"
                    </p>
                  )}

                  {form.photos && form.photos.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 mb-1.5">
                        Fotos del Resultado:
                      </p>
                      <div className="flex space-x-2">
                        {form.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt="Resultado"
                            className="w-16 h-16 rounded-xl object-cover border border-brand-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Appointment History */}
        {activeSubTab === 'history' && (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {clientAppointments.length === 0 ? (
              <p className="text-xs text-center py-6 text-charcoal-500">Sin citas previas registradas</p>
            ) : (
              clientAppointments.map((apt) => (
                <div key={apt.id} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-brand-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-charcoal-900">
                    <span>{apt.date} · {apt.startTime} hrs</span>
                    <span className="text-brand-800">${apt.totalPrice.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-charcoal-600">
                    {apt.items.map((i, idx) => (
                      <div key={idx}>• {i.serviceName} ({i.professionalName})</div>
                    ))}
                  </div>
                  {apt.checkoutDetails?.surveyRating && (
                    <div className="mt-2 pt-1 border-t border-brand-200/60 flex items-center justify-between text-[11px] text-amber-800">
                      <span>Calificación WhatsApp: ⭐ {apt.checkoutDetails.surveyRating}/5</span>
                      {apt.checkoutDetails.surveyComment && (
                        <span className="italic truncate max-w-xs">"{apt.checkoutDetails.surveyComment}"</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
