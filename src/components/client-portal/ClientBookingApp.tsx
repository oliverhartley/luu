import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Check, 
  Plus, 
  Trash2, 
  Heart, 
  Star, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Service, Professional, ServiceCategory } from '../../types';

export const ClientBookingApp: React.FC = () => {
  const { services, professionals, addAppointment, setRole } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-17');
  const [selectedTime, setSelectedTime] = useState<string>('11:30');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+56 9 ');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const availableTimes = [
    '09:30', '10:15', '11:30', '12:45', '14:30', '15:15', '16:30', '17:45', '18:30'
  ];

  const filteredServices = services.filter((s) =>
    selectedCategory === 'all' ? true : s.category === selectedCategory
  );

  const toggleServiceSelection = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de WhatsApp');
      return;
    }

    // Determine professionals
    const items = selectedServices.map((serv) => {
      let chosenProf = professionals.find((p) => p.id === selectedProfessional);
      if (!chosenProf) {
        // Pick first matching specialty
        chosenProf = professionals.find((p) => p.specialties.includes(serv.category)) || professionals[0];
      }
      return {
        serviceId: serv.id,
        serviceName: serv.name,
        professionalId: chosenProf.id,
        professionalName: chosenProf.name,
        durationMinutes: serv.durationMinutes,
        price: serv.price
      };
    });

    const [h, m] = selectedTime.split(':').map(Number);
    const endMinutes = h * 60 + m + totalDuration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const created = addAppointment({
      clientId: 'client-guest-' + Date.now(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      status: 'confirmed',
      items,
      totalPrice,
      notes: clientNotes.trim() || undefined
    });

    setConfirmedBookingId(created.id);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16 animate-fade-in">
      
      {/* Chic Header Banner */}
      <div className="bg-white border-b border-brand-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-roseGold flex items-center justify-center text-white shadow-sm">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-charcoal-950">
                luu. Studio & Spa
              </h1>
              <p className="text-[11px] text-charcoal-500">Reserva online en 1 minuto</p>
            </div>
          </div>

          <button
            onClick={() => setRole('admin')}
            className="text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200"
          >
            ← Volver a Vista Salón
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center justify-between text-xs font-bold text-charcoal-500">
            <span className={step >= 1 ? 'text-brand-600' : ''}>1. Servicios</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-brand-600' : ''}>2. Profesional & Horario</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-brand-600' : ''}>3. Tus Datos</span>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        
        {/* STEP 1: Select Services */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-950">
                ¿Qué te gustaría hacerte hoy? ✨
              </h2>
              <p className="text-xs text-charcoal-600 mt-1">
                Puedes combinar varios servicios en una misma cita (ej: color + manicura).
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'hair', label: '💇‍♀️ Cabello & Color' },
                { id: 'nails', label: '💅 Uñas & Manicura' },
                { id: 'brows_lashes', label: '✨ Mirada & Cejas' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-charcoal-950 text-white shadow-sm'
                      : 'bg-white text-charcoal-700 border border-brand-100 hover:bg-brand-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Services Cards */}
            <div className="space-y-3">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleServiceSelection(service)}
                    className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer shadow-sm flex items-start space-x-4 ${
                      isSelected
                        ? 'border-brand-500 ring-2 ring-brand-200 bg-brand-50/20'
                        : 'border-brand-100 hover:border-brand-300'
                    }`}
                  >
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-1 ring-brand-100 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-charcoal-950 text-sm">{service.name}</h4>
                        <span className="font-bold text-brand-800 text-sm ml-2 shrink-0">
                          ${service.price.toLocaleString('es-CL')}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-500 line-clamp-2 mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-50">
                        <span className="text-[11px] text-charcoal-500 font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-brand-500" />
                          {service.durationMinutes} min
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-brand-500 text-white'
                              : 'bg-brand-50 text-brand-700 border border-brand-200'
                          }`}
                        >
                          {isSelected ? '✓ Seleccionado' : '+ Seleccionar'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Bar */}
            {selectedServices.length > 0 && (
              <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40">
                <div className="bg-charcoal-950 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-charcoal-400">
                      {selectedServices.length} {selectedServices.length === 1 ? 'servicio' : 'servicios'} · {totalDuration} min
                    </p>
                    <p className="text-lg font-bold text-white">
                      ${totalPrice.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-1.5"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Professional & Date/Time */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in pb-20">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a servicios</span>
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-950">
                Elige tu Especialista & Horario 🌸
              </h2>
            </div>

            {/* Professional Picker */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                1. ¿Tienes una estilista favorita?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedProfessional('any')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedProfessional === 'any'
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-200'
                      : 'bg-white border-brand-100 hover:bg-brand-50/40'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center font-bold text-sm">
                    ✨
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-charcoal-950">Cualquiera disponible</h5>
                    <p className="text-[11px] text-charcoal-500">Mayor disponibilidad de horarios</p>
                  </div>
                </div>

                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => setSelectedProfessional(prof.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      selectedProfessional === prof.id
                        ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-200'
                        : 'bg-white border-brand-100 hover:bg-brand-50/40'
                    }`}
                  >
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-1 ring-brand-100"
                    />
                    <div className="truncate">
                      <h5 className="font-bold text-xs text-charcoal-950 truncate">{prof.name}</h5>
                      <p className="text-[10px] text-brand-700 font-semibold">{prof.roleTitle.split('&')[0]}</p>
                      <span className="text-[10px] text-amber-600 font-bold">⭐ {prof.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                2. Selecciona el Día
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-200 rounded-2xl text-sm font-semibold text-charcoal-900 focus:outline-none"
              />
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                3. Horarios Disponibles para {selectedDate}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      selectedTime === time
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                        : 'bg-white border border-brand-200 text-charcoal-700 hover:bg-brand-50'
                    }`}
                  >
                    {time} hrs
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-8 py-3 bg-charcoal-950 hover:bg-charcoal-900 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Continuar a tus Datos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Client Details */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-5 animate-fade-in pb-20">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a horario</span>
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-950">
                Completa tu Reserva 💖
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Te enviaremos los detalles y recordatorio directo a tu WhatsApp.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-brand-50/70 p-4 rounded-3xl border border-brand-200 text-xs space-y-2">
              <p className="font-bold text-brand-950">Resumen de tu Cita:</p>
              <p className="text-charcoal-700">
                📅 <strong>{selectedDate}</strong> a las <strong>{selectedTime} hrs</strong> (~{totalDuration} min)
              </p>
              <div className="space-y-1 pt-1">
                {selectedServices.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>• {s.name}</span>
                    <strong className="text-brand-900">${s.price.toLocaleString('es-CL')}</strong>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-brand-200 flex justify-between font-bold text-sm text-brand-950">
                <span>Total a Pagar en Salón:</span>
                <span>${totalPrice.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Form inputs */}
            <div className="space-y-3 bg-white p-5 rounded-3xl border border-brand-100 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Tu Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía Valdés"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-brand-200 rounded-2xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  WhatsApp / Celular (Para confirmación y recordatorio) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+56 9 9123 4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-brand-200 rounded-2xl text-xs sm:text-sm focus:outline-none font-semibold text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  ¿Alguna preferencia o detalle especial? (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Primera vez realizándome balayage, largo hasta media espalda..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FAF8F5] border border-brand-200 rounded-2xl text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all transform active:scale-95"
            >
              ✓ Confirmar Reserva & Recibir WhatsApp
            </button>
          </form>
        )}

        {/* STEP 4: Success Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-xl text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-charcoal-950">
              ¡Tu Cita está Confirmada! 🎉
            </h2>
            
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
              Gracias, <strong>{clientName}</strong>. Hemos reservado tu espacio para el <strong>{selectedDate}</strong> a las <strong>{selectedTime} hrs</strong>.
            </p>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-100 max-w-sm mx-auto text-xs text-charcoal-700 text-left space-y-1.5">
              <p className="font-bold text-brand-900">📍 Pelu Studio Vitacura</p>
              <p className="text-[11px] text-charcoal-500">Av. Alonso de Córdova 3820, Vitacura</p>
              <p className="text-emerald-800 font-semibold pt-1">
                💬 Te enviamos el comprobante a tu WhatsApp ({clientPhone}).
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedServices([]);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-charcoal-700 bg-brand-50 hover:bg-brand-100 rounded-xl"
              >
                Hacer Otra Reserva
              </button>
              <button
                onClick={() => setRole('admin')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-charcoal-950 hover:bg-charcoal-900 rounded-xl shadow-md"
              >
                Ir al Panel del Salón
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
