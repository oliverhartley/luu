import React, { useState } from 'react';
import { X, Sparkles, SlidersHorizontal, Scissors, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

interface BeforeAfterSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeforeAfterSliderModal: React.FC<BeforeAfterSliderModalProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeTransformation, setActiveTransformation] = useState<'hair' | 'nails'>('hair');

  if (!isOpen) return null;

  const transformations = {
    hair: {
      title: 'Balayage Signature & Neutralización Ceniza',
      stylist: 'Valentina Morales',
      client: 'Isidora Paz Benítez',
      beforeImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      afterImg: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
      notes: 'Fórmula: 40g 7.1 + 10g 8.21 con 20 Vol + Matiz Dialight 9.02'
    },
    nails: {
      title: 'Manicura Rusa + Esmaltado Glazed Chrome',
      stylist: 'Camila Soto',
      client: 'María Jesús Correa',
      beforeImg: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
      afterImg: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
      notes: 'Base Rubber Nude Kodi + OPI Funny Bunny 2 capas + Cromo plateado'
    }
  };

  const current = transformations[activeTransformation];

  const handleShare = () => {
    navigator.clipboard.writeText('https://pelu.app/portfolio/transformacion-101');
    showToast('Enlace de Transformación Copiado', 'Listo para publicar en Instagram Stories o WhatsApp', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                Comparador Antes vs Después
              </h3>
              <p className="text-xs text-charcoal-500">
                Desliza la barra para ver el resultado de la transformación.
              </p>
            </div>
          </div>

          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-brand-200">
            <button
              onClick={() => setActiveTransformation('hair')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTransformation === 'hair' ? 'bg-brand-500 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              Cabello
            </button>
            <button
              onClick={() => setActiveTransformation('nails')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTransformation === 'nails' ? 'bg-brand-500 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              Uñas
            </button>
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl select-none border border-brand-200">
          
          {/* AFTER Image (Full background) */}
          <img
            src={current.afterImg}
            alt="Resultado Después"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ✨ Después
          </span>

          {/* BEFORE Image (Clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={current.beforeImg}
              alt="Estado Antes"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <span className="absolute top-4 left-4 bg-charcoal-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Antes
            </span>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-charcoal-900 border border-brand-200">
              <SlidersHorizontal className="w-4 h-4 text-brand-600 rotate-90" />
            </div>
          </div>

          {/* Range input transparent overlay for seamless dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
          />
        </div>

        {/* Details card below */}
        <div className="mt-4 p-4 bg-[#FAF8F5] rounded-2xl border border-brand-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-charcoal-900">{current.title}</h4>
            <p className="text-[11px] text-charcoal-500">
              Por <strong>{current.stylist}</strong> para <strong>{current.client}</strong>
            </p>
            <p className="text-[11px] text-brand-900 font-mono mt-1 italic">{current.notes}</p>
          </div>

          <Button variant="luxury" size="sm" onClick={handleShare} className="shrink-0">
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Compartir en Redes
          </Button>
        </div>

      </div>
    </div>
  );
};
