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
  ArrowDownRight,
  TrendingDown,
  RotateCw
} from 'lucide-react';
import { InventoryProduct } from '../../types';

export const InventoryList: React.FC = () => {
  const { inventory, restockProduct, showToast } = useApp();

  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [restockingItem, setRestockingItem] = useState<InventoryProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [showSupplierOrderModal, setShowSupplierOrderModal] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Todos los Insumos' },
    { id: 'tintes', label: '🎨 Tintes & Decolorantes' },
    { id: 'oxidantes', label: '🧪 Oxidantes' },
    { id: 'tratamientos', label: '✨ Tratamientos' },
    { id: 'esmaltes', label: '💅 Esmaltes & Bases' },
    { id: 'retail', label: '🛍️ Venta a Clientes' },
  ];

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minStockAlert);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 flex items-center space-x-2">
            <span>Inventario & Alertas de Recompra</span>
            <Package className="w-5 h-5 text-brand-500" />
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Control de insumos técnicos con descuento automático según servicios realizados y alarmas de stock crítico.
          </p>
        </div>

        {lowStockItems.length > 0 && (
          <button
            onClick={() => setShowSupplierOrderModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Generar Orden a Proveedor ({lowStockItems.length} alertas)</span>
          </button>
        )}
      </div>

      {/* Critical Stock Alarms Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Insumos con Stock Bajo el Mínimo Requerido</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-charcoal-950">{item.name}</h4>
                  <p className="text-[11px] text-charcoal-500">{item.brand}</p>
                  <p className="text-xs text-red-600 font-bold mt-1">
                    Quedan: {item.currentStock} {item.unit} (Mín: {item.minStockAlert})
                  </p>
                </div>
                <button
                  onClick={() => setRestockingItem(item)}
                  className="px-3 py-1.5 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all"
                >
                  + Reponer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por insumo, marca o tinte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200/70 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                categoryFilter === cat.id
                  ? 'bg-charcoal-900 text-white font-semibold'
                  : 'bg-[#FAF8F5] text-charcoal-700 hover:bg-brand-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Grid */}
      <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF8F5] text-charcoal-500 font-bold uppercase tracking-wider text-[10px] border-b border-brand-100">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Producto / Insumo</th>
                <th className="py-3.5 px-4">Marca & Categoría</th>
                <th className="py-3.5 px-4 text-center">Stock Actual</th>
                <th className="py-3.5 px-4 text-center">Stock Mínimo</th>
                <th className="py-3.5 px-4 text-right">Costo Unit.</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100/70">
              {filteredInventory.map((item) => {
                const isCritical = item.currentStock <= item.minStockAlert;
                return (
                  <tr key={item.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-charcoal-950">{item.name}</div>
                      <div className="text-[11px] text-charcoal-500">Última recarga: {item.lastRestocked}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-charcoal-700">{item.brand}</span>
                      <span className="block text-[10px] uppercase font-bold text-brand-600">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          isCritical
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-charcoal-500">
                      {item.minStockAlert} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-charcoal-800">
                      ${item.costPrice.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => setRestockingItem(item)}
                        className="px-3 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-all"
                      >
                        + Ingresar Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Single Product Modal */}
      {restockingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-brand-100">
            <h4 className="font-serif font-bold text-lg text-charcoal-950 mb-1">
              Ingresar Compra de Insumo
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

      {/* Supplier Purchase Order Modal */}
      {showSupplierOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-100 space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-brand-600" />
              <h3 className="font-serif font-bold text-xl text-charcoal-950">
                Lista de Reabastecimiento a Proveedor
              </h3>
            </div>
            <p className="text-xs text-charcoal-600">
              Insumos que han alcanzado el umbral crítico en el salón:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-2.5 bg-[#FAF8F5] rounded-xl border border-brand-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-charcoal-900">{item.name}</span>
                    <span className="text-charcoal-500 block text-[11px]">{item.brand}</span>
                  </div>
                  <span className="font-bold text-amber-800">Pedir: 10 {item.unit}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setShowSupplierOrderModal(false)}
                className="px-4 py-2 text-xs text-charcoal-600 font-semibold"
              >
                Cerrar
              </button>
              <button
                onClick={handleGenerateSupplierOrder}
                className="px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-all"
              >
                Exportar / Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
