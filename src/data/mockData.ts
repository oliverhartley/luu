import { Professional, Service, Client, Appointment, InventoryProduct, MarketingCampaign, WhatsAppMessageSimulation, ProductSale, Station } from '../types';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Valentina Morales',
    roleTitle: 'Master Colorista & Balayage',
    specialties: ['hair', 'spa'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 4.95,
    commissionRate: 0.45,
    phone: '+56 9 8123 4567',
    colorHex: '#D57B6C'
  },
  {
    id: 'prof-2',
    name: 'Camila Soto',
    roleTitle: 'Especialista en Manicura Rusa & Nail Art',
    specialties: ['nails'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    rating: 4.90,
    commissionRate: 0.40,
    phone: '+56 9 8234 5678',
    colorHex: '#E8B4B8'
  },
  {
    id: 'prof-3',
    name: 'Javiera Silva',
    roleTitle: 'Estilista & Tratamientos Capilares',
    specialties: ['hair', 'brows_lashes'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 4.88,
    commissionRate: 0.40,
    phone: '+56 9 8345 6789',
    colorHex: '#BCA893'
  },
  {
    id: 'prof-4',
    name: 'Sofía Castro',
    roleTitle: 'Lash & Brow Artist / Cejas y Pestañas',
    specialties: ['brows_lashes', 'skincare'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    rating: 4.92,
    commissionRate: 0.42,
    phone: '+56 9 8456 7890',
    colorHex: '#A34638'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    name: 'Balayage Signature + Matiz + Olaplex',
    category: 'hair',
    durationMinutes: 180,
    price: 95000,
    description: 'Técnica de aclaración degradada personalizada, incluye baño de luz, tratamiento restaurador y peinado final.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 90,
    requiredProducts: [
      { productId: 'prod-1', productName: 'Decolorante Blonde Studio 9', amountUsed: 60, unit: 'g' },
      { productId: 'prod-2', productName: 'Oxidante 20 Vol', amountUsed: 90, unit: 'ml' },
      { productId: 'prod-3', productName: 'Olaplex Nº 1 & 2', amountUsed: 15, unit: 'ml' }
    ]
  },
  {
    id: 'serv-2',
    name: 'Retoque de Raíz & Baño de Brillo',
    category: 'hair',
    durationMinutes: 75,
    price: 42000,
    description: 'Cobertura 100% de canas o retoque de tono base con fórmula registrada confidencial + secado express.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 25,
    requiredProducts: [
      { productId: 'prod-4', productName: 'Majirel Cool Inforced 7.1', amountUsed: 50, unit: 'g' },
      { productId: 'prod-2', productName: 'Oxidante 20 Vol', amountUsed: 75, unit: 'ml' }
    ]
  },
  {
    id: 'serv-3',
    name: 'Corte de Autor & Styling Ondas',
    category: 'hair',
    durationMinutes: 50,
    price: 28000,
    description: 'Diagnóstico visagista, lavado relajante con masaje capilar, corte en seco/húmedo y ondas de pasarela.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 45
  },
  {
    id: 'serv-4',
    name: 'Manicura Rusa Combinada + Esmaltado Permanente',
    category: 'nails',
    durationMinutes: 60,
    price: 24000,
    description: 'Limpieza profunda de cutículas con torno, nivelación con base rubber y esmaltado de alta duración.',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 14,
    requiredProducts: [
      { productId: 'prod-5', productName: 'Base Rubber Nude', amountUsed: 3, unit: 'ml' },
      { productId: 'prod-6', productName: 'Esmalte OPI / Gel Polish', amountUsed: 2, unit: 'ml' }
    ]
  },
  {
    id: 'serv-5',
    name: 'Nail Art Editorial (Mano Alzada)',
    category: 'nails',
    durationMinutes: 30,
    price: 12000,
    description: 'Diseños geométricos, francesitas cromadas, flores minimalistas o encapsulados en 2 a 10 uñas.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 14
  },
  {
    id: 'serv-6',
    name: 'Lifting de Pestañas con Keratina & Tinte',
    category: 'brows_lashes',
    durationMinutes: 60,
    price: 32000,
    description: 'Curvatura natural de pestañas con efecto máscara 24/7 y nutrición intensiva con botox de keratina.',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 35
  },
  {
    id: 'serv-7',
    name: 'Diseño y Laminado de Cejas con Henna',
    category: 'brows_lashes',
    durationMinutes: 45,
    price: 26000,
    description: 'Mapeo facial con hilo, alisado de vellos rebeldes, perfilado con cera/pinza y sombreado suave.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 28
  },
  {
    id: 'serv-8',
    name: 'Tratamiento Botox Capilar / Células Madre',
    category: 'hair',
    durationMinutes: 90,
    price: 55000,
    description: 'Nutrición anti-frizz profunda y sellado de cutícula con brillo espejo.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&auto=format&fit=crop&q=80',
    defaultRecurrenceDays: 45
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Isidora Paz Benítez',
    phone: '+56 9 9123 7788',
    email: 'isidora.benitez@gmail.com',
    birthday: '1995-08-22',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    totalVisits: 14,
    totalSpent: 485000,
    avgTicket: 34642,
    firstVisitDate: '2025-02-10',
    lastVisitDate: '2026-08-01',
    favoriteProfessionalId: 'prof-1',
    tags: ['VIP', 'Color Raíz', 'Manicura Lover'],
    notes: 'Sensibilidad leve en cuero cabelludo con oxidantes altos. Prefiere té verde con endulzante.',
    formulas: [
      {
        id: 'form-1',
        date: '2026-08-01',
        serviceId: 'serv-2',
        serviceName: 'Retoque de Raíz & Baño de Brillo',
        professionalId: 'prof-1',
        professionalName: 'Valentina Morales',
        isPrivate: true,
        rootFormula: '40g Majirel 7.1 + 10g 8.21 + 5g Corrector Ceniza 0.11',
        lengthsFormula: 'Dialight 9.02 + 9.11 con Revelador 9 vol (10 min emulsionado)',
        developerVol: '20 Volúmenes (1:1.5)',
        processingTimeMinutes: 35,
        generalNotes: 'Excelente neutralización de reflejos cobrizos en zona parietal.',
        photos: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'form-2',
        date: '2026-07-15',
        serviceId: 'serv-4',
        serviceName: 'Manicura Rusa Combinada',
        professionalId: 'prof-2',
        professionalName: 'Camila Soto',
        isPrivate: false,
        baseType: 'Rubber Base Soft Pink Kodi',
        polishBrandAndCode: 'OPI Funny Bunny (2 capas) + Top No Wipe Victoria Vynn',
        nailArtDetails: 'Micro-francesita cromada plateada en índice y anular',
        generalNotes: 'Uñas con tendencia a desprendimiento en laterales, usar deshidratador doble capa.'
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Florencia Valenzuela',
    phone: '+56 9 9456 1234',
    email: 'flo.valenzuela@outlook.com',
    birthday: '1998-11-04',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    totalVisits: 6,
    totalSpent: 310000,
    avgTicket: 51666,
    firstVisitDate: '2025-09-12',
    lastVisitDate: '2026-07-28',
    favoriteProfessionalId: 'prof-1',
    tags: ['Frecuente'],
    notes: 'Amante del café cortado con leche vegetal.',
    formulas: [
      {
        id: 'form-3',
        date: '2026-07-28',
        serviceId: 'serv-1',
        serviceName: 'Balayage Signature',
        professionalId: 'prof-1',
        professionalName: 'Valentina Morales',
        isPrivate: true,
        rootFormula: 'Sombreado raíz: DiaRichesse 6.01 con 9 vol',
        lengthsFormula: 'Deco Blonde Studio 9 + 30 vol (Cardado 50%) / Matiz: 10.12 + Clear',
        developerVol: '30 Vol en largos, 20 Vol en frontales',
        processingTimeMinutes: 50,
        generalNotes: 'Decoloró a fondo 9/10 muy parejo. Mantener matiz cada 4 semanas.'
      }
    ]
  },
  {
    id: 'client-3',
    name: 'María Jesús Correa',
    phone: '+56 9 8765 4321',
    email: 'mjesus.correa@empresa.cl',
    birthday: '1992-08-18', // Birthday coming up soon!
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    totalVisits: 8,
    totalSpent: 192000,
    avgTicket: 24000,
    firstVisitDate: '2025-11-01',
    lastVisitDate: '2026-07-02', // Inactive > 40 days
    favoriteProfessionalId: 'prof-2',
    tags: ['Manicura Lover', 'Inactivo'],
    notes: 'Viene siempre los viernes en la tarde post oficina.',
    formulas: []
  },
  {
    id: 'client-4',
    name: 'Catalina Rivas',
    phone: '+56 9 7654 3210',
    email: 'cata.rivas@gmail.com',
    birthday: '2001-03-14',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
    totalVisits: 1,
    totalSpent: 58000,
    avgTicket: 58000,
    firstVisitDate: '2026-08-10',
    lastVisitDate: '2026-08-10',
    tags: ['Nuevo'],
    formulas: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientId: 'client-1',
    clientName: 'Isidora Paz Benítez',
    clientPhone: '+56 9 9123 7788',
    date: '2026-08-16',
    startTime: '10:00',
    endTime: '12:15',
    status: 'arrived', // Already checked in!
    checkInTime: '09:55',
    totalPrice: 66000,
    notes: 'Servicio combinado: Retoque de raíz con Valentina y luego Manicura con Camila.',
    items: [
      {
        serviceId: 'serv-2',
        serviceName: 'Retoque de Raíz & Baño de Brillo',
        professionalId: 'prof-1',
        professionalName: 'Valentina Morales',
        durationMinutes: 75,
        price: 42000
      },
      {
        serviceId: 'serv-4',
        serviceName: 'Manicura Rusa + Permanente',
        professionalId: 'prof-2',
        professionalName: 'Camila Soto',
        durationMinutes: 60,
        price: 24000
      }
    ]
  },
  {
    id: 'apt-102',
    clientId: 'client-2',
    clientName: 'Florencia Valenzuela',
    clientPhone: '+56 9 9456 1234',
    date: '2026-08-16',
    startTime: '11:30',
    endTime: '12:20',
    status: 'confirmed',
    totalPrice: 28000,
    notes: 'Quiere mantener el largo y dar forma a las capas.',
    items: [
      {
        serviceId: 'serv-3',
        serviceName: 'Corte de Autor & Styling Ondas',
        professionalId: 'prof-3',
        professionalName: 'Javiera Silva',
        durationMinutes: 50,
        price: 28000
      }
    ]
  },
  {
    id: 'apt-103',
    clientId: 'client-4',
    clientName: 'Catalina Rivas',
    clientPhone: '+56 9 7654 3210',
    date: '2026-08-16',
    startTime: '14:00',
    endTime: '15:45',
    status: 'confirmed',
    totalPrice: 58000,
    items: [
      {
        serviceId: 'serv-6',
        serviceName: 'Lifting de Pestañas con Keratina',
        professionalId: 'prof-4',
        professionalName: 'Sofía Castro',
        durationMinutes: 60,
        price: 32000
      },
      {
        serviceId: 'serv-7',
        serviceName: 'Diseño y Laminado de Cejas',
        professionalId: 'prof-4',
        professionalName: 'Sofía Castro',
        durationMinutes: 45,
        price: 26000
      }
    ]
  },
  {
    id: 'apt-100',
    clientId: 'client-3',
    clientName: 'María Jesús Correa',
    clientPhone: '+56 9 8765 4321',
    date: '2026-08-15',
    startTime: '16:00',
    endTime: '17:00',
    status: 'completed',
    totalPrice: 24000,
    items: [
      {
        serviceId: 'serv-4',
        serviceName: 'Manicura Rusa + Permanente',
        professionalId: 'prof-2',
        professionalName: 'Camila Soto',
        durationMinutes: 60,
        price: 24000
      }
    ],
    checkoutDetails: {
      paymentMethod: 'credit',
      subtotal: 24000,
      discount: 0,
      tip: 3000,
      total: 27000,
      completedAt: '2026-08-15 17:05',
      surveySent: true,
      surveyRating: 5,
      surveyComment: '¡Excelente atención de Camila, mis uñas quedaron perfectas y la cutícula impecable!'
    }
  }
];

export const INITIAL_INVENTORY: InventoryProduct[] = [
  {
    id: 'prod-1',
    name: 'Decolorante Blonde Studio 9 Niveles',
    brand: "L'Oréal Professionnel",
    category: 'tintes',
    barcode: '7801122334455',
    sku: 'DEC-BS9-500',
    isForSale: false,
    currentStock: 450, // 450 grams remaining
    minStockAlert: 500, // Alert triggered!
    unit: 'g',
    costPrice: 28900,
    lastRestocked: '2026-07-20',
    description: 'Polvo decolorante de alto rendimiento que aclara hasta 9 tonos. Formulado con Olicomplex para máxima protección y neutralización de reflejos amarillos indeseados.',
    features: [
      '⚡ Aclaración extrema de hasta 9 niveles',
      '🛡️ Tecnología Olicomplex que cuida la fibra',
      '🎨 Textura cremosa ideal para balayage al aire libre'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-2',
    name: 'Oxidante Crema 20 Volúmenes (1 Litro)',
    brand: "L'Oréal Professionnel",
    category: 'oxidantes',
    barcode: '7802233445566',
    sku: 'OXI-20V-1L',
    isForSale: false,
    currentStock: 2200,
    minStockAlert: 1000,
    unit: 'ml',
    costPrice: 12500,
    lastRestocked: '2026-08-01',
    description: 'Oxidante estabilizado en crema para una mezcla homogénea y resultados de coloración de máxima fidelidad y cobertura impecable.',
    features: [
      '🧪 Estabilizado al 6% de peróxido de hidrógeno',
      '✨ Consistencia cremosa que no gotea',
      '💆‍♀️ Acondicionadores que protegen el cuero cabelludo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-3',
    name: 'Tratamiento Olaplex Nº 1 & 2 Kit Salon',
    brand: 'Olaplex',
    category: 'tratamientos',
    barcode: '7809876543210',
    sku: 'OLA-KIT-SALON',
    isForSale: true,
    currentStock: 180,
    minStockAlert: 150,
    unit: 'ml',
    costPrice: 65000,
    salePrice: 79000,
    lastRestocked: '2026-07-10',
    description: 'Sistema profesional en dos pasos que multiplica y repara los enlaces de disulfuro quebrados durante la decoloración y coloración química.',
    features: [
      '🔬 Tecnología de reconexión molecular de enlaces',
      '🛡️ Evita el daño capilar durante procesos extremos',
      '💎 Resultados visibles desde el primer uso'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-4',
    name: 'Tinte Majirel Cool Inforced 7.1 (Tubo 50g)',
    brand: "L'Oréal Professionnel",
    category: 'tintes',
    barcode: '7804455667788',
    sku: 'MAJ-7.1-COOL',
    isForSale: false,
    currentStock: 2, // only 2 tubes left! Alert!
    minStockAlert: 5,
    unit: 'tubos',
    costPrice: 6200,
    lastRestocked: '2026-07-15',
    description: 'Coloración permanente con hasta 6 semanas de neutralización fría contra reflejos rojizos y anaranjados.',
    features: [
      '🎨 Reflejos cenizas ultra fríos de larga duración',
      '💆‍♀️ Cuidado Ionène G + Incell que fortalece la cutícula',
      '💯 Cobertura total de canas con acabado natural'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-5',
    name: 'Base Rubber Nude 30ml',
    brand: 'Kodi Professional',
    category: 'esmaltes',
    barcode: '7803332221110',
    sku: 'KOD-RUBBER-NUDE',
    isForSale: true,
    currentStock: 1, // 1 unit left! Alert!
    minStockAlert: 3,
    unit: 'frascos',
    costPrice: 16900,
    salePrice: 24900,
    lastRestocked: '2026-06-28',
    description: 'Base de camuflaje de alta densidad con elasticidad de caucho para alineación y refuerzo de uñas naturales frágiles.',
    features: [
      '💅 Refuerzo elástico anti-quiebre',
      '💎 Nivelación autónoma perfecta en segundos',
      '⏱️ Más de 3 semanas sin desprendimientos'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-6',
    name: 'Aceite de Argán Tratamiento 100ml',
    brand: 'Moroccanoil',
    category: 'retail',
    barcode: '7801234567890',
    sku: 'MOR-OIL-100',
    isForSale: true,
    currentStock: 8,
    minStockAlert: 4,
    unit: 'unidades',
    costPrice: 18000,
    salePrice: 32000,
    lastRestocked: '2026-08-05',
    description: 'El aceite capilar icónico que revolucionó la industria. Enriquecido con aceite de argán rico en antioxidantes y vitaminas para un brillo deslumbrante y tacto de seda.',
    features: [
      '✨ Brillo espejo y sedosidad inmediata',
      '💧 Enriquecido con aceite de argán puro & vitamina E',
      '🛡️ Protección térmica y control del frizz 48h',
      '🌿 Fórmula no grasa de rápida absorción'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-322194d216f4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-7',
    name: 'Shampoo Nutritive Bain Satin Riche 250ml',
    brand: 'Kérastase',
    category: 'retail',
    barcode: '7804561237894',
    sku: 'KER-BAIN-SATIN',
    isForSale: true,
    currentStock: 6,
    minStockAlert: 3,
    unit: 'unidades',
    costPrice: 21000,
    salePrice: 36900,
    lastRestocked: '2026-08-10',
    description: 'Baño de nutrición profunda con proteínas de origen vegetal y niacinamida. Limpia con extrema delicadeza el cabello seco, devolviéndole ligereza y brillo sublime.',
    features: [
      '💧 +58% de hidratación profunda inmediata',
      '✨ Nutrición intensa sin aportar peso',
      '🌿 Niacinamida + Proteínas vegetales hidrolizadas',
      '🌸 Fragancia floral de alta perfumería francesa'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-8',
    name: 'Mascarilla Absolut Repair Gold Quinoa 250ml',
    brand: "L'Oréal Professionnel",
    category: 'retail',
    barcode: '7806549873215',
    sku: 'LOR-ABS-REP-250',
    isForSale: true,
    currentStock: 5,
    minStockAlert: 2,
    unit: 'unidades',
    costPrice: 17500,
    salePrice: 31900,
    lastRestocked: '2026-08-12',
    description: 'Mascarilla reconstructora instantánea para cabellos muy dañados. Infundida con quinoa dorada y proteína de trigo para restaurar la superficie sin apelmazar.',
    features: [
      '✨ 77% menos daño en la superficie capilar',
      '🛡️ 7x más brillo y suavidad de salón',
      '🌾 Infusión de Quinoa Dorada + Proteína vegetal'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCT_SALES: ProductSale[] = [
  {
    id: 'sale-101',
    salonId: 'salon-1',
    date: '2026-08-16',
    time: '11:45',
    clientId: 'client-1',
    clientName: 'Isidora Paz Benítez',
    professionalId: 'prof-1',
    professionalName: 'Valentina Morales',
    paymentMethod: 'credit',
    items: [
      {
        productId: 'prod-6',
        productName: 'Aceite de Argán Tratamiento 100ml',
        brand: 'Moroccanoil',
        quantity: 1,
        unitPrice: 32000,
        subtotal: 32000,
        barcode: '7801234567890',
        imageUrl: 'https://images.unsplash.com/photo-1608248597359-322194d216f4?w=600&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 32000,
    discount: 0,
    total: 32000,
    notes: 'Recomendado para mantención de puntas tras balayage.'
  },
  {
    id: 'sale-102',
    salonId: 'salon-1',
    date: '2026-08-15',
    time: '16:30',
    clientId: 'client-2',
    clientName: 'Florencia Valenzuela',
    professionalId: 'prof-3',
    professionalName: 'Javiera Silva',
    paymentMethod: 'debit',
    items: [
      {
        productId: 'prod-7',
        productName: 'Shampoo Nutritive Bain Satin Riche 250ml',
        brand: 'Kérastase',
        quantity: 1,
        unitPrice: 36900,
        subtotal: 36900,
        barcode: '7804561237894',
        imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 36900,
    discount: 0,
    total: 36900
  }
];


export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    title: 'Recordatorio Retoque de Manicura (14 Días)',
    type: 'recurrence',
    serviceTrigger: 'nails',
    daysTrigger: 14,
    messageTemplate: '¡Hola {nombre}! 💅 Han pasado 14 días desde tu manicura en Pelu. Tus uñas merecen seguir impecables. ¿Te agendamos tu mantención para esta semana? Responde aquí o reserva en un clic: {link}',
    isActive: true,
    targetCount: 28,
    convertedCount: 19
  },
  {
    id: 'camp-2',
    title: 'Recordatorio Color & Raíces (25 Días)',
    type: 'recurrence',
    serviceTrigger: 'hair',
    daysTrigger: 25,
    messageTemplate: 'Hola {nombre} ✨ ¡Esperamos que estés disfrutando tu color! Ya se cumplen 25 días y es el momento ideal para cuidar tu raíz y mantener el brillo espejo con {profesional}. ¿Agendamos?',
    isActive: true,
    targetCount: 15,
    convertedCount: 11
  },
  {
    id: 'camp-3',
    title: 'Regalo Especial de Cumpleaños (20% OFF)',
    type: 'birthday',
    daysTrigger: 3, // 3 days before birthday
    messageTemplate: '🎉 ¡Feliz casi cumpleaños {nombre}! 🎂 En Pelu queremos celebrarte. Tienes un 20% de descuento de regalo en cualquier servicio durante tu mes. ¡Ven a consentirte!',
    discountPercentage: 20,
    isActive: true,
    targetCount: 6,
    convertedCount: 5
  },
  {
    id: 'camp-4',
    title: 'Recuperación de Clientes Inactivos (+45 Días)',
    type: 'inactivity_recovery',
    daysTrigger: 45,
    messageTemplate: '¡Te extrañamos {nombre}! 💕 Hace semanas que no nos visitas. Tenemos un voucher de $10.000 de regalo para tu próxima visita usando el código VOLVERAQUERERTE.',
    discountPercentage: 15,
    isActive: true,
    targetCount: 12,
    convertedCount: 4
  }
];

export const INITIAL_WHATSAPP_LOGS: WhatsAppMessageSimulation[] = [
  {
    id: 'wa-1',
    toName: 'Isidora Paz Benítez',
    toPhone: '+56 9 9123 7788',
    type: 'checkin_alert',
    message: '🛎️ *¡Check-In Confirmado!* Hola Isidora, confirmamos tu llegada a Pelu. Valentina Morales y Camila Soto ya fueron notificadas y te recibirán en breves minutos. ¡Ponte cómoda!',
    timestamp: 'Hoy, 09:56',
    status: 'read',
    appointmentId: 'apt-101'
  },
  {
    id: 'wa-2',
    toName: 'María Jesús Correa',
    toPhone: '+56 9 8765 4321',
    type: 'survey',
    message: '✨ *¿Cómo estuvo tu experiencia en Pelu?* Hola María Jesús, gracias por visitarnos hoy para tu Manicura con Camila Soto. ¿Podrías calificarnos del 1 al 5 ⭐? Tu opinión nos ayuda a brindarte siempre lo mejor.',
    timestamp: 'Ayer, 17:06',
    status: 'replied',
    appointmentId: 'apt-100'
  },
  {
    id: 'wa-3',
    toName: 'María Jesús Correa',
    toPhone: '+56 9 8765 4321',
    type: 'campaign',
    message: '🎉 ¡Feliz casi cumpleaños María Jesús! 🎂 En Pelu queremos celebrarte. Tienes un 20% de descuento de regalo en cualquier servicio durante tu mes. ¡Ven a consentirte!',
    timestamp: 'Hoy, 08:30',
    status: 'delivered'
  }
];

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'st-1',
    name: 'Sillón 1 · Colorimetría & Balayage',
    category: 'hair_color',
    chairNumber: 1,
    assignedProfessionalId: 'prof-1',
    assignedProfessionalName: 'Valentina Morales',
    assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    currentClientName: 'Isidora Paz Benítez',
    currentServiceName: 'Retoque de Raíz & Baño de Brillo (Tiempo de pose)',
    status: 'occupied',
    timeRemainingMinutes: 25
  },
  {
    id: 'st-2',
    name: 'Sillón 2 · Corte de Autor & Styling',
    category: 'hair_cut',
    chairNumber: 2,
    assignedProfessionalId: 'prof-3',
    assignedProfessionalName: 'Javiera Silva',
    assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    currentClientName: 'Florencia Valenzuela',
    currentServiceName: 'Corte de Autor & Styling Ondas',
    status: 'occupied',
    timeRemainingMinutes: 15
  },
  {
    id: 'st-3',
    name: 'Estación 3 · Lavacabezas & Spa Capilar',
    category: 'wash_spa',
    chairNumber: 3,
    assignedProfessionalName: 'Staff Rotativo',
    assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    status: 'ready'
  },
  {
    id: 'st-4',
    name: 'Mesa 4 · Manicura Rusa & Nail Art',
    category: 'nails',
    chairNumber: 4,
    assignedProfessionalId: 'prof-2',
    assignedProfessionalName: 'Camila Soto',
    assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    currentClientName: 'María Jesús Correa',
    currentServiceName: 'Manicura Rusa Combinada + Esmalte OPI',
    status: 'occupied',
    timeRemainingMinutes: 30
  },
  {
    id: 'st-5',
    name: 'Cabina 5 · Lash & Brow Studio',
    category: 'lashes',
    chairNumber: 5,
    assignedProfessionalId: 'prof-4',
    assignedProfessionalName: 'Sofía Castro',
    assignedProfessionalAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    currentClientName: 'Catalina Rivas',
    currentServiceName: 'Lifting de Pestañas con Keratina & Tinte',
    status: 'occupied',
    timeRemainingMinutes: 40
  }
];
