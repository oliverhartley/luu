import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Store, 
  Users, 
  Armchair, 
  Sparkles, 
  Package, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Upload, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  X, 
  Heart,
  Smile,
  BadgeCheck,
  DollarSign,
  AlertCircle,
  HelpCircle,
  SkipForward
} from 'lucide-react';
import { Professional, Service, Station, InventoryProduct, ServiceCategory, TenantSalon } from '../../types';
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
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
];

const PRESET_SALON_PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&auto=format&fit=crop&q=80'
];

const PRESET_COLORS = [
  '#D57B6C', '#E8B4B8', '#BCA893', '#A34638', '#6366F1', '#EC4899', '#10B981', '#F59E0B'
];

const SUGGESTED_SERVICES: Array<Omit<Service, 'id' | 'salonId'>> = [
  {
    name: 'Balayage Signature & Matiz Gloss',
    category: 'hair',
    durationMinutes: 180,
    price: 95000,
    description: 'Aclaración degradada personalizada, baño de luz, tratamiento restaurador y peinado con ondas.',
    defaultRecurrenceDays: 90
  },
  {
    name: 'Corte de Autor & Peinado Brushing',
    category: 'hair',
    durationMinutes: 50,
    price: 32000,
    description: 'Diagnóstico capilar, visagismo según forma de rostro, lavado relajante y styling final.',
    defaultRecurrenceDays: 45
  },
  {
    name: 'Lavado Spa, Masaje & Brushing',
    category: 'hair',
    durationMinutes: 40,
    price: 18000,
    description: 'Lavado con masaje craneal relajante y secado con movimiento.',
    defaultRecurrenceDays: 20
  },
  {
    name: 'Manicura Rusa Combinada + Esmaltado Permanente',
    category: 'nails',
    durationMinutes: 60,
    price: 26000,
    description: 'Limpieza profunda de cutículas con torno, nivelación y esmaltado de alta duración.',
    defaultRecurrenceDays: 21
  },
  {
    name: 'Lifting de Pestañas con Keratina & Tinte Negro',
    category: 'brows_lashes',
    durationMinutes: 50,
    price: 28000,
    description: 'Curvatura natural desde la raíz, nutrición intensa con keratina y efecto máscara de pestañas.',
    defaultRecurrenceDays: 45
  },
  {
    name: 'Hidratación Profunda & Cauterización Molecular',
    category: 'spa',
    durationMinutes: 60,
    price: 45000,
    description: 'Tratamiento intensivo para sellar cutícula y recuperar brillo y suavidad extrema.',
    defaultRecurrenceDays: 30
  }
];

const SUGGESTED_PRODUCTS: Array<Omit<InventoryProduct, 'id' | 'salonId' | 'lastRestocked'>> = [
  {
    name: 'Shampoo No. 4 Bond Maintenance 250ml',
    brand: 'Olaplex',
    category: 'retail',
    currentStock: 12,
    minStockAlert: 3,
    unit: 'unidades',
    costPrice: 18000,
    salePrice: 32000,
    isForSale: true,
    description: 'Shampoo reparador que limpia suavemente e hidrata el cabello dañado por decoloración.'
  },
  {
    name: 'Tinte Profesional Majirel 50ml (Gama Fríos)',
    brand: "L'Oréal Professionnel",
    category: 'tintes',
    currentStock: 24,
    minStockAlert: 6,
    unit: 'tubos',
    costPrice: 5500,
    salePrice: 0,
    isForSale: false,
    description: 'Coloración permanente con Ionène G e Incell para máxima cobertura de canas.'
  },
  {
    name: 'Aceite Elixir Ultime L\'Huile Originale 100ml',
    brand: 'Kérastase',
    category: 'retail',
    currentStock: 8,
    minStockAlert: 2,
    unit: 'unidades',
    costPrice: 26000,
    salePrice: 44000,
    isForSale: true,
    description: 'Aceite sublimador capilar con extracto de camelia salvaje para brillo y protección térmica.'
  },
  {
    name: 'Colección GelColor Esmalte Permanente 15ml',
    brand: 'OPI',
    category: 'esmaltes',
    currentStock: 30,
    minStockAlert: 5,
    unit: 'frascos',
    costPrice: 7500,
    salePrice: 0,
    isForSale: false,
    description: 'Esmaltado en gel con acabado ultrabrillante y duración de hasta 3 semanas.'
  }
];

export const OnboardingWizardModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    completeOnboarding,
    currentSalon,
    updateSalonInfo,
    professionals,
    addProfessional,
    deleteProfessional,
    stations,
    addStation,
    deleteStation,
    services,
    addService,
    inventory,
    addProduct,
    setActiveTab
  } = useApp();

  // Step state: 0 = Welcome, 1 = Salon Info, 2 = Stylists, 3 = Stations, 4 = Services, 5 = Products, 6 = Success
  const [step, setStep] = useState<number>(0);

  // STEP 1: Salon Info Form
  const [salonName, setSalonName] = useState<string>(currentSalon?.name || '');
  const [salonSlogan, setSalonSlogan] = useState<string>(currentSalon?.slogan || 'El templo de la belleza y diseño de autor');
  const [salonAddress, setSalonAddress] = useState<string>(currentSalon?.address && currentSalon?.address !== 'Dirección por configurar' ? currentSalon.address : '');
  const [salonCity, setSalonCity] = useState<string>(currentSalon?.city || 'Santiago, Chile');
  const [salonPhone, setSalonPhone] = useState<string>(currentSalon?.phone || '+56 9 ');
  const [salonEmail, setSalonEmail] = useState<string>(currentSalon?.email || '');
  const [salonInstagram, setSalonInstagram] = useState<string>(currentSalon?.instagram || '@tupeluqueria');
  const [salonHours, setSalonHours] = useState<string>(currentSalon?.openingHours || 'Lunes a Sábado 10:00 - 20:00');
  const [salonLogo, setSalonLogo] = useState<string>(currentSalon?.logo || '');

  // Track open transition so we only initialize state once when modal opens
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOnboardingOpen && !wasOpenRef.current) {
      setStep(0);
      setSalonName(currentSalon?.name || '');
      setSalonPhone(currentSalon?.phone || '+56 9 ');
      setSalonCity(currentSalon?.city || 'Santiago, Chile');
      setSalonEmail(currentSalon?.email || '');
      setSalonAddress(currentSalon?.address && currentSalon?.address !== 'Dirección por configurar' ? currentSalon.address : '');
      setSalonSlogan(currentSalon?.slogan || '');
      setSalonInstagram(currentSalon?.instagram || '');
      setSalonHours(currentSalon?.openingHours || 'Lunes a Sábado 10:00 - 20:00');
      setSalonLogo(currentSalon?.logo || '');
    }
    wasOpenRef.current = isOnboardingOpen;
  }, [isOnboardingOpen]);

  // STEP 2: Stylist Form (No comisiones!)
  const [profName, setProfName] = useState<string>('');
  const [profRoleTitle, setProfRoleTitle] = useState<string>('Master Colorista & Balayage');
  const [profPhone, setProfPhone] = useState<string>('+56 9 ');
  const [profSpecialties, setProfSpecialties] = useState<ServiceCategory[]>(['hair']);
  const [profColorHex, setProfColorHex] = useState<string>(PRESET_COLORS[0]);
  const [profAvatar, setProfAvatar] = useState<string>('');
  const profFileInputRef = useRef<HTMLInputElement>(null);

  // STEP 3: Station Form
  const [stationName, setStationName] = useState<string>('');
  const [stationCategory, setStationCategory] = useState<Station['category']>('hair_color');
  const [stationChairNum, setStationChairNum] = useState<number>(stations.length + 1);
  const [stationAssignedProfId, setStationAssignedProfId] = useState<string>('');
  const [stationPhoto, setStationPhoto] = useState<string>('');
  const stationFileInputRef = useRef<HTMLInputElement>(null);

  // STEP 4: Service Custom Form
  const [customServName, setCustomServName] = useState<string>('');
  const [customServCategory, setCustomServCategory] = useState<ServiceCategory>('hair');
  const [customServDuration, setCustomServDuration] = useState<number>(60);
  const [customServPrice, setCustomServPrice] = useState<number>(35000);
  const [customServDesc, setCustomServDesc] = useState<string>('');

  // STEP 5: Product Custom Form
  const [customProdName, setCustomProdName] = useState<string>('');
  const [customProdBrand, setCustomProdBrand] = useState<string>('');
  const [customProdCategory, setCustomProdCategory] = useState<InventoryProduct['category']>('retail');
  const [customProdStock, setCustomProdStock] = useState<number>(10);
  const [customProdCost, setCustomProdCost] = useState<number>(15000);
  const [customProdSale, setCustomProdSale] = useState<number>(28000);
  const [customProdIsForSale, setCustomProdIsForSale] = useState<boolean>(true);

  if (!isOnboardingOpen) return null;

  // Handle Image Upload for Stylist
  const handleProfPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Image Upload for Station
  const handleStationPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStationPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Step 1 (Salon Info) and go to Step 2
  const handleSaveSalonInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonInfo({
      name: salonName.trim() || currentSalon.name,
      slogan: salonSlogan.trim(),
      address: salonAddress.trim(),
      city: salonCity.trim(),
      phone: salonPhone.trim(),
      email: salonEmail.trim(),
      instagram: salonInstagram.trim(),
      openingHours: salonHours.trim(),
      logo: salonLogo
    });
    setStep(2);
  };

  // Add Professional in Step 2
  const handleAddProfessional = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profName.trim()) return;

    // Fallback avatar if empty: initials avatar or first preset
    const fallbackAvatar = profAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profName.trim())}&background=D57B6C&color=fff&size=200`;

    addProfessional({
      name: profName.trim(),
      roleTitle: profRoleTitle.trim() || 'Estilista Profesional',
      specialties: profSpecialties.length > 0 ? profSpecialties : ['hair'],
      avatar: fallbackAvatar,
      rating: 5.0,
      commissionRate: 0.4, // standard background default, not requested in UI
      phone: profPhone.trim(),
      colorHex: profColorHex
    });

    // Reset Form
    setProfName('');
    setProfRoleTitle('Colorista & Estilista');
    setProfPhone('+56 9 ');
    setProfAvatar('');
  };

  // Add Station in Step 3
  const handleAddStation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const assignedProf = professionals.find((p) => p.id === stationAssignedProfId);

    const sName = stationName.trim() || `Sillón ${stationChairNum} · ${stationCategory.replace('_', ' ')}`;

    addStation({
      name: sName,
      category: stationCategory,
      chairNumber: stationChairNum,
      assignedProfessionalId: assignedProf?.id,
      assignedProfessionalName: assignedProf?.name || 'Staff Rotativo',
      assignedProfessionalAvatar: assignedProf?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      photoUrl: stationPhoto || undefined,
      status: 'ready'
    });

    // Reset & increment chair
    setStationName('');
    setStationPhoto('');
    setStationChairNum((prev) => prev + 1);
  };

  // Quick 1-click Station Preset
  const handleQuickAddStation = (cat: Station['category'], defaultLabel: string) => {
    const chairNum = stations.length + 1;
    const defaultProf = professionals[chairNum % professionals.length] || professionals[0];

    addStation({
      name: `${defaultLabel} ${chairNum}`,
      category: cat,
      chairNumber: chairNum,
      assignedProfessionalId: defaultProf?.id,
      assignedProfessionalName: defaultProf?.name || 'Staff Rotativo',
      assignedProfessionalAvatar: defaultProf?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'ready'
    });
  };

  // Add Service in Step 4
  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServName.trim()) return;

    addService({
      name: customServName.trim(),
      category: customServCategory,
      durationMinutes: Number(customServDuration),
      price: Number(customServPrice),
      description: customServDesc.trim() || 'Servicio realizado con técnicas de autor y productos premium.'
    });

    setCustomServName('');
    setCustomServDesc('');
  };

  // Add 1-click Suggested Service
  const handleAddSuggestedService = (s: Omit<Service, 'id' | 'salonId'>) => {
    const alreadyExists = services.some((existing) => existing.name.toLowerCase() === s.name.toLowerCase());
    if (!alreadyExists) {
      addService(s);
    }
  };

  // Add Product in Step 5
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProdName.trim()) return;

    addProduct({
      name: customProdName.trim(),
      brand: customProdBrand.trim() || 'Marca Profesional',
      category: customProdCategory,
      currentStock: Number(customProdStock),
      minStockAlert: 2,
      unit: 'unidades',
      costPrice: Number(customProdCost),
      salePrice: customProdIsForSale ? Number(customProdSale) : 0,
      isForSale: customProdIsForSale,
      description: 'Producto registrado desde el asistente de configuración inicial.'
    });

    setCustomProdName('');
    setCustomProdBrand('');
  };

  // Add 1-click Suggested Product
  const handleAddSuggestedProduct = (p: Omit<InventoryProduct, 'id' | 'salonId' | 'lastRestocked'>) => {
    const alreadyExists = inventory.some((existing) => existing.name.toLowerCase() === p.name.toLowerCase());
    if (!alreadyExists) {
      addProduct(p);
    }
  };

  // Finish Wizard
  const handleFinishWizard = () => {
    completeOnboarding();
    setActiveTab('agenda');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-brand-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header Bar & Progress Tracker */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-brand-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white shadow-lg shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold tracking-tight">
                  luu<span className="text-brand-400">.</span>
                </span>
                <span className="text-white/40 text-xs">|</span>
                <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">
                  Asistente de Configuración
                </span>
              </div>
              <p className="text-[11px] text-charcoal-300">
                Paso a paso para dejar tu salón funcionando al 100%
              </p>
            </div>
          </div>

          {/* Steps Indicator Badges (Only shown for steps 1-5) */}
          {step >= 1 && step <= 5 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {[
                { num: 1, label: 'Salón', icon: Store },
                { num: 2, label: 'Peluqueras', icon: Users },
                { num: 3, label: 'Sillones', icon: Armchair },
                { num: 4, label: 'Servicios', icon: Scissors },
                { num: 5, label: 'Productos', icon: Package }
              ].map((item) => {
                const isActive = step === item.num;
                const isCompleted = step > item.num;
                const Icon = item.icon;

                return (
                  <button
                    key={item.num}
                    onClick={() => setStep(item.num)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : isCompleted
                        ? 'bg-white/15 text-brand-200 hover:bg-white/25'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Close / Skip All button */}
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors ml-auto sm:ml-0"
            title="Guardar y cerrar por ahora"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 0: BIENVENIDA SIMPÁTICA Y GRACIOSA                                   */}
        {/* ========================================================================= */}
        {step === 0 && (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              
              <div className="inline-flex items-center space-x-2 bg-brand-50 text-brand-800 px-4 py-1.5 rounded-full border border-brand-200 text-xs font-bold shadow-2xs animate-bounce">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>¡Hola, artista del peinado y la belleza!</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 leading-tight">
                Sabemos que organizar una peluquería es más difícil que desenredar una decoloración mal hecha...
              </h2>

              <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-sans">
                Entre clientas que llegan 20 minutos tarde diciendo <i>"¡estoy a la vuelta!"</i> y mezclas secretas de tintes anotadas en servilletas, el día a día puede ser un torbellino. 
                <br className="hidden sm:inline" />
                Por eso creamos este asistente: <strong>en solo 3 minutos dejamos tu salón impecable, digital y listo para brillar. ✨</strong>
              </p>
            </div>

            {/* Quick Steps Overview Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl mx-auto w-full">
              
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 space-y-1.5 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                  <Store className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">1. Tu Templo</h4>
                <p className="text-[11px] text-charcoal-600 leading-snug">
                  Dirección, teléfono de contacto y tu Instagram para presumir los antes y después.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 space-y-1.5 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-roseGold text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">2. Tu Dream Team</h4>
                <p className="text-[11px] text-charcoal-600 leading-snug">
                  Tus peluqueras estrella. Fotos optativas (por si hoy no se han peinado).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 space-y-1.5 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-charcoal-800 text-white flex items-center justify-center shadow-xs">
                  <Armchair className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-charcoal-900">3. Los Sillones</h4>
                  <Badge variant="luxury" className="text-[9px]">Skip</Badge>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-snug">
                  Tus tronos de atención. Puedes saltarlo si aún estás reacomodando los espejos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 space-y-1.5 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-charcoal-900">4. Tu Carta de Mimos</h4>
                <p className="text-[11px] text-charcoal-600 leading-snug">
                  Balayage, cortes, uñas o spa. Elige de nuestras plantillas con 1 clic.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 space-y-1.5 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-charcoal-900">5. Pócimas & Shampoos</h4>
                  <Badge variant="luxury" className="text-[9px]">Skip</Badge>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-snug">
                  Controla stock técnico o venta retail. También puedes omitirlo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-1.5 flex flex-col justify-center">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                  <Smile className="w-4 h-4" />
                  <span>¡Sin Estrés!</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Puedes editar todo después cuantas veces quieras. ¡Nada está grabado en piedra!
                </p>
              </div>

            </div>

            {/* Welcome CTA Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-brand-100">
              <Button
                variant="luxury"
                size="lg"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2"
              >
                <span>¡Vamos a configurar mi salón! 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: INFORMACIÓN DEL SALÓN (DIRECCIÓN, CONTACTO, INSTAGRAM, HORARIOS)  */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleSaveSalonInfo} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 1 de 5</Badge>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                  La Identidad de tu Salón
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Estos datos aparecerán en los recordatorios automáticos de WhatsApp y el portal de tus clientas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Salon Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Nombre de la Peluquería / Salón *
                </label>
                <input
                  type="text"
                  required
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Ej. luu. Vitacura"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Eslogan o Frase Característica
                </label>
                <input
                  type="text"
                  value={salonSlogan}
                  onChange={(e) => setSalonSlogan(e.target.value)}
                  placeholder="Ej. Especialistas en balayage y diseño de autor"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600" />
                  Dirección Física Completa
                </label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  placeholder="Ej. Av. Alonso de Córdova 3820, Local 4"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* City / Country */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Comuna, Ciudad y País
                </label>
                <input
                  type="text"
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  placeholder="Ej. Santiago, Chile"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  WhatsApp / Teléfono Oficial de Contacto
                </label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  placeholder="+56 9 8123 4567"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Correo Electrónico de Contacto
                </label>
                <input
                  type="email"
                  value={salonEmail}
                  onChange={(e) => setSalonEmail(e.target.value)}
                  placeholder="contacto@tupeluqueria.cl"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <InstagramIcon className="w-3.5 h-3.5 mr-1 text-pink-600" />
                  Instagram del Salón
                </label>
                <input
                  type="text"
                  value={salonInstagram}
                  onChange={(e) => setSalonInstagram(e.target.value)}
                  placeholder="@luu.vitacura"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Horario de Atención Habitual
                </label>
                <input
                  type="text"
                  value={salonHours}
                  onChange={(e) => setSalonHours(e.target.value)}
                  placeholder="Ej. Lun a Sáb 10:00 - 20:00"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

            </div>

            {/* Salon Logo / Aesthetic Photo (Optativo) */}
            <div className="pt-2 border-t border-brand-100">
              <label className="block text-xs font-bold text-charcoal-700 mb-2 flex items-center justify-between">
                <span>Foto de Fachada o Logo del Salón (Optativo)</span>
                <span className="text-[10px] text-charcoal-400 font-normal">Puedes subir una imagen o elegir un preset</span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                {/* Presets */}
                {PRESET_SALON_PHOTOS.map((photoUrl, idx) => (
                  <img
                    key={idx}
                    src={photoUrl}
                    alt={`Preset salón ${idx + 1}`}
                    onClick={() => setSalonLogo(photoUrl)}
                    className={`w-16 h-12 rounded-xl object-cover cursor-pointer border transition-all ${
                      salonLogo === photoUrl ? 'ring-2 ring-brand-500 scale-105 border-brand-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}

                {/* Upload Custom Logo/Photo */}
                <label className="w-16 h-12 rounded-xl border border-dashed border-brand-300 hover:border-brand-500 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] text-charcoal-500 hover:text-brand-700 transition-all">
                  <Camera className="w-4 h-4" />
                  <span className="text-[9px] font-bold mt-0.5">Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') setSalonLogo(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {salonLogo && (
                  <button
                    type="button"
                    onClick={() => setSalonLogo('')}
                    className="text-xs text-red-500 hover:underline ml-2"
                  >
                    Quitar foto
                  </button>
                )}
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
                <span>Guardar y Continuar a Peluqueras</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: LAS PELUQUERAS (FOTOS OPTATIVO, SIN COMISIÓN)                     */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 2 de 5</Badge>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                  Las Peluqueras & Tu Equipo
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Configura a las estilistas de tu equipo. Las fotos son <strong>optativas</strong> y puedes subir una o elegir un preset.
              </p>
            </div>

            {/* Current Stylists List */}
            <div>
              <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                Equipo Configurado ({professionals.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 flex items-center justify-between space-x-3 shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-charcoal-950 truncate">{prof.name}</h5>
                        <p className="text-[11px] text-charcoal-500 truncate">{prof.roleTitle}</p>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: prof.colorHex }}
                          />
                          <span className="text-[10px] text-charcoal-400">{prof.phone}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteProfessional(prof.id)}
                      className="text-charcoal-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar estilista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form to Add Stylist */}
            <div className="bg-white p-5 rounded-3xl border border-brand-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                  Añadir Peluquera al Salón
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    placeholder="Ej. Valentina Morales"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Rol / Especialidad Principal</label>
                  <input
                    type="text"
                    value={profRoleTitle}
                    onChange={(e) => setProfRoleTitle(e.target.value)}
                    placeholder="Ej. Master Colorista, Manicurista Senior"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    placeholder="+56 9 8123 4567"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              {/* Specialties & Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Especialidades que atiende</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['hair', 'nails', 'brows_lashes', 'skincare', 'spa'] as ServiceCategory[]).map((cat) => {
                      const isSelected = profSpecialties.includes(cat);
                      const labels: Record<string, string> = {
                        hair: '💇‍♀️ Cabello',
                        nails: '💅 Uñas',
                        brows_lashes: '👁️ Pestañas/Cejas',
                        skincare: '✨ Facial',
                        spa: '🧖‍♀️ Spa'
                      };
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => {
                            setProfSpecialties((prev) =>
                              isSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-brand-500 text-white border-brand-500 shadow-2xs'
                              : 'bg-[#FAF8F5] text-charcoal-700 border-brand-200 hover:bg-white'
                          }`}
                        >
                          {labels[cat] || cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Color en la Agenda</label>
                  <div className="flex items-center space-x-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setProfColorHex(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          profColorHex === c ? 'scale-125 ring-2 ring-offset-2 ring-charcoal-900' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Photo */}
              <div className="pt-2 border-t border-brand-100">
                <label className="block text-xs font-bold text-charcoal-700 mb-2 flex items-center justify-between">
                  <span>Foto de Perfil (Optativo)</span>
                  <span className="text-[10px] text-charcoal-400 font-normal">Sube foto de tu estilista o elige de los presets</span>
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* File Upload Button */}
                  <label className="w-10 h-10 rounded-xl border border-dashed border-brand-300 hover:border-brand-500 bg-[#FAF8F5] flex flex-col items-center justify-center cursor-pointer text-charcoal-500 hover:text-brand-700 transition-all">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      ref={profFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfPhotoUpload}
                    />
                  </label>

                  {/* Preset Avatars */}
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Preset"
                      onClick={() => setProfAvatar(av)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border transition-all ${
                        profAvatar === av ? 'ring-2 ring-brand-500 scale-110 border-brand-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}

                  {profAvatar && (
                    <div className="flex items-center space-x-2 ml-2">
                      <img
                        src={profAvatar}
                        alt="Seleccionada"
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setProfAvatar('')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="luxury"
                  disabled={!profName.trim()}
                  onClick={() => handleAddProfessional()}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Añadir a la lista
                </Button>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Anterior
              </Button>

              <Button
                variant="luxury"
                onClick={() => setStep(3)}
                className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
              >
                <span>Siguiente: Sillones</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SILLONES (FOTOS OPTATIVO, CON OPCIÓN DE SKIP)                      */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="luxury">Paso 3 de 5</Badge>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                    Sillones & Estaciones
                  </h3>
                </div>
                <p className="text-xs text-charcoal-500 mt-1">
                  Organiza los puestos de atención. Fotos optativas. Si prefieres hacerlo después, puedes <strong>saltar este paso</strong>.
                </p>
              </div>

              {/* SKIP BUTTON */}
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-charcoal-600 bg-charcoal-100 hover:bg-charcoal-200 transition-colors self-start sm:self-auto"
              >
                <span>Saltar este paso</span>
                <SkipForward className="w-3.5 h-3.5 text-charcoal-500" />
              </button>
            </div>

            {/* 1-Click Quick Add Presets */}
            <div className="bg-brand-50/70 p-4 rounded-3xl border border-brand-200/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Agregar estaciones comunes con 1 clic</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAddStation('hair_cut', 'Sillón de Corte & Peinado')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-brand-200 hover:border-brand-400 rounded-xl shadow-2xs flex items-center space-x-1.5 text-charcoal-800"
                >
                  <Scissors className="w-3.5 h-3.5 text-brand-600" />
                  <span>+ Sillón Corte</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddStation('hair_color', 'Sillón de Colorimetría')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-brand-200 hover:border-brand-400 rounded-xl shadow-2xs flex items-center space-x-1.5 text-charcoal-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-roseGold" />
                  <span>+ Sillón Color</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddStation('wash_spa', 'Lavacabezas & Spa Capilar')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-brand-200 hover:border-brand-400 rounded-xl shadow-2xs flex items-center space-x-1.5 text-charcoal-800"
                >
                  <Armchair className="w-3.5 h-3.5 text-blue-500" />
                  <span>+ Lavacabezas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddStation('nails', 'Mesa de Manicura Rusa')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-brand-200 hover:border-brand-400 rounded-xl shadow-2xs flex items-center space-x-1.5 text-charcoal-800"
                >
                  <span>💅</span>
                  <span>+ Mesa Manicura</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddStation('lashes', 'Cabina Lash & Brow')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-brand-200 hover:border-brand-400 rounded-xl shadow-2xs flex items-center space-x-1.5 text-charcoal-800"
                >
                  <span>👁️</span>
                  <span>+ Cabina Pestañas</span>
                </button>
              </div>
            </div>

            {/* Stations List */}
            <div>
              <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                Sillones en el Plano ({stations.length})
              </h4>
              {stations.length === 0 ? (
                <div className="p-6 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-charcoal-300 text-xs text-charcoal-500">
                  No hay sillones creados aún. Añade uno con el formulario o los botones rápidos, o pulsa "Saltar este paso".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stations.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 flex items-center justify-between space-x-2 shadow-2xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {st.photoUrl ? (
                          <img
                            src={st.photoUrl}
                            alt={st.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-300 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                            #{st.chairNumber}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-charcoal-950 truncate">{st.name}</h5>
                          <p className="text-[11px] text-charcoal-500 truncate">
                            {st.assignedProfessionalName || 'Staff Rotativo'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteStation(st.id)}
                        className="text-charcoal-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar puesto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Station Form */}
            <div className="bg-white p-5 rounded-3xl border border-brand-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                  Personalizar Nuevo Puesto o Sillón
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Número de Sillón</label>
                  <input
                    type="number"
                    min="1"
                    value={stationChairNum}
                    onChange={(e) => setStationChairNum(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Nombre o Etiqueta</label>
                  <input
                    type="text"
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    placeholder="Ej. Sillón 1 · Colorimetría"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Peluquera Asignada (Optativo)</label>
                  <select
                    value={stationAssignedProfId}
                    onChange={(e) => setStationAssignedProfId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  >
                    <option value="">Rotativo / Cualquier estilista</option>
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.roleTitle})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo of station (Optativo) */}
              <div className="pt-2 border-t border-brand-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <label className="px-3 py-1.5 rounded-xl border border-dashed border-brand-300 hover:border-brand-500 bg-[#FAF8F5] text-xs font-semibold cursor-pointer text-charcoal-700 flex items-center space-x-1.5 transition-all">
                    <Camera className="w-3.5 h-3.5 text-brand-600" />
                    <span>Subir foto del sillón (Optativo)</span>
                    <input
                      type="file"
                      ref={stationFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleStationPhotoUpload}
                    />
                  </label>
                  {stationPhoto && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Foto cargada
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  variant="luxury"
                  onClick={() => handleAddStation()}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Añadir Sillón
                </Button>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  className="text-xs text-charcoal-600"
                >
                  Saltar Sillones
                </Button>
                <Button
                  variant="luxury"
                  onClick={() => setStep(4)}
                  className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
                >
                  <span>Siguiente: Servicios</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SERVICIOS                                                         */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="luxury">Paso 4 de 5</Badge>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                  Carta de Servicios & Tarifas
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Selecciona los servicios que ofrece tu salón o agrega los tuyos personalizados con precio y duración.
              </p>
            </div>

            {/* Quick 1-Click Suggestions */}
            <div>
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Servicios Populares (Toca para agregar a tu carta con 1 clic)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {SUGGESTED_SERVICES.map((s, idx) => {
                  const isAdded = services.some((existing) => existing.name.toLowerCase() === s.name.toLowerCase());

                  return (
                    <div
                      key={idx}
                      onClick={() => handleAddSuggestedService(s)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isAdded
                          ? 'bg-brand-50/70 border-brand-300 ring-1 ring-brand-200'
                          : 'bg-[#FAF8F5] border-brand-200 hover:bg-white hover:border-brand-400 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-white px-2 py-0.5 rounded-full border border-brand-200">
                            {s.category}
                          </span>
                          {isAdded ? (
                            <Badge variant="success" className="text-[9px]">Agregado</Badge>
                          ) : (
                            <span className="text-[11px] font-bold text-brand-600 hover:underline">+ Agregar</span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-charcoal-950 leading-snug">{s.name}</h5>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-brand-100">
                        <span className="text-charcoal-500 text-[11px]">{s.durationMinutes} min</span>
                        <span className="font-bold text-charcoal-900">${s.price.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Service Form */}
            <form onSubmit={handleAddCustomService} className="bg-white p-5 rounded-3xl border border-brand-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                  Crear Servicio Personalizado
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Nombre del Servicio *</label>
                  <input
                    type="text"
                    required
                    value={customServName}
                    onChange={(e) => setCustomServName(e.target.value)}
                    placeholder="Ej. Babylights + Tratamiento Nutritivo"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={customServDuration}
                    onChange={(e) => setCustomServDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Precio ($ CLP)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={customServPrice}
                    onChange={(e) => setCustomServPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="luxury"
                  disabled={!customServName.trim()}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar a mi Carta
                </Button>
              </div>
            </form>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Anterior
              </Button>

              <Button
                variant="luxury"
                onClick={() => setStep(5)}
                className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
              >
                <span>Siguiente: Productos</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: PRODUCTOS (CON OPCIÓN DE SKIP)                                    */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="luxury">Paso 5 de 5</Badge>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                    Productos & Control de Inventario
                  </h3>
                </div>
                <p className="text-xs text-charcoal-500 mt-1">
                  Registra productos para uso en el lavacabezas o para venta en recepción. Puedes <strong>saltar este paso</strong> si lo deseas.
                </p>
              </div>

              {/* SKIP BUTTON */}
              <button
                type="button"
                onClick={() => setStep(6)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-charcoal-600 bg-charcoal-100 hover:bg-charcoal-200 transition-colors self-start sm:self-auto"
              >
                <span>Saltar este paso</span>
                <SkipForward className="w-3.5 h-3.5 text-charcoal-500" />
              </button>
            </div>

            {/* Quick 1-Click Suggestions */}
            <div>
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Productos Habituales (Toca para agregar a tu inventario)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_PRODUCTS.map((p, idx) => {
                  const isAdded = inventory.some((existing) => existing.name.toLowerCase() === p.name.toLowerCase());

                  return (
                    <div
                      key={idx}
                      onClick={() => handleAddSuggestedProduct(p)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isAdded
                          ? 'bg-brand-50/70 border-brand-300 ring-1 ring-brand-200'
                          : 'bg-[#FAF8F5] border-brand-200 hover:bg-white hover:border-brand-400 shadow-2xs'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-brand-700 uppercase">{p.brand}</span>
                        <h5 className="font-bold text-xs text-charcoal-950 truncate">{p.name}</h5>
                        <p className="text-[11px] text-charcoal-500 mt-0.5">
                          Stock: {p.currentStock} {p.unit} · {p.isForSale ? `Venta $${p.salePrice?.toLocaleString('es-CL')}` : 'Uso Técnico'}
                        </p>
                      </div>

                      {isAdded ? (
                        <Badge variant="success" className="text-[9px] shrink-0">Agregado</Badge>
                      ) : (
                        <span className="text-xs font-bold text-brand-600 hover:underline shrink-0">+ Añadir</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Product Form */}
            <form onSubmit={handleAddCustomProduct} className="bg-white p-5 rounded-3xl border border-brand-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                  Registrar Producto Personalizado
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={customProdName}
                    onChange={(e) => setCustomProdName(e.target.value)}
                    placeholder="Ej. Serum Sellador de Puntas"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={customProdBrand}
                    onChange={(e) => setCustomProdBrand(e.target.value)}
                    placeholder="Ej. Moroccanoil"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Stock Inicial (unidades)</label>
                  <input
                    type="number"
                    min="1"
                    value={customProdStock}
                    onChange={(e) => setCustomProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Precio Costo ($ CLP)</label>
                  <input
                    type="number"
                    min="0"
                    value={customProdCost}
                    onChange={(e) => setCustomProdCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Precio Venta Clientas ($ CLP)</label>
                  <input
                    type="number"
                    min="0"
                    value={customProdSale}
                    onChange={(e) => setCustomProdSale(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-brand-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-charcoal-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customProdIsForSale}
                      onChange={(e) => setCustomProdIsForSale(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Disponible para venta a clientas</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="luxury"
                  disabled={!customProdName.trim()}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Agregar al Inventario
                </Button>
              </div>
            </form>

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-100">
              <Button
                variant="outline"
                onClick={() => setStep(4)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(6)}
                  className="text-xs text-charcoal-600"
                >
                  Saltar Productos
                </Button>
                <Button
                  variant="luxury"
                  onClick={() => setStep(6)}
                  className="text-xs px-6 font-bold shadow-md shadow-brand-500/20"
                >
                  <span>Revisar y Finalizar ➔</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: RESUMEN Y CELEBRACIÓN FINAL                                       */}
        {/* ========================================================================= */}
        {step === 6 && (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
            <div className="max-w-xl mx-auto text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                <BadgeCheck className="w-8 h-8" />
              </div>

              <h2 className="font-serif text-3xl font-bold text-charcoal-950">
                ¡Tu Salón está 100% Listo para Brillar! 🥂✨
              </h2>

              <p className="text-xs sm:text-sm text-charcoal-600">
                ¡Felicitaciones! Has configurado la estructura completa de <strong>{currentSalon.name}</strong>. Ya puedes agendar citas, coordinar a tu equipo y recibir a tus clientas.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-1">
                <Users className="w-5 h-5 mx-auto text-brand-600 mb-1" />
                <span className="font-serif text-2xl font-bold text-charcoal-950">{professionals.length}</span>
                <p className="text-[11px] text-charcoal-500 font-semibold">Peluqueras</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-1">
                <Armchair className="w-5 h-5 mx-auto text-roseGold mb-1" />
                <span className="font-serif text-2xl font-bold text-charcoal-950">{stations.length}</span>
                <p className="text-[11px] text-charcoal-500 font-semibold">Sillones / Puestos</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-1">
                <Scissors className="w-5 h-5 mx-auto text-charcoal-800 mb-1" />
                <span className="font-serif text-2xl font-bold text-charcoal-950">{services.length}</span>
                <p className="text-[11px] text-charcoal-500 font-semibold">Servicios en Carta</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-200/80 text-center space-y-1">
                <Package className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <span className="font-serif text-2xl font-bold text-charcoal-950">{inventory.length}</span>
                <p className="text-[11px] text-charcoal-500 font-semibold">Productos</p>
              </div>
            </div>

            {/* Salon Details Recap */}
            <div className="max-w-2xl mx-auto w-full bg-[#FAF8F5] p-4 rounded-2xl border border-brand-200 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="text-charcoal-500 font-medium">Ubicación:</span>
                <span className="font-bold text-charcoal-900">{currentSalon.address}, {currentSalon.city}</span>
              </div>
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="text-charcoal-500 font-medium">WhatsApp Oficial:</span>
                <span className="font-bold text-emerald-700">{currentSalon.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500 font-medium">Instagram:</span>
                <span className="font-bold text-pink-600">{currentSalon.instagram || '@tupeluqueria'}</span>
              </div>
            </div>

            {/* Final CTA */}
            <div className="flex justify-center pt-4 border-t border-brand-100">
              <Button
                variant="luxury"
                size="lg"
                onClick={handleFinishWizard}
                className="w-full sm:w-auto px-10 py-3 text-sm font-bold shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>¡Ir a la Agenda y Comenzar a Gestionar! 🚀</span>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
