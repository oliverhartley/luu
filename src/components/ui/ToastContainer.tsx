import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-fade-in flex items-start space-x-3 ${
              isSuccess
                ? 'bg-white/95 border-emerald-200 text-charcoal-900 shadow-emerald-500/10'
                : isWarning
                ? 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-500/15'
                : isError
                ? 'bg-red-50/95 border-red-300 text-red-950 shadow-red-500/15'
                : 'bg-white/95 border-brand-200 text-charcoal-900 shadow-brand-500/10'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-brand-600" />}
            </div>
            
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-bold text-charcoal-950">{toast.title}</p>
              {toast.message && (
                <p className="text-charcoal-600 mt-0.5 text-xs leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
