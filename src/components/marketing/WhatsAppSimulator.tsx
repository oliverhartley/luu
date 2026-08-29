import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  Video,
  MoreVertical,
  Scissors
} from 'lucide-react';
import { WhatsAppMessageSimulation } from '../../types';

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
    sendWhatsAppMessage, 
    submitSurveyFeedback 
  } = useApp();

  const [selectedClientPhone, setSelectedClientPhone] = useState<string>(() => {
    return targetClientPhone || clients[0]?.phone || '';
  });

  const [typedMessage, setTypedMessage] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [surveyComment, setSurveyComment] = useState<string>('');

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.phone === selectedClientPhone) || clients[0];
  
  // Filter messages for current client
  const clientMessages = whatsAppLogs.filter(
    (m) => m.toPhone === currentClient?.phone || m.toName === currentClient?.name
  );

  const handleSendMessage = (e: React.FormEvent) => {
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
    // Find latest completed appointment for this client
    const apt = appointments.find((a) => a.clientPhone === currentClient.phone && a.status === 'completed');
    if (apt) {
      submitSurveyFeedback(apt.id, rating, surveyComment || (rating >= 4 ? '¡Me encantó el servicio!' : 'Tuve un inconveniente con el tono/duración'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-4xl w-full p-4 sm:p-6 relative my-6 flex flex-col md:flex-row gap-6 max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Client Selector & Automation Explanation */}
        <div className="w-full md:w-80 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-100 pr-0 md:pr-4 pb-4 md:pb-0">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal-950">WhatsApp Hub</h3>
                <p className="text-[11px] text-charcoal-500">Simulador de Conversaciones</p>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 mb-3 leading-relaxed">
              Selecciona una clienta para ver cómo recibe sus recordatorios de servicio, check-in en recepción y encuestas post-atención.
            </p>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {clients.map((c) => {
                const isSelected = c.phone === currentClient?.phone;
                const hasUnread = whatsAppLogs.some((l) => l.toPhone === c.phone);
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
                    {hasUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
            <p className="font-bold flex items-center space-x-1 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>GCP & WhatsApp Cloud API</span>
            </p>
            <p className="text-emerald-800 leading-tight">
              En producción se conecta automáticamente a la API Cloud de Meta para enviar sin costo mensual las primeras 1.000 conversaciones.
            </p>
          </div>
        </div>

        {/* Right Side: WhatsApp Interactive Phone Mockup */}
        <div className="flex-1 flex flex-col bg-[#EFEAE2] rounded-2xl overflow-hidden border border-charcoal-200 shadow-inner max-h-[560px]">
          
          {/* WhatsApp Header Bar */}
          <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white font-bold text-sm shadow-sm">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Pelu Studio Vitacura</h4>
                <p className="text-[10px] text-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Cuenta Comercial Verificada</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-white/80">
              <Phone className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <MoreVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[radial-gradient(#d1d7db_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* System Encryption Notice */}
            <div className="text-center">
              <span className="inline-block bg-[#FFEECD] text-[#54656F] text-[10px] px-2.5 py-1 rounded-lg shadow-sm">
                🔒 Los mensajes están cifrados de extremo a extremo.
              </span>
            </div>

            {/* Conversation Messages */}
            {clientMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col items-start space-y-1">
                
                {/* Outgoing Message Bubble from Salon */}
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[75%] border border-black/5 text-xs text-charcoal-900">
                  <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                  
                  {/* Interactive Survey Widget if this is a satisfaction survey */}
                  {msg.type === 'survey' && (
                    <div className="mt-3 pt-2.5 border-t border-charcoal-100">
                      <p className="font-bold text-[11px] text-charcoal-700 mb-1.5">
                        Toca una calificación para responder:
                      </p>
                      <div className="flex items-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleSurveyReply(star)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-0.5 ${
                              selectedRating === star
                                ? 'bg-amber-400 text-charcoal-950 scale-110 shadow-sm'
                                : 'bg-gray-100 hover:bg-amber-100 text-charcoal-700'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${selectedRating && selectedRating >= star ? 'fill-amber-500 text-amber-500' : 'text-charcoal-400'}`} />
                            <span>{star}</span>
                          </button>
                        ))}
                      </div>

                      {selectedRating && (
                        <div className="mt-2.5 p-2 rounded-xl text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-950 animate-fade-in">
                          {selectedRating >= 4 ? (
                            <p className="font-semibold text-emerald-800">
                              ⭐ ¡Gracias por tu calificación de {selectedRating} estrellas! Tu opinión nos alegra el día.
                            </p>
                          ) : (
                            <div className="text-amber-900">
                              <p className="font-bold flex items-center space-x-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Alerta de Rectificación Activada</span>
                              </p>
                              <p className="text-[10px] text-amber-800 mt-0.5">
                                El salón fue notificado para contactarte de inmediato y ofrecerte una solución.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-charcoal-400">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3 h-3 text-sky-500" />
                  </div>
                </div>

              </div>
            ))}

          </div>

          {/* WhatsApp Typing Bar */}
          <form onSubmit={handleSendMessage} className="bg-[#F0F2F5] p-2 flex items-center space-x-2 border-t border-charcoal-200">
            <input
              type="text"
              placeholder={`Escribir mensaje personalizado a ${currentClient?.name.split(' ')[0]}...`}
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white rounded-full border border-charcoal-200 focus:outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#00A884] hover:bg-[#008f70] text-white flex items-center justify-center shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
