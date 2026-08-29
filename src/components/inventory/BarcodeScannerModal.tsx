import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { 
  X, 
  Barcode, 
  Camera, 
  Sparkles, 
  Zap, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle,
  Play
} from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string) => void;
  title?: string;
  subtitle?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onBarcodeDetected,
  title = 'Lector de Código de Barras',
  subtitle = 'Apunta tu pistola lectora o utiliza el simulador rápido'
}) => {
  const { inventory } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [lastScanned, setLastScanned] = useState<{ code: string; name?: string; found: boolean } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { playBeep, simulateScan } = useBarcodeScanner({
    enabled: isOpen,
    soundEnabled: !soundMuted,
    onScan: (code) => {
      handleCodeReceived(code);
    }
  });

  const handleCodeReceived = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    const matched = inventory.find(
      (p) => (p.barcode && p.barcode.toLowerCase() === trimmed.toLowerCase()) ||
             (p.sku && p.sku.toLowerCase() === trimmed.toLowerCase())
    );

    setLastScanned({
      code: trimmed,
      name: matched ? matched.name : undefined,
      found: !!matched
    });

    onBarcodeDetected(trimmed);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    simulateScan(manualCode.trim());
    setManualCode('');
  };

  // Manejo de Cámara Web
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useCamera && isOpen) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraError(null);
        })
        .catch((err) => {
          setCameraError('No se pudo acceder a la cámara o no hay permisos concedidos.');
          setUseCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useCamera, isOpen]);

  if (!isOpen) return null;

  const sampleProducts = [
    { name: 'Moroccanoil 100ml', code: '7801234567890', brand: 'Moroccanoil' },
    { name: 'Kérastase Bain Satin', code: '7804561237894', brand: 'Kérastase' },
    { name: 'Olaplex Nº 3', code: '7809876543210', brand: 'Olaplex' },
    { name: 'Mascarilla Quinoa Gold', code: '7806549873215', brand: "L'Oréal" },
    { name: 'Producto Nuevo (No registrado)', code: '7809988776655', brand: 'Desconocido' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-lg w-full p-6 sm:p-7 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-charcoal-900 text-brand-400 flex items-center justify-center shadow-md">
            <Barcode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-950">
              {title}
            </h3>
            <p className="text-xs text-charcoal-500">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Laser Scanner Visual Target */}
        <div className="relative bg-charcoal-950 rounded-2xl p-6 mb-5 overflow-hidden text-center text-white border border-charcoal-800 shadow-inner">
          
          {useCamera ? (
            <div className="relative h-48 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-48 h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center relative">
              {/* Animated laser red line */}
              <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-red-500 shadow-[0_0_15px_#ff0000] animate-pulse"></div>
              
              <div className="font-mono text-charcoal-600 select-none text-5xl tracking-widest opacity-40 mb-2">
                |||||| | |||| ||
              </div>
              <div className="relative z-10 bg-charcoal-900/90 px-4 py-1.5 rounded-full border border-charcoal-700 text-xs font-bold text-brand-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Esperando disparo de pistola USB / Bluetooth...</span>
              </div>
            </div>
          )}

          {/* Sound Mute and Camera toggle bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal-800/80 text-[11px]">
            <button
              onClick={() => setUseCamera(!useCamera)}
              className="text-charcoal-400 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{useCamera ? 'Apagar cámara' : 'Escanear con cámara web'}</span>
            </button>
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="text-charcoal-400 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{soundMuted ? 'Sonido silenciado' : 'Bip activado'}</span>
            </button>
          </div>

          {cameraError && (
            <p className="text-[11px] text-red-400 mt-2">{cameraError}</p>
          )}
        </div>

        {/* Last scanned feedback banner */}
        {lastScanned && (
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2.5 ${
            lastScanned.found 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}>
            {lastScanned.found ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">
                {lastScanned.found ? `Encontrado: ${lastScanned.name}` : `Código: ${lastScanned.code}`}
              </p>
              <p className="text-[11px] opacity-80">
                {lastScanned.found ? `Código verificado (${lastScanned.code})` : 'No está en el catálogo. Se abrirá el asistente IA para darlo de alta.'}
              </p>
            </div>
          </div>
        )}

        {/* Manual Barcode Input */}
        <form onSubmit={handleManualSubmit} className="mb-5">
          <label className="block text-xs font-bold text-charcoal-700 mb-1">
            O escribe / pega el código manualmente:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ej: 7801234567890"
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl shadow-sm transition-all"
            >
              Procesar
            </button>
          </div>
        </form>

        {/* Simulator Buttons */}
        <div className="pt-3 border-t border-brand-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-charcoal-700 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulador de Pistola (Prueba rápida):</span>
            </span>
            <span className="text-[10px] text-charcoal-400">Clic para simular escaneo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleProducts.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => simulateScan(p.code)}
                className="text-left px-3 py-2 rounded-xl bg-brand-50/60 hover:bg-brand-100 border border-brand-200/80 transition-all flex items-center justify-between group active:scale-95"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-charcoal-900 truncate group-hover:text-brand-900">
                    {p.name}
                  </p>
                  <p className="text-[10px] font-mono text-charcoal-500">
                    {p.code}
                  </p>
                </div>
                <Play className="w-3 h-3 text-brand-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
