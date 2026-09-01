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
  Calendar,
  X, 
  Smile, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Upload,
  Camera
} from 'lucide-react';
import { Professional, Service, ServiceCategory } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { loadGoogleMapsScript, extractAddressComponents } from '../../utils/googleMaps';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const CATEGORY_OPTIONS: { id: ServiceCategory; label: string; icon: string }[] = [
  { id: 'hair', label: 'Cabello / Color', icon: '💇‍♀️' },
  { id: 'nails', label: 'Manicura & Pedicura', icon: '💅' },
  { id: 'brows_lashes', label: 'Pestañas & Cejas', icon: '👁️' },
  { id: 'skincare', label: 'Facial & Piel', icon: '✨' },
  { id: 'spa', label: 'Spa & Relajación', icon: '🧖‍♀️' },
];

const WEEK_DAYS: { id: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'; label: string; full: string }[] = [
  { id: 'lun', label: 'L', full: 'Lunes' },
  { id: 'mar', label: 'M', full: 'Martes' },
  { id: 'mie', label: 'M', full: 'Miércoles' },
  { id: 'jue', label: 'J', full: 'Jueves' },
  { id: 'vie', label: 'V', full: 'Viernes' },
  { id: 'sab', label: 'S', full: 'Sábado' },
  { id: 'dom', label: 'D', full: 'Domingo' }
];

const formatWorkingDays = (days?: string[]) => {
  if (!days || days.length === 0) return 'Todos los días';
  if (days.length === 7) return 'Todos los días (Lun a Dom)';
  if (days.length === 6 && !days.includes('dom')) return 'Lun a Sáb';
  if (days.length === 5 && !days.includes('sab') && !days.includes('dom')) return 'Lun a Vie';
  const map: Record<string, string> = {
    lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom'
  };
  return days.map((d) => map[d] || d).join(', ');
};

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
  const [salonCoordinates, setSalonCoordinates] = useState<{ lat: number; lng: number } | undefined>(currentSalon?.coordinates);
  const [salonMapsUrl, setSalonMapsUrl] = useState<string | undefined>(currentSalon?.googleMapsUrl);
  const [isMapsLoaded, setIsMapsLoaded] = useState<boolean>(false);
  const [isAddressVerified, setIsAddressVerified] = useState<boolean>(Boolean(currentSalon?.coordinates || currentSalon?.googleMapsUrl));
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(() => {
    return !!currentSalon?.logo && !PRESET_SALON_PHOTOS.includes(currentSalon.logo);
  });

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Archivo no compatible', 'Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSalonLogo(compressedDataUrl);
          setIsCustomPhoto(true);
        } else {
          setSalonLogo(event.target?.result as string);
          setIsCustomPhoto(true);
        }
        showToast('Foto Cargada con Éxito', 'Se ha subido la foto de tu salón.', 'success');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // STEP 3: Professional inline add
  const [newProfName, setNewProfName] = useState<string>('');
  const [newProfEmail, setNewProfEmail] = useState<string>('');
  const [newProfPhone, setNewProfPhone] = useState<string>('+56 9 ');
  const [newProfAvatar, setNewProfAvatar] = useState<string>(PRESET_AVATARS[0]);
  const [newProfCategories, setNewProfCategories] = useState<ServiceCategory[]>(['hair']);
  const [newProfServiceIds, setNewProfServiceIds] = useState<string[]>([]);
  const [newProfWorkingDays, setNewProfWorkingDays] = useState<('lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom')[]>([
    'lun', 'mar', 'mie', 'jue', 'vie', 'sab'
  ]);
  const [newProfStartHour, setNewProfStartHour] = useState<string>('10:00');
  const [newProfEndHour, setNewProfEndHour] = useState<string>('19:00');

  // STEP 2: Custom service inline add
  const [newServiceName, setNewServiceName] = useState<string>('');
  const [newServicePrice, setNewServicePrice] = useState<number>(30000);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(60);
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>('hair');
  const [newServiceRecurrenceDays, setNewServiceRecurrenceDays] = useState<number>(30);
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
      setSalonCoordinates(currentSalon?.coordinates);
      setSalonMapsUrl(currentSalon?.googleMapsUrl);
      setIsAddressVerified(Boolean(currentSalon?.coordinates || currentSalon?.googleMapsUrl));
      setIsCustomPhoto(Boolean(currentSalon?.logo && !PRESET_SALON_PHOTOS.includes(currentSalon.logo)));
    }
    wasOpenRef.current = isOnboardingOpen;
  }, [isOnboardingOpen]);

  // Initialize Google Maps Places Autocomplete on Step 1
  useEffect(() => {
    if (step === 1 && addressInputRef.current) {
      loadGoogleMapsScript()
        .then((googleMaps) => {
          setIsMapsLoaded(true);
          if (!autocompleteRef.current && addressInputRef.current && googleMaps?.places) {
            const isChile = (salonCity || currentSalon?.city || '').toLowerCase().includes('chile');
            const autocomplete = new googleMaps.places.Autocomplete(addressInputRef.current, {
              ...(isChile ? { componentRestrictions: { country: ['cl'] } } : {}),
              fields: ['address_components', 'formatted_address', 'geometry', 'name', 'url', 'place_id']
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place && (place.formatted_address || place.name)) {
                const extracted = extractAddressComponents(place);
                setSalonAddress(extracted.streetAddress || extracted.formattedAddress);
                if (extracted.cityOrComuna) {
                  setSalonCity(extracted.cityOrComuna);
                }
                if (extracted.lat && extracted.lng) {
                  setSalonCoordinates({ lat: extracted.lat, lng: extracted.lng });
                }
                if (extracted.url) {
                  setSalonMapsUrl(extracted.url);
                }
                setIsAddressVerified(true);
                showToast('Dirección Verificada', 'Ubicación conectada con Google Maps ✨', 'success');
              }
            });

            autocompleteRef.current = autocomplete;
          }
        })
        .catch((err) => {
          console.warn('Google Maps Places API not available:', err);
        });
    }
  }, [step, salonCity, currentSalon?.city, showToast]);

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
      logo: salonLogo,
      coordinates: salonCoordinates,
      googleMapsUrl: salonMapsUrl
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
        email: currentUser?.email,
        roleTitle: 'Dueño(a) & Profesional',
        specialties: ['hair', 'nails'],
        avatar: currentUser?.avatar || PRESET_AVATARS[0],
        rating: 5.0,
        commissionRate: 0.5,
        phone: salonPhone || '+56 9 ',
        colorHex: '#D57B6C',
        workingDays: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
        workingHours: { start: '10:00', end: '20:00' }
      });
    }
  };

  // Add Suggested Team with 1 click
  const handleAddSuggestedTeam = () => {
    const teamToLoad = [
      {
        name: 'Valentina Morales',
        email: 'valentina.morales@salonglow.cl',
        roleTitle: 'Master Colorista & Balayage',
        specialties: ['hair' as ServiceCategory],
        avatar: PRESET_AVATARS[0],
        rating: 5.0,
        commissionRate: 0.45,
        phone: '+56 9 8123 4567',
        colorHex: '#D57B6C',
        workingDays: ['mar' as const, 'mie' as const, 'jue' as const, 'vie' as const, 'sab' as const],
        workingHours: { start: '10:00', end: '19:00' }
      },
      {
        name: 'Camila Soto',
        email: 'camila.soto@salonglow.cl',
        roleTitle: 'Especialista en Manicura & Nail Art',
        specialties: ['nails' as ServiceCategory],
        avatar: PRESET_AVATARS[1],
        rating: 4.9,
        commissionRate: 0.4,
        phone: '+56 9 8234 5678',
        colorHex: '#E8B4B8',
        workingDays: ['lun' as const, 'mar' as const, 'mie' as const, 'jue' as const, 'vie' as const],
        workingHours: { start: '10:00', end: '18:00' }
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

    const cats = newProfCategories.length > 0 ? newProfCategories : ['hair' as ServiceCategory];
    const categoryLabels: Record<ServiceCategory, string> = {
      hair: 'Estilista & Colorista',
      nails: 'Especialista en Manicura',
      brows_lashes: 'Pestañas & Cejas',
      skincare: 'Cosmetóloga Facial',
      spa: 'Terapeuta Spa'
    };
    const generatedRole = cats.map((c) => categoryLabels[c] || c).join(', ');

    addProfessional({
      name: newProfName.trim(),
      email: newProfEmail.trim() || undefined,
      phone: newProfPhone.trim() || '+56 9 ',
      roleTitle: generatedRole || 'Profesional & Especialista',
      specialties: cats,
      serviceIds: newProfServiceIds.length > 0 ? newProfServiceIds : undefined,
      avatar: newProfAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newProfName.trim())}&background=D57B6C&color=fff`,
      rating: 5.0,
      commissionRate: 0.4,
      colorHex: '#D57B6C',
      workingDays: newProfWorkingDays,
      workingHours: {
        start: newProfStartHour || '10:00',
        end: newProfEndHour || '19:00'
      }
    });

    setNewProfName('');
    setNewProfEmail('');
    setNewProfPhone('+56 9 ');
    setNewProfCategories(['hair']);
    setNewProfServiceIds([]);
    setNewProfWorkingDays(['lun', 'mar', 'mie', 'jue', 'vie', 'sab']);
    setNewProfStartHour('10:00');
    setNewProfEndHour('19:00');
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
      category: newServiceCategory,
      durationMinutes: Number(newServiceDuration) || 60,
      price: Number(newServicePrice) || 25000,
      defaultRecurrenceDays: Number(newServiceRecurrenceDays) || 30,
      description: 'Servicio creado durante la configuración inicial.'
    });
    setNewServiceName('');
    setNewServicePrice(30000);
    setNewServiceDuration(60);
    setNewServiceCategory('hair');
    setNewServiceRecurrenceDays(30);
    setIsAddingCustomService(false);
    showToast('Servicio Agregado', `Se agregó "${newServiceName.trim()}" a tu carta.`, 'success');
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
                {step === 2 && 'Paso 2 de 3: Tu Carta de Servicios'}
                {step === 3 && 'Paso 3 de 3: Profesionales & Especialistas'}
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
                2. Servicios
              </span>
              <span className="text-white/30">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 3 ? 'bg-brand-500 text-white font-bold' : 'bg-white/10 text-white/60'}`}>
                3. Profesionales
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
                <h4 className="font-bold text-xs text-charcoal-900">Tus Servicios</h4>
                <p className="text-[11px] text-charcoal-500">Elige tus servicios con 1 solo clic.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100/80 text-brand-800 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">Profesionales & Especialistas</h4>
                <p className="text-[11px] text-charcoal-500">Tus estilistas y profesionales estrella.</p>
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
                Estos datos aparecerán en los recordatorios automáticos de WhatsApp y en el portal de tus clientes y clientas.
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

              {/* Address with Google Places Autocomplete */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-charcoal-700 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600" />
                    Dirección Física
                  </label>
                  {isAddressVerified ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Verificada en Maps
                    </span>
                  ) : isMapsLoaded ? (
                    <span className="text-[10px] text-brand-600 font-semibold flex items-center">
                      <Sparkles className="w-3 h-3 mr-0.5 text-brand-500" />
                      Google Places
                    </span>
                  ) : null}
                </div>

                <div className="relative flex items-center">
                  <input
                    ref={addressInputRef}
                    type="text"
                    value={salonAddress}
                    onChange={(e) => {
                      setSalonAddress(e.target.value);
                      setIsAddressVerified(false);
                    }}
                    placeholder="Ej. Nueva Costanera 3222 (o busca tu salón)"
                    className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  {salonAddress.trim() && (
                    <a
                      href={salonMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonAddress + ', ' + salonCity)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 p-1 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Ver y comprobar pin en Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-charcoal-400">
                  <span className="truncate">Escribe y selecciona para verificar en Google Maps.</span>
                  {salonAddress.trim() && (
                    <a
                      href={salonMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonAddress + ', ' + salonCity)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline font-semibold text-[10px] shrink-0 ml-2 inline-flex items-center"
                    >
                      Ver en Maps ↗
                    </a>
                  )}
                </div>
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

            {/* Foto de Portada o Fachada con opción de Subida */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-charcoal-700">
                  Foto de Portada o Fachada del Salón
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Tu Propia Foto</span>
                </button>
              </div>

              {/* Vista previa de foto propia subida */}
              {isCustomPhoto && (
                <div className="rounded-2xl border-2 border-brand-500 ring-2 ring-brand-300/40 p-2 bg-brand-50/40 shadow-xs flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={salonLogo}
                      alt="Foto subida del salón"
                      className="w-20 h-14 object-cover rounded-xl border border-brand-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Foto personalizada seleccionada
                      </span>
                      <p className="text-xs font-bold text-charcoal-900 truncate">Foto subida desde tu dispositivo</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold underline mt-0.5 block text-left"
                      >
                        Cambiar por otra imagen
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPhoto(false);
                      setSalonLogo(PRESET_SALON_PHOTOS[0]);
                    }}
                    className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    title="Quitar foto propia y volver a fotos de muestra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div>
                <p className="text-[11px] text-charcoal-500 mb-2 font-medium">
                  {isCustomPhoto 
                    ? "O si prefieres, elige una de nuestras fotos de muestra:" 
                    : "Elige una foto de muestra o presiona 'Subir Tu Propia Foto':"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_SALON_PHOTOS.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSalonLogo(photoUrl);
                        setIsCustomPhoto(false);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                        salonLogo === photoUrl && !isCustomPhoto 
                          ? 'border-brand-500 ring-2 ring-brand-300 shadow-sm' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photoUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      {salonLogo === photoUrl && !isCustomPhoto && (
                        <div className="absolute inset-0 bg-brand-900/30 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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
                <span>Continuar a Tus Servicios</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: TUS SERVICIOS (SELECCIÓN VISUAL CON 1 CLIC)                      */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 2 de 3</Badge>
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
                <span>Agregar un servicio personalizado</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomService} className="p-4 sm:p-5 bg-white border-2 border-brand-300 ring-2 ring-brand-100/50 rounded-2xl space-y-4 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-brand-100 pb-2.5">
                  <span className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Nuevo Servicio Personalizado
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomService(false)}
                    className="text-charcoal-400 hover:text-charcoal-700 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Fila 1: Categoría y Nombre */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => {
                        const cat = e.target.value as ServiceCategory;
                        setNewServiceCategory(cat);
                        // Auto-sugerir recurrencia inteligente según categoría
                        if (cat === 'nails') setNewServiceRecurrenceDays(15);
                        else if (cat === 'brows_lashes') setNewServiceRecurrenceDays(25);
                        else if (cat === 'skincare') setNewServiceRecurrenceDays(30);
                        else if (cat === 'spa') setNewServiceRecurrenceDays(30);
                        else setNewServiceRecurrenceDays(45);
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 font-medium text-charcoal-800"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Nombre del Servicio *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="Ej. Mechas Babylights, Retoque de Raíz, etc."
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                </div>

                {/* Fila 2: Precio, Duración y Frecuencia de Retorno */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Precio ($ CLP) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Duración del Servicio *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={10}
                        step={5}
                        value={newServiceDuration}
                        onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 pr-12 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-charcoal-400 font-medium pointer-events-none">
                        min
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      ¿Cada cuánto tiempo realizarse? *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={7}
                        max={365}
                        value={newServiceRecurrenceDays}
                        onChange={(e) => setNewServiceRecurrenceDays(Number(e.target.value))}
                        className="w-full px-3 py-2 pr-12 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 font-medium text-charcoal-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-charcoal-400 font-medium pointer-events-none">
                        días
                      </span>
                    </div>
                  </div>
                </div>

                {/* Presets rápidos de sugerencia */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-charcoal-500 font-medium mr-1">Frecuencia sugerida:</span>
                  {[
                    { label: '15 días (Uñas)', days: 15 },
                    { label: '25 días (Pestañas/Raíz)', days: 25 },
                    { label: '30 días (1 mes)', days: 30 },
                    { label: '45 días (1.5 meses)', days: 45 },
                    { label: '60 días (2 meses)', days: 60 },
                    { label: '90 días (3 meses)', days: 90 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setNewServiceRecurrenceDays(preset.days)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                        newServiceRecurrenceDays === preset.days
                          ? 'bg-brand-100 border-brand-400 text-brand-900 font-bold'
                          : 'bg-[#FAF8F5] border-brand-200 text-charcoal-600 hover:bg-brand-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-brand-100">
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
                    className="text-xs font-bold shadow-xs"
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
                <span>Continuar a Profesionales & Especialistas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PROFESIONALES & ESPECIALISTAS                                     */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 3 de 3</Badge>
                <h3 className="font-serif text-xl font-bold text-charcoal-950">
                  Profesionales & Especialistas
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Agrega a las y los profesionales de tu salón para que clientes y clientas puedan reservar hora con ellos.
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
                    Profesionales en el Salón ({professionals.length})
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
                      className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl flex items-start justify-between space-x-3 shadow-2xs"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-300 shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs font-bold text-charcoal-900 truncate">{prof.name}</h4>
                          <p className="text-[11px] text-brand-700 font-medium truncate">{prof.roleTitle}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-charcoal-500">
                            {prof.phone && (
                              <span className="flex items-center">
                                <Phone className="w-2.5 h-2.5 mr-0.5 text-charcoal-400" />
                                {prof.phone}
                              </span>
                            )}
                            {prof.email && (
                              <span className="flex items-center truncate max-w-[130px]">
                                <Mail className="w-2.5 h-2.5 mr-0.5 text-charcoal-400 shrink-0" />
                                <span className="truncate">{prof.email}</span>
                              </span>
                            )}
                          </div>

                          {prof.workingDays && prof.workingDays.length > 0 && (
                            <p className="text-[10px] text-charcoal-500 flex items-center pt-0.5">
                              <Calendar className="w-2.5 h-2.5 mr-1 text-charcoal-400 shrink-0" />
                              <span className="truncate">
                                {formatWorkingDays(prof.workingDays)}
                                {prof.workingHours ? ` · ${prof.workingHours.start} - ${prof.workingHours.end}` : ''}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteProfessional(prof.id)}
                        className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
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
            <form onSubmit={handleAddCustomStylist} className="p-4 sm:p-5 bg-white border border-brand-200/90 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2.5">
                <span className="text-xs font-bold text-charcoal-900 flex items-center">
                  <Plus className="w-4 h-4 mr-1 text-brand-600" />
                  Añadir Profesional o Especialista
                </span>
                <span className="text-[11px] text-charcoal-400">Datos para agenda y contacto</span>
              </div>

              {/* Basic Details: Name, Email, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    placeholder="Ej. Valentina Morales"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1 flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-charcoal-400" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={newProfEmail}
                    onChange={(e) => setNewProfEmail(e.target.value)}
                    placeholder="valentina@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-charcoal-400" />
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newProfPhone}
                    onChange={(e) => setNewProfPhone(e.target.value)}
                    placeholder="+56 9 8123 4567"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              {/* Categorías y Servicios que atiende */}
              <div className="space-y-2 pt-1 border-t border-brand-100/60">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-charcoal-800">
                    Categorías y Servicios que atiende (para linkear a la agenda) *
                  </label>
                  <span className="text-[10px] text-brand-600 font-medium">Selecciona al menos una categoría</span>
                </div>
                
                {/* Categorías Principales */}
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = newProfCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (newProfCategories.length > 1) {
                              setNewProfCategories(newProfCategories.filter((c) => c !== cat.id));
                            }
                          } else {
                            setNewProfCategories([...newProfCategories, cat.id]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-500 shadow-2xs'
                            : 'bg-[#FAF8F5] text-charcoal-700 border-brand-200 hover:bg-brand-50/50'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        {isSelected && <Check className="w-3 h-3 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Servicios específicos del Salón configurados en Paso 2 */}
                {services.length > 0 && (
                  <div className="pt-1.5">
                    <p className="text-[10px] text-charcoal-500 mb-1.5">
                      Servicios específicos de tu salón que realiza (clic para asignar o desasignar):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#FAF8F5] rounded-xl border border-brand-200/60">
                      {services.map((serv) => {
                        const isAssigned = newProfServiceIds.includes(serv.id) || 
                          (newProfServiceIds.length === 0 && newProfCategories.includes(serv.category));
                        return (
                          <button
                            key={serv.id}
                            type="button"
                            onClick={() => {
                              if (newProfServiceIds.length === 0) {
                                const matchingIds = services.filter((s) => newProfCategories.includes(s.category)).map((s) => s.id);
                                if (matchingIds.includes(serv.id)) {
                                  setNewProfServiceIds(matchingIds.filter((id) => id !== serv.id));
                                } else {
                                  setNewProfServiceIds([...matchingIds, serv.id]);
                                }
                              } else if (newProfServiceIds.includes(serv.id)) {
                                setNewProfServiceIds(newProfServiceIds.filter((id) => id !== serv.id));
                              } else {
                                setNewProfServiceIds([...newProfServiceIds, serv.id]);
                              }
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                              isAssigned
                                ? 'bg-brand-100 text-brand-900 border-brand-300 font-semibold shadow-2xs'
                                : 'bg-white text-charcoal-500 border-charcoal-200 hover:border-brand-300'
                            }`}
                          >
                            <span>{serv.name}</span>
                            {isAssigned && <span className="ml-1 text-brand-700">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Días y Horarios que atiende */}
              <div className="pt-2 border-t border-brand-100/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-charcoal-800 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-charcoal-400" />
                      Días que atiende en el salón
                    </label>
                    <div className="space-x-1">
                      <button
                        type="button"
                        onClick={() => setNewProfWorkingDays(['lun', 'mar', 'mie', 'jue', 'vie', 'sab'])}
                        className="text-[10px] text-brand-600 hover:underline"
                      >
                        Lun-Sáb
                      </button>
                      <span className="text-[10px] text-charcoal-300">·</span>
                      <button
                        type="button"
                        onClick={() => setNewProfWorkingDays(['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'])}
                        className="text-[10px] text-brand-600 hover:underline"
                      >
                        Todos
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {WEEK_DAYS.map((day) => {
                      const isActive = newProfWorkingDays.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          title={day.full}
                          onClick={() => {
                            if (isActive) {
                              if (newProfWorkingDays.length > 1) {
                                setNewProfWorkingDays(newProfWorkingDays.filter((d) => d !== day.id));
                              }
                            } else {
                              setNewProfWorkingDays([...newProfWorkingDays, day.id]);
                            }
                          }}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white shadow-2xs'
                              : 'bg-[#FAF8F5] text-charcoal-500 border border-brand-200 hover:bg-brand-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-800 mb-1.5 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-charcoal-400" />
                    Horario de atención
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={newProfStartHour}
                      onChange={(e) => setNewProfStartHour(e.target.value)}
                      className="px-2 py-1 text-xs bg-[#FAF8F5] border border-brand-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 font-medium"
                    />
                    <span className="text-xs text-charcoal-400 font-medium">a</span>
                    <input
                      type="time"
                      value={newProfEndHour}
                      onChange={(e) => setNewProfEndHour(e.target.value)}
                      className="px-2 py-1 text-xs bg-[#FAF8F5] border border-brand-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="pt-2 border-t border-brand-100/60">
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1.5">Foto de perfil:</label>
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

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="luxury"
                  size="sm"
                  disabled={!newProfName.trim()}
                  className="text-xs font-bold px-4"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar Profesional
                </Button>
              </div>
            </form>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver a Servicios
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
                Hemos configurado la base de <strong>{salonName || currentSalon.name}</strong>. Ya puedes empezar a agendar citas y recibir clientes y clientas.
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
                <Scissors className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="block text-[11px] text-charcoal-500">Servicios</span>
                <span className="block text-xs font-bold text-charcoal-900">{services.length} activos</span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-brand-200/80 rounded-2xl">
                <Users className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="block text-[11px] text-charcoal-500">Profesionales</span>
                <span className="block text-xs font-bold text-charcoal-900">{professionals.length} en equipo</span>
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
                Puedes poner este link en tu biografía de Instagram o enviarlo por WhatsApp a tus clientes y clientas.
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
