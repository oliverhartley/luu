import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Calendar, Clock, User, Scissors, Check, Sparkles } from 'lucide-react';
import { AppointmentItem } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { 
    clients, 
    services, 
    professionals, 
    selectedDate, 
    addAppointment,
    addClient 
  } = useApp();

  const [isNewClient, setIsNewClient] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('+56 9 ');
  const [date, setDate] = useState<string>(selectedDate);
  const [startTime, setStartTime] = useState<string>('11:00');
  const [notes, setNotes] = useState<string>('');

  // Selected Services List (Supports Multi-Service)
  const [selectedItems, setSelectedItems] = useState<AppointmentItem[]>([
    {
      serviceId: services[0]?.id || 'serv-1',
      serviceName: services[0]?.name || 'Balayage Signature',
      professionalId: professionals[0]?.id || 'prof-1',
      professionalName: professionals[0]?.name || 'Valentina Morales',
      durationMinutes: services[0]?.durationMinutes || 180,
      price: services[0]?.price || 95000
    }
  ]);

  if (!isOpen) return null;

  const totalDuration = selectedItems.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalPrice = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  // Calculate estimated end time
  const calculateEndTime = (start: string, durationMinutes: number) => {
    const [h, m] = start.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleAddServiceRow = () => {
    const firstService = services[0];
    const firstProf = professionals[0];
    setSelectedItems((prev) => [
      ...prev,
      {
        serviceId: firstService.id,
        serviceName: firstService.name,
        professionalId: firstProf.id,
        professionalName: firstProf.name,
        durationMinutes: firstService.durationMinutes,
        price: firstService.price
      }
    ]);
  };

  const handleRemoveServiceRow = (index: number) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, serviceId: string) => {
    const serv = services.find((s) => s.id === serviceId);
    if (!serv) return;

    setSelectedItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            serviceId: serv.id,
            serviceName: serv.name,
            durationMinutes: serv.durationMinutes,
            price: serv.price
          };
        }
        return item;
      })
    );
  };

  const handleProfessionalChange = (index: number, professionalId: string) => {
    const prof = professionals.find((p) => p.id === professionalId);
    if (!prof) return;

    setSelectedItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            professionalId: prof.id,
            professionalName: prof.name
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetClientId = selectedClientId;
    let targetClientName = '';
    let targetClientPhone = '';

    if (isNewClient) {
      if (!newClientName.trim() || !newClientPhone.trim()) {
        alert('Por favor ingresa nombre y teléfono del cliente');
        return;
      }
      const created = addClient({
        name: newClientName.trim(),
        phone: newClientPhone.trim(),
        email: `${newClientName.toLowerCase().replace(/\s+/g, '')}@ejemplo.cl`,
        tags: ['Nuevo']
      });
      targetClientId = created.id;
      targetClientName = created.name;
      targetClientPhone = created.phone;
    } else {
      const client = clients.find((c) => c.id === selectedClientId);
      if (!client) return;
      targetClientName = client.name;
      targetClientPhone = client.phone;
    }

    const endTime = calculateEndTime(startTime, totalDuration);

    addAppointment({
      clientId: targetClientId,
      clientName: targetClientName,
      clientPhone: targetClientPhone,
      date,
      startTime,
      endTime,
      status: 'confirmed',
      items: selectedItems,
      totalPrice,
      notes: notes.trim() ? notes : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
              Agendar Nueva Cita
            </h3>
            <p className="text-xs text-charcoal-500">
              Combina múltiples servicios y profesionales en una sola visita.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Client Selection / Creation */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/70">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Información del Cliente
              </label>
              <button
                type="button"
                onClick={() => setIsNewClient(!isNewClient)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 underline"
              >
                {isNewClient ? '← Seleccionar Cliente Existente' : '+ Registrar Nuevo Cliente'}
              </button>
            </div>

            {isNewClient ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-charcoal-600 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Francisca Silva"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-charcoal-600 mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.tags.join(', ')}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Hora de Inicio</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Services & Professionals Builder (Multi-service) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center space-x-1.5">
                <Scissors className="w-4 h-4 text-brand-600" />
                <span>Servicios Solicitados</span>
              </label>
              <button
                type="button"
                onClick={handleAddServiceRow}
                className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Otro Servicio</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item, index) => (
                <div 
                  key={index}
                  className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-brand-200/70 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] uppercase font-bold text-charcoal-500 mb-1">
                      Servicio #{index + 1}
                    </label>
                    <select
                      value={item.serviceId}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-brand-200 rounded-lg focus:outline-none font-medium"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.durationMinutes} min - ${s.price.toLocaleString('es-CL')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[10px] uppercase font-bold text-charcoal-500 mb-1">
                      Profesional Asignado
                    </label>
                    <select
                      value={item.professionalId}
                      onChange={(e) => handleProfessionalChange(index, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-brand-200 rounded-lg focus:outline-none font-medium"
                    >
                      {professionals.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.roleTitle.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceRow(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all self-end sm:self-center mt-2 sm:mt-4"
                      title="Eliminar este servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
              Notas / Requerimientos Especiales
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Quiere café cortado, tiene sensibilidad en cuero cabelludo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
            />
          </div>

          {/* Summary & Price calculation */}
          <div className="bg-brand-50/80 p-4 rounded-2xl border border-brand-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-900 font-medium">
                Duración Total: <strong className="text-brand-950 font-bold">{totalDuration} min</strong> (hasta las {calculateEndTime(startTime, totalDuration)})
              </p>
              <p className="text-[11px] text-brand-700">Se enviará confirmación automática por WhatsApp.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-charcoal-500 block">Total a Pagar:</span>
              <span className="text-xl font-bold text-brand-900">
                ${totalPrice.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-charcoal-600 hover:bg-charcoal-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl shadow-lg shadow-brand-500/25 transition-all transform active:scale-95"
            >
              Confirmar Reserva
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
