import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Store, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  X, 
  Smile, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Professional, Service, ServiceCategory } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
];

const PRESET_SALON_PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&auto=format&fit=crop&q=80'
];

const SUGGESTED_SERVICES: Array<Omit<Service, 'id' | 'salonId'>> = [
  {
    name: 'Balayage Signature & Matiz Gloss',
    category: 'hair',
    durationMinutes: 180,
    price: 85000,
    description: 'Aclaración degradada personalizada, baño de luz, tratamiento restaurador y peinado.',
    defaultRecurrenceDays: 90
  },
  {
    name: 'Corte Mujer & Brushing Styling',
    category: 'hair',
    durationMinutes: 50,
    price: 28000,
    description: 'Visagismo según forma de rostro, lavado relajante y peinado styling final.',
    defaultRecurrenceDays: 45
  },
  {
    name: 'Lavado Spa, Masaje Craneal & Peinado',
    category: 'hair',
    durationMinutes: 40,
    price: 18000,
    description: 'Lavado sensorial con masaje craneal y secado profesional.',
    defaultRecurrenceDays: 20
  },
  {
    name: 'Manicura Rusa & Esmaltado Permanente',
    category: 'nails',
    durationMinutes: 60,
    price: 24000,
    description: 'Limpieza profunda de cutículas con torno y esmaltado de alta duración.',
    defaultRecurrenceDays: 21
  },
  {
    name: 'Hidratación Capilar & Sellado Molecular',
    category: 'spa',
    durationMinutes: 60,
    price: 35000,
    description: 'Tratamiento intensivo para sellar cutícula y recuperar brillo extremo.',
    defaultRecurrenceDays: 30
  },
  {
    name: 'Lifting de Pestañas con Keratina',
    category: 'brows_lashes',
    durationMinutes: 50,
    price: 28000,
    description: 'Curvatura natural desde la raíz, nutrición con keratina y efecto rímel.',
    defaultRecurrenceDays: 45
  },
  {
    name: 'Corte Hombre & Barba de Autor',
    category: 'hair',
    durationMinutes: 40,
    price: 22000,
    description: 'Corte clásico o degradado con tijera y máquina más perfilado de barba.',
    defaultRecurrenceDays: 30
  }
];

export const OnboardingWizardModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    completeOnboarding,
    currentSalon,
    currentUser,
    updateSalonInfo,
    professionals,
    addProfessional,
    deleteProfessional,
    services,
    addService,
    deleteService,
    setActiveTab,
    showToast
  } = useApp();

  // Step state: 0 = Welcome, 1 = Salon Info, 2 = Stylists, 3 = Services, 4 = Success
  const [step, setStep] = useState<number>(0);

  // STEP 1: Salon Info Form
  const [salonName, setSalonName] = useState<string>(currentSalon?.name || '');
  const [salonPhone, setSalonPhone] = useState<string>(currentSalon?.phone || '+56 9 ');
  const [salonCity, setSalonCity] = useState<string>(currentSalon?.city || 'Santiago, Chile');
  const [salonAddress, setSalonAddress] = useState<string>(currentSalon?.address && currentSalon?.address !== 'Dirección por configurar' ? currentSalon.address : '');
  const [salonInstagram, setSalonInstagram] = useState<string>(currentSalon?.instagram || '');
  const [salonHours, setSalonHours] = useState<string>(currentSalon?.openingHours || 'Lunes a Sábado 10:00 - 20:00');
  const [salonLogo, setSalonLogo] = useState<string>(currentSalon?.logo || PRESET_SALON_PHOTOS[0]);

  // STEP 2: Stylist inline add
  const [newProfName, setNewProfName] = useState<string>('');
  const [newProfRole, setNewProfRole] = useState<string>('Master Colorista');
  const [newProfAvatar, setNewProfAvatar] = useState<string>(PRESET_AVATARS[0]);

  // STEP 3: Custom service inline add
  const [newServiceName, setNewServiceName] = useState<string>('');
  const [newServicePrice, setNewServicePrice] = useState<number>(30000);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(60);
  const [isAddingCustomService, setIsAddingCustomService] = useState<boolean>(false);

  // Link copy state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Track initialization so we only sync once when opened
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOnboardingOpen && !wasOpenRef.current) {
      setStep(0);
      setSalonName(currentSalon?.name || '');
      setSalonPhone(currentSalon?.phone || '+56 9 ');
      setSalonCity(currentSalon?.city || 'Santiago, Chile');
      setSalonAddress(currentSalon?.address && currentSalon?.address !== 'Dirección por configurar' ? currentSalon.address : '');
      setSalonInstagram(currentSalon?.instagram || '');
      setSalonHours(currentSalon?.openingHours || 'Lunes a Sábado 10:00 - 20:00');
      setSalonLogo(currentSalon?.logo || PRESET_SALON_PHOTOS[0]);
    }
    wasOpenRef.current = isOnboardingOpen;
  }, [isOnboardingOpen]);

  if (!isOnboardingOpen) return null;

  // Save Step 1 (Salon Info)
  const handleSaveSalonInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = salonName.trim() || currentSalon.name || 'Mi Peluquería';
    updateSalonInfo({
      name: finalName,
      address: salonAddress.trim(),
      city: salonCity.trim() || 'Santiago, Chile',
      phone: salonPhone.trim(),
      instagram: salonInstagram.trim(),
      openingHours: salonHours.trim(),
      logo: salonLogo
    });
    setStep(2);
  };

  // Add Owner as first Stylist with 1 click
  const handleAddOwnerAsStylist = () => {
    const ownerName = currentUser?.name || 'Estilista Principal';
    const alreadyExists = professionals.some(
      (p) => p.name.toLowerCase() === ownerName.toLowerCase()
    );
    if (!alreadyExists) {
      addProfessional({
        name: ownerName,
        roleTitle: 'Dueño(a) & Master Stylist',
        specialties: ['hair'],
        avatar: currentUser?.avatar || PRESET_AVATARS[0],
        rating: 5.0,
        commissionRate: 0.5,
        phone: salonPhone || '+56 9 ',
        colorHex: '#D57B6C'
      });
    }
  };

  // Add Suggested Team with 1 click
  const handleAddSuggestedTeam = () => {
    const teamToLoad = [
      {
        name: 'Valentina Morales',
        roleTitle: 'Master Colorista & Balayage',
        specialties: ['hair' as ServiceCategory],
        avatar: PRESET_AVATARS[0],
        rating: 5.0,
        commissionRate: 0.45,
        phone: '+56 9 8123 4567',
        colorHex: '#D57B6C'
      },
      {
        name: 'Camila Soto',
        roleTitle: 'Especialista en Manicura & Nail Art',
        specialties: ['nails' as ServiceCategory],
        avatar: PRESET_AVATARS[1],
        rating: 4.9,
        commissionRate: 0.4,
        phone: '+56 9 8234 5678',
        colorHex: '#E8B4B8'
      }
    ];

    teamToLoad.forEach((p) => {
      if (!professionals.some((existing) => existing.name === p.name)) {
        addProfessional(p);
      }
    });
  };

  // Add custom professional
  const handleAddCustomStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName.trim()) return;
    addProfessional({
      name: newProfName.trim(),
      roleTitle: newProfRole.trim() || 'Estilista Profesional',
      specialties: ['hair'],
      avatar: newProfAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newProfName.trim())}&background=D57B6C&color=fff`,
      rating: 5.0,
      commissionRate: 0.4,
      phone: '+56 9 ',
      colorHex: '#D57B6C'
    });
    setNewProfName('');
    setNewProfRole('Master Colorista');
  };

  // Toggle Suggested Service
  const handleToggleSuggestedService = (serv: Omit<Service, 'id' | 'salonId'>) => {
    const existing = services.find((s) => s.name.toLowerCase() === serv.name.toLowerCase());
    if (existing) {
      deleteService(existing.id);
    } else {
      addService(serv);
    }
  };

  // Add Custom Service
  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    addService({
      name: newServiceName.trim(),
      category: 'hair',
      durationMinutes: Number(newServiceDuration) || 60,
      price: Number(newServicePrice) || 25000,
      description: 'Servicio creado durante la configuración inicial.'
    });
    setNewServiceName('');
    setNewServicePrice(30000);
    setIsAddingCustomService(false);
  };

  // Finish Onboarding
  const handleFinishWizard = () => {
    completeOnboarding();
    setActiveTab('agenda');
    showToast('🎉 ¡Salón Configurado!', 'Tu plataforma luu. está lista para trabajar.', 'success');
  };

  const bookingSlug = (salonName || currentSalon.name || 'mi-salon')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const bookingUrl = `https://luu.cl/${bookingSlug}`;

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    setIsCopied(true);
    showToast('Enlace Copiado', 'Link de reservas copiado al portapapeles.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl border border-brand-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header Bar & Simple Steps Indicator */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-brand-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white shadow-lg">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold tracking-tight">luu<span className="text-brand-400">.</span></span>
                <span className="text-white/40 text-xs">|</span>
                <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">Asistente de Configuración</span>
              </div>
              <p className="text-[11px] text-white/60">
                {step === 0 && 'Bienvenida al CRM de tu salón'}
                {step === 1 && 'Paso 1 de 3: Identidad y Contacto'}
                {step === 2 && 'Paso 2 de 3: Tu Equipo de Estilistas'}
                {step === 3 && 'Paso 3 de 3: Tu Carta de Servicios'}
                {step === 4 && '¡Configuración Completada!'}
              </p>
            </div>
          </div>

          {/* Step Badges (Steps 1 to 3) */}
          {step > 0 && step < 4 && (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium">
              <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-brand-500 text-white font-bold' : 'bg-white/10 text-white/60'}`}>
                1. Salón
              </span>
              <span className="text-white/30">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-brand-500 text-white font-bold' : 'bg-white/10 text-white/60'}`}>
                2. Equipo
              </span>
              <span className="text-white/30">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 3 ? 'bg-brand-500 text-white font-bold' : 'bg-white/10 text-white/60'}`}>
                3. Servicios
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Cerrar por ahora"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 0: BIENVENIDA CÁLIDA                                                 */}
        {/* ========================================================================= */}
        {step === 0 && (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-brand-50 text-brand-800 px-4 py-1.5 rounded-full border border-brand-200 text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>¡Hola, artista del peinado y la belleza!</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950 leading-tight">
                Sabemos que organizar una peluquería es más difícil que desenredar una decoloración mal hecha...
              </h2>

              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
                Entre clientas que llegan tarde diciendo <i>"¡estoy a la vuelta!"</i> y mezclas secretas anotadas en servilletas, el día a día puede ser un torbellino. 
                Por eso creamos este asistente: <strong>en solo 3 pasos dejamos tu salón impecable, digital y listo para brillar. ✨</strong>
              </p>
            </div>

            {/* 3 Steps Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto w-full">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100/80 text-brand-800 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">Tu Salón</h4>
                <p className="text-[11px] text-charcoal-500">Nombre, WhatsApp de contacto y dirección.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100/80 text-brand-800 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">Tu Equipo</h4>
                <p className="text-[11px] text-charcoal-500">Tus estilistas y profesionales estrella.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100/80 text-brand-800 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">Tus Servicios</h4>
                <p className="text-[11px] text-charcoal-500">Elige tus servicios con 1 solo clic.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pt-2">
              <Button
                variant="luxury"
                size="lg"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2"
              >
                <span>¡Vamos a configurar mi salón! 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-[11px] text-charcoal-400 mt-2">Puedes editar todo después cuando quieras. ¡Nada está grabado en piedra!</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: INFORMACIÓN DEL SALÓN                                             */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleSaveSalonInfo} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 1 de 3</Badge>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  La Identidad de tu Salón
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Estos datos aparecerán en los recordatorios automáticos de WhatsApp y en el portal de tus clientas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salon Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Nombre de la Peluquería / Salón *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Ej. PElu, Studio Glow, Atelier Providencia"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 font-semibold"
                />
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  WhatsApp Oficial para Reservas *
                </label>
                <input
                  type="text"
                  required
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  placeholder="+56 9 9162 7029"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* City / Country */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Comuna y Ciudad
                </label>
                <input
                  type="text"
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  placeholder="Ej. Santiago, Chile"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600" />
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  placeholder="Ej. Nueva Costanera 3222"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <InstagramIcon className="w-3.5 h-3.5 mr-1 text-pink-600" />
                  Instagram Oficial
                </label>
                <input
                  type="text"
                  value={salonInstagram}
                  onChange={(e) => setSalonInstagram(e.target.value)}
                  placeholder="@pelu"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>

            {/* Presets de Foto de Portada */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-charcoal-700 mb-2">
                Foto de Portada o Fachada del Salón
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_SALON_PHOTOS.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSalonLogo(photoUrl)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      salonLogo === photoUrl ? 'border-brand-500 ring-2 ring-brand-300' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photoUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {salonLogo === photoUrl && (
                      <div className="absolute inset-0 bg-brand-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(0)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver
              </Button>

              <Button
                type="submit"
                variant="luxury"
                className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
              >
                <span>Continuar a Tu Equipo</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: TU EQUIPO (LAS PELUQUERAS / PROFESIONALES)                        */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 2 de 3</Badge>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  Tu Equipo de Peluqueras & Especialistas
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Agrega a las profesionales de tu salón para que las clientas puedan reservar hora con ellas.
              </p>
            </div>

            {/* 1-Click Quick Add Cards if empty */}
            {professionals.length === 0 && (
              <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-2xl space-y-3">
                <p className="text-xs font-semibold text-brand-950">
                  ⚡ Agrega tu primer profesional con 1 clic:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleAddOwnerAsStylist}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-brand-200 rounded-xl hover:bg-brand-50 text-left transition-all shadow-2xs"
                  >
                    <span className="block text-xs font-bold text-charcoal-900">
                      + Agregarme a mí ({currentUser?.name || 'Dueño'})
                    </span>
                    <span className="block text-[11px] text-charcoal-500">Como Estilista & Colorista Principal</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSuggestedTeam}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-brand-200 rounded-xl hover:bg-brand-50 text-left transition-all shadow-2xs"
                  >
                    <span className="block text-xs font-bold text-charcoal-900">+ Cargar 2 estilistas de ejemplo</span>
                    <span className="block text-[11px] text-charcoal-500">Colorista y Manicurista</span>
                  </button>
                </div>
              </div>
            )}

            {/* Current Team List */}
            {professionals.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                    Peluqueras en el Salón ({professionals.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOwnerAsStylist}
                    className="text-[11px] text-brand-700 hover:text-brand-900 font-semibold"
                  >
                    + Agregarme a mí
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {professionals.map((prof) => (
                    <div
                      key={prof.id}
                      className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl flex items-center justify-between space-x-3 shadow-2xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-charcoal-900 truncate">{prof.name}</h4>
                          <p className="text-[11px] text-charcoal-500 truncate">{prof.roleTitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteProfessional(prof.id)}
                        className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar profesional"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline Add Stylist Form */}
            <form onSubmit={handleAddCustomStylist} className="p-4 bg-white border border-brand-200/80 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-charcoal-800 flex items-center">
                <Plus className="w-3.5 h-3.5 mr-1 text-brand-600" />
                Añadir Otra Profesional
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    placeholder="Ej. Valentina Morales"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-charcoal-600 mb-1">Especialidad / Cargo</label>
                  <input
                    type="text"
                    value={newProfRole}
                    onChange={(e) => setNewProfRole(e.target.value)}
                    placeholder="Ej. Colorista & Balayage, Manicurista"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-medium text-charcoal-600 mb-1.5">Foto de perfil (elige una):</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProfAvatar(av)}
                      className={`w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                        newProfAvatar === av ? 'border-brand-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  disabled={!newProfName.trim()}
                  className="text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar al Equipo
                </Button>
              </div>
            </form>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver a Salón
              </Button>

              <Button
                type="button"
                variant="luxury"
                onClick={() => setStep(3)}
                className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
              >
                <span>Continuar a Servicios</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: TUS SERVICIOS (SELECCIÓN VISUAL CON 1 CLIC)                      */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 3 de 3</Badge>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  Tu Carta de Servicios
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Marca los servicios que ofreces en tu peluquería para agregarlos a tu lista con 1 clic.
              </p>
            </div>

            {/* Suggested Services Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUGGESTED_SERVICES.map((serv, idx) => {
                const isSelected = services.some(
                  (s) => s.name.toLowerCase() === serv.name.toLowerCase()
                );
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSuggestedService(serv)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between space-x-3 ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-400 shadow-xs'
                        : 'bg-[#FAF8F5] border-brand-200/80 hover:bg-brand-50/30'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-charcoal-900 leading-tight">{serv.name}</span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 leading-snug line-clamp-1">{serv.description}</p>
                      <div className="flex items-center space-x-2 pt-0.5 text-[11px] font-semibold text-brand-900">
                        <span>${serv.price.toLocaleString('es-CL')}</span>
                        <span className="text-charcoal-400">·</span>
                        <span className="text-charcoal-600 font-normal">{serv.durationMinutes} min</span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-charcoal-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Service Accordion / Form */}
            {!isAddingCustomService ? (
              <button
                type="button"
                onClick={() => setIsAddingCustomService(true)}
                className="w-full py-2.5 border border-dashed border-brand-300 rounded-2xl text-xs font-semibold text-brand-800 hover:bg-brand-50/60 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar un servicio personalizado</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomService} className="p-4 bg-brand-50/50 border border-brand-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-charcoal-800">Nuevo Servicio Personalizado</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-medium text-charcoal-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="Ej. Mechas Babylights"
                      className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-charcoal-600 mb-1">Precio ($ CLP)</label>
                    <input
                      type="number"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-charcoal-600 mb-1">Duración (min)</label>
                    <input
                      type="number"
                      required
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingCustomService(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="luxury"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    Guardar Servicio
                  </Button>
                </div>
              </form>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver a Equipo
              </Button>

              <Button
                type="button"
                variant="luxury"
                onClick={() => setStep(4)}
                className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
              >
                <span>Finalizar Configuración 🎉</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: CELEBRACIÓN Y TODO LISTO                                         */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-between space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-950">
                ¡Tu salón ya está listo para brillar!
              </h2>

              <p className="text-xs sm:text-sm text-charcoal-600">
                Hemos configurado la base de <strong>{salonName || currentSalon.name}</strong>. Ya puedes empezar a agendar citas y recibir clientas.
              </p>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto w-full">
              <div className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl">
                <Store className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="block text-[11px] text-charcoal-500">Salón</span>
                <span className="block text-xs font-bold text-charcoal-900 truncate">{salonName || currentSalon.name}</span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl">
                <Users className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="block text-[11px] text-charcoal-500">Equipo</span>
                <span className="block text-xs font-bold text-charcoal-900">{professionals.length} estilistas</span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl">
                <Scissors className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="block text-[11px] text-charcoal-500">Servicios</span>
                <span className="block text-xs font-bold text-charcoal-900">{services.length} activos</span>
              </div>
            </div>

            {/* Public Booking Link Card */}
            <div className="p-4 max-w-lg mx-auto w-full bg-brand-50/70 border border-brand-200 rounded-2xl space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider">
                  Tu Enlace Público de Reservas
                </span>
                <Badge variant="luxury" className="text-[10px]">Listo para compartir</Badge>
              </div>

              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-brand-200">
                <span className="text-xs font-mono text-charcoal-700 truncate flex-1">{bookingUrl}</span>
                <button
                  type="button"
                  onClick={copyBookingLink}
                  className="px-2.5 py-1 text-xs font-semibold text-brand-800 hover:bg-brand-50 rounded-lg transition-colors flex items-center space-x-1 shrink-0"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-charcoal-500">
                Puedes poner este link en tu biografía de Instagram o enviarlo por WhatsApp a tus clientas.
              </p>
            </div>

            {/* Final Action Button */}
            <div className="flex justify-center pt-2">
              <Button
                variant="luxury"
                size="lg"
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-10 py-3 text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2"
              >
                <span>Ir a mi Agenda y Comenzar 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
