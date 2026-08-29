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

interface Station {
  id: string;
  name: string;
  category: 'hair_color' | 'hair_cut' | 'wash_spa' | 'nails' | 'lashes';
  assignedProfessionalName: string;
  assignedProfessionalAvatar: string;
  currentClientName?: string;
  currentServiceName?: string;
  status: 'occupied' | 'ready' | 'sanitizing';
  timeRemainingMinutes?: number;
  chairNumber: number;
}

export const SalonFloorPlan: React.FC<{
  onOpenAppointmentDetails?: (clientName: string) => void;
}> = ({ onOpenAppointmentDetails }) => {
  const { appointments, selectedDate } = useApp();

  const stations: Station[] = [
    {
      id: 'st-1',
      name: 'Sillón 1 · Colorimetría & Balayage',
      category: 'hair_color',
      chairNumber: 1,
      assignedProfessionalName: 'Valentina Morales',
      assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      currentClientName: 'Isidora Paz Benítez',
      currentServiceName: 'Retoque de Raíz & Baño de Brillo (Tiempo de pose)',
      status: 'occupied',
      timeRemainingMinutes: 25
    },
    {
      id: 'st-2',
      name: 'Sillón 2 · Corte de Autor & Styling',
      category: 'hair_cut',
      chairNumber: 2,
      assignedProfessionalName: 'Javiera Silva',
      assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      currentClientName: 'Florencia Valenzuela',
      currentServiceName: 'Corte de Autor & Styling Ondas',
      status: 'occupied',
      timeRemainingMinutes: 15
    },
    {
      id: 'st-3',
      name: 'Estación 3 · Lavacabezas & Spa Capilar',
      category: 'wash_spa',
      chairNumber: 3,
      assignedProfessionalName: 'Staff Rotativo',
      assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      status: 'ready'
    },
    {
      id: 'st-4',
      name: 'Mesa 4 · Manicura Rusa & Nail Art',
      category: 'nails',
      chairNumber: 4,
      assignedProfessionalName: 'Camila Soto',
      assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      currentClientName: 'María Jesús Correa',
      currentServiceName: 'Manicura Rusa Combinada + Esmalte OPI',
      status: 'occupied',
      timeRemainingMinutes: 30
    },
    {
      id: 'st-5',
      name: 'Cabina 5 · Lash & Brow Studio',
      category: 'lashes',
      chairNumber: 5,
      assignedProfessionalName: 'Sofía Castro',
      assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      currentClientName: 'Catalina Rivas',
      currentServiceName: 'Lifting de Pestañas con Keratina & Tinte',
      status: 'occupied',
      timeRemainingMinutes: 40
    }
  ];

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

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((st) => {
          const isOccupied = st.status === 'occupied';

          return (
            <div
              key={st.id}
              className={`p-4 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isOccupied
                  ? 'bg-white border-brand-200/90 shadow-md ring-1 ring-brand-100'
                  : 'bg-[#FAF8F5] border-dashed border-charcoal-300 opacity-80'
              }`}
            >
              {/* Top Station Tag */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      #{st.chairNumber}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-charcoal-950">{st.name.split('·')[1]}</h5>
                      <span className="text-[10px] text-charcoal-500">{st.name.split('·')[0]}</span>
                    </div>
                  </div>

                  <Badge
                    variant={isOccupied ? 'luxury' : 'success'}
                    className="text-[10px]"
                  >
                    {isOccupied ? `Ocupado · ${st.timeRemainingMinutes} min` : 'Disponible'}
                  </Badge>
                </div>

                {/* Professional Assigned */}
                <div className="flex items-center space-x-2 py-2 border-y border-brand-100/70 text-xs">
                  <img
                    src={st.assignedProfessionalAvatar}
                    alt={st.assignedProfessionalName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-charcoal-800">{st.assignedProfessionalName}</span>
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
                  <div className="mt-3 py-4 text-center text-xs text-charcoal-400 italic">
                    Estación libre y desinfectada
                  </div>
                )}
              </div>

              {/* Action */}
              {isOccupied && (
                <div className="mt-3 pt-2 border-t border-brand-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-charcoal-500 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-brand-500" />
                    Fin estimado en {st.timeRemainingMinutes} min
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
