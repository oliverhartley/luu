import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Palette, 
  Check, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Building2, 
  SlidersHorizontal,
  Cloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LOGO_STYLES, 
  LOGO_SYMBOLS, 
  LOGO_PALETTES, 
  GeneratedLogo, 
  generateLogosWithAI,
  purgeAiStudioTokens
} from '../../lib/aiLogoGenerator';

interface AILogoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AILogoStudioModal: React.FC<AILogoStudioModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentSalon, updateSalonInfo, showToast } = useApp();

  // Configuration form state
  const [salonName, setSalonName] = useState<string>(currentSalon?.name || 'Pelu OBi');
  const [slogan, setSlogan] = useState<string>(currentSalon?.slogan || 'Hair & Beauty Atelier');
  const [selectedStyleId, setSelectedStyleId] = useState<string>(LOGO_STYLES[0].id);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>(LOGO_SYMBOLS[0].id);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(LOGO_PALETTES[0].id);
  const [customDetails, setCustomDetails] = useState<string>('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<GeneratedLogo | null>(null);
  const [mockupTab, setMockupTab] = useState<'card' | 'store' | 'whatsapp'>('card');

  // Purge any legacy AI Studio token on mount and trigger initial generation
  useEffect(() => {
    if (isOpen) {
      purgeAiStudioTokens();
      const currentName = currentSalon?.name || 'Pelu OBi';
      const currentSlogan = currentSalon?.slogan || 'Hair & Beauty Atelier';
      setSalonName(currentName);
      setSlogan(currentSlogan);

      handleGenerate(currentName, currentSlogan);
    }
  }, [isOpen, currentSalon]);

  if (!isOpen) return null;

  const handleGenerate = async (overrideName?: string, overrideSlogan?: string) => {
    setIsGenerating(true);

    try {
      const res = await generateLogosWithAI({
        salonName: overrideName || salonName,
        slogan: overrideSlogan || slogan,
        styleId: selectedStyleId,
        symbolId: selectedSymbolId,
        paletteId: selectedPaletteId,
        customDetails
      });

      if (res.success && res.logos.length > 0) {
        setGeneratedLogos(res.logos);
        setSelectedLogo(res.logos[0]);
      }
    } catch (err: any) {
      console.error('[GCP Logo Studio] Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyLogo = () => {
    if (!selectedLogo) return;

    updateSalonInfo({
      logo: selectedLogo.url,
      name: salonName.trim() || currentSalon.name,
      slogan: slogan.trim() || currentSalon.slogan
    });

    showToast(
      'Logo Oficial Actualizado',
      `La nueva identidad visual de ${salonName} ha sido guardada en Cloud Firestore.`,
      'success'
    );
    onClose();
  };

  const handleDownloadLogo = () => {
    if (!selectedLogo) return;

    // Convert SVG Data URI to a high-res PNG for download
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 1200, 1200);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `logo-${salonName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = pngUrl;
        link.click();
      }
    };
    img.src = selectedLogo.url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-charcoal-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 bg-[#FCFAF8] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-200 overflow-hidden animate-scale-up">
        
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-brand-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-roseGold flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-950">
                  Estudio de Logo & Identidad con IA
                </h2>
                <Badge variant="luxury" className="bg-brand-50 text-brand-800 border-brand-200 text-[10px]">
                  Google Cloud Generative Studio
                </Badge>
              </div>
              <p className="text-xs text-charcoal-500">
                Genera la identidad gráfica y monograma oficial para tu salón con Google Cloud Platform.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* GCP Cloud Active Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>GCP Activo</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout (2 columns) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Brand Studio Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Basic Info */}
            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                <span>1. Datos del Salón</span>
              </h3>
              
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Nombre de Marca
                  </label>
                  <input
                    type="text"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="Ej: Luu Studio, Pelu OBi..."
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Eslogan o Subtítulo
                  </label>
                  <input
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="Ej: Colorimetría de Autor & Spa"
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Aesthetic Style Selector */}
            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                <Palette className="w-3.5 h-3.5 text-brand-600" />
                <span>2. Estilo Visual de Marca</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LOGO_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyleId(style.id);
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all relative ${
                      selectedStyleId === style.id
                        ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                        : 'border-brand-100 hover:border-brand-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-charcoal-900">{style.name}</span>
                      {selectedStyleId === style.id && (
                        <Check className="w-3.5 h-3.5 text-brand-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-charcoal-500 mt-1 line-clamp-2 leading-tight">
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Iconic Element */}
            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>3. Símbolo o Isotipo Principal</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {LOGO_SYMBOLS.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => {
                      setSelectedSymbolId(sym.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSymbolId === sym.id
                        ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                        : 'bg-[#FAF8F5] text-charcoal-700 border-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    {sym.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal-600 flex items-center space-x-2">
                <Palette className="w-3.5 h-3.5 text-brand-600" />
                <span>4. Paleta de Color de Marca</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LOGO_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => {
                      setSelectedPaletteId(pal.id);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      selectedPaletteId === pal.id
                        ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                        : 'border-brand-100 bg-white hover:border-brand-200'
                    }`}
                  >
                    <span className="text-xs font-semibold text-charcoal-800">{pal.name}</span>
                    <div className="flex items-center -space-x-1">
                      {pal.colors.map((c, i) => (
                        <span 
                          key={i} 
                          className="w-4 h-4 rounded-full border border-white shadow-2xs" 
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action button: Generate */}
            <Button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 text-sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Diseñando propuestas con GCP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generar 4 Propuestas de Logo</span>
                </>
              )}
            </Button>
          </div>

          {/* RIGHT COLUMN: Gallery & Live Mockups (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Generated Options Grid */}
            <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-charcoal-900 text-sm flex items-center space-x-2">
                    <span>Propuestas Diseñadas</span>
                    <Badge variant="luxury" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                      GCP Cloud AI
                    </Badge>
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Haz clic en una opción para seleccionarla y previsualizarla en maquetas reales.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerar
                </Button>
              </div>

              {/* 4 Cards Grid with Base64 Vector SVGs */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {isGenerating ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-square rounded-2xl bg-brand-50/70 animate-pulse flex flex-col items-center justify-center p-4 border border-brand-100 text-center space-y-2"
                    >
                      <Sparkles className="w-6 h-6 text-brand-300 animate-spin" />
                      <span className="text-[11px] font-semibold text-brand-600">Diseñando propuesta {idx + 1}...</span>
                    </div>
                  ))
                ) : (
                  generatedLogos.map((logo, idx) => {
                    const isSelected = selectedLogo?.id === logo.id;
                    return (
                      <div
                        key={logo.id}
                        onClick={() => setSelectedLogo(logo)}
                        className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative group bg-white shadow-sm flex items-center justify-center p-3 ${
                          isSelected
                            ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-md scale-[1.02]'
                            : 'border-brand-100 hover:border-brand-300 hover:shadow-md'
                        }`}
                      >
                        <img
                          src={logo.url}
                          alt={`Propuesta de Logo ${idx + 1}`}
                          className="w-full h-full object-contain rounded-xl"
                        />

                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 bg-charcoal-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
                          {logo.title || `Opción ${idx + 1}`}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Real Mockup Preview Box */}
            <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-brand-600" />
                  <h3 className="font-bold text-charcoal-900 text-sm">
                    Previsualización en Maqueta Real
                  </h3>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-xl border border-brand-100 text-xs">
                  <button
                    onClick={() => setMockupTab('card')}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition-all ${
                      mockupTab === 'card'
                        ? 'bg-white text-charcoal-900 shadow-2xs'
                        : 'text-charcoal-500 hover:text-charcoal-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Beauty Pass</span>
                  </button>
                  <button
                    onClick={() => setMockupTab('store')}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition-all ${
                      mockupTab === 'store'
                        ? 'bg-white text-charcoal-900 shadow-2xs'
                        : 'text-charcoal-500 hover:text-charcoal-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Fachada</span>
                  </button>
                  <button
                    onClick={() => setMockupTab('whatsapp')}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition-all ${
                      mockupTab === 'whatsapp'
                        ? 'bg-white text-charcoal-900 shadow-2xs'
                        : 'text-charcoal-500 hover:text-charcoal-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div className="min-h-[200px] flex items-center justify-center p-4 bg-[#FAF7F2] rounded-2xl border border-brand-100">
                {selectedLogo ? (
                  <>
                    {/* Mockup 1: Beauty Pass Card */}
                    {mockupTab === 'card' && (
                      <div className="w-full max-w-sm rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-brand-950 border border-white/20 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden shadow-sm flex items-center justify-center">
                              <img src={selectedLogo.url} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-sm text-white tracking-wide">{salonName}</p>
                              <p className="text-[10px] text-brand-200">{slogan}</p>
                            </div>
                          </div>
                          <Badge variant="luxury" className="bg-white/20 text-white text-[9px]">VIP Member</Badge>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-brand-100 font-mono">
                          <span>Valentina Silva</span>
                          <span>1.450 Pts</span>
                        </div>
                      </div>
                    )}

                    {/* Mockup 2: Salon Store Signboard */}
                    {mockupTab === 'store' && (
                      <div className="w-full max-w-sm rounded-2xl p-6 bg-[#161618] border-2 border-brand-300/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center border border-white/20">
                          <img src={selectedLogo.url} alt="Logo Store" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xl font-bold tracking-widest text-white uppercase">
                            {salonName}
                          </h4>
                          <p className="text-[10px] font-sans text-brand-300 tracking-wider mt-1 uppercase">
                            {slogan}
                          </p>
                        </div>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent mt-2" />
                      </div>
                    )}

                    {/* Mockup 3: WhatsApp Notification Profile */}
                    {mockupTab === 'whatsapp' && (
                      <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-md border border-emerald-100 flex items-center space-x-3 animate-fade-in">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm flex items-center justify-center bg-[#FAF8F5] p-1 flex-shrink-0">
                          <img src={selectedLogo.url} alt="Avatar" className="w-full h-full object-contain rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-charcoal-900 truncate">{salonName}</h4>
                            <span className="text-[10px] text-emerald-600 font-bold">12:30</span>
                          </div>
                          <p className="text-[11px] text-charcoal-600 truncate mt-0.5">
                            ✨ ¡Hola Camila! Tu cita para Balayage está confirmada...
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-charcoal-400">Genera o selecciona una propuesta para previsualizar.</p>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <Button
                  variant="outline"
                  onClick={handleDownloadLogo}
                  disabled={!selectedLogo}
                  className="w-full sm:w-auto text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Descargar PNG (1200x1200)
                </Button>

                <Button
                  onClick={handleApplyLogo}
                  disabled={!selectedLogo}
                  className="w-full sm:w-auto text-xs font-bold bg-charcoal-900 hover:bg-charcoal-950 text-white shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Establecer como Logo Oficial del Salón
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
