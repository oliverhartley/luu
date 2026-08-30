import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentSalon, deleteAccount } = useApp();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!isOpen || !currentUser) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteAccount();
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={() => !isDeleting && onClose()}
      />

      <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-red-200 animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-full hover:bg-brand-50 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Badge */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shadow-sm shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 text-[10px] uppercase font-bold tracking-wider mb-1">
              Acción Irreversible
            </Badge>
            <h3 className="font-serif font-bold text-xl text-charcoal-950 leading-tight">
              ¿Eliminar Cuenta?
            </h3>
          </div>
        </div>

        {/* Target User Info Card */}
        <div className="p-3.5 bg-red-50/50 rounded-2xl border border-red-100 flex items-center space-x-3 mb-4">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-charcoal-950 truncate">{currentUser.name}</p>
            <p className="text-xs font-semibold text-red-700 truncate">{currentUser.email}</p>
            <p className="text-[11px] text-charcoal-500 truncate mt-0.5">Salón: {currentSalon.name}</p>
          </div>
        </div>

        {/* Explanatory Warnings */}
        <div className="space-y-2 mb-6 text-xs text-charcoal-600 bg-[#FAF7F2] p-3.5 rounded-2xl border border-brand-200/60">
          <p className="font-semibold text-charcoal-800">Al confirmar esta acción sucederá lo siguiente:</p>
          <ul className="list-disc pl-4 space-y-1 text-charcoal-600">
            <li>Tu cuenta <strong className="text-charcoal-900">{currentUser.email}</strong> será eliminada de forma permanente.</li>
            <li>Se desvinculará tu acceso de administrador al salón.</li>
            <li>Se cerrará tu sesión actual de inmediato.</li>
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border-brand-200 hover:bg-brand-50 text-xs font-semibold"
          >
            Cancelar
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Cuenta</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
