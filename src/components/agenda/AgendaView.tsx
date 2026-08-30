import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Scissors, 
  MessageCircle, 
  FileText, 
  Plus,
  Phone,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';
import { AddServiceToAppointmentModal } from '../stylists/AddServiceToAppointmentModal';

interface AgendaViewProps {
  onOpenNewAppointment: () => void;
  onOpenCheckout: (appointment: Appointment) => void;
  onViewClientProfile: (clientId: string) => void;
  onOpenWhatsAppForAppointment: (appointment: Appointment) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  onOpenNewAppointment,
  onOpenCheckout,
  onViewClientProfile,
  onOpenWhatsAppForAppointment
}) => {
  const { 
    appointments, 
    professionals, 
    selectedDate, 
    setSelectedDate,
    selectedProfessionalFilter, 
    setSelectedProfessionalFilter,
    checkInAppointment,
    updateAppointmentStatus,
    role,
    currentSalon,
    setIsOnboardingOpen
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [targetAppointmentForAddService, setTargetAppointmentForAddService] = useState<Appointment | null>(null);

  // Filter appointments for the selected date and professional
  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate;
    const matchesProf = selectedProfessionalFilter === 'all' 
      ? true 
      : apt.items.some((i) => i.professionalId === selectedProfessionalFilter);
    const matchesStatus = statusFilter === 'all' ? true : apt.status === statusFilter;
    return matchesDate && matchesProf && matchesStatus;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const stats = {
    total: appointments.filter((a) => a.date === selectedDate).length,
    arrived: appointments.filter((a) => a.date === selectedDate && a.status === 'arrived').length,
    completed: appointments.filter((a) => a.date === selectedDate && a.status === 'completed').length,
    revenue: appointments
      .filter((a) => a.date === selectedDate && a.status === 'completed')
      .reduce((sum, a) => sum + (a.checkoutDetails?.total || a.totalPrice), 0)
  };

  const getStatusBadge = (status: AppointmentStatus, checkInTime?: string) => {
    switch (status) {
      case 'arrived':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
            En Sala de Espera ({checkInTime || 'Recién'})
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-300">
            <Scissors className="w-3 h-3 mr-1 animate-spin" />
            En Atención
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Finalizada & Cobrada
          </span>
        );
      case 'confirmed':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            Confirmada
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Pending Onboarding Banner */}
      {currentSalon?.onboardingCompleted === false && (
        <div className="bg-gradient-to-r from-brand-500 via-roseGold to-brand-600 text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base">¡Completa la Configuración de tu Salón!</h4>
              <p className="text-xs text-white/90">
                Configura tus peluqueras, sillones, servicios y productos con nuestro asistente en solo 3 minutos.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-900 hover:bg-white/90 shadow-sm shrink-0"
          >
            Abrir Asistente ✨
          </button>
        </div>
      )}

      {/* Top Banner with KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-brand-100/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Citas del Día</p>
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900 mt-0.5">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">En Recepción</p>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-0.5">{stats.arrived}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Atendidas</p>
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900 mt-0.5">{stats.completed}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Total Facturado</p>
            <h3 className="text-lg sm:text-2xl font-bold text-brand-800 mt-0.5">
              ${stats.revenue.toLocaleString('es-CL')}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-100/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Stylist Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedProfessionalFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
              selectedProfessionalFilter === 'all'
                ? 'bg-charcoal-900 text-white font-semibold shadow-sm'
                : 'bg-[#FAF8F5] text-charcoal-700 hover:bg-brand-50'
            }`}
          >
            Todos los Profesionales ({professionals.length})
          </button>
          {professionals.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setSelectedProfessionalFilter(prof.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                selectedProfessionalFilter === prof.id
                  ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                  : 'bg-[#FAF8F5] text-charcoal-700 hover:bg-brand-50'
              }`}
            >
              <img src={prof.avatar} alt={prof.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{prof.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Date Selector & New Button */}
        <div className="flex items-center justify-between md:justify-end space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200/80 rounded-xl font-medium text-charcoal-800 focus:outline-none"
          />
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </button>
        </div>

      </div>

      {/* Appointments Timeline List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-100 p-12 text-center">
            <CalendarIcon className="w-12 h-12 text-brand-300 mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-charcoal-900">No hay citas agendadas</h4>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              No se encontraron citas para esta fecha o profesional seleccionado.
            </p>
            <button
              onClick={onOpenNewAppointment}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-all"
            >
              Crear Nueva Cita
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-sm hover:shadow-md ${
                apt.status === 'arrived'
                  ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20'
                  : 'border-brand-100/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Left: Time & Client Details */}
                <div className="flex items-start space-x-3.5">
                  <div className="text-center bg-[#FAF8F5] p-2.5 rounded-xl border border-brand-200/60 shrink-0 min-w-[75px]">
                    <span className="block text-sm sm:text-base font-bold text-charcoal-950">
                      {apt.startTime}
                    </span>
                    <span className="block text-[10px] text-charcoal-500 font-medium">
                      hasta {apt.endTime}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 
                        onClick={() => onViewClientProfile(apt.clientId)}
                        className="font-bold text-charcoal-950 text-sm sm:text-base cursor-pointer hover:text-brand-600 transition-colors flex items-center space-x-1"
                      >
                        <span>{apt.clientName}</span>
                      </h4>
                      {getStatusBadge(apt.status, apt.checkInTime)}
                    </div>
                    
                    <p className="text-xs text-charcoal-500 mt-0.5 flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-brand-500" />
                      <span>{apt.clientPhone}</span>
                    </p>

                    {apt.notes && (
                      <p className="text-xs text-charcoal-600 bg-brand-50/70 px-2.5 py-1 rounded-lg mt-2 inline-block italic border border-brand-100">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Multi-Services List with Stylist assignment */}
                <div className="flex-1 lg:max-w-md bg-[#FAF8F5] p-3 rounded-xl border border-brand-100/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                    Servicios Incluidos ({apt.items.length})
                  </p>
                  <div className="space-y-1.5">
                    {apt.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                          <span className="font-semibold text-charcoal-800 truncate">{item.serviceName}</span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 text-charcoal-600 text-[11px]">
                          <span className="bg-white px-2 py-0.5 rounded-md border border-brand-200/60 font-medium">
                            {item.professionalName.split(' ')[0]}
                          </span>
                          <span className="font-bold text-charcoal-900">${item.price.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-brand-200/50 flex justify-between items-center text-xs font-bold">
                    <span className="text-charcoal-600">Total Estimado:</span>
                    <span className="text-brand-800 text-sm">${apt.totalPrice.toLocaleString('es-CL')}</span>
                  </div>
                  {apt.status !== 'completed' && (
                    <button
                      onClick={() => setTargetAppointmentForAddService(apt)}
                      className="mt-2 w-full flex items-center justify-center space-x-1 py-1 px-2 rounded-lg text-[11px] font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 border-dashed hover:border-brand-400 transition-all"
                    >
                      <Plus className="w-3 h-3 text-brand-600" />
                      <span>+ Agregar Servicio</span>
                    </button>
                  )}
                </div>

                {/* Right: Operational Actions (Check-In / Checkout / WhatsApp / Formula) */}
                <div className="flex items-center flex-wrap gap-2 lg:flex-col lg:items-end justify-end">
                  
                  {/* Action 1: Check-in button if confirmed */}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => checkInAppointment(apt.id)}
                      className="flex-1 lg:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirmar Llegada (Check-In)</span>
                    </button>
                  )}

                  {/* Action 2: Start Service if arrived */}
                  {apt.status === 'arrived' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                      className="flex-1 lg:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-md shadow-brand-500/20"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Iniciar Atención</span>
                    </button>
                  )}

                  {/* Action 3: Checkout / Cobrar if in progress or arrived */}
                  {(apt.status === 'in_progress' || apt.status === 'arrived') && (
                    <button
                      onClick={() => onOpenCheckout(apt)}
                      className="flex-1 lg:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-charcoal-900 hover:bg-charcoal-800 rounded-xl transition-all shadow-sm"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-brand-400" />
                      <span>Finalizar & Cobrar</span>
                    </button>
                  )}

                  {/* If completed, show survey rating badge */}
                  {apt.status === 'completed' && apt.checkoutDetails && (
                    <div className="text-right">
                      {apt.checkoutDetails.surveyRating ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
                          <span>⭐ {apt.checkoutDetails.surveyRating}/5 estrellas</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-charcoal-500 italic">Encuesta WhatsApp enviada</span>
                      )}
                    </div>
                  )}

                  {/* Secondary Utility Actions */}
                  <div className="flex items-center space-x-1.5 w-full lg:w-auto justify-end">
                    
                    {/* View formulas */}
                    <button
                      onClick={() => onViewClientProfile(apt.clientId)}
                      className="p-2 text-charcoal-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-brand-100 transition-all text-xs flex items-center space-x-1"
                      title="Ver Ficha y Fórmulas del Cliente"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ficha</span>
                    </button>

                    {/* Quick WhatsApp Simulator Chat */}
                    <button
                      onClick={() => onOpenWhatsAppForAppointment(apt)}
                      className="p-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition-all text-xs flex items-center space-x-1"
                      title="Enviar mensaje de WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                  </div>

                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Service Modal */}
      <AddServiceToAppointmentModal
        appointment={targetAppointmentForAddService}
        isOpen={!!targetAppointmentForAddService}
        onClose={() => setTargetAppointmentForAddService(null)}
      />

    </div>
  );
};
