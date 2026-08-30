import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Crown, 
  QrCode, 
  Check, 
  Share2, 
  Scissors, 
  Heart,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Client } from '../../types';

interface BeautyPassModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BeautyPassModal: React.FC<BeautyPassModalProps> = ({
  client,
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();

  if (!isOpen || !client) return null;

  const points = client.totalVisits * 150 + 250;
  const isVip = client.tags.includes('VIP') || client.totalVisits >= 5;

  const handleSharePass = () => {
    navigator.clipboard.writeText(`https://pelu.app/pass/${client.id}`);
    showToast('Enlace de Beauty Pass Copiado', 'Listo para enviar por WhatsApp a la clienta', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-md w-full p-6 sm:p-8 relative my-8 text-center">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
            Digital Loyalty Pass
          </span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-charcoal-950 mb-5">
          luu. VIP Club Pass
        </h3>

        {/* Digital Card (Apple Wallet Style with Holographic Sheen) */}
        <div className="relative rounded-3xl overflow-hidden p-6 text-white shadow-2xl bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-brand-950 border border-white/20 text-left space-y-4 holographic-sheen">
          
          {/* Top Brand & Tier */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-300">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">luu.</span>
            </div>
            
            <Badge variant="luxury" className="bg-white/20 text-white border-white/30 backdrop-blur-md text-[10px]">
              <Crown className="w-3 h-3 mr-1 text-amber-300" />
              {isVip ? 'Platinum Member' : 'Signature Member'}
            </Badge>
          </div>

          {/* Client Details */}
          <div className="py-2">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
              Titular del Pase
            </span>
            <h4 className="font-serif text-xl font-bold tracking-wide mt-0.5 text-white">
              {client.name}
            </h4>
            <p className="text-xs text-brand-200 mt-0.5">{client.phone}</p>
          </div>

          {/* Points & Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-charcoal-400 block">Puntos Acumulados</span>
              <span className="text-lg font-bold text-amber-300">{points} pts</span>
            </div>
            <div>
              <span className="text-[10px] text-charcoal-400 block">Visitas Registradas</span>
              <span className="text-lg font-bold text-white">{client.totalVisits} citas</span>
            </div>
          </div>

          {/* QR Code for Check-in */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between bg-black/30 p-3 rounded-2xl backdrop-blur-sm">
            <div className="text-[11px] text-charcoal-300">
              <p className="font-bold text-white">QR de Check-In Rápido</p>
              <p className="text-[10px]">Escanea al llegar al salón</p>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <QrCode className="w-10 h-10 text-charcoal-950" />
            </div>
          </div>

        </div>

        {/* Benefits list */}
        <div className="mt-5 text-left bg-[#FAF8F5] p-3.5 rounded-2xl border border-brand-100 text-xs space-y-1.5">
          <p className="font-bold text-charcoal-900 text-[11px] uppercase tracking-wider">
            Beneficios Activos en Pelu:
          </p>
          <p className="text-charcoal-600 flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Café latte & matcha de cortesía en cada cita</span>
          </p>
          <p className="text-charcoal-600 flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recordatorio prioritario de raíces y manicura</span>
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-center space-x-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="luxury" size="sm" onClick={handleSharePass}>
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Enviar por WhatsApp
          </Button>
        </div>

      </div>
    </div>
  );
};
