import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Plus, 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Phone, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Droplet, 
  FileText, 
  MessageCircle, 
  HeartHandshake,
  Users,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  X
} from 'lucide-react';
import { Professional, ServiceCategory, Appointment, AppointmentStatus } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AddServiceToAppointmentModal } from './AddServiceToAppointmentModal';

interface StylistsManagerProps {
  onOpenCheckout?: (appointment: Appointment) => void;
  onViewClientProfile?: (clientId: string) => void;
  onOpenWhatsAppForAppointment?: (appointment: Appointment) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
];

const PRESET_COLORS = [
  '#D57B6C', '#E8B4B8', '#BCA893', '#A34638', '#6366F1', '#EC4899', '#10B981', '#F59E0B'
];

export const StylistsManager: React.FC<StylistsManagerProps> = ({
  onOpenCheckout,
  onViewClientProfile,
  onOpenWhatsAppForAppointment
}) => {
  const { 
    professionals, 
    addProfessional, 
    updateProfessional, 
    deleteProfessional,
    appointments, 
    selectedDate, 
    setSelectedDate,
    selectedStylistId, 
    setSelectedStylistId,
    checkInAppointment,
    updateAppointmentStatus,
    currentSalon
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'station' | 'team'>('station');

  // Modal State for adding/editing professional
  const [isProfModalOpen, setIsProfModalOpen] = useState<boolean>(false);
  const [editingProf, setEditingProf] = useState<Professional | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [specialties, setSpecialties] = useState<ServiceCategory[]>(['hair']);
  const [commissionRate, setCommissionRate] = useState<number>(40);
  const [phone, setPhone] = useState<string>('+56 9 ');
  const [colorHex, setColorHex] = useState<string>(PRESET_COLORS[0]);
  const [avatar, setAvatar] = useState<string>(PRESET_AVATARS[0]);

  // Add Service Modal State
  const [targetAppointmentForAddService, setTargetAppointmentForAddService] = useState<Appointment | null>(null);

  // Active stylist for the workstation view
  const currentStylist = professionals.find((p) => p.id === selectedStylistId) || professionals[0];

  // Appointments for current stylist on selectedDate
  const stylistAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate;
    const matchesStylist = apt.items.some((item) => item.professionalId === (currentStylist?.id || ''));
    return matchesDate && matchesStylist;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // KPIs for the current stylist
  const arrivedCount = stylistAppointments.filter((a) => a.status === 'arrived').length;
  const inProgressCount = stylistAppointments.filter((a) => a.status === 'in_progress').length;
  const completedCount = stylistAppointments.filter((a) => a.status === 'completed').length;
  
  // Total services amount for this stylist today
  const totalBilledToday = stylistAppointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => {
      const stylistItemsSum = a.items
        .filter((item) => item.professionalId === currentStylist?.id)
        .reduce((itemSum, item) => itemSum + item.price, 0);
      return sum + stylistItemsSum;
    }, 0);

  const estimatedCommission = Math.round(totalBilledToday * (currentStylist?.commissionRate || 0.40));

  const handleOpenCreate = () => {
    setEditingProf(null);
    setName('');
    setRoleTitle('');
    setSpecialties(['hair']);
    setCommissionRate(40);
    setPhone('+56 9 ');
    setColorHex(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setIsProfModalOpen(true);
  };

  const handleOpenEdit = (prof: Professional) => {
    setEditingProf(prof);
    setName(prof.name);
    setRoleTitle(prof.roleTitle);
    setSpecialties(prof.specialties);
    setCommissionRate(Math.round(prof.commissionRate * 100));
    setPhone(prof.phone);
    setColorHex(prof.colorHex || PRESET_COLORS[0]);
    setAvatar(prof.avatar);
    setIsProfModalOpen(true);
  };

  const handleToggleSpecialty = (cat: ServiceCategory) => {
    if (specialties.includes(cat)) {
      if (specialties.length > 1) {
        setSpecialties(specialties.filter((s) => s !== cat));
      }
    } else {
      setSpecialties([...specialties, cat]);
    }
  };

  const handleSubmitProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProf) {
      updateProfessional({
        ...editingProf,
        name: name.trim(),
        roleTitle: roleTitle.trim() || 'Estilista Profesional',
        specialties,
        commissionRate: commissionRate / 100,
        phone: phone.trim(),
        colorHex,
        avatar
      });
    } else {
      const created = addProfessional({
        name: name.trim(),
        roleTitle: roleTitle.trim() || 'Estilista Profesional',
        specialties,
        avatar,
        rating: 5.0,
        commissionRate: commissionRate / 100,
        phone: phone.trim(),
        colorHex
      });
      setSelectedStylistId(created.id);
    }
    setIsProfModalOpen(false);
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
            Finalizada
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

  const formatCategoryBadge = (cat: ServiceCategory) => {
    switch (cat) {
      case 'hair': return '💇‍♀️ Cabello';
      case 'nails': return '💅 Uñas';
      case 'brows_lashes': return '✨ Cejas & Pestañas';
      case 'skincare': return '🌸 Facial';
      case 'spa': return '🧖‍♀️ Spa';
      default: return cat;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Main Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-brand-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-brand-50 rounded-2xl text-brand-600">
              <Scissors className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
              Módulo de Peluqueras
            </h2>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Gestión del equipo de estilistas y estación de atención en tiempo real
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Main Mode Toggle */}
          <div className="flex bg-[#FAF8F5] p-1 rounded-2xl border border-brand-200/80">
            <button
              onClick={() => setActiveMainTab('station')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMainTab === 'station'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mi Estación (Clientas)</span>
              {arrivedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
            </button>
            <button
              onClick={() => setActiveMainTab('team')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMainTab === 'team'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equipo ({professionals.length})</span>
            </button>
          </div>

          {/* New Stylist Button */}
          <Button
            variant="luxury"
            onClick={handleOpenCreate}
            className="flex items-center space-x-1.5 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Peluquera</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: MI ESTACIÓN (ATENCIÓN A CLIENTAS Y AGREGAR SERVICIOS)            */}
      {/* ========================================================================= */}
      {activeMainTab === 'station' && (
        <div className="space-y-6">
          
          {/* Stylist Selector Banner */}
          <div className="bg-gradient-to-r from-brand-50 via-roseGold-light to-champagne-light p-4 sm:p-5 rounded-3xl border border-brand-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={currentStylist?.avatar}
                alt={currentStylist?.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-300 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-white/80 px-2 py-0.5 rounded-full border border-brand-200">
                    Estación Activa
                  </span>
                  <div className="flex items-center space-x-1 text-amber-600 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{currentStylist?.rating.toFixed(2)}</span>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-950 mt-0.5">
                  {currentStylist?.name}
                </h3>
                <p className="text-xs text-charcoal-600">
                  {currentStylist?.roleTitle} · Comisión {(currentStylist?.commissionRate * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Switch Stylist & Date Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center space-x-1.5 bg-white/90 px-3 py-1.5 rounded-2xl border border-brand-200 text-xs">
                <Scissors className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-medium text-charcoal-600">Ver como:</span>
                <select
                  value={selectedStylistId}
                  onChange={(e) => setSelectedStylistId(e.target.value)}
                  className="bg-transparent font-bold text-charcoal-900 focus:outline-none cursor-pointer"
                >
                  {professionals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/90 px-3 py-1.5 rounded-2xl border border-brand-200 text-xs">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-bold text-charcoal-900 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Today's Workstation Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Clientas del Día</p>
                <h4 className="text-xl sm:text-2xl font-bold text-charcoal-950 mt-0.5">{stylistAppointments.length}</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">En Sala de Espera</p>
                <h4 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-0.5">{arrivedCount}</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">En Sillón / Atendidas</p>
                <h4 className="text-xl sm:text-2xl font-bold text-charcoal-950 mt-0.5">{inProgressCount + completedCount}</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Scissors className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Comisión Est. Hoy</p>
                <h4 className="text-lg sm:text-xl font-bold text-brand-800 mt-0.5">
                  ${estimatedCommission.toLocaleString('es-CL')}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Percent className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Clientas List for this Stylist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Clientas de {currentStylist?.name} ({stylistAppointments.length})
              </h3>
              <span className="text-xs text-charcoal-500">
                Fecha: {selectedDate}
              </span>
            </div>

            {stylistAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-brand-100 p-12 text-center shadow-sm">
                <Scissors className="w-12 h-12 text-brand-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-charcoal-900">No hay clientas para hoy</h4>
                <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
                  {currentStylist?.name} no tiene citas agendadas para el {selectedDate}. Puedes cambiar de fecha o agendar una nueva cita desde la Agenda.
                </p>
              </div>
            ) : (
              stylistAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`bg-white rounded-3xl border transition-all p-5 shadow-sm hover:shadow-md ${
                    apt.status === 'arrived'
                      ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20'
                      : apt.status === 'in_progress'
                      ? 'border-brand-300 ring-2 ring-brand-100 bg-brand-50/10'
                      : 'border-brand-100'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    
                    {/* Client info & time */}
                    <div className="flex items-start space-x-4">
                      <div className="text-center bg-[#FAF8F5] p-3 rounded-2xl border border-brand-200/60 shrink-0 min-w-[80px]">
                        <span className="block text-base font-bold text-charcoal-950">
                          {apt.startTime}
                        </span>
                        <span className="block text-[11px] text-charcoal-500 font-medium">
                          a {apt.endTime}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 
                            onClick={() => onViewClientProfile && onViewClientProfile(apt.clientId)}
                            className="font-bold text-charcoal-950 text-base cursor-pointer hover:text-brand-600 transition-colors"
                          >
                            {apt.clientName}
                          </h4>
                          {getStatusBadge(apt.status, apt.checkInTime)}
                        </div>

                        <p className="text-xs text-charcoal-500 mt-1 flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-brand-500" />
                          <span>{apt.clientPhone}</span>
                        </p>

                        {apt.notes && (
                          <p className="text-xs text-charcoal-600 bg-brand-50/70 px-2.5 py-1 rounded-xl mt-2 inline-block italic border border-brand-100">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Middle: Bought Services Breakdown + Add Service CTA */}
                    <div className="flex-1 lg:max-w-md bg-[#FAF8F5] p-4 rounded-2xl border border-brand-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                          Servicios Comprados / En Atención ({apt.items.length})
                        </span>
                        <span className="text-xs font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                          ${apt.totalPrice.toLocaleString('es-CL')}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {apt.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-brand-100/70">
                            <div className="truncate pr-2">
                              <span className="font-semibold text-charcoal-800 truncate block">{item.serviceName}</span>
                              <span className="text-[10px] text-charcoal-500">{item.durationMinutes} min · con {item.professionalName.split(' ')[0]}</span>
                            </div>
                            <span className="font-bold text-charcoal-900 shrink-0">${item.price.toLocaleString('es-CL')}</span>
                          </div>
                        ))}
                      </div>

                      {/* 🌟 KEY BUTTON: AGREGAR SERVICIOS (Queratina, Lavado, Matiz, etc.) */}
                      {apt.status !== 'completed' && (
                        <button
                          onClick={() => setTargetAppointmentForAddService(apt)}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-300 border-dashed hover:border-brand-500 transition-all shadow-2xs group"
                        >
                          <Plus className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
                          <span>+ Agregar Servicio (Queratina, Lavado, etc.)</span>
                        </button>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-end gap-2 justify-end">
                      {/* Check-In */}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => checkInAppointment(apt.id)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Registrar Llegada (Check-In)</span>
                        </button>
                      )}

                      {/* Iniciar Atención */}
                      {apt.status === 'arrived' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-md shadow-brand-500/20"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>Pasar al Sillón & Iniciar</span>
                        </button>
                      )}

                      {/* Finalizar & Cobrar */}
                      {(apt.status === 'in_progress' || apt.status === 'arrived') && onOpenCheckout && (
                        <button
                          onClick={() => onOpenCheckout(apt)}
                          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-charcoal-900 hover:bg-charcoal-800 rounded-xl transition-all shadow-sm"
                        >
                          <DollarSign className="w-3.5 h-3.5 text-brand-400" />
                          <span>Finalizar & Cobrar</span>
                        </button>
                      )}

                      {apt.status === 'completed' && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          ✓ Atención Cobrada
                        </span>
                      )}

                      {/* Secondary quick actions */}
                      <div className="flex items-center space-x-1.5 mt-1">
                        {onViewClientProfile && (
                          <button
                            onClick={() => onViewClientProfile(apt.clientId)}
                            className="p-2 text-charcoal-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-brand-100 text-xs flex items-center space-x-1 transition-all"
                            title="Ver Ficha Técnica / Fórmulas"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Ficha</span>
                          </button>
                        )}

                        {onOpenWhatsAppForAppointment && (
                          <button
                            onClick={() => onOpenWhatsAppForAppointment(apt)}
                            className="p-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center space-x-1 transition-all"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: EQUIPO DE PELUQUERAS (DIRECTORIO Y CREACIÓN)                     */}
      {/* ========================================================================= */}
      {activeMainTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-950">
                Peluqueras & Profesionales ({professionals.length})
              </h3>
              <p className="text-xs text-charcoal-500">
                Equipo registrado en {currentSalon.name}
              </p>
            </div>
            <Button
              variant="luxury"
              onClick={handleOpenCreate}
              className="flex items-center space-x-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Peluquera</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {professionals.map((prof) => {
              const profAppointments = appointments.filter((a) =>
                a.items.some((i) => i.professionalId === prof.id)
              );

              return (
                <div
                  key={prof.id}
                  className="bg-white rounded-3xl border border-brand-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-2" 
                    style={{ backgroundColor: prof.colorHex || '#D57B6C' }}
                  />

                  <div>
                    <div className="flex items-start justify-between mt-1 mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        <div>
                          <h4 className="font-bold text-charcoal-950 text-base">{prof.name}</h4>
                          <p className="text-xs text-brand-700 font-semibold">{prof.roleTitle}</p>
                          <div className="flex items-center space-x-1 text-amber-600 text-xs font-bold mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{prof.rating.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(prof)}
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-800 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Editar datos"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {professionals.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar a ${prof.name} del salón?`)) {
                                deleteProfessional(prof.id);
                              }
                            }}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar peluquera"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Specialties Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {prof.specialties.map((cat, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-semibold bg-[#FAF8F5] text-charcoal-700 px-2 py-0.5 rounded-md border border-brand-200/60"
                        >
                          {formatCategoryBadge(cat)}
                        </span>
                      ))}
                    </div>

                    {/* Quick Stats & Phone */}
                    <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-charcoal-500 block">Comisión</span>
                        <span className="font-bold text-charcoal-900">{(prof.commissionRate * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-500 block">Total Atenciones</span>
                        <span className="font-bold text-charcoal-900">{profAppointments.length} citas</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-brand-100">
                    <span className="text-xs text-charcoal-500 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-brand-500" />
                      <span>{prof.phone}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedStylistId(prof.id);
                        setActiveMainTab('station');
                      }}
                      className="text-xs py-1 h-8"
                    >
                      Ver Estación
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR / EDITAR PELUQUERA                                       */}
      {/* ========================================================================= */}
      {isProfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-lg w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={() => setIsProfModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  {editingProf ? 'Editar Peluquera' : 'Registrar Nueva Peluquera'}
                </h3>
                <p className="text-xs text-charcoal-500">
                  Completa los datos para incorporarla a {currentSalon.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitProf} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Valentina Morales"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Cargo / Especialidad Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="ej. Master Colorista, Estilista Integral"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Comisión (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 8123 4567"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Specialties Selectors */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Especialidades que atiende
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['hair', 'nails', 'brows_lashes', 'skincare', 'spa'] as ServiceCategory[]).map((cat) => {
                    const isSelected = specialties.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleToggleSpecialty(cat)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-400 text-brand-900 shadow-2xs'
                            : 'bg-white border-brand-200 text-charcoal-600'
                        }`}
                      >
                        <span className="truncate">{formatCategoryBadge(cat)}</span>
                        {isSelected && <Check className="w-3 h-3 text-brand-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Code */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Color Identificador en la Agenda
                </label>
                <div className="flex items-center space-x-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColorHex(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        colorHex === c ? 'scale-125 ring-2 ring-offset-2 ring-charcoal-900' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Foto de Perfil (Elige o pega URL)
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Avatar preset"
                      onClick={() => setAvatar(av)}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition-all ${
                        avatar === av ? 'ring-2 ring-brand-500 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-brand-100 flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProfModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="luxury"
                >
                  {editingProf ? 'Guardar Cambios' : 'Registrar Peluquera'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Global Add Service to Appointment Modal */}
      <AddServiceToAppointmentModal
        appointment={targetAppointmentForAddService}
        isOpen={!!targetAppointmentForAddService}
        onClose={() => setTargetAppointmentForAddService(null)}
        defaultProfessionalId={currentStylist?.id}
      />

    </div>
  );
};
