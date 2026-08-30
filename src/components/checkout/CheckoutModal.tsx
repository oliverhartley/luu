import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Sparkles, 
  Camera, 
  Plus, 
  FileText, 
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Appointment } from '../../types';

interface CheckoutModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  appointment,
  isOpen,
  onClose
}) => {
  const { checkoutAppointment, inventory, addClientFormula, processProductSale } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'transfer' | 'cash'>('credit');
  const [discount, setDiscount] = useState<number>(0);
  const [tip, setTip] = useState<number>(3000);
  const [selectedExtraProduct, setSelectedExtraProduct] = useState<string>('');
  const [extraProductPrice, setExtraProductPrice] = useState<number>(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80');
  const [quickFormulaNotes, setQuickFormulaNotes] = useState<string>('Tinte 45g 7.1 + 15g 8.21 con 20 vol');
  const [saveFormulaToProfile, setSaveFormulaToProfile] = useState<boolean>(true);

  if (!isOpen || !appointment) return null;

  const baseServicesSubtotal = appointment.items.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = Math.max(0, baseServicesSubtotal + extraProductPrice - discount + tip);

  const handleProductSelect = (prodId: string) => {
    setSelectedExtraProduct(prodId);
    const prod = inventory.find((p) => p.id === prodId);
    if (prod && prod.salePrice) {
      setExtraProductPrice(prod.salePrice);
    } else {
      setExtraProductPrice(0);
    }
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const completedAt = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Optionally save formula
    if (saveFormulaToProfile && quickFormulaNotes.trim()) {
      const primaryItem = appointment.items[0];
      addClientFormula(appointment.clientId, {
        serviceId: primaryItem.serviceId,
        serviceName: primaryItem.serviceName,
        professionalId: primaryItem.professionalId,
        professionalName: primaryItem.professionalName,
        isPrivate: true,
        rootFormula: quickFormulaNotes,
        generalNotes: `Registrado en cobro de atención del ${appointment.date}`,
        photos: uploadedPhoto ? [uploadedPhoto] : []
      });
    }

    // Si se seleccionó un producto de retail adicional, descontar de inventario y registrar venta
    if (selectedExtraProduct) {
      const extraProd = inventory.find((p) => p.id === selectedExtraProduct);
      if (extraProd) {
        processProductSale({
          items: [
            {
              productId: extraProd.id,
              productName: extraProd.name,
              brand: extraProd.brand,
              quantity: 1,
              unitPrice: extraProd.salePrice || extraProductPrice,
              subtotal: extraProd.salePrice || extraProductPrice,
              barcode: extraProd.barcode,
              imageUrl: extraProd.imageUrl
            }
          ],
          subtotal: extraProductPrice,
          discount: 0,
          total: extraProductPrice,
          paymentMethod,
          clientId: appointment.clientId,
          clientName: appointment.clientName,
          professionalId: appointment.items[0]?.professionalId,
          professionalName: appointment.items[0]?.professionalName,
          notes: `Venta adicional en atención #${appointment.id}`
        });
      }
    }

    checkoutAppointment(appointment.id, {
      paymentMethod,
      subtotal: baseServicesSubtotal + extraProductPrice,
      discount,
      tip,
      total: finalTotal,
      completedAt,
      uploadedPhoto: uploadedPhoto || undefined,
      technicalNotes: quickFormulaNotes || undefined,
      surveySent: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-charcoal-900 text-brand-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
              Punto de Cobro & Cierre de Atención
            </h3>
            <p className="text-xs text-charcoal-500">
              Cliente: <strong className="text-charcoal-900">{appointment.clientName}</strong> · {appointment.items.length} servicios realizados
            </p>
          </div>
        </div>

        <form onSubmit={handleCompleteCheckout} className="space-y-5">
          
          {/* Services Breakdown */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200/70">
            <p className="text-[10px] uppercase font-bold text-charcoal-500 mb-2">
              Servicios Realizados
            </p>
            <div className="space-y-2">
              {appointment.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-charcoal-800">{item.serviceName}</span>
                    <span className="text-charcoal-500 block text-[11px]">con {item.professionalName}</span>
                  </div>
                  <span className="font-bold text-charcoal-900">${item.price.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Retail Product / Add-on */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                + Venta de Producto / Adicional
              </label>
              <select
                value={selectedExtraProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
              >
                <option value="">Ninguno</option>
                {inventory.filter((p) => p.salePrice).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (+${p.salePrice?.toLocaleString('es-CL')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Descuento / Cupón ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Tip & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Propina para el Personal ($)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl font-bold text-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'credit', label: 'Crédito', icon: CreditCard },
                  { id: 'debit', label: 'Débito', icon: CreditCard },
                  { id: 'transfer', label: 'Transfer.', icon: Smartphone },
                  { id: 'cash', label: 'Efectivo', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'bg-white text-charcoal-700 border-brand-200 hover:bg-brand-50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Technical Formula & Photo Capture */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-brand-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-charcoal-800 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span>Registrar Receta / Color Usado Hoy</span>
              </label>
              <label className="flex items-center space-x-1 text-xs text-brand-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveFormulaToProfile}
                  onChange={(e) => setSaveFormulaToProfile(e.target.checked)}
                  className="w-3.5 h-3.5 text-brand-600 rounded"
                />
                <span>Guardar en Ficha</span>
              </label>
            </div>
            
            <input
              type="text"
              value={quickFormulaNotes}
              onChange={(e) => setQuickFormulaNotes(e.target.value)}
              placeholder="Ej. Tinte 45g 7.1 + 15g 8.21 con 20 vol"
              className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl font-mono text-charcoal-900"
            />

            <div>
              <label className="block text-[11px] font-bold text-charcoal-600 mb-1 flex items-center space-x-1">
                <Camera className="w-3 h-3 text-brand-600" />
                <span>Foto del Resultado Final (Opcional)</span>
              </label>
              <input
                type="text"
                value={uploadedPhoto}
                onChange={(e) => setUploadedPhoto(e.target.value)}
                placeholder="URL de foto o mockup"
                className="w-full px-3 py-1.5 text-xs bg-white border border-brand-200 rounded-xl"
              />
            </div>
          </div>

          {/* WhatsApp Survey Notification Banner */}
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-start space-x-2.5">
            <MessageSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-xs text-emerald-950">
              <p className="font-bold">Disparo Automático de Encuesta de Satisfacción</p>
              <p className="text-[11px] text-emerald-800">
                Al confirmar, se enviará un mensaje de WhatsApp a {appointment.clientName} para calificar su experiencia de 1 a 5 ⭐.
              </p>
            </div>
          </div>

          {/* Total & Action */}
          <div className="bg-charcoal-950 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-charcoal-400 block">Total Final a Cobrar</span>
              <span className="text-2xl font-bold text-white tracking-tight">
                ${finalTotal.toLocaleString('es-CL')}
              </span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalizar & Enviar Encuesta</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
