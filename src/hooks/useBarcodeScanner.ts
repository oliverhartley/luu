import { useEffect, useRef, useCallback } from 'react';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  enabled?: boolean;
  minChars?: number;
  maxDelayMs?: number;
  soundEnabled?: boolean;
}

/**
 * Hook para detectar pistolas lectoras de código de barras USB/Bluetooth.
 * Las pistolas envían una ráfaga de pulsaciones de teclado a altísima velocidad (< 45ms entre teclas)
 * culminando con la tecla "Enter".
 */
export function useBarcodeScanner({
  onScan,
  enabled = true,
  minChars = 4,
  maxDelayMs = 50,
  soundEnabled = true
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  // Reproduce un agradable "bip" sintético de caja registradora usando Web Audio API
  const playBeep = useCallback((type: 'success' | 'error' = 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // Doble tono armónico dulce de POS boutique
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } else {
        // Tono grave de error/código no encontrado
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      // Ignore audio failure if browser policies block audio before user gesture
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Si el usuario está escribiendo manualmente en un textarea o input de texto normal,
      // no interceptamos la pulsación a menos que venga en ráfaga de escáner.
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      const currentTime = Date.now();
      const elapsed = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Si el tiempo entre teclas supera el umbral, reiniciamos el búfer (escritura humana manual)
      if (elapsed > maxDelayMs && bufferRef.current.length > 0) {
        bufferRef.current = '';
      }

      if (e.key === 'Enter') {
        const scannedCode = bufferRef.current.trim();
        if (scannedCode.length >= minChars) {
          e.preventDefault();
          playBeep('success');
          onScan(scannedCode);
          bufferRef.current = '';
        }
        return;
      }

      // Acumular caracteres imprimibles simples (números, letras, guiones)
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Si el usuario está en un input y escribe despacio (> 50ms), no bloqueamos su escritura
        if (isInput && elapsed > maxDelayMs) {
          bufferRef.current = '';
          return;
        }
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled, minChars, maxDelayMs, onScan, playBeep]);

  const simulateScan = useCallback((code: string) => {
    playBeep('success');
    onScan(code);
  }, [onScan, playBeep]);

  return { playBeep, simulateScan };
}
