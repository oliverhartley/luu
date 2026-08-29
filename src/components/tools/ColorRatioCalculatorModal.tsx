import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Calculator, 
  Scale, 
  Check, 
  Copy, 
  FileText, 
  Beaker, 
  Flame, 
  Droplet 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

interface ColorRatioCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFormula?: (formulaString: string) => void;
}

export const ColorRatioCalculatorModal: React.FC<ColorRatioCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyFormula
}) => {
  const { showToast } = useApp();

  const [ratio, setRatio] = useState<'1:1' | '1:1.5' | '1:2'>('1:1.5');
  const [baseDyeName, setBaseDyeName] = useState<string>('7.1 Rubio Ceniza');
  const [baseDyeGrams, setBaseDyeGrams] = useState<number>(40);
  
  const [hasSecondary, setHasSecondary] = useState<boolean>(true);
  const [secondaryDyeName, setSecondaryDyeName] = useState<string>('8.21 Irisé Ceniza');
  const [secondaryDyeGrams, setSecondaryDyeGrams] = useState<number>(15);

  const [developerVol, setDeveloperVol] = useState<'10' | '20' | '30' | '40'>('20');
  const [processingTime, setProcessingTime] = useState<number>(35);

  if (!isOpen) return null;

  const totalDyeGrams = baseDyeGrams + (hasSecondary ? secondaryDyeGrams : 0);

  // Calculate developer required based on ratio multiplier
  const multiplier = ratio === '1:1' ? 1.0 : ratio === '1:1.5' ? 1.5 : 2.0;
  const developerGramsRequired = Math.round(totalDyeGrams * multiplier);
  const totalMixtureBowlGrams = totalDyeGrams + developerGramsRequired;

  const fullFormulaString = `${baseDyeGrams}g [${baseDyeName}]${hasSecondary ? ` + ${secondaryDyeGrams}g [${secondaryDyeName}]` : ''} + ${developerGramsRequired}g Ox ${developerVol} Vol (Ratio ${ratio}) · ${processingTime} min`;

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(fullFormulaString);
    showToast('Fórmula Copiada al Portapapeles', fullFormulaString, 'success');
  };

  const handleSaveToClient = () => {
    if (onApplyFormula) {
      onApplyFormula(fullFormulaString);
    }
    handleCopyFormula();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-roseGold text-white flex items-center justify-center shadow-md shadow-brand-500/25">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                Báscula Digital & Calculadora de Color
              </h3>
              <Badge variant="luxury">v2.0 Pro</Badge>
            </div>
            <p className="text-xs text-charcoal-500">
              Calcula proporciones exactas de oxidante y tintes según ratio técnico.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* Ratio Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
              1. Selecciona Ratio de Mezcla
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1:1', label: '1 : 1', desc: 'Cobertura Canas / Matiz' },
                { id: '1:1.5', label: '1 : 1.5', desc: 'Estándar L\'Oréal / Majirel' },
                { id: '1:2', label: '1 : 2', desc: 'Superaclarantes / Deco' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRatio(r.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    ratio === r.id
                      ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20 font-bold'
                      : 'bg-[#FAF8F5] border-brand-200 text-charcoal-700 hover:bg-brand-50'
                  }`}
                >
                  <span className="block text-base">{r.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${ratio === r.id ? 'text-white/80' : 'text-charcoal-500'}`}>
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dyes Inputs */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/80 space-y-3">
            <label className="block text-xs font-bold text-charcoal-800">
              2. Tintes en el Bowl / Pocillo
            </label>

            {/* Base Dye */}
            <div className="grid grid-cols-3 gap-3 items-center">
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-charcoal-500 mb-1">Tono Base / Tinte 1</label>
                <Input
                  type="text"
                  value={baseDyeName}
                  onChange={(e) => setBaseDyeName(e.target.value)}
                  placeholder="Ej. 7.1 Rubio Ceniza"
                  className="bg-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-charcoal-500 mb-1">Gramos (g)</label>
                <Input
                  type="number"
                  min="1"
                  value={baseDyeGrams}
                  onChange={(e) => setBaseDyeGrams(Number(e.target.value))}
                  className="bg-white text-xs font-bold text-brand-900"
                />
              </div>
            </div>

            {/* Secondary Dye */}
            {hasSecondary ? (
              <div className="grid grid-cols-3 gap-3 items-center pt-2 border-t border-brand-200/50">
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-semibold text-charcoal-500">Matiz / Tinte 2 (Reflejo)</label>
                    <button
                      type="button"
                      onClick={() => setHasSecondary(false)}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                  <Input
                    type="text"
                    value={secondaryDyeName}
                    onChange={(e) => setSecondaryDyeName(e.target.value)}
                    placeholder="Ej. 8.21 Irisé"
                    className="bg-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-charcoal-500 mb-1">Gramos (g)</label>
                  <Input
                    type="number"
                    min="0"
                    value={secondaryDyeGrams}
                    onChange={(e) => setSecondaryDyeGrams(Number(e.target.value))}
                    className="bg-white text-xs font-bold text-brand-900"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setHasSecondary(true)}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                + Agregar segundo tono / matiz
              </button>
            )}
          </div>

          {/* Developer & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1.5">
                3. Volúmenes de Oxidante
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['10', '20', '30', '40'] as const).map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setDeveloperVol(vol)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      developerVol === vol
                        ? 'bg-charcoal-900 text-white border-charcoal-900'
                        : 'bg-white text-charcoal-700 border-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    {vol}V
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1.5">
                Tiempo Exposición (min)
              </label>
              <Input
                type="number"
                min="5"
                step="5"
                value={processingTime}
                onChange={(e) => setProcessingTime(Number(e.target.value))}
                className="bg-white text-xs font-bold"
              />
            </div>
          </div>

          {/* Digital Scale Output Box */}
          <div className="bg-charcoal-950 text-white p-5 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-charcoal-400">
              <span className="flex items-center space-x-1.5">
                <Beaker className="w-4 h-4 text-brand-400" />
                <span>Resultado Báscula Digital</span>
              </span>
              <Badge variant="luxury">Ratio {ratio}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center py-2 border-y border-charcoal-800">
              <div>
                <span className="text-[10px] text-charcoal-400 uppercase">Tinte Total</span>
                <p className="text-lg font-bold text-white mt-0.5">{totalDyeGrams} g</p>
              </div>
              <div className="border-x border-charcoal-800">
                <span className="text-[10px] text-brand-300 uppercase font-bold">Oxidante {developerVol}V</span>
                <p className="text-xl font-bold text-brand-400 mt-0.5">+{developerGramsRequired} g</p>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-400 uppercase">Peso Total Bowl</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{totalMixtureBowlGrams} g</p>
              </div>
            </div>

            <p className="text-xs text-charcoal-300 font-mono italic truncate">
              {fullFormulaString}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCopyFormula}>
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copiar Fórmula
            </Button>
            <Button variant="luxury" size="sm" onClick={handleSaveToClient}>
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Usar Fórmula
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
