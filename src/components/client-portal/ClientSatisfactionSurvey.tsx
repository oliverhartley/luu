import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Heart, 
  Scissors, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  MessageSquare, 
  Star, 
  Smile, 
  Frown, 
  Check, 
  Send,
  X,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { openWhatsApp } from '../../lib/whatsapp';

interface ClientSatisfactionSurveyProps {
  appointmentId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const ClientSatisfactionSurvey: React.FC<ClientSatisfactionSurveyProps> = ({
  appointmentId,
  onClose,
  isModal = false
}) => {
  const { appointments, currentSalon, submitPostServiceSurvey, showToast } = useApp();

  // Buscar la cita correspondiente o generar datos de muestra si es un enlace de prueba
  const appointment = appointments.find((a) => a.id === appointmentId) ||
    (appointmentId && appointmentId.includes('francisca') ? {
      id: appointmentId,
      clientId: 'client-francisca',
      clientName: 'Francisca Lizama',
      clientPhone: '+56 9 9489 1994',
      date: new Date().toISOString().split('T')[0],
      startTime: '11:00',
      endTime: '14:00',
      status: 'completed' as const,
      items: [
        {
          serviceId: 'srv-1',
          serviceName: 'Balayage Signature & Matiz Gloss',
          professionalId: 'prof-1',
          professionalName: 'Francisca Lizama',
          durationMinutes: 180,
          price: 85000
        }
      ],
      totalPrice: 85000
    } : null) ||
    appointments.filter((a) => a.status === 'completed')[0] ||
    appointments[0];

  const [feeling, setFeeling] = useState<'love' | 'happy' | 'retouch' | 'unhappy' | null>(null);
  const [retouchReason, setRetouchReason] = useState<'color_matiz' | 'corte_puntas' | 'volumen' | 'tratamiento' | 'otro'>('color_matiz');
  const [retouchNotes, setRetouchNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl border border-brand-200 shadow-md text-center max-w-sm">
          <p className="text-sm text-charcoal-700 font-medium">No se encontró la atención para esta encuesta.</p>
          {onClose && (
            <Button onClick={onClose} className="mt-4 text-xs font-bold" variant="luxury">
              Volver
            </Button>
          )}
        </div>
      </div>
    );
  }

  const clientName = appointment.clientName;
  const primaryService = appointment.items.map((i) => i.serviceName).join(' + ');
  const primaryStylist = appointment.items[0]?.professionalName || 'Tu Estilista';
  const salonName = currentSalon?.name || 'Pelu OBi';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling) return;

    const isHappy = feeling === 'love' || feeling === 'happy';
    const wantsRetouch = feeling === 'retouch' || feeling === 'unhappy';
    const rating = feeling === 'love' ? 5 : feeling === 'happy' ? 4 : feeling === 'retouch' ? 3 : 2;

    submitPostServiceSurvey(appointment.id, {
      rating,
      isHappy,
      wantsRetouch,
      retouchReason: wantsRetouch ? retouchReason : undefined,
      retouchNotes: retouchNotes.trim() ? retouchNotes : undefined
    });

    setIsSubmitted(true);
  };

  const handleOpenSalonWhatsApp = () => {
    const reasonText = retouchReason === 'color_matiz' ? 'color/matiz' :
      retouchReason === 'corte_puntas' ? 'corte/puntas' :
      retouchReason === 'volumen' ? 'peinado/volumen' :
      retouchReason === 'tratamiento' ? 'tratamiento' : 'un detalle';

    const msg = `¡Hola ${salonName}! Soy ${clientName.split(' ')[0]}. Acabo de responder la encuesta sobre mi atención de ${primaryService}. Me gustaría coordinar el retoque de ${reasonText} que conversamos. ¡Muchas gracias!`;
    openWhatsApp(currentSalon?.phone || '+56994891994', msg);
  };

  const content = (
    <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-brand-100/90 overflow-hidden relative animate-fade-in mx-auto">
      {/* Header Close Button (if modal) */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-charcoal-400 hover:text-charcoal-700 bg-white/80 backdrop-blur-md rounded-full shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Top Salon Header */}
      <div className="bg-gradient-to-br from-brand-600 via-roseGold to-brand-500 text-white p-6 sm:p-7 relative overflow-hidden text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Scissors className="w-6 h-6" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/25 backdrop-blur-md mb-2">
          <Sparkles className="w-3 h-3" />
          Garantía de Satisfacción 100%
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-bold">{salonName}</h2>
        <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
          Nos importa tu opinión para que siempre te sientas increíble
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
          {/* Greeting & Service Info */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/70 space-y-1 text-center sm:text-left">
            <p className="text-xs text-charcoal-500 font-medium">Hola <strong className="text-charcoal-900 font-bold">{clientName}</strong>,</p>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Hace un par de horas estuviste con nosotros para tu atención de <strong className="text-brand-700">{primaryService}</strong> con <strong className="text-charcoal-900">{primaryStylist}</strong>.
            </p>
          </div>

          {/* Question 1: How do you feel? */}
          <div>
            <label className="block text-sm font-bold text-charcoal-900 mb-2 text-center sm:text-left">
              1. ¿Cómo te sientes con tu resultado ahora que estás en casa? ✨
            </label>
            <p className="text-xs text-charcoal-500 mb-3 text-center sm:text-left">
              Mírate al espejo con luz natural y cuéntanos con total confianza:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setFeeling('love')}
                className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                  feeling === 'love'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200 shadow-sm'
                    : 'bg-white border-brand-200/80 hover:bg-brand-50/50 text-charcoal-800'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">😍</span>
                  <div>
                    <span className="block font-bold">¡Me encantó! Estoy 100% feliz</span>
                    <span className="block text-[11px] text-charcoal-500 font-normal">Quedó perfecto, tal como quería</span>
                  </div>
                </span>
                {feeling === 'love' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setFeeling('happy')}
                className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                  feeling === 'happy'
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200 shadow-sm'
                    : 'bg-white border-brand-200/80 hover:bg-brand-50/50 text-charcoal-800'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">😊</span>
                  <div>
                    <span className="block font-bold">Me gustó mucho, todo súper bien</span>
                    <span className="block text-[11px] text-charcoal-500 font-normal">Buena experiencia y resultado</span>
                  </div>
                </span>
                {feeling === 'happy' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setFeeling('retouch')}
                className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                  feeling === 'retouch'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200 shadow-sm'
                    : 'bg-white border-brand-200/80 hover:bg-brand-50/50 text-charcoal-800'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">✂️</span>
                  <div>
                    <span className="block font-bold text-amber-900">Me gustaría un pequeño retoque o cambio</span>
                    <span className="block text-[11px] text-amber-700/80 font-normal">Hay un detalle que quiero ajustar sin costo</span>
                  </div>
                </span>
                {feeling === 'retouch' && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setFeeling('unhappy')}
                className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                  feeling === 'unhappy'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200 shadow-sm'
                    : 'bg-white border-brand-200/80 hover:bg-brand-50/50 text-charcoal-800'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-2xl">💔</span>
                  <div>
                    <span className="block font-bold text-rose-900">No quedé conforme con el resultado</span>
                    <span className="block text-[11px] text-rose-700/80 font-normal">Necesito una solución o revisión urgente</span>
                  </div>
                </span>
                {feeling === 'unhappy' && <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Conditional Question 2: Retouch Details */}
          {(feeling === 'retouch' || feeling === 'unhappy') && (
            <div className="p-4 bg-amber-50/60 border border-amber-200/90 rounded-2xl space-y-3.5 animate-fade-in">
              <div className="flex items-start space-x-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Garantía de Retoque Rápido y Gratuito</h4>
                  <p className="text-[11px] text-amber-800">
                    ¡No te preocupes! Lo solucionamos rápido y con prioridad para que quedes 100% enamorada de tu look.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                  ¿Qué área o detalle te gustaría retocar?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'color_matiz', label: '🎨 Color o Matiz' },
                    { id: 'corte_puntas', label: '✂️ Corte / Flequillo / Largo' },
                    { id: 'volumen', label: '💨 Caída / Volumen' },
                    { id: 'tratamiento', label: '💆‍♀️ Suavidad / Textura' },
                    { id: 'otro', label: '✍️ Otro detalle' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRetouchReason(opt.id as any)}
                      className={`p-2 rounded-xl text-left border font-medium transition-all ${
                        retouchReason === opt.id
                          ? 'bg-brand-500 text-white border-brand-600 font-bold shadow-xs'
                          : 'bg-white text-charcoal-700 border-brand-200/70 hover:bg-brand-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Cuéntanos un poco más para preparar tu retoque:
                </label>
                <textarea
                  rows={2}
                  value={retouchNotes}
                  onChange={(e) => setRetouchNotes(e.target.value)}
                  placeholder="Ej: Siento que el matiz quedó un poco más cálido de lo que quería, o me gustaría cortar 1 cm más las puntas..."
                  className="w-full p-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!feeling}
            className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>
              {feeling === 'retouch' || feeling === 'unhappy'
                ? 'Enviar & Activar Garantía de Retoque'
                : 'Enviar mi Opinión'}
            </span>
          </Button>

          <p className="text-[11px] text-center text-charcoal-400 leading-tight">
            🔒 Tu respuesta es confidencial y le llega directamente a la dirección del salón para asegurar la mejor calidad.
          </p>
        </form>
      ) : (
        /* Success / Resolution Screen */
        <div className="p-7 sm:p-8 space-y-6 text-center animate-fade-in">
          {feeling === 'love' || feeling === 'happy' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-950">
                ¡Nos alegra muchísimo que lo hayas amado!
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-sm mx-auto">
                Tu felicidad es nuestra mayor satisfacción. Le transmitiremos tus felicitaciones a <strong>{primaryStylist}</strong>. ¡Esperamos verte muy pronto en {salonName}! 💖
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900">
                ⭐ <strong>Calificación 5 Estrellas Registrada en tu Ficha VIP</strong>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-950">
                ¡Tu Garantía de Retoque está Activa!
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-sm mx-auto">
                Lamentamos que no haya quedado 100% como soñabas. En <strong>{salonName}</strong> nuestra prioridad es no perder tu confianza: <strong>te agendaremos una cita de retoque prioritaria y totalmente gratuita</strong>.
              </p>

              <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-300 text-left text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Notificación Prioritaria Enviada al Salón</span>
                </p>
                <p className="text-[11px] text-amber-800">
                  La administración y tu estilista <strong>{primaryStylist}</strong> ya tienen tu solicitud para contactarte enseguida.
                </p>
              </div>

              <Button
                onClick={handleOpenSalonWhatsApp}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hablar con el Salón por WhatsApp Ahora</span>
              </Button>
            </div>
          )}

          {isModal && onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-semibold"
            >
              Cerrar Vista de Encuesta
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
      {content}
    </div>
  );
};
