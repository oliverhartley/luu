import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Unlock, Sparkles, Scissors, Image as ImageIcon } from 'lucide-react';

interface FormulaEditorModalProps {
  clientId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaEditorModal: React.FC<FormulaEditorModalProps> = ({
  clientId,
  isOpen,
  onClose
}) => {
  const { clients, services, professionals, addClientFormula } = useApp();

  const client = clients.find((c) => c.id === clientId);

  const [formulaType, setFormulaType] = useState<'hair' | 'nails'>('hair');
  const [serviceId, setServiceId] = useState<string>(services[0]?.id || 'serv-1');
  const [professionalId, setProfessionalId] = useState<string>(professionals[0]?.id || 'prof-1');
  const [isPrivate, setIsPrivate] = useState<boolean>(true);

  // Hair Specific Fields
  const [rootFormula, setRootFormula] = useState<string>('45g 7.1 + 15g 8.21 + 5g 0.11');
  const [lengthsFormula, setLengthsFormula] = useState<string>('Dialight 9.02 + Clear con 9 vol (10 min)');
  const [developerVol, setDeveloperVol] = useState<string>('20 Volúmenes (1:1.5)');
  const [processingTimeMinutes, setProcessingTimeMinutes] = useState<number>(35);

  // Nails Specific Fields
  const [baseType, setBaseType] = useState<string>('Rubber Base Nude');
  const [polishBrandAndCode, setPolishBrandAndCode] = useState<string>('OPI Bubble Bath (2 capas) + Chrome');
  const [nailArtDetails, setNailArtDetails] = useState<string>('Diseño francés minimalista');

  const [generalNotes, setGeneralNotes] = useState<string>('Sensibilidad normal, excelente cobertura de canas.');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80');

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedService = services.find((s) => s.id === serviceId);
    const selectedProf = professionals.find((p) => p.id === professionalId);

    if (formulaType === 'hair') {
      addClientFormula(client.id, {
        serviceId,
        serviceName: selectedService?.name || 'Servicio Capilar',
        professionalId,
        professionalName: selectedProf?.name || 'Estilista',
        isPrivate,
        rootFormula,
        lengthsFormula,
        developerVol,
        processingTimeMinutes: Number(processingTimeMinutes),
        generalNotes,
        photos: photoUrl ? [photoUrl] : []
      });
    } else {
      addClientFormula(client.id, {
        serviceId,
        serviceName: selectedService?.name || 'Manicura',
        professionalId,
        professionalName: selectedProf?.name || 'Manicurista',
        isPrivate,
        baseType,
        polishBrandAndCode,
        nailArtDetails,
        generalNotes,
        photos: photoUrl ? [photoUrl] : []
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
              Registrar Ficha Técnica & Receta
            </h3>
            <p className="text-xs text-charcoal-500">
              Cliente: <strong className="text-charcoal-800">{client.name}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Formula Type Toggle */}
          <div className="flex items-center space-x-2 p-1 bg-[#FAF8F5] rounded-2xl border border-brand-200">
            <button
              type="button"
              onClick={() => setFormulaType('hair')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                formulaType === 'hair'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              🎨 Tinte, Color & Capilar
            </button>
            <button
              type="button"
              onClick={() => setFormulaType('nails')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                formulaType === 'nails'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              💅 Manicura & Nail Art
            </button>
          </div>

          {/* Service & Professional assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                Servicio
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                Profesional
              </label>
              <select
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Flag */}
          <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2">
              {isPrivate ? <Lock className="w-4 h-4 text-purple-700" /> : <Unlock className="w-4 h-4 text-charcoal-500" />}
              <div className="text-xs">
                <p className="font-bold text-purple-950">Ficha Confidencial</p>
                <p className="text-[11px] text-purple-700">Solo visible por el estilista creador y el salón.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          {/* Hair Specific Inputs */}
          {formulaType === 'hair' ? (
            <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-brand-100">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Fórmula Raíz / Canas (Gramos y Tonos)
                </label>
                <input
                  type="text"
                  value={rootFormula}
                  onChange={(e) => setRootFormula(e.target.value)}
                  placeholder="Ej. 40g 6.1 + 10g 7.0"
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Fórmula Medios y Puntas / Matiz
                </label>
                <input
                  type="text"
                  value={lengthsFormula}
                  onChange={(e) => setLengthsFormula(e.target.value)}
                  placeholder="Ej. Dialight 9.02 + 9.11"
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Oxidante / Volúmenes
                  </label>
                  <input
                    type="text"
                    value={developerVol}
                    onChange={(e) => setDeveloperVol(e.target.value)}
                    placeholder="20 Vol (1:1.5)"
                    className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Tiempo Exposición (min)
                  </label>
                  <input
                    type="number"
                    value={processingTimeMinutes}
                    onChange={(e) => setProcessingTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-brand-100">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Marca y Código de Esmalte
                </label>
                <input
                  type="text"
                  value={polishBrandAndCode}
                  onChange={(e) => setPolishBrandAndCode(e.target.value)}
                  placeholder="Ej. OPI Funny Bunny (2 capas) + Top Matte"
                  className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Tipo de Base / Nivelación
                  </label>
                  <input
                    type="text"
                    value={baseType}
                    onChange={(e) => setBaseType(e.target.value)}
                    placeholder="Rubber Base Kodi Soft Pink"
                    className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Nail Art / Técnica
                  </label>
                  <input
                    type="text"
                    value={nailArtDetails}
                    onChange={(e) => setNailArtDetails(e.target.value)}
                    placeholder="Efecto Glazed Donut / Cromo"
                    className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes & Photo Link */}
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1">
              Observaciones del Cabello / Uñas
            </label>
            <input
              type="text"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Sensibilidad, porosidad, comportamiento..."
              className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1 flex items-center space-x-1">
              <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
              <span>Foto del Resultado (URL o Mock)</span>
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-charcoal-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-all"
            >
              Guardar en Historial del Cliente
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
