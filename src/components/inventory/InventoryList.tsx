import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  ShoppingCart, 
  CheckCircle2, 
  Search, 
  Filter, 
  RotateCw,
  Barcode,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  Edit2,
  Zap,
  TrendingUp,
  Tag,
  Receipt,
  Eye,
  Check,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { InventoryProduct, ProductSaleItem } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { enrichProductWithAI } from '../../lib/aiProductAgent';

export const InventoryList: React.FC = () => {
  const { 
    inventory, 
    restockProduct, 
    deleteProduct,
    updateProduct,
    processProductSale, 
    productSales,
    clients,
    professionals,
    showToast 
  } = useApp();

  // Sub-tabs: 'pos' | 'catalog' | 'stock' | 'sales'
  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'catalog' | 'stock' | 'sales'>('pos');

  // Search & Filters
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [catalogViewMode, setCatalogViewMode] = useState<'cards' | 'table'>('cards');

  // Modals state
  const [isProductFormOpen, setIsProductFormOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState<boolean>(false);
  const [prefilledBarcode, setPrefilledBarcode] = useState<string | undefined>(undefined);
  const [restockingItem, setRestockingItem] = useState<InventoryProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [showSupplierOrderModal, setShowSupplierOrderModal] = useState<boolean>(false);
  const [completedSaleModal, setCompletedSaleModal] = useState<any | null>(null);

  // POS State
  const [cart, setCart] = useState<ProductSaleItem[]>([]);
  const [posSelectedClientId, setPosSelectedClientId] = useState<string>('');
  const [posSelectedStylistId, setPosSelectedStylistId] = useState<string>(professionals[0]?.id || '');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'credit' | 'debit' | 'transfer' | 'cash'>('credit');
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posNotes, setPosNotes] = useState<string>('');

  // AI loading per product
  const [aiEnrichingId, setAiEnrichingId] = useState<string | null>(null);

  // Barcode Scanner Hook (Global listener for handheld USB/Bluetooth scanner)
  const { simulateScan } = useBarcodeScanner({
    enabled: true,
    onScan: (scannedCode) => {
      handleBarcodeScanned(scannedCode);
    }
  });

  const handleBarcodeScanned = (code: string) => {
    const clean = code.trim().toLowerCase();
    const foundProduct = inventory.find(
      (p) => (p.barcode && p.barcode.toLowerCase() === clean) || (p.sku && p.sku.toLowerCase() === clean)
    );

    if (foundProduct) {
      if (activeSubTab === 'pos') {
        addToCart(foundProduct);
        showToast('📦 Producto Escaneado', `${foundProduct.name} agregado al carrito de venta.`, 'success');
      } else {
        showToast('Código Encontrado', `${foundProduct.name} (${foundProduct.brand}) · Stock: ${foundProduct.currentStock}`, 'info');
      }
    } else {
      // Código desconocido: abrir modal para dar de alta con IA
      setPrefilledBarcode(code);
      setEditingProduct(null);
      setIsProductFormOpen(true);
      showToast('Código no registrado', `El código ${code} no existe en catálogo. Completémoslo con el Agente IA.`, 'warning');
    }
  };

  // Cart Management
  const addToCart = (product: InventoryProduct) => {
    if (product.currentStock <= 0) {
      showToast('Sin Stock', `No quedan unidades disponibles de ${product.name}.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          showToast('Stock Máximo Alcanzado', `Solo hay ${product.currentStock} unidades en stock.`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      } else {
        const unitPrice = product.salePrice || Math.round(product.costPrice * 1.5);
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            brand: product.brand,
            quantity: 1,
            unitPrice,
            subtotal: unitPrice,
            barcode: product.barcode,
            imageUrl: product.imageUrl
          }
        ];
      }
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const product = inventory.find((p) => p.id === productId);
            const maxStock = product ? product.currentStock : 999;
            const newQty = item.quantity + delta;

            if (newQty > maxStock) {
              showToast('Límite de Stock', `No hay más de ${maxStock} unidades disponibles.`, 'warning');
              return item;
            }
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean) as ProductSaleItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartTotal = Math.max(0, cartSubtotal - posDiscount);

  const handleCheckoutSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Carrito vacío', 'Escanea o selecciona al menos un producto para cobrar.', 'warning');
      return;
    }

    const client = clients.find((c) => c.id === posSelectedClientId);
    const stylist = professionals.find((p) => p.id === posSelectedStylistId);

    const sale = processProductSale({
      items: cart,
      subtotal: cartSubtotal,
      discount: posDiscount,
      total: cartTotal,
      paymentMethod: posPaymentMethod,
      clientId: client?.id,
      clientName: client?.name || 'Cliente de Mostrador',
      professionalId: stylist?.id,
      professionalName: stylist?.name,
      notes: posNotes.trim() || undefined
    });

    setCompletedSaleModal(sale);
    // Limpiar carrito
    setCart([]);
    setPosDiscount(0);
    setPosNotes('');
  };

  // Inline AI Enrichment for any catalog product
  const handleEnrichExistingProduct = async (product: InventoryProduct) => {
    setAiEnrichingId(product.id);
    try {
      const enriched = await enrichProductWithAI({
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        category: product.category,
        costPrice: product.costPrice
      });

      updateProduct({
        ...product,
        description: enriched.description,
        features: enriched.features,
        imageUrl: enriched.imageUrl,
        salePrice: product.salePrice || enriched.suggestedSalePrice
      });

      showToast('✨ Producto Enriquecido con IA', `${product.name} actualizado con descripción y foto.`);
    } catch {
      showToast('Error', 'No se pudo enriquecer el producto.', 'error');
    } finally {
      setAiEnrichingId(null);
    }
  };

  // Stock filtering
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minStockAlert);

  const categories = [
    { id: 'all', label: 'Todos los Productos' },
    { id: 'retail', label: '🛍️ Venta a Clientes' },
    { id: 'tintes', label: '🎨 Tintes & Decolorantes' },
    { id: 'oxidantes', label: '🧪 Oxidantes' },
    { id: 'tratamientos', label: '✨ Tratamientos' },
    { id: 'esmaltes', label: '💅 Esmaltes & Bases' },
  ];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      (item.barcode && item.barcode.toLowerCase().includes(search.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCat = categoryFilter === 'all' ? true : item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockingItem || restockAmount <= 0) return;

    restockProduct(restockingItem.id, restockAmount);
    setRestockingItem(null);
    setRestockAmount(10);
  };

  const handleGenerateSupplierOrder = () => {
    showToast(
      'Orden de Compra Generada',
      `Se ha creado la lista con ${lowStockItems.length} insumos críticos para enviar al proveedor.`,
      'success'
    );
    setShowSupplierOrderModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 flex items-center space-x-2.5">
            <span>Productos, Inventario & Punto de Venta (POS)</span>
            <Package className="w-6 h-6 text-brand-500" />
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Venta minorista en mostrador con lector de código de barras, catálogo enriquecido con IA y control de insumos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Barcode Scanner Modal trigger */}
          <button
            onClick={() => setIsBarcodeScannerOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-charcoal-800 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Barcode className="w-4 h-4 text-brand-600" />
            <span>Escanear Código</span>
          </button>

          {/* New Product Modal trigger */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setPrefilledBarcode(undefined);
              setIsProductFormOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-brand-100/90 gap-2 sm:gap-4 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveSubTab('pos')}
          className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'pos'
              ? 'border-brand-500 text-brand-900 bg-brand-50/50 rounded-t-xl'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-brand-500" />
          <span>Punto de Venta (POS) & Venta Rápida</span>
          {cart.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500 text-white">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'catalog'
              ? 'border-brand-500 text-brand-900 bg-brand-50/50 rounded-t-xl'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Catálogo & Asistente IA</span>
          <span className="text-[11px] text-charcoal-400 font-medium">({inventory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stock')}
          className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'stock'
              ? 'border-brand-500 text-brand-900 bg-brand-50/50 rounded-t-xl'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Package className="w-4 h-4 text-amber-600" />
          <span>Control de Stock & Alertas</span>
          {lowStockItems.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
              {lowStockItems.length} alertas
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('sales')}
          className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'sales'
              ? 'border-brand-500 text-brand-900 bg-brand-50/50 rounded-t-xl'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>Historial de Ventas</span>
          <span className="text-[11px] text-charcoal-400 font-medium">({productSales.length})</span>
        </button>
      </div>

      {/* TAB 1: POS / VENTA RÁPIDA */}
      {activeSubTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Product Picker & Quick Scanner (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Quick Barcode Trigger Box */}
            <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-charcoal-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-charcoal-800 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white flex items-center space-x-2">
                      <span>Lector de Código de Barras Activo</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </h4>
                    <p className="text-xs text-charcoal-300">
                      Dispara con tu pistola USB/Bluetooth o haz clic en un producto de prueba:
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBarcodeScannerOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-brand-300 rounded-xl border border-white/20 transition-all self-start sm:self-auto"
                >
                  Abrir Visor Láser
                </button>
              </div>

              {/* Quick simulation buttons */}
              <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                <span className="text-[10px] text-charcoal-400 flex items-center mr-1">
                  <Zap className="w-3 h-3 text-amber-400 mr-1" /> Pistola Express:
                </span>
                {inventory.filter(i => i.barcode).slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => simulateScan(item.barcode!)}
                    className="text-[11px] font-medium bg-white/10 hover:bg-brand-500 hover:text-white px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1"
                  >
                    <span>{item.name.split(' ')[0]} {item.name.split(' ')[1]}</span>
                    <span className="font-mono text-[9px] opacity-70">({item.barcode?.slice(-4)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Search & Category Filter */}
            <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar producto por nombre, marca o código..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-bold bg-[#FAF8F5] border border-brand-200 rounded-xl outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Retail Products Quick-Grid for POS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredInventory.map((product) => {
                  const isAvailable = product.currentStock > 0;
                  const price = product.salePrice || Math.round(product.costPrice * 1.5);
                  return (
                    <div
                      key={product.id}
                      onClick={() => isAvailable && addToCart(product)}
                      className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 cursor-pointer group ${
                        isAvailable 
                          ? 'bg-white hover:bg-brand-50/60 border-brand-100 hover:border-brand-300 shadow-sm hover:shadow active:scale-[0.98]' 
                          : 'bg-charcoal-50 border-charcoal-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-brand-50 overflow-hidden shrink-0 border border-brand-100 relative">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-300">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        {product.currentStock <= product.minStockAlert && isAvailable && (
                          <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[8px] font-extrabold text-center py-0.5">
                            Poco Stock
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                          {product.brand}
                        </span>
                        <h5 className="font-bold text-xs text-charcoal-900 truncate group-hover:text-brand-900">
                          {product.name}
                        </h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-xs text-charcoal-950">
                            ${price.toLocaleString('es-CL')}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAvailable ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                          }`}>
                            {isAvailable ? `${product.currentStock} disp.` : 'Agotado'}
                          </span>
                        </div>
                      </div>

                      {/* Add icon */}
                      <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: POS Cart & Checkout Ticket (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-brand-100 shadow-xl p-5 sm:p-6 sticky top-6 space-y-5">
              
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-100">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-brand-500" />
                  <h4 className="font-serif font-bold text-lg text-charcoal-950">
                    Ticket de Venta
                  </h4>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Vaciar</span>
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-10 text-center text-charcoal-400 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-400 mx-auto flex items-center justify-center">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-charcoal-600">El carrito de venta está vacío</p>
                  <p className="text-[11px] text-charcoal-400 max-w-xs mx-auto">
                    Escanea un producto con la pistola lectora o haz clic en los artículos del catálogo a la izquierda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-brand-100/60">
                  {cart.map((item) => (
                    <div key={item.productId} className="pt-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-charcoal-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[10px] text-charcoal-500">
                          ${item.unitPrice.toLocaleString('es-CL')} c/u {item.barcode && `· ${item.barcode}`}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => updateCartQty(item.productId, -1)}
                          className="w-6 h-6 rounded-lg bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-bold text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.productId, 1)}
                          className="w-6 h-6 rounded-lg bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-bold text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right shrink-0 min-w-[70px]">
                        <p className="font-bold text-xs text-charcoal-950">
                          ${item.subtotal.toLocaleString('es-CL')}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[10px] text-red-500 hover:text-red-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSale} className="space-y-4 pt-2 border-t border-brand-100">
                
                {/* Client & Stylist Attribution */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-600 mb-1">
                      Cliente (Opcional)
                    </label>
                    <select
                      value={posSelectedClientId}
                      onChange={(e) => setPosSelectedClientId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl font-medium outline-none truncate"
                    >
                      <option value="">Cliente de Paso / Mostrador</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal-600 mb-1">
                      Comisión / Vendedor
                    </label>
                    <select
                      value={posSelectedStylistId}
                      onChange={(e) => setPosSelectedStylistId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl font-medium outline-none truncate"
                    >
                      {professionals.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-600 mb-1.5">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'credit', label: 'Crédito', icon: CreditCard },
                      { id: 'debit', label: 'Débito', icon: CreditCard },
                      { id: 'transfer', label: 'Transf.', icon: Smartphone },
                      { id: 'cash', label: 'Efectivo', icon: Banknote },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = posPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPosPaymentMethod(m.id as any)}
                          className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                            isSelected
                              ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                              : 'bg-[#FAF8F5] text-charcoal-600 border-brand-200 hover:bg-brand-50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-600">Descuento ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={posDiscount}
                    onChange={(e) => setPosDiscount(Number(e.target.value))}
                    className="w-28 px-2.5 py-1 text-right text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl font-bold"
                  />
                </div>

                {/* Subtotals & Grand Total */}
                <div className="space-y-1 pt-2 border-t border-brand-100 text-xs">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${cartSubtotal.toLocaleString('es-CL')}</span>
                  </div>
                  {posDiscount > 0 && (
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Descuento aplicado</span>
                      <span>-${posDiscount.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-serif font-bold text-charcoal-950 pt-2 border-t border-brand-100">
                    <span>Total a Cobrar</span>
                    <span className="text-emerald-700">${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-3.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Cobrar e Imprimir Ticket (${cartTotal.toLocaleString('es-CL')})</span>
                </button>
              </form>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CATÁLOGO & AGENTE IA */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white p-4 rounded-3xl border border-brand-100 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, marca o código EAN..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-[#FAF8F5] border border-brand-200 rounded-xl outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <button
                onClick={() => setCatalogViewMode(catalogViewMode === 'cards' ? 'table' : 'cards')}
                className="px-3 py-2 text-xs font-bold text-charcoal-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-all"
              >
                {catalogViewMode === 'cards' ? 'Ver Tabla' : 'Ver Tarjetas'}
              </button>
            </div>
          </div>

          {/* Cards View */}
          {catalogViewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInventory.map((item) => {
                const isCritical = item.currentStock <= item.minStockAlert;
                const isAiBusy = aiEnrichingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-brand-100/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header with Barcode & Stock Pill */}
                      <div className="relative h-44 bg-brand-50 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-brand-300">
                            <Package className="w-10 h-10" />
                            <span className="text-[11px] text-charcoal-400 mt-1">Sin fotografía</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-charcoal-950/80 text-white backdrop-blur-sm">
                            {item.category}
                          </span>
                          {item.isForSale && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white backdrop-blur-sm">
                              Venta Retail
                            </span>
                          )}
                        </div>

                        {item.barcode && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/90 text-charcoal-900 shadow-sm backdrop-blur-sm flex items-center space-x-1">
                            <Barcode className="w-3.5 h-3.5 text-brand-600" />
                            <span>{item.barcode}</span>
                          </div>
                        )}

                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isCritical
                              ? 'bg-red-500 text-white shadow-sm animate-pulse'
                              : 'bg-emerald-500/90 text-white backdrop-blur-sm'
                          }`}
                        >
                          Stock: {item.currentStock} {item.unit}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-5 space-y-2.5">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block">
                            {item.brand}
                          </span>
                          <h4 className="font-bold text-sm text-charcoal-950">
                            {item.name}
                          </h4>
                        </div>

                        {/* AI Description snippet */}
                        {item.description ? (
                          <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        ) : (
                          <p className="text-xs text-charcoal-400 italic">
                            Sin descripción comercial generada.
                          </p>
                        )}

                        {/* Feature Badges */}
                        {item.features && item.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.features.slice(0, 3).map((f, i) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-brand-50 text-brand-900 border border-brand-100"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Pricing details */}
                        <div className="pt-2 border-t border-brand-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-charcoal-400 block">Costo Neto</span>
                            <span className="font-semibold text-charcoal-700">${item.costPrice.toLocaleString('es-CL')}</span>
                          </div>
                          {item.salePrice ? (
                            <div className="text-right">
                              <span className="text-[10px] text-emerald-600 font-bold block">Precio Retail</span>
                              <span className="font-bold text-sm text-emerald-800">${item.salePrice.toLocaleString('es-CL')}</span>
                            </div>
                          ) : (
                            <div className="text-right text-charcoal-400 text-[10px] italic">
                              Uso interno cabina
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-0 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleEnrichExistingProduct(item)}
                        disabled={isAiBusy}
                        className="flex-1 py-1.5 px-2 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-all flex items-center justify-center space-x-1"
                        title="Generar nueva descripción, beneficios y fotografía con IA"
                      >
                        <Sparkles className={`w-3 h-3 ${isAiBusy ? 'animate-spin' : ''}`} />
                        <span>{isAiBusy ? 'Mejorando...' : '✨ IA'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setIsProductFormOpen(true);
                        }}
                        className="py-1.5 px-3 text-[11px] font-bold text-charcoal-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-all flex items-center space-x-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setRestockingItem(item)}
                        className="py-1.5 px-3 text-[11px] font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-sm transition-all"
                      >
                        + Stock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-charcoal-500 font-bold uppercase tracking-wider text-[10px] border-b border-brand-100">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Producto</th>
                      <th className="py-3.5 px-4">Código / Barcode</th>
                      <th className="py-3.5 px-4 text-center">Stock</th>
                      <th className="py-3.5 px-4 text-right">Costo</th>
                      <th className="py-3.5 px-4 text-right">Precio Venta</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100/70">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-brand-50/40 transition-colors">
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-50 overflow-hidden shrink-0 border border-brand-200">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-brand-300 m-auto" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-charcoal-950">{item.name}</div>
                              <div className="text-[11px] text-charcoal-500">{item.brand} · <span className="uppercase text-brand-600">{item.category}</span></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-charcoal-600">
                          {item.barcode ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-brand-50 border border-brand-200">
                              <Barcode className="w-3 h-3 text-brand-600" />
                              <span>{item.barcode}</span>
                            </span>
                          ) : (
                            <span className="text-charcoal-400 italic">Sin código</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            item.currentStock <= item.minStockAlert ? 'bg-red-100 text-red-800' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {item.currentStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-charcoal-700">
                          ${item.costPrice.toLocaleString('es-CL')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-800">
                          {item.salePrice ? `$${item.salePrice.toLocaleString('es-CL')}` : '-'}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(item);
                              setIsProductFormOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-charcoal-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setRestockingItem(item)}
                            className="px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 rounded-lg"
                          >
                            + Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: CONTROL DE STOCK & ALERTAS */}
      {activeSubTab === 'stock' && (
        <div className="space-y-6">
          
          {/* Critical Stock Banner */}
          {lowStockItems.length > 0 ? (
            <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2.5 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Alerta: {lowStockItems.length} Insumos Bajo el Stock Mínimo Requerido</span>
                </div>
                <button
                  onClick={() => setShowSupplierOrderModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Generar Orden a Proveedor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-charcoal-950">{item.name}</h5>
                      <p className="text-[11px] text-charcoal-500">{item.brand}</p>
                      <p className="text-xs font-bold text-red-600 mt-1">
                        Stock: {item.currentStock} {item.unit} (Mín: {item.minStockAlert})
                      </p>
                    </div>
                    <button
                      onClick={() => setRestockingItem(item)}
                      className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl"
                    >
                      + Ingresar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-bold text-sm">Inventario en Niveles Óptimos</h4>
                <p className="text-xs opacity-90">Todos los insumos técnicos y productos retail se encuentran sobre el umbral de reposición.</p>
              </div>
            </div>
          )}

          {/* Quick Restock Table */}
          <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-brand-100 flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-charcoal-950">
                Resumen de Existencias & Fechas de Reposición
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF8F5] text-charcoal-500 font-bold uppercase tracking-wider text-[10px] border-b border-brand-100">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Insumo / Producto</th>
                    <th className="py-3 px-4 text-center">Stock Actual</th>
                    <th className="py-3 px-4 text-center">Mínimo</th>
                    <th className="py-3 px-4">Última Recarga</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/70">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-50/40 transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-bold text-charcoal-900">
                        {item.name}
                        <span className="block text-[10px] font-normal text-charcoal-500">{item.brand}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center text-charcoal-500">
                        {item.minStockAlert} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-charcoal-600 font-mono text-xs">
                        {item.lastRestocked}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setRestockingItem(item)}
                          className="px-3 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200"
                        >
                          + Recargar Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: HISTORIAL DE VENTAS */}
      {activeSubTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-brand-100 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-charcoal-950">
                  Registro de Ventas Retail de Mostrador
                </h4>
                <p className="text-xs text-charcoal-500">
                  Ventas de productos registradas en caja o mediante pistola de código de barras.
                </p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {productSales.length} transacciones
              </span>
            </div>

            {productSales.length === 0 ? (
              <div className="p-10 text-center text-charcoal-400">
                <Receipt className="w-10 h-10 mx-auto text-brand-300 mb-2" />
                <p className="text-xs font-bold">Aún no se registran ventas de productos</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-100/70">
                {productSales.map((sale) => (
                  <div key={sale.id} className="p-4 sm:p-5 hover:bg-brand-50/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-mono font-bold text-charcoal-700">#{sale.id}</span>
                        <span className="text-charcoal-400">·</span>
                        <span className="text-charcoal-600">{sale.date} a las {sale.time}</span>
                        <span className="text-charcoal-400">·</span>
                        <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                          {sale.paymentMethod}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-charcoal-950">
                        {sale.clientName || 'Cliente de Mostrador'}
                      </h5>
                      <p className="text-xs text-charcoal-600">
                        {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      {sale.professionalName && (
                        <p className="text-[11px] text-brand-700 font-medium">
                          Atendido por: {sale.professionalName}
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-charcoal-400 uppercase font-bold block">Total Pagado</span>
                      <span className="font-serif font-bold text-lg text-emerald-700">
                        ${sale.total.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Product Form Modal (With AI Agent) */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
          setPrefilledBarcode(undefined);
        }}
        productToEdit={editingProduct}
        initialBarcode={prefilledBarcode}
      />

      {/* Global Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onBarcodeDetected={(code) => {
          handleBarcodeScanned(code);
          setIsBarcodeScannerOpen(false);
        }}
      />

      {/* Single Product Restock Modal */}
      {restockingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-brand-100">
            <h4 className="font-serif font-bold text-lg text-charcoal-950 mb-1">
              Ingresar Compra de Insumo / Stock
            </h4>
            <p className="text-xs text-charcoal-600 mb-4">{restockingItem.name}</p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Cantidad a ingresar ({restockingItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-brand-200 rounded-xl font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockingItem(null)}
                  className="px-3 py-1.5 text-xs text-charcoal-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-brand-500 text-white rounded-xl shadow-sm"
                >
                  Confirmar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completed Sale Receipt Modal */}
      {completedSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-brand-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-950">
                ¡Venta Exitosa!
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Ticket #{completedSaleModal.id} · Stock actualizado inmediatamente en bodega.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-100 text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-charcoal-900 border-b border-brand-200/80 pb-1.5">
                <span>Cliente:</span>
                <span>{completedSaleModal.clientName}</span>
              </div>
              <div className="space-y-1 pt-1 text-charcoal-600">
                {completedSaleModal.items.map((i: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.quantity}x {i.productName}</span>
                    <span className="font-medium">${i.subtotal.toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal-950 pt-2 border-t border-brand-200">
                <span>Total Cobrado ({completedSaleModal.paymentMethod}):</span>
                <span className="text-emerald-700">${completedSaleModal.total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedSaleModal(null)}
              className="w-full py-2.5 text-xs font-bold text-white bg-charcoal-900 hover:bg-charcoal-800 rounded-xl transition-all shadow-md"
            >
              Cerrar Ticket & Continuar
            </button>
          </div>
        </div>
      )}

      {/* Supplier Order Modal */}
      {showSupplierOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-brand-100">
            <h4 className="font-serif font-bold text-lg text-charcoal-950 mb-2 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-brand-500" />
              <span>Generar Orden de Compra a Proveedores</span>
            </h4>
            <p className="text-xs text-charcoal-600 mb-4">
              Se incluirán todos los productos que están bajo el mínimo de seguridad ({lowStockItems.length} insumos).
            </p>

            <div className="max-h-48 overflow-y-auto divide-y divide-brand-100 text-xs mb-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-bold text-charcoal-900">{item.name}</span>
                    <span className="block text-[11px] text-charcoal-500">{item.brand}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-bold">Stock: {item.currentStock}</span>
                    <span className="block text-[10px] text-charcoal-500">Mín: {item.minStockAlert} {item.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setShowSupplierOrderModal(false)}
                className="px-3 py-1.5 text-xs text-charcoal-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerateSupplierOrder}
                className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-xl shadow-sm"
              >
                Exportar Orden de Compra
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
