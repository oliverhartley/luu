import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Armchair, 
  Sparkles, 
  Scissors, 
  Clock, 
  User, 
  CheckCircle2, 
  Flame, 
  Droplet,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

import { Station } from '../../types';

export const SalonFloorPlan: React.FC<{
  onOpenAppointmentDetails?: (clientName: string) => void;
}> = ({ onOpenAppointmentDetails }) => {
  const { stations, setIsOnboardingOpen } = useApp();

  const occupiedCount = stations.filter((s) => s.status === 'occupied').length;

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-xl font-bold text-charcoal-950">
              Mapa de Sillones & Estaciones en Vivo
            </h3>
            <Badge variant="luxury">Live Floor Plan</Badge>
          </div>
          <p className="text-xs text-charcoal-500">
            Monitoreo en tiempo real de ocupación y tiempos de pose en cabinas y sillones.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            {occupiedCount} de {stations.length} en uso ({Math.round((occupiedCount / stations.length) * 100)}%)
          </span>
        </div>
      </div>

      {/* Empty State if no stations */}
      {stations.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-brand-300 p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <Armchair className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-lg font-bold text-charcoal-900">Aún no has configurado sillones o puestos</h4>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto">
            Organiza las estaciones de corte, color, lavacabezas o mesas de manicura para monitorear la ocupación de tu salón en vivo.
          </p>
          <Button
            variant="luxury"
            onClick={() => setIsOnboardingOpen(true)}
            className="text-xs"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Configurar Sillones en el Asistente
          </Button>
        </div>
      )}

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((st) => {
          const isOccupied = st.status === 'occupied';
          const stationTitle = st.name.includes('·') ? st.name.split('·')[1].trim() : st.name;
          const stationSubtitle = st.name.includes('·') ? st.name.split('·')[0].trim() : `Puesto #${st.chairNumber}`;

          return (
            <div
              key={st.id}
              className={`p-4 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isOccupied
                  ? 'bg-white border-brand-200/90 shadow-md ring-1 ring-brand-100'
                  : 'bg-[#FAF8F5] border-dashed border-charcoal-300 opacity-90'
              }`}
            >
              {/* Optional Station Photo Banner */}
              {st.photoUrl && (
                <div className="h-28 -mx-4 -mt-4 mb-3 overflow-hidden relative">
                  <img
                    src={st.photoUrl}
                    alt={st.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg">
                    Foto del Puesto
                  </span>
                </div>
              )}

              {/* Top Station Tag */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      #{st.chairNumber}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-charcoal-950">{stationTitle}</h5>
                      <span className="text-[10px] text-charcoal-500">{stationSubtitle}</span>
                    </div>
                  </div>

                  <Badge
                    variant={isOccupied ? 'luxury' : 'success'}
                    className="text-[10px]"
                  >
                    {isOccupied ? `Ocupado · ${st.timeRemainingMinutes || 20} min` : 'Disponible'}
                  </Badge>
                </div>

                {/* Professional Assigned */}
                <div className="flex items-center space-x-2 py-2 border-y border-brand-100/70 text-xs">
                  {st.assignedProfessionalAvatar ? (
                    <img
                      src={st.assignedProfessionalAvatar}
                      alt={st.assignedProfessionalName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center text-[10px] font-bold">
                      {st.assignedProfessionalName ? st.assignedProfessionalName.charAt(0) : 'R'}
                    </div>
                  )}
                  <span className="font-semibold text-charcoal-800">
                    {st.assignedProfessionalName || 'Staff Rotativo'}
                  </span>
                </div>

                {/* Current Client Status */}
                {isOccupied && st.currentClientName ? (
                  <div className="mt-3 bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 space-y-1 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                      Clienta en Atención
                    </p>
                    <p className="font-bold text-charcoal-900 flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      <span>{st.currentClientName}</span>
                    </p>
                    <p className="text-[11px] text-brand-800 font-medium">
                      {st.currentServiceName}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 py-3 text-center text-xs text-charcoal-400 italic">
                    Estación libre y desinfectada
                  </div>
                )}
              </div>

              {/* Action */}
              {isOccupied && (
                <div className="mt-3 pt-2 border-t border-brand-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-charcoal-500 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-brand-500" />
                    Fin estimado en {st.timeRemainingMinutes || 20} min
                  </span>
                  <button
                    onClick={() => onOpenAppointmentDetails && onOpenAppointmentDetails(st.currentClientName || '')}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline"
                  >
                    Ver Ficha
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
