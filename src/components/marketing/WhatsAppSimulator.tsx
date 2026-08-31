import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  Video,
  MoreVertical,
  Scissors,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { openWhatsApp, cleanWhatsAppNumber, WhatsAppTemplates } from '../../lib/whatsapp';

interface WhatsAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  targetClientPhone?: string;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  isOpen,
  onClose,
  targetClientPhone
}) => {
  const { 
    whatsAppLogs, 
    clients, 
    appointments, 
    currentSalon,
    sendWhatsAppMessage, 
    submitSurveyFeedback,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'real' | 'simulator'>('real');

  // Estado para envío REAL de WhatsApp
  const [realPhone, setRealPhone] = useState<string>(targetClientPhone || '+56 9 ');
  const [realName, setRealName] = useState<string>('Oliver');
  const [selectedTemplate, setSelectedTemplate] = useState<'confirmation' | 'reminder' | 'beautypass' | 'survey' | 'custom'>('confirmation');
  const [realMessage, setRealMessage] = useState<string>(() => {
    const salonName = currentSalon?.name || 'Pelu OBi';
    return `¡Hola Oliver! ✨ Te confirmamos tu cita en *${salonName}*:\n\n📅 Fecha: Viernes 5 de Septiembre\n⏰ Hora: 15:30 hrs\n💆‍♀️ Servicio: Corte & Estilo de Autor\n💇‍♀️ Estilista: Francisca\n\nSi necesitas reagendar o tienes alguna duda, escríbenos por aquí. ¡Te esperamos!`;
  });

  // Estado para el simulador de pantalla
  const [selectedClientPhone, setSelectedClientPhone] = useState<string>(() => {
    return targetClientPhone || clients[0]?.phone || '';
  });
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.phone === selectedClientPhone) || clients[0];
  const salonName = currentSalon?.name || 'Pelu OBi';
  
  // Mensajes simulados para la clienta actual
  const clientMessages = whatsAppLogs.filter(
    (m) => m.toPhone === currentClient?.phone || m.toName === currentClient?.name
  );

  // Cambiar plantilla en el envío real
  const handleSelectTemplate = (type: 'confirmation' | 'reminder' | 'beautypass' | 'survey' | 'custom') => {
    setSelectedTemplate(type);
    const firstName = realName.trim() || 'Cliente';

    switch (type) {
      case 'confirmation':
        setRealMessage(
          `¡Hola ${firstName}! ✨ Te confirmamos tu cita en *${salonName}*:\n\n📅 Fecha: Viernes 5 de Septiembre\n⏰ Hora: 15:30 hrs\n💆‍♀️ Servicio: Balayage & Olaplex\n💇‍♀️ Estilista: Francisca\n\nSi necesitas reagendar, por favor avísanos con anticipación. ¡Te esperamos!`
        );
        break;
      case 'reminder':
        setRealMessage(
          `¡Hola ${firstName}! ⏰ Te recordamos que mañana tienes cita en *${salonName}* a las 11:00 hrs para Corte & Peinado.\n\nPor favor confirma respondiendo con un *SÍ* a este mensaje. ¡Que tengas un gran día!`
        );
        break;
      case 'beautypass':
        setRealMessage(
          `¡Hola ${firstName}! ✨ Te compartimos tu Beauty Pass VIP de *${salonName}*:\n\n💎 Tienes *1.450 Puntos Acumulados*\n🎁 20% de descuento en tu próxima sesión\n\nRevisa tus beneficios y visitas aquí: https://test.luu.cl/pass/vip-member`
        );
        break;
      case 'survey':
        setRealMessage(
          `✨ *¿Cómo estuvo tu experiencia hoy en ${salonName}?*\n\nHola ${firstName}, gracias por visitarnos. ¿Podrías calificarnos del 1 al 5 ⭐ respondiendo a este mensaje? Tu opinión nos ayuda a brindarte siempre lo mejor.`
        );
        break;
      case 'custom':
      default:
        setRealMessage(`¡Hola ${firstName}! Te escribimos desde *${salonName}*...`);
        break;
    }
  };

  // Enviar mensaje REAL a través de WhatsApp Web / App
  const handleSendRealWhatsApp = () => {
    const cleaned = cleanWhatsAppNumber(realPhone);
    if (!cleaned || cleaned.length < 8) {
      showToast('Número Inválido', 'Por favor ingresa un número de teléfono válido (ej: +56 9 8123 4567).', 'error');
      return;
    }

    // Registrar en el log de la aplicación
    sendWhatsAppMessage(
      realName || 'Cliente WhatsApp',
      realPhone,
      selectedTemplate === 'survey' ? 'survey' : selectedTemplate === 'reminder' ? 'reminder' : 'campaign',
      realMessage
    );

    // Abrir WhatsApp Real
    openWhatsApp(realPhone, realMessage);
    showToast('Abriendo WhatsApp Real', `Iniciando chat con ${realPhone}...`, 'success');
  };

  const handleSendMessageSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !currentClient) return;

    sendWhatsAppMessage(
      currentClient.name,
      currentClient.phone,
      'campaign',
      typedMessage.trim()
    );
    setTypedMessage('');
  };

  const handleSurveyReply = (rating: number) => {
    setSelectedRating(rating);
    const apt = appointments.find((a) => a.clientPhone === currentClient.phone && a.status === 'completed');
    if (apt) {
      submitSurveyFeedback(apt.id, rating, rating >= 4 ? '¡Me encantó el servicio!' : 'Tuve un inconveniente con el tono/duración');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-charcoal-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-4xl w-full p-4 sm:p-6 relative my-6 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con pestañas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-lg text-charcoal-950">WhatsApp de {salonName}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-charcoal-500">Prueba envíos reales y automatizaciones del salón</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs selector */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-brand-200 text-xs">
              <button
                onClick={() => setActiveTab('real')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                  activeTab === 'real'
                    ? 'bg-[#25D366] text-white shadow-sm'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📲 Probar WhatsApp Real</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <span>💬 Simulador de Pantalla</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENIDO 1: PROBAR WHATSAPP REAL */}
        {activeTab === 'real' && (
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
            {/* Columna Izquierda: Configuración del mensaje */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-100 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  <span>Destinatario de Prueba</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder="Ej: Oliver"
                      className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Teléfono WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={realPhone}
                      onChange={(e) => setRealPhone(e.target.value)}
                      placeholder="+56 9 8123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 bg-white text-emerald-800"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-charcoal-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Puedes escribir tu propio número para recibir el mensaje en tu WhatsApp.</span>
                </div>
              </div>

              {/* Plantillas de Mensaje */}
              <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Seleccionar Tipo de Notificación</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectTemplate('confirmation')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTemplate === 'confirmation'
                        ? 'bg-emerald-50 border-[#25D366] text-emerald-950 font-bold shadow-xs ring-2 ring-[#25D366]/20'
                        : 'bg-[#FAF8F5] border-brand-100 hover:border-brand-300 text-charcoal-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">Confirmación Cita</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate('reminder')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTemplate === 'reminder'
                        ? 'bg-emerald-50 border-[#25D366] text-emerald-950 font-bold shadow-xs ring-2 ring-[#25D366]/20'
                        : 'bg-[#FAF8F5] border-brand-100 hover:border-brand-300 text-charcoal-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">Recordatorio 24h</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate('beautypass')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTemplate === 'beautypass'
                        ? 'bg-emerald-50 border-[#25D366] text-emerald-950 font-bold shadow-xs ring-2 ring-[#25D366]/20'
                        : 'bg-[#FAF8F5] border-brand-100 hover:border-brand-300 text-charcoal-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">VIP Beauty Pass</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate('survey')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTemplate === 'survey'
                        ? 'bg-emerald-50 border-[#25D366] text-emerald-950 font-bold shadow-xs ring-2 ring-[#25D366]/20'
                        : 'bg-[#FAF8F5] border-brand-100 hover:border-brand-300 text-charcoal-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Star className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">Encuesta 5 Estrellas</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Editor del mensaje */}
              <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-2">
                <label className="block text-xs font-bold text-charcoal-700">
                  Mensaje a Enviar (Editable)
                </label>
                <textarea
                  rows={5}
                  value={realMessage}
                  onChange={(e) => {
                    setRealMessage(e.target.value);
                    setSelectedTemplate('custom');
                  }}
                  className="w-full p-3 rounded-xl border border-brand-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 bg-[#FAF8F5]"
                />
              </div>
            </div>

            {/* Columna Derecha: Vista Previa en WhatsApp y Botón de Envío Real */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div className="bg-[#EFEAE2] rounded-2xl p-4 border border-charcoal-200 shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#075E54] text-white flex items-center justify-center text-xs font-bold">
                      {salonName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal-900">{salonName}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Para: {realPhone || 'Destinatario'}</p>
                    </div>
                  </div>
                  <Badge variant="luxury" className="bg-[#25D366] text-white text-[9px]">WhatsApp</Badge>
                </div>

                {/* Burbuja de WhatsApp */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-black/5 text-xs text-charcoal-900 space-y-1">
                  <p className="whitespace-pre-line leading-relaxed">{realMessage}</p>
                  <div className="flex items-center justify-end space-x-1 pt-1 text-[10px] text-charcoal-400">
                    <span>Ahora</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                </div>
              </div>

              {/* Botón de Envío Real */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleSendRealWhatsApp}
                  className="w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/30 text-sm sm:text-base transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Abrir y Enviar en WhatsApp Real</span>
                </Button>

                <p className="text-[11px] text-center text-charcoal-500">
                  Al hacer clic se abrirá tu aplicación de WhatsApp con el número y mensaje listos para presionar <b>Enviar</b>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO 2: SIMULADOR DE PANTALLA */}
        {activeTab === 'simulator' && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
            {/* Left Side: Client Selector */}
            <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-100 pr-0 md:pr-4 pb-4 md:pb-0 space-y-3">
              <div>
                <p className="text-xs text-charcoal-600 mb-2 leading-relaxed">
                  Selecciona una clienta para ver cómo recibe sus recordatorios de servicio y encuestas.
                </p>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {clients.map((c) => {
                    const isSelected = c.phone === currentClient?.phone;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedClientPhone(c.phone);
                          setSelectedRating(null);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center space-x-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold shadow-sm'
                            : 'bg-[#FAF8F5] border border-transparent hover:bg-brand-50 text-charcoal-700'
                        }`}
                      >
                        <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div className="flex-1 truncate">
                          <p className="truncate font-semibold">{c.name}</p>
                          <p className="text-[10px] text-charcoal-500">{c.phone}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
                <p className="font-bold flex items-center space-x-1 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Envíos Directos Gratis</span>
                </p>
                <p className="text-emerald-800 leading-tight">
                  Puedes enviar recordatorios ilimitados directamente desde el salón usando el enlace oficial de WhatsApp.
                </p>
              </div>
            </div>

            {/* Right Side: Phone Mockup */}
            <div className="md:col-span-8 flex flex-col bg-[#EFEAE2] rounded-2xl overflow-hidden border border-charcoal-200 shadow-inner max-h-[500px]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{salonName}</h4>
                    <p className="text-[10px] text-emerald-200">En línea</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-white/80">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openWhatsApp(currentClient.phone, clientMessages[clientMessages.length - 1]?.message || `Hola ${currentClient.name}, te escribimos de ${salonName}`)}
                    className="text-[10px] bg-white/20 text-white border-white/30 hover:bg-white/30 h-7 px-2"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Abrir en WhatsApp Real
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[radial-gradient(#d1d7db_1px,transparent_1px)] [background-size:16px_16px]">
                {clientMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col items-start space-y-1">
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-sm max-w-[85%] border border-black/5 text-xs text-charcoal-900">
                      <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                      
                      {msg.type === 'survey' && (
                        <div className="mt-2.5 pt-2 border-t border-charcoal-100">
                          <p className="font-bold text-[10px] text-charcoal-700 mb-1">
                            Toca para calificar:
                          </p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleSurveyReply(star)}
                                className={`p-1 rounded text-[10px] font-bold ${
                                  selectedRating === star ? 'bg-amber-400 text-charcoal-950' : 'bg-gray-100'
                                }`}
                              >
                                {star} ⭐
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between space-x-2 mt-1.5 pt-1 border-t border-charcoal-50 text-[9px] text-charcoal-400">
                        <button
                          onClick={() => openWhatsApp(currentClient.phone, msg.message)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Enviar a WhatsApp Real</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <span>{msg.timestamp}</span>
                          <CheckCheck className="w-3 h-3 text-sky-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessageSimulator} className="bg-[#F0F2F5] p-2 flex items-center space-x-2 border-t border-charcoal-200">
                <input
                  type="text"
                  placeholder={`Escribir mensaje a ${currentClient?.name.split(' ')[0]}...`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 px-3.5 py-1.5 text-xs bg-white rounded-full border border-charcoal-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-sm shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
