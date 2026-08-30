import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Sparkles, 
  FileText, 
  Lock, 
  Calendar,
  DollarSign,
  Tag,
  CreditCard
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Client } from '../../types';

interface ClientsListProps {
  onViewClientProfile: (clientId: string) => void;
  onOpenNewFormula: (clientId: string) => void;
  onOpenBeautyPass?: (client: Client) => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  onViewClientProfile,
  onOpenNewFormula,
  onOpenBeautyPass
}) => {
  const { clients, addClient } = useApp();

  const [search, setSearch] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [isAddingClient, setIsAddingClient] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('+56 9 ');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');

  const allTags = ['VIP', 'Frecuente', 'Nuevo', 'Inactivo', 'Color Raíz', 'Manicura Lover'];

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesTag = selectedTagFilter === 'all' ? true : c.tags.includes(selectedTagFilter as any);
    return matchesSearch && matchesTag;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addClient({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@ejemplo.cl`,
      notes: newNotes.trim() || undefined,
      tags: ['Nuevo']
    });

    setNewName('');
    setNewPhone('+56 9 ');
    setNewEmail('');
    setNewNotes('');
    setIsAddingClient(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950">
            Directorio de Clientas & Fichas Técnicas
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Historial de visitas, recetas confidenciales de color, esmaltes y Beauty Pass VIP.
          </p>
        </div>

        <Button
          variant="luxury"
          size="sm"
          onClick={() => setIsAddingClient(true)}
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Nuevo Registro</span>
        </Button>
      </div>

      {/* New Client Form Drawer / Card */}
      {isAddingClient && (
        <form onSubmit={handleCreateClient} className="bg-white p-5 rounded-3xl border border-brand-200 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-brand-100 pb-2">
            <h4 className="font-bold text-sm text-charcoal-900">Registrar Nueva Clienta</h4>
            <button
              type="button"
              onClick={() => setIsAddingClient(false)}
              className="text-xs text-charcoal-500 hover:text-charcoal-800"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Antonia Correa"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">WhatsApp / Teléfono *</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="antonia@gmail.com"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Preferencias / Alergias / Notas</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Ej. Cuero cabelludo sensible, prefiere atención en silencio..."
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingClient(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
            >
              Guardar Clienta
            </Button>
          </div>
        </form>
      )}

      {/* Search & Tag Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-brand-100/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-brand-200/70 rounded-2xl focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTagFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
              selectedTagFilter === 'all'
                ? 'bg-charcoal-900 text-white font-semibold'
                : 'bg-[#FAF8F5] text-charcoal-700 hover:bg-brand-50'
            }`}
          >
            Todas ({clients.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(tag)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                selectedTagFilter === tag
                  ? 'bg-brand-500 text-white font-semibold shadow-sm'
                  : 'bg-[#FAF8F5] text-charcoal-600 hover:bg-brand-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-3xl border border-brand-100/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start space-x-3.5">
                <img
                  src={client.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                  alt={client.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-100 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 
                      onClick={() => onViewClientProfile(client.id)}
                      className="font-bold text-charcoal-950 text-base truncate cursor-pointer hover:text-brand-600"
                    >
                      {client.name}
                    </h4>
                    {onOpenBeautyPass && (
                      <button
                        onClick={() => onOpenBeautyPass(client)}
                        className="text-brand-600 hover:text-brand-800 p-1 hover:bg-brand-50 rounded-lg"
                        title="Ver VIP Beauty Pass"
                      >
                        <CreditCard className="w-4 h-4 text-brand-600" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-500 flex items-center space-x-1 mt-0.5">
                    <Phone className="w-3 h-3 text-brand-500" />
                    <span>{client.phone}</span>
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {client.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-100 text-xs">
                <div className="bg-[#FAF8F5] p-2 rounded-xl text-center">
                  <span className="text-[10px] text-charcoal-500 block">Total Visitas</span>
                  <span className="font-bold text-charcoal-900">{client.totalVisits} citas</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-xl text-center">
                  <span className="text-[10px] text-charcoal-500 block">Ticket Promedio</span>
                  <span className="font-bold text-brand-800">${client.avgTicket.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Latest Technical Formula Highlight */}
              {client.formulas.length > 0 ? (
                <div className="mt-3 bg-brand-50/70 p-2.5 rounded-xl border border-brand-200/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-brand-900 mb-1">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-brand-600" />
                      <span>Fórmula: {client.formulas[0].serviceName.split(' ')[0]}</span>
                    </span>
                    <span className="text-[10px] font-normal text-charcoal-500">{client.formulas[0].date}</span>
                  </div>
                  <p className="text-charcoal-700 font-mono text-[11px] truncate">
                    {client.formulas[0].rootFormula || client.formulas[0].polishBrandAndCode || client.formulas[0].generalNotes}
                  </p>
                </div>
              ) : (
                <div className="mt-3 p-2 bg-[#FAF8F5] rounded-xl text-center text-xs text-charcoal-400">
                  Sin fórmula técnica registrada
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-brand-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewClientProfile(client.id)}
                className="flex-1"
              >
                Ficha Completa
              </Button>
              <Button
                variant="luxury"
                size="sm"
                onClick={() => onOpenNewFormula(client.id)}
              >
                + Receta
              </Button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
