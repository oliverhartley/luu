import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  Armchair, 
  Sparkles, 
  Smartphone, 
  Package, 
  Scissors, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck, 
  ChevronRight,
  HelpCircle,
  Eye,
  Store
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface TutorialSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  targetTab?: string;
  targetTabName?: string;
  features: {
    title: string;
    description: string;
    badge?: string;
  }[];
  tip?: string;
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    id: 'welcome',
    tag: 'Bienvenida',
    title: '¡Te damos la bienvenida a luu.!',
    subtitle: 'El ecosistema digital y CRM de alta gama diseñado especialmente para salones de belleza y peluquerías de autor.',
    icon: Sparkles,
    accentColor: 'text-brand-600',
    bgGradient: 'from-brand-500/10 via-roseGold/10 to-champagne/20',
    features: [
      {
        title: 'Gestión Integral Sin Complicaciones',
        description: 'Todo tu salón conectado en tiempo real: citas, estilistas, clientas, inventario y comunicación.',
        badge: 'Todo en Uno'
      },
      {
        title: 'Diseñado para Peluquerías Reales',
        description: 'Fórmulas técnicas de color, tiempos de exposición de tintes y atención personalizada por sillón.',
        badge: 'Especializado'
      },
      {
        title: 'Fidelización Activa por WhatsApp',
        description: 'Recordatorios automáticos para que tus clientas nunca olviden una cita ni su retoque de raíz.',
        badge: 'Cero Inasistencias'
      }
    ],
    tip: '💡 Puedes recorrer este breve tutorial en 1 minuto o saltarlo cuando desees.'
  },
  {
    id: 'agenda',
    tag: 'Módulo 1 · Citas & Agenda',
    title: 'Agenda Inteligente & Control en Sala',
    subtitle: 'Organiza el día de tu salón con visualización clara por horas y peluqueras.',
    icon: Calendar,
    accentColor: 'text-roseGold',
    bgGradient: 'from-brand-100/40 via-white to-roseGold/15',
    targetTab: 'agenda',
    targetTabName: 'Ir a la Agenda',
    features: [
      {
        title: 'Control de Llegadas en Sala (Recepción)',
        description: 'Marca a las clientas como "En Sala" al momento que ingresan al salón para alertar al estilista.',
        badge: 'En Recepción'
      },
      {
        title: 'Cobro Inmediato (Checkout)',
        description: 'Al terminar el peinado, haz clic en "Cobrar" para registrar el método de pago y sumar productos retail.',
        badge: 'POS Directo'
      },
      {
        title: 'Agendamiento Rápido con 1 Clic',
        description: 'Usa el botón superior "+ Nueva Cita" en cualquier momento para reservar un espacio.',
        badge: 'Fácil & Rápido'
      }
    ],
    tip: '💡 Tip: Filtra por estilista arriba en la agenda para ver la jornada individual de cada profesional.'
  },
  {
    id: 'clients',
    tag: 'Módulo 2 · Clientas & Fórmulas',
    title: 'Fichas VIP & Fórmulas Capilares',
    subtitle: 'El verdadero secreto de un salón exitoso: recordar la receta exacta de cada clienta.',
    icon: Users,
    accentColor: 'text-brand-700',
    bgGradient: 'from-amber-50/50 via-white to-brand-50/40',
    targetTab: 'clients',
    targetTabName: 'Ver Clientas',
    features: [
      {
        title: 'Bitácora Técnica de Fórmulas',
        description: 'Guarda mezclas de coloración (ej: Majirel 9.1 + 20 Vol), marcas, tiempos y notas de diagnóstico capilar.',
        badge: 'Fórmulas'
      },
      {
        title: 'Beauty Pass & Fidelización',
        description: 'Nivel VIP de clientas, historial de visitas y control de preferencias personales.',
        badge: 'VIP Club'
      },
      {
        title: 'Registro Fotográfico Antes y Después',
        description: 'Compara el resultado antes y después de cada tratamiento con el deslizador fotográfico interactivo.',
        badge: 'Antes/Después'
      }
    ],
    tip: '💡 Tip: Desde el perfil de cada clienta puedes abrir su WhatsApp directo con un solo clic.'
  },
  {
    id: 'floorplan',
    tag: 'Módulo 3 · Operaciones en Vivo',
    title: 'Mapa de Sillones & Salón en Vivo',
    subtitle: 'Monitorea visualmente qué ocurre en cada rincón de tu peluquería en tiempo real.',
    icon: Armchair,
    accentColor: 'text-charcoal-800',
    bgGradient: 'from-stone-100/60 via-white to-amber-50/30',
    targetTab: 'floorplan',
    targetTabName: 'Ver Mapa de Sillones',
    features: [
      {
        title: 'Estados de Puestos en Vivo',
        description: 'Identifica al instante sillones libres, en proceso de corte, decoloración o en espera de lavado.',
        badge: 'En Vivo'
      },
      {
        title: 'Estaciones por Especialidad',
        description: 'Organiza puestos de corte, zonas de balayage/color, lavapeinados y mesas de manicura.',
        badge: 'Zonificación'
      },
      {
        title: 'Asignación de Estilistas',
        description: 'Asigna a tus peluqueras a sus sillones habituales para agilizar el flujo de atención.',
        badge: 'Optimización'
      }
    ],
    tip: '💡 Tip: Puedes reorganizar y crear nuevos sillones desde el Asistente de Configuración.'
  },
  {
    id: 'marketing',
    tag: 'Módulo 4 · Comunicación',
    title: 'WhatsApp & Marketing Automatizado',
    subtitle: 'Reduce las inasistencias al mínimo y mantén tu agenda siempre llena.',
    icon: Smartphone,
    accentColor: 'text-emerald-600',
    bgGradient: 'from-emerald-50/50 via-white to-teal-50/30',
    targetTab: 'marketing',
    targetTabName: 'Ir a Marketing & WhatsApp',
    features: [
      {
        title: 'Recordatorios 24 Horas Antes',
        description: 'Plantillas automáticas con fecha, hora, dirección del salón y nombre de la peluquera asignada.',
        badge: 'WhatsApp'
      },
      {
        title: 'Reactivación de Clientas Inactivas',
        description: 'Detecta a quienes llevan más de 60 días sin retocar su color y envíales una invitación especial.',
        badge: 'Retención'
      },
      {
        title: 'Simulador de WhatsApp en Pantalla',
        description: 'Prueba cómo lucen los mensajes interactivos en el botón "WhatsApp" de la barra superior.',
        badge: 'Simulador'
      }
    ],
    tip: '💡 Tip: Las clientas que reciben recordatorio por WhatsApp reducen el ausentismo en más de un 80%.'
  },
  {
    id: 'tools',
    tag: 'Módulo 5 · Control & Herramientas',
    title: 'Inventario, POS & Atajos Pro',
    subtitle: 'Herramientas de precisión para que nada se te escape en la gestión diaria.',
    icon: Package,
    accentColor: 'text-purple-600',
    bgGradient: 'from-purple-50/40 via-white to-brand-50/30',
    targetTab: 'inventory',
    targetTabName: 'Ver Inventario',
    features: [
      {
        title: 'Alertas de Stock Crítico',
        description: 'Avisos visuales cuando te queden pocos tubos de tinte o shampoos de reventa en vitrina.',
        badge: 'Stock Bajo'
      },
      {
        title: 'Calculadora de Ratios de Tinte',
        description: 'Calcula proporciones exactas de oxidante (1:1, 1:1.5, 1:2) y gramos requeridos al instante.',
        badge: 'Calculadora'
      },
      {
        title: 'Paleta de Comandos Universal (⌘ K)',
        description: 'Presiona ⌘+K (o Ctrl+K) para buscar clientas, citas o saltar de pantalla en medio segundo.',
        badge: '⌘ K'
      }
    ],
    tip: '💡 Tip: Prueba presionar ⌘ + K en tu teclado para probar la búsqueda rápida en cualquier momento.'
  }
];

export const TutorialModal: React.FC = () => {
  const { isTutorialOpen, dismissTutorial, setActiveTab } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  // Reset slide index when modal opens
  useEffect(() => {
    if (isTutorialOpen) {
      setCurrentSlideIndex(0);
    }
  }, [isTutorialOpen]);

  if (!isTutorialOpen) return null;

  const currentSlide = TUTORIAL_SLIDES[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === TUTORIAL_SLIDES.length - 1;
  const SlideIcon = currentSlide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstSlide) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    dismissTutorial(dontShowAgain);
  };

  const handleJumpToTab = (tabId: string) => {
    setActiveTab(tabId);
    dismissTutorial(dontShowAgain);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-brand-100/90 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-brand-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white shadow-md shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold tracking-tight">
                  luu<span className="text-brand-400">.</span>
                </span>
                <span className="text-white/40 text-xs">|</span>
                <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">
                  Guía Rápida de Funcionalidades
                </span>
              </div>
              <p className="text-[11px] text-charcoal-300">
                Paso {currentSlideIndex + 1} de {TUTORIAL_SLIDES.length}
              </p>
            </div>
          </div>

          {/* Quick Close Button */}
          <button
            onClick={handleComplete}
            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Cerrar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Content Slide */}
        <div className={`p-6 sm:p-8 flex-1 overflow-y-auto bg-gradient-to-b ${currentSlide.bgGradient}`}>
          
          {/* Slide Tag & Title */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="luxury" className="text-[10px] sm:text-xs">
              {currentSlide.tag}
            </Badge>

            {currentSlide.targetTab && (
              <button
                onClick={() => handleJumpToTab(currentSlide.targetTab!)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 bg-white/80 hover:bg-white px-3 py-1 rounded-full border border-brand-200 shadow-2xs transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                <span>{currentSlide.targetTabName}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-start space-x-4 mb-5">
            <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm border border-brand-100 flex items-center justify-center shrink-0 ${currentSlide.accentColor}`}>
              <SlideIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950 leading-tight">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1 leading-relaxed font-sans">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {currentSlide.features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-brand-200/80 shadow-2xs space-y-1.5 hover:border-brand-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-brand-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-xs text-charcoal-900 leading-tight">
                      {feature.title}
                    </span>
                  </div>
                  {feature.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200/60 shrink-0">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal-600 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Pro Tip Callout */}
          {currentSlide.tip && (
            <div className="p-3 bg-white/70 rounded-2xl border border-brand-200/60 text-xs text-charcoal-700 flex items-center space-x-2 shadow-2xs">
              <span className="text-xs font-semibold">{currentSlide.tip}</span>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-white p-4 sm:p-5 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* "Don't show again" Checkbox */}
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 border-brand-300 focus:ring-brand-500 transition-all cursor-pointer"
            />
            <span className="text-xs font-medium text-charcoal-700">
              No volver a mostrar este tutorial al iniciar
            </span>
          </label>

          {/* Steps Dots & Controls */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Step Dots Indicators */}
            <div className="flex items-center space-x-1.5 mr-2">
              {TUTORIAL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlideIndex 
                      ? 'w-6 bg-brand-600' 
                      : 'w-2 bg-charcoal-200 hover:bg-charcoal-300'
                  }`}
                  title={`Ir al paso ${idx + 1}`}
                />
              ))}
            </div>

            {/* Back Button */}
            {!isFirstSlide && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                className="text-xs font-bold text-charcoal-600 hover:text-charcoal-900 px-3"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Anterior</span>
              </Button>
            )}

            {/* Next / Finish Button */}
            <Button
              variant="luxury"
              size="sm"
              onClick={handleNext}
              className="text-xs font-bold px-4 py-2 flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
            >
              <span>{isLastSlide ? '¡Comenzar a Gestionar! ✨' : 'Siguiente'}</span>
              {!isLastSlide && <ArrowRight className="w-3.5 h-3.5" />}
            </Button>

          </div>

        </div>

      </div>
    </div>
  );
};
