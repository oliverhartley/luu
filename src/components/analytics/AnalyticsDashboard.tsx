import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Scissors, 
  Star, 
  Calendar, 
  Clock, 
  Award,
  Sparkles
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { appointments, clients, professionals, services } = useApp();

  // Aggregate metrics
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + (a.checkoutDetails?.total || a.totalPrice), 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const overallAvgTicket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 48500;

  // Day distribution mock & analysis
  const dayDistribution = [
    { day: 'Lun', bookings: 12, pct: '35%' },
    { day: 'Mar', bookings: 18, pct: '50%' },
    { day: 'Mié', bookings: 24, pct: '65%' },
    { day: 'Jue', bookings: 32, pct: '80%' },
    { day: 'Vie', bookings: 46, pct: '100%', isPeak: true },
    { day: 'Sáb', bookings: 44, pct: '95%', isPeak: true },
    { day: 'Dom', bookings: 0, pct: '0%' },
  ];

  // Peak hours
  const peakHours = [
    { time: '10:00 - 12:00', label: 'Mañanas (Color & Balayage)', load: '85%' },
    { time: '12:00 - 15:00', label: 'Mediodía (Cortes & Manicura)', load: '65%' },
    { time: '16:00 - 19:30', label: 'Tardes Post-Oficina (Pico Máximo)', load: '98%', isPeak: true },
  ];

  // Professional performance
  const stylistStats = professionals.map((prof) => {
    const profAppointments = appointments.filter((a) =>
      a.items.some((i) => i.professionalId === prof.id)
    );
    const profRevenue = profAppointments.reduce((sum, a) => {
      const item = a.items.find((i) => i.professionalId === prof.id);
      return sum + (item?.price || 0);
    }, 0);

    const calculatedAvgTicket = profAppointments.length > 0
      ? Math.round(profRevenue / profAppointments.length)
      : 35000;

    return {
      ...prof,
      totalServices: profAppointments.length + 8, // sample boost
      totalRevenue: profRevenue + 350000,
      avgTicket: calculatedAvgTicket,
      commissionEstimated: Math.round((profRevenue + 350000) * prof.commissionRate)
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 flex items-center space-x-2">
            <span>Métricas Operativas & Rendimiento</span>
            <BarChart3 className="w-5 h-5 text-brand-500" />
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Analítica centralizada de ticket promedio, días con mayor afluencia, recurrencia y evaluación de profesionales.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Ticket Promedio</p>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-800 mt-1">
            ${overallAvgTicket.toLocaleString('es-CL')}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12.4% vs mes anterior
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Satisfacción Clientes</p>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-500 mt-1 flex items-center">
            <span>4.94</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 ml-1.5" />
          </h3>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Basado en 84 encuestas WhatsApp
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Recurrencia Promedio</p>
          <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900 mt-1">
            21.4 días
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Uñas 14d · Color 26d
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Ocupación Sillones</p>
          <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900 mt-1">
            78.5%
          </h3>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Capacidad óptima en horas punta
          </p>
        </div>

      </div>

      {/* Peak Days & Peak Hours Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Days of week flow */}
        <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-charcoal-950 text-sm flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Afluencia de Clientes por Día de la Semana</span>
            </h4>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              Pico: Viernes & Sábado
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {dayDistribution.map((d) => (
              <div key={d.day} className="flex items-center space-x-3 text-xs">
                <span className={`w-8 font-bold ${d.isPeak ? 'text-brand-600' : 'text-charcoal-600'}`}>
                  {d.day}
                </span>
                <div className="flex-1 bg-[#FAF8F5] h-6 rounded-full overflow-hidden p-0.5 border border-brand-100">
                  <div
                    className={`h-full rounded-full transition-all flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      d.isPeak
                        ? 'bg-gradient-to-r from-brand-500 to-roseGold'
                        : 'bg-charcoal-700'
                    }`}
                    style={{ width: d.pct }}
                  >
                    {d.bookings > 0 && `${d.bookings} citas`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours distribution */}
        <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-charcoal-950 text-sm flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Horarios con Mayor Demanda</span>
            </h4>
          </div>

          <div className="space-y-3.5 pt-2">
            {peakHours.map((h, i) => (
              <div key={i} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-brand-100 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-charcoal-900">{h.time}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    h.isPeak ? 'bg-red-100 text-red-800' : 'bg-brand-50 text-brand-700'
                  }`}>
                    {h.load} ocupación
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-600">{h.label}</p>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${h.isPeak ? 'bg-brand-500' : 'bg-charcoal-400'}`}
                    style={{ width: h.load }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Stylists Performance & Ticket Table */}
      <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm space-y-4">
        <h4 className="font-bold text-charcoal-950 text-sm flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-brand-600" />
          <span>Evaluación de Rendimiento por Profesional & Ticket Promedio</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stylistStats.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-100 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={st.avatar}
                  alt={st.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-200"
                />
                <div>
                  <h5 className="font-bold text-charcoal-950 text-sm">{st.name}</h5>
                  <p className="text-[10px] text-brand-700 font-semibold">{st.roleTitle.split('&')[0]}</p>
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{st.rating} ⭐</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-brand-200/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Ticket Promedio:</span>
                  <strong className="text-charcoal-900">${st.avgTicket.toLocaleString('es-CL')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Servicios Mes:</span>
                  <strong className="text-charcoal-900">{st.totalServices} atendidos</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Comisión ({st.commissionRate * 100}%):</span>
                  <strong className="text-brand-800">${st.commissionEstimated.toLocaleString('es-CL')}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
