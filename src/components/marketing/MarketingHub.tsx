import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Clock, 
  Send, 
  Gift, 
  UserX, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  TrendingUp,
  Percent,
  Power
} from 'lucide-react';
import { MarketingCampaign } from '../../types';

interface MarketingHubProps {
  onOpenWhatsAppSimulator: (clientPhone?: string) => void;
}

export const MarketingHub: React.FC<MarketingHubProps> = ({ onOpenWhatsAppSimulator }) => {
  const { campaigns, toggleCampaign, clients, sendWhatsAppMessage } = useApp();

  // Calculate inactive clients (> 30 days)
  const inactiveClients = clients.filter((c) => c.tags.includes('Inactivo'));
  
  // Calculate clients with birthday soon
  const birthdayClients = clients.filter((c) => c.birthday && c.birthday.includes('-08-'));

  const handleSendQuickCampaign = (campaign: MarketingCampaign) => {
    // Dispatch to target clients
    const targets = campaign.type === 'inactivity_recovery' 
      ? inactiveClients 
      : campaign.type === 'birthday' 
      ? birthdayClients 
      : clients.slice(0, 2);

    targets.forEach((c) => {
      const parsedMessage = campaign.messageTemplate
        .replace('{nombre}', c.name.split(' ')[0])
        .replace('{profesional}', 'su estilista favorita')
        .replace('{link}', 'https://pelu.app/reserva');

      sendWhatsAppMessage(
        c.name,
        c.phone,
        'campaign',
        parsedMessage
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 flex items-center space-x-2">
            <span>Fidelización & Automatizaciones WhatsApp</span>
            <Sparkles className="w-5 h-5 text-brand-500" />
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Automatiza recordatorios de servicios según su ciclo de mantención (14 días uñas, 25 días color), cumpleaños y recuperación de clientes.
          </p>
        </div>

        <button
          onClick={() => onOpenWhatsAppSimulator()}
          className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Abrir Simulador WhatsApp</span>
        </button>
      </div>

      {/* Top Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Campañas Activas</p>
            <h3 className="text-2xl font-bold text-charcoal-900 mt-0.5">
              {campaigns.filter((c) => c.isActive).length} de {campaigns.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <Power className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Tasa de Conversión</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">64.2%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Clientes Reactivadas</p>
            <h3 className="text-2xl font-bold text-charcoal-900 mt-0.5">39 citas este mes</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Automated Campaigns Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-charcoal-900 text-sm uppercase tracking-wider">
          Flujos de Retención Inteligente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`bg-white rounded-3xl border transition-all p-5 shadow-sm flex flex-col justify-between ${
                camp.isActive ? 'border-brand-200 ring-1 ring-brand-100' : 'border-charcoal-200 opacity-60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                      {camp.type === 'birthday' ? (
                        <Gift className="w-4 h-4" />
                      ) : camp.type === 'inactivity_recovery' ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal-950 text-sm">{camp.title}</h4>
                      <span className="text-[11px] text-brand-600 font-medium">
                        {camp.type === 'recurrence'
                          ? `Disparo cada ${camp.daysTrigger} días post-servicio`
                          : camp.type === 'birthday'
                          ? 'Disparo en el mes de cumpleaños'
                          : 'Clientes sin visitas en +45 días'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleCampaign(camp.id)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      camp.isActive ? 'bg-brand-500' : 'bg-charcoal-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        camp.isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Message Template Preview */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-brand-100 text-xs text-charcoal-700 italic">
                  "{camp.messageTemplate}"
                </div>

                {/* Conversion Stats */}
                <div className="flex items-center justify-between mt-3 text-xs text-charcoal-600">
                  <span>
                    Enviados: <strong>{camp.targetCount}</strong>
                  </span>
                  <span>
                    Agendadas: <strong className="text-emerald-700">{camp.convertedCount}</strong> (
                    {Math.round((camp.convertedCount / camp.targetCount) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-500">
                  {camp.isActive ? '🟢 Automatización Activa' : '⚪ En Pausa'}
                </span>
                <button
                  onClick={() => handleSendQuickCampaign(camp)}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Probar Envío Manual</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
