import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Plus, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Search, 
  Smartphone, 
  Check, 
  X,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Service, ServiceCategory } from '../../types';

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService, currentSalon } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('hair');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [price, setPrice] = useState<number>(35000);
  const [description, setDescription] = useState<string>('');
  const [defaultRecurrenceDays, setDefaultRecurrenceDays] = useState<number>(25);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'hair', label: '💇‍♀️ Cabello & Color' },
    { id: 'nails', label: '💅 Uñas & Manicura' },
    { id: 'brows_lashes', label: '✨ Cejas & Pestañas' },
    { id: 'skincare', label: '🌸 Cuidado Facial' },
    { id: 'spa', label: '🧖‍♀️ Masajes & Spa' }
  ];

  const filteredServices = services.filter((s) => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setCategory('hair');
    setDurationMinutes(60);
    setPrice(35000);
    setDescription('');
    setDefaultRecurrenceDays(25);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setDurationMinutes(service.durationMinutes);
    setPrice(service.price);
    setDescription(service.description || '');
    setDefaultRecurrenceDays(service.defaultRecurrenceDays || 30);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService({
        ...editingService,
        name: name.trim(),
        category,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        description: description.trim(),
        defaultRecurrenceDays: Number(defaultRecurrenceDays)
      });
    } else {
      addService({
        name: name.trim(),
        category,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        description: description.trim(),
        defaultRecurrenceDays: Number(defaultRecurrenceDays)
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, srvName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el servicio "${srvName}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-2xl font-bold text-charcoal-950">
              Catálogo de Servicios & Tarifas
            </h2>
            <Badge variant="luxury">
              {filteredServices.length} servicios
            </Badge>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Configura los precios, tiempos de atención y los ciclos de recordatorio automático por WhatsApp en {currentSalon.name}.
          </p>
        </div>

        <Button
          variant="luxury"
          size="sm"
          onClick={handleOpenCreate}
          className="self-start sm:self-auto flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Servicio</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200/70 rounded-2xl focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                categoryFilter === cat.id
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-charcoal-600 hover:bg-brand-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-brand-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              
              {/* Category & Action Buttons */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200/60 uppercase tracking-wider">
                  {service.category === 'hair' ? 'Cabello' : service.category === 'nails' ? 'Uñas' : service.category === 'brows_lashes' ? 'Cejas/Pestañas' : service.category === 'skincare' ? 'Facial' : 'Spa'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 text-charcoal-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                    title="Editar servicio"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.name)}
                    className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar servicio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-bold text-charcoal-950 text-base group-hover:text-brand-600 transition-colors">
                {service.name}
              </h4>
              <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                {service.description || 'Sin descripción detallada.'}
              </p>

              {/* Price & Duration Badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-100 text-xs">
                <div className="bg-[#FAF8F5] p-2 rounded-xl flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-charcoal-400 block">Tarifa</span>
                    <span className="font-bold text-charcoal-900">${service.price.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-2 rounded-xl flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-charcoal-400 block">Duración</span>
                    <span className="font-bold text-charcoal-900">{service.durationMinutes} min</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Retention WhatsApp Reminder Info */}
            <div className="mt-3.5 pt-3 border-t border-brand-100 flex items-center justify-between text-[11px] text-brand-900 font-medium">
              <span className="flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Retorno automático:</span>
              </span>
              <span className="font-bold bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                Cada {service.defaultRecurrenceDays || 30} días
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Create / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 max-w-lg w-full p-6 sm:p-8 relative my-8">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-brand-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  {editingService ? 'Editar Servicio' : 'Nuevo Servicio para tu Salón'}
                </h3>
                <p className="text-xs text-charcoal-500">
                  {currentSalon.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Nombre del Servicio *
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Balayage Signature + Olaplex"
                  className="text-xs sm:text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  >
                    <option value="hair">💇‍♀️ Cabello & Color</option>
                    <option value="nails">💅 Uñas & Manicura</option>
                    <option value="brows_lashes">✨ Cejas & Pestañas</option>
                    <option value="skincare">🌸 Cuidado Facial</option>
                    <option value="spa">🧖‍♀️ Masajes & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Precio ($ CLP) *
                  </label>
                  <Input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="45000"
                    className="text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Duración Estimada *
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  >
                    <option value={30}>30 minutos (Express)</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos (1.5 horas)</option>
                    <option value={120}>120 minutos (2 horas)</option>
                    <option value={180}>180 minutos (3 horas)</option>
                    <option value={240}>240 minutos (4 horas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Ciclo WhatsApp de Retorno
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={7}
                      max={180}
                      value={defaultRecurrenceDays}
                      onChange={(e) => setDefaultRecurrenceDays(Number(e.target.value))}
                      placeholder="14 para uñas, 25 para raíces"
                      className="text-xs sm:text-sm bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-400">
                      días
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Descripción para Clientas (Portal de reservas)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Incluye lavado con champú neutro, diagnóstico capilar y peinado con ondas..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-2xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-brand-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="luxury"
                  size="sm"
                >
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
