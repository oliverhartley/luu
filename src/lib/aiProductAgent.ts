import { InventoryProduct } from '../types';

export interface AIEnrichmentResult {
  name: string;
  brand: string;
  category: InventoryProduct['category'];
  description: string;
  features: string[];
  imageUrl: string;
  suggestedSalePrice?: number;
}

// Curated high quality beauty and cosmetic photography
const COSMETIC_IMAGES: Record<string, string[]> = {
  retail: [
    'https://images.unsplash.com/photo-1608248597359-322194d216f4?w=600&auto=format&fit=crop&q=80', // hair oil dropper
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80', // luxury cosmetic bottle
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80', // serum bottle
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80', // shampoo cosmetic
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', // pump bottle
  ],
  tratamientos: [
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80', // salon hair treatment
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', // mask jar
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80', // professional bottle
  ],
  tintes: [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80', // hair color styling
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80', // hair salon color
  ],
  oxidantes: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', // bottle
  ],
  esmaltes: [
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80', // manicure polish
    'https://images.unsplash.com/photo-1519014816548-bf785179c947?w=600&auto=format&fit=crop&q=80', // nails polish
  ],
  desechables: [
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
  ]
};

// Known Barcode Registry for instant accurate identification
export const KNOWN_BARCODES: Record<string, Partial<AIEnrichmentResult>> = {
  '7801234567890': {
    name: 'Aceite de Argán Tratamiento 100ml',
    brand: 'Moroccanoil',
    category: 'retail',
    description: 'El pionero en el cuidado del cabello a base de aceite infusionado con argán rico en antioxidantes. Desenreda al instante, acelera el tiempo de secado y potencia el brillo hasta un 118%.',
    features: [
      '✨ Brillo espejo y sedosidad inmediata',
      '💧 Enriquecido con aceite de argán puro & vitamina E',
      '🛡️ Protección térmica y anti-frizz duradero',
      '🌿 Fórmula no grasa de rápida absorción'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-322194d216f4?w=600&auto=format&fit=crop&q=80',
    suggestedSalePrice: 38900
  },
  '7809876543210': {
    name: 'Olaplex Nº 3 Hair Perfector 100ml',
    brand: 'Olaplex',
    category: 'retail',
    description: 'Tratamiento reparador intensivo para el hogar con tecnología patentada Bis-Aminopropyl Diglycol Dimaleate. Restaura los enlaces de disulfuro rotos por procesos químicos, decoloraciones y calor.',
    features: [
      '🔬 Reconstruye la estructura interna capilar',
      '💪 Reduce el quiebre y refuerza la fibra',
      '✨ Apto para todo tipo de cabello tinturado o decolorado',
      '🌱 Fórmula vegana, sin sulfatos ni ftalatos'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    suggestedSalePrice: 34900
  },
  '7804561237894': {
    name: 'Shampoo Nutritive Bain Satin Riche 250ml',
    brand: 'Kérastase',
    category: 'retail',
    description: 'Baño de nutrición profunda con proteínas de origen vegetal y niacinamida. Limpia con extrema suavidad mientras revitaliza el cabello muy seco, aportando luminosidad radiante y textura aterciopelada.',
    features: [
      '💧 +58% de hidratación profunda inmediata',
      '✨ Nutrición intensa sin aportar peso',
      '🌿 Niacinamida + Proteínas vegetales hidrolizadas',
      '🌸 Fragancia floral icónica de alta perfumería francesa'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    suggestedSalePrice: 36900
  },
  '7806549873215': {
    name: 'Mascarilla Absolut Repair Gold Quinoa 250ml',
    brand: "L'Oréal Professionnel",
    category: 'retail',
    description: 'Mascarilla reconstructora instantánea para cabellos muy dañados. Formulada con quinoa dorada y proteína de trigo, repara la superficie de la fibra capilar sin apelmazar.',
    features: [
      '✨ 77% menos daño en la superficie de la fibra',
      '🛡️ 7x más brillo y acabado de peluquería',
      '🌾 Infusión de Quinoa Dorada + Proteína vegetal',
      '💆‍♀️ Textura manteca dorada sensorial'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    suggestedSalePrice: 31900
  },
  '7803332221110': {
    name: 'Esmalte Gel Polish tono Rubor Francés 15ml',
    brand: 'Kodi Professional',
    category: 'esmaltes',
    description: 'Esmalte semipermanente de pigmentación ultra densa y nivelación autónoma. Brinda un acabado lechoso translúcido perfecto para manicura rusa y baby boomer.',
    features: [
      '💅 Nivelación perfecta en 30 segundos UV/LED',
      '💎 Duración impecable superior a 21 días',
      '✨ Acabado porcelana de alto brillo',
      '👌 Pincel ergonómico de precisión milimétrica'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
    suggestedSalePrice: 14900
  }
};

/**
 * Agente IA de Catálogo Cosmético
 * Conecta con Gemini AI si hay clave disponible o ejecuta el motor cosmético inteligente local.
 */
export async function enrichProductWithAI(params: {
  barcode?: string;
  name?: string;
  brand?: string;
  category?: InventoryProduct['category'];
  costPrice?: number;
}): Promise<AIEnrichmentResult> {
  const cleanBarcode = (params.barcode || '').trim();

  // 1. Si coincide con un código de barra de catálogo conocido, devolver datos enriquecidos precisos
  if (cleanBarcode && KNOWN_BARCODES[cleanBarcode]) {
    const known = KNOWN_BARCODES[cleanBarcode];
    const cat = known.category || params.category || 'retail';
    return {
      name: known.name || params.name || 'Producto Cosmético',
      brand: known.brand || params.brand || 'Marca Profesional',
      category: cat,
      description: known.description || 'Fórmula profesional de alta eficacia para salón boutique.',
      features: known.features || [
        '✨ Brillo y suavidad profesional',
        '🌿 Ingredientes dermatológicamente testeados',
        '🛡️ Protección duradera'
      ],
      imageUrl: known.imageUrl || getRandomImage(cat),
      suggestedSalePrice: known.suggestedSalePrice || (params.costPrice ? Math.round((params.costPrice * 1.5) / 100) * 100 : undefined)
    };
  }

  // 2. Intentar llamar a Gemini AI en vivo si existe API key configurada
  const geminiKey = typeof window !== 'undefined' ? localStorage.getItem('luu_gemini_api_key') : null;
  if (geminiKey) {
    try {
      const liveResult = await callLiveGeminiAPI(geminiKey, params);
      if (liveResult) return liveResult;
    } catch (e) {
      console.warn('[AI Agent] Llamada a Gemini en vivo falló, usando motor cosmético integrado:', e);
    }
  }

  // 3. Motor cosmético integrado autónomo
  await new Promise((resolve) => setTimeout(resolve, 350));
  const queryName = (params.name || '').trim();
  const queryBrand = (params.brand || '').trim() || detectBrandFromName(queryName) || 'Professional Care';
  const category = params.category || detectCategoryFromName(queryName);

  const dynamicInfo = generateDynamicCopywriting(queryName, queryBrand, category);

  const suggestedSalePrice = params.costPrice && params.costPrice > 0
    ? Math.round((params.costPrice * 1.55) / 500) * 500
    : undefined;

  return {
    name: queryName || dynamicInfo.fallbackName,
    brand: queryBrand,
    category,
    description: dynamicInfo.description,
    features: dynamicInfo.features,
    imageUrl: getRandomImage(category),
    suggestedSalePrice
  };
}

async function callLiveGeminiAPI(
  apiKey: string, 
  params: { barcode?: string; name?: string; brand?: string; category?: InventoryProduct['category']; costPrice?: number; }
): Promise<AIEnrichmentResult | null> {
  const promptText = `Eres el Agente IA de un Salón de Belleza Boutique. Genera la ficha comercial en JSON para este producto:
Nombre: "${params.name || ''}"
Marca: "${params.brand || ''}"
Código de barras: "${params.barcode || ''}"
Categoría previa: "${params.category || 'retail'}"
Costo de compra: ${params.costPrice || 'desconocido'}

Responde ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin texto extra):
{
  "name": "Nombre comercial completo del producto",
  "brand": "Marca cosmética",
  "category": "retail" | "tratamientos" | "tintes" | "oxidantes" | "esmaltes" | "desechables",
  "description": "Descripción vendedora, atractiva, sensorial y elegante (3 a 4 líneas)",
  "features": ["✨ Beneficio 1", "🌿 Beneficio 2", "🛡️ Beneficio 3", "💧 Beneficio 4"]
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
    })
  });

  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  const cat = parsed.category || params.category || 'retail';

  const suggestedSalePrice = params.costPrice && params.costPrice > 0
    ? Math.round((params.costPrice * 1.55) / 500) * 500
    : undefined;

  return {
    name: parsed.name || params.name || 'Producto Profesional',
    brand: parsed.brand || params.brand || 'Luu Salon',
    category: cat,
    description: parsed.description,
    features: parsed.features || ['✨ Fórmula profesional', '🌿 Alta eficacia', '🛡️ Resultados duraderos'],
    imageUrl: getRandomImage(cat),
    suggestedSalePrice
  };
}

function detectBrandFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes('moroccanoil')) return 'Moroccanoil';
  if (lower.includes('olaplex')) return 'Olaplex';
  if (lower.includes('kerastase') || lower.includes('kérastase')) return 'Kérastase';
  if (lower.includes("l'oreal") || lower.includes('loreal') || lower.includes('majirel')) return "L'Oréal Professionnel";
  if (lower.includes('redken')) return 'Redken';
  if (lower.includes('wella')) return 'Wella Professionals';
  if (lower.includes('schwarzkopf')) return 'Schwarzkopf';
  if (lower.includes('kodi')) return 'Kodi Professional';
  if (lower.includes('opi')) return 'OPI';
  if (lower.includes('brazilian blowout')) return 'Brazilian Blowout';
  return null;
}

function detectCategoryFromName(name: string): InventoryProduct['category'] {
  const lower = name.toLowerCase();
  if (lower.includes('tinte') || lower.includes('color') || lower.includes('majirel') || lower.includes('toner') || lower.includes('decolorante')) {
    return 'tintes';
  }
  if (lower.includes('oxidante') || lower.includes('volumen') || lower.includes('revelador')) {
    return 'oxidantes';
  }
  if (lower.includes('esmalte') || lower.includes('gel') || lower.includes('top coat') || lower.includes('base rubber')) {
    return 'esmaltes';
  }
  if (lower.includes('mascarilla') || lower.includes('tratamiento') || lower.includes('botox') || lower.includes('keratina')) {
    return 'tratamientos';
  }
  if (lower.includes('toalla') || lower.includes('guante') || lower.includes('capa') || lower.includes('papel')) {
    return 'desechables';
  }
  return 'retail';
}

function generateDynamicCopywriting(name: string, brand: string, category: InventoryProduct['category']) {
  const label = name ? `El tratamiento ${name}` : 'Este producto';

  switch (category) {
    case 'retail':
      return {
        fallbackName: `${brand} Tratamiento Revitalizante Diario`,
        description: `${label} ha sido formulado por ${brand} para brindar una experiencia de cuidado capilar premium en casa. Su textura ligera y sedosa sella la cutícula, repara las puntas abiertas y transforma el tacto del cabello desde la primera aplicación, dejándolo suelto, luminoso y con un aroma irresistible.`,
        features: [
          '✨ Nutrición intensiva con efecto anti-frizz duradero',
          '💧 Hidratación continua por más de 48 horas sin sensación pesada',
          '🛡️ Protección térmica y contra rayos UV para sellar el color',
          '🌿 Fórmula dermatológicamente testeada y cruelty-free'
        ]
      };
    case 'tratamientos':
      return {
        fallbackName: `${brand} Mascarilla Hidratante Pro-Bond`,
        description: `Tratamiento técnico intensivo de cabina desarrollado para reconstruir enlaces de queratina debilitados por factores térmicos y químicos. Reestablece la elasticidad natural del cabello, devolviendo la fuerza estructural y un brillo tridimensional.`,
        features: [
          '🔬 Reconstrucción profunda de puentes moleculares',
          '✨ Brillo tridimensional y suavidad extrema',
          '💪 Previene el quiebre capilar en un 85%',
          '⏱️ Acción exprés de salón de 5 a 10 minutos'
        ]
      };
    case 'tintes':
      return {
        fallbackName: `${brand} Coloración Permanente de Alta Fidelidad`,
        description: `Coloración cosmética profesional de cobertura 100% de canas con reflejos ultrabrillantes y duraderos. Su complejo acondicionador protege la cutícula durante el proceso de oxidación asegurando un tono fiel a la carta de color.`,
        features: [
          '🎨 Cobertura perfecta de raíz a puntas con reflejos luminosos',
          '💎 Tecnología de micropigmentos para máxima duración',
          '💆‍♀️ Con agentes emolientes que cuidan el cuero cabelludo',
          '🌿 Bajo contenido de amoníaco con fragancia delicada'
        ]
      };
    case 'esmaltes':
      return {
        fallbackName: `${brand} Esmalte Semipermanente Profesional`,
        description: `Esmalte semipermanente de consistencia autonivelante y altísima densidad de pigmento. Garantiza una cobertura uniforme en una sola capa con brillo espejo inalterable por hasta 3 semanas.`,
        features: [
          '💅 Fórmula autonivelante de fácil aplicación',
          '💎 Brillo tipo diamante resistente a rayaduras',
          '⏱️ Curado ultra rápido en lámpara LED/UV',
          '👌 Libre de componentes nocivos (10-Free)'
        ]
      };
    default:
      return {
        fallbackName: `${brand} Insumo Profesional de Salón`,
        description: `Insumo técnico formulado para garantizar la máxima precisión y rendimiento en los servicios diarios del salón de belleza, optimizando tiempos y garantizando resultados impecables.`,
        features: [
          '✨ Rendimiento superior para uso profesional de alto tráfico',
          '👌 Compatibilidad garantizada con líneas técnicas líderes',
          '🌿 Estándares de calidad y seguridad certificados'
        ]
      };
  }
}

function getRandomImage(category: InventoryProduct['category']): string {
  const list = COSMETIC_IMAGES[category] || COSMETIC_IMAGES['retail'];
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
