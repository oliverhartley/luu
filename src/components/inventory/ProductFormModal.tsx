import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryProduct } from '../../types';
import { enrichProductWithAI } from '../../lib/aiProductAgent';
import { 
  X, 
  Sparkles, 
  Barcode, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Image as ImageIcon,
  Check,
  RefreshCw,
  Tag,
  Layers
} from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: InventoryProduct | null;
  initialBarcode?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  initialBarcode
}) => {
  const { addProduct, updateProduct, showToast } = useApp();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<InventoryProduct['category']>('retail');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [isForSale, setIsForSale] = useState(true);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(3);
  const [unit, setUnit] = useState('unidades');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessBadge, setAiSuccessBadge] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setBarcode(productToEdit.barcode || '');
      setSku(productToEdit.sku || '');
      setIsForSale(productToEdit.isForSale ?? true);
      setCostPrice(productToEdit.costPrice || 0);
      setSalePrice(productToEdit.salePrice || 0);
      setCurrentStock(productToEdit.currentStock);
      setMinStockAlert(productToEdit.minStockAlert);
      setUnit(productToEdit.unit || 'unidades');
      setDescription(productToEdit.description || '');
      setFeatures(productToEdit.features || []);
      setImageUrl(productToEdit.imageUrl || '');
    } else {
      setName('');
      setBrand('');
      setCategory('retail');
      setBarcode(initialBarcode || '');
      setSku(initialBarcode ? `SKU-${initialBarcode.slice(-6)}` : '');
      setIsForSale(true);
      setCostPrice(0);
      setSalePrice(0);
      setCurrentStock(10);
      setMinStockAlert(3);
      setUnit('unidades');
      setDescription('');
      setFeatures([]);
      setImageUrl('');
    }
    setAiSuccessBadge(false);
  }, [productToEdit, initialBarcode, isOpen]);

  if (!isOpen) return null;

  const handleGenerateBarcode = () => {
    // Generar un código EAN-13 válido simulado (prefijo 780 para Chile)
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const generated = `780${randomDigits}`;
    setBarcode(generated);
    if (!sku) {
      setSku(`SKU-${randomDigits.slice(-5)}`);
    }
  };

  const handleEnrichWithAI = async () => {
    if (!name.trim() && !barcode.trim() && !brand.trim()) {
      showToast('Ingresa un dato previo', 'Escribe el nombre del producto, marca o ingresa el código para que la IA lo identifique.', 'warning');
      return;
    }

    setIsAiLoading(true);
    try {
      const enriched = await enrichProductWithAI({
        barcode,
        name,
        brand,
        category,
        costPrice: costPrice > 0 ? costPrice : undefined
      });

      if (!name) setName(enriched.name);
      if (!brand) setBrand(enriched.brand);
      setCategory(enriched.category);
      setDescription(enriched.description);
      setFeatures(enriched.features);
      setImageUrl(enriched.imageUrl);

      if (enriched.suggestedSalePrice && (!salePrice || salePrice === 0)) {
        setSalePrice(enriched.suggestedSalePrice);
      }

      setAiSuccessBadge(true);
      showToast('✨ Catálogo Enriquecido con IA', 'Se generó descripción comercial llamativa, beneficios y fotografía profesional.');
    } catch {
      showToast('Error', 'No se pudo contactar al agente de catálogo.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (productToEdit) {
      updateProduct({
        ...productToEdit,
        name: name.trim(),
        brand: brand.trim() || 'General',
        category,
        barcode: barcode.trim() || undefined,
        sku: sku.trim() || undefined,
        isForSale,
        costPrice: Number(costPrice),
        salePrice: isForSale ? Number(salePrice) : undefined,
        currentStock: Number(currentStock),
        minStockAlert: Number(minStockAlert),
        unit,
        description: description.trim() || undefined,
        features: features.length > 0 ? features : undefined,
        imageUrl: imageUrl.trim() || undefined
      });
    } else {
      addProduct({
        name: name.trim(),
        brand: brand.trim() || 'General',
        category,
        barcode: barcode.trim() || undefined,
        sku: sku.trim() || undefined,
        isForSale,
        costPrice: Number(costPrice),
        salePrice: isForSale ? Number(salePrice) : undefined,
        currentStock: Number(currentStock),
        minStockAlert: Number(minStockAlert),
        unit,
        description: description.trim() || undefined,
        features: features.length > 0 ? features : undefined,
        imageUrl: imageUrl.trim() || undefined
      });
    }

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
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
              {productToEdit ? 'Editar Producto / Insumo' : 'Nuevo Producto en Catálogo'}
            </h3>
            <p className="text-xs text-charcoal-500">
              {productToEdit 
                ? 'Actualiza los datos de inventario, precios y código de barras.' 
                : 'Ingresa un artículo escaneando su código o completándolo con el Agente IA.'}
            </p>
          </div>
        </div>

        {/* AI Agent Banner / Button */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                <span>Agente IA Luu Beauty</span>
                {aiSuccessBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    <Check className="w-3 h-3 mr-0.5" /> Enriquecido
                  </span>
                )}
              </p>
              <p className="text-[11px] text-purple-700">
                Genera descripción comercial llamativa, beneficios clave y fotografía profesional en 1 clic.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEnrichWithAI}
            disabled={isAiLoading}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md transition-all active:scale-95 shrink-0 disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Autocompletar con IA</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Identificación Básica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Aceite de Argán Tratamiento 100ml"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Marca / Laboratorio
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Moroccanoil, Kérastase, L'Oréal"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Categoría y Tipo de Uso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryProduct['category'])}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
              >
                <option value="retail">🛍️ Venta a Clientes (Retail)</option>
                <option value="tratamientos">✨ Tratamientos & Mascarillas</option>
                <option value="tintes">🎨 Tintes & Decolorantes</option>
                <option value="oxidantes">🧪 Oxidantes & Reveladores</option>
                <option value="esmaltes">💅 Esmaltes & Manicura</option>
                <option value="desechables">📦 Desechables & Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Destino Principal
              </label>
              <div className="flex items-center space-x-3 pt-1">
                <label className="flex items-center space-x-2 text-xs font-bold text-charcoal-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isForSale}
                    onChange={(e) => setIsForSale(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-brand-300 focus:ring-brand-500"
                  />
                  <span>Disponible para Venta Directa (POS)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Código de Barras & SKU */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                <Barcode className="w-4 h-4 text-amber-700" />
                <span>Código de Barras (EAN / UPC / SKU)</span>
              </span>
              <button
                type="button"
                onClick={handleGenerateBarcode}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2"
              >
                Generar Código Automático
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Escanea con pistola o ingresa ej: 7801234567890"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl font-mono font-bold text-charcoal-900 tracking-wider focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU interno opcional (ej: MOR-OIL-100)"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl font-mono text-charcoal-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Precios & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Costo Neto ($)
              </label>
              <input
                type="number"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-bold text-charcoal-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Precio Venta ($)
              </label>
              <input
                type="number"
                min="0"
                disabled={!isForSale}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl font-bold ${
                  isForSale 
                    ? 'bg-[#FAF8F5] border-brand-200 text-emerald-700' 
                    : 'bg-charcoal-100 border-charcoal-200 text-charcoal-400 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-bold text-charcoal-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Alerta Mínima
              </label>
              <input
                type="number"
                min="0"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-bold text-charcoal-900"
              />
            </div>
          </div>

          {/* Fotografía del Producto */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center justify-between">
              <span>URL Imagen del Producto (Asignada por IA o propia)</span>
              {imageUrl && (
                <span className="text-[10px] text-emerald-700 font-bold">Vista previa disponible</span>
              )}
            </label>
            <div className="flex items-center space-x-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-12 h-12 rounded-xl object-cover border border-brand-200 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl font-mono text-charcoal-700 outline-none"
              />
            </div>
          </div>

          {/* Descripción Comercial & Características (Generadas por IA) */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center justify-between">
              <span>Descripción Comercial Atractiva</span>
              <span className="text-[10px] text-purple-700 font-bold">Orientada al cliente final</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción persuasiva de beneficios, aroma, textura y resultados para la clienta..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl text-charcoal-800 leading-relaxed outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Features pills */}
          {features.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-charcoal-700">Beneficios y Características Clave:</span>
              <div className="flex flex-wrap gap-1.5">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-900 border border-brand-200"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-all active:scale-95"
            >
              {productToEdit ? 'Guardar Cambios' : 'Registrar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
