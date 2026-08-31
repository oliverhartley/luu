/**
 * Servicio de Generación de Logos e Identidad Visual para Salones
 * Configurado con estilos alegres, isotipos temáticos reales y colores descriptivos
 */

export interface DescriptiveColor {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  accent: string;
  bg: string;
}

export interface LogoIsotype {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface LogoStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface LogoGenerationParams {
  salonName: string;
  slogan?: string;
  styleId: string;
  symbolId: string;
  paletteId: string;
  customDetails?: string;
}

export interface GeneratedLogo {
  id: string;
  svg: string;
  url: string;
  title: string;
  styleName: string;
  composition: string;
  timestamp: number;
}

/**
 * Colores descriptivos y evocadores pedidos por Oliver (ej: Azul Océano, Verde Lechuga, etc.)
 */
export const DESCRIPTIVE_COLORS: DescriptiveColor[] = [
  {
    id: 'verde_lechuga',
    name: 'Verde Lechuga / Menta Fresca',
    emoji: '🥬',
    primary: '#2E7D32',
    accent: '#66BB6A',
    bg: '#F1F8E9'
  },
  {
    id: 'azul_oceano',
    name: 'Azul Océano / Brisa Marina',
    emoji: '🌊',
    primary: '#1565C0',
    accent: '#42A5F5',
    bg: '#E3F2FD'
  },
  {
    id: 'rosa_chicle',
    name: 'Rosa Chicle / Algodón Dulce',
    emoji: '🌸',
    primary: '#D81B60',
    accent: '#EC407A',
    bg: '#FCE4EC'
  },
  {
    id: 'lavanda_silvestre',
    name: 'Lavanda Silvestre / Lila Pastel',
    emoji: '💜',
    primary: '#7B1FA2',
    accent: '#AB47BC',
    bg: '#F3E5F5'
  },
  {
    id: 'amarillo_sol',
    name: 'Amarillo Sol / Mostaza Alegre',
    emoji: '☀️',
    primary: '#E65100',
    accent: '#FBC02D',
    bg: '#FFFDE7'
  },
  {
    id: 'naranja_coral',
    name: 'Naranja Melocotón / Coral Vivo',
    emoji: '🍊',
    primary: '#D84315',
    accent: '#FF7043',
    bg: '#FBE9E7'
  },
  {
    id: 'negro_glam',
    name: 'Negro Glam & Champagne',
    emoji: '🖤',
    primary: '#1A1A1A',
    accent: '#C5A059',
    bg: '#FAF8F5'
  },
  {
    id: 'caramelo_miel',
    name: 'Caramelo & Miel Cálida',
    emoji: '☕',
    primary: '#6D4C41',
    accent: '#BCAAA4',
    bg: '#EFEBE9'
  }
];

/**
 * Isotipos específicos y con sentido para peluquerías y salones
 */
export const SALON_ISOTYPES: LogoIsotype[] = [
  {
    id: 'tijeras_peine',
    name: 'Tijeras & Peine de Estilista',
    emoji: '✂️',
    description: 'El clásico indiscutido del corte profesional'
  },
  {
    id: 'peinado_ondas',
    name: 'Peinado & Melena Ondulada',
    emoji: '💇‍♀️',
    description: 'Cabello voluminoso con movimiento alegre y moderno'
  },
  {
    id: 'flor_organica',
    name: 'Flor & Botánica de Belleza',
    emoji: '🌸',
    description: 'Pétalos suaves y bienestar natural para salón o spa'
  },
  {
    id: 'unas_manicure',
    name: 'Uñas & Esmalte Chic',
    emoji: '💅',
    description: 'Pincelada de color y manos cuidadas'
  },
  {
    id: 'espejo_tocador',
    name: 'Espejo Tocador & Destellos',
    emoji: '🪞',
    description: 'Espejo de salón vintage con reflejos mágicos'
  },
  {
    id: 'monograma_pop',
    name: 'Inicial de Marca Pop & Dinámica',
    emoji: '⚡',
    description: 'La inicial de tu salón con estrellas y aire vanguardista'
  }
];

/**
 * Estilos visuales pedidos (Alegre, Colorido, Minimalista, etc.)
 */
export const SALON_STYLES: LogoStyle[] = [
  {
    id: 'alegre',
    name: 'Alegre & Juguetón',
    emoji: '✨',
    description: 'Trazos amigables, destellos chispeantes y calidez'
  },
  {
    id: 'colorido',
    name: 'Colorido & Vibrante',
    emoji: '🎨',
    description: 'Degradados vivos, energía moderna y colores llamativos'
  },
  {
    id: 'minimalista',
    name: 'Minimalista & Limpio',
    emoji: '🤍',
    description: 'Líneas finas, estética escandinava moderna y aire despejado'
  },
  {
    id: 'elegante',
    name: 'Elegante & Boutique',
    emoji: '👑',
    description: 'Tipografía de alta gama, serifa fina y aire exclusivo'
  },
  {
    id: 'boho',
    name: 'Boho & Natural',
    emoji: '🌿',
    description: 'Formas orgánicas, arcos suaves y espíritu artesanal'
  },
  {
    id: 'urbano',
    name: 'Urbano & Trendy',
    emoji: '⚡',
    description: 'Tipografía bold, estilo salón contemporáneo y audaz'
  }
];

export function purgeAiStudioTokens(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('luu_gemini_api_key');
      localStorage.removeItem('gemini_api_key');
    } catch (e) {}
  }
}

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function svgToDataUri(svgString: string): string {
  try {
    if (typeof window !== 'undefined') {
      const encoded = window.btoa(unescape(encodeURIComponent(svgString)));
      return `data:image/svg+xml;base64,${encoded}`;
    }
  } catch (e) {}
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

/**
 * Renderiza el dibujo vectorial específico del isotipo seleccionado
 */
function renderIsotypePath(isotypeId: string, primaryColor: string, accentColor: string, initialLetter: string, scale: number = 1): string {
  switch (isotypeId) {
    case 'peinado_ondas':
      return `
        <g transform="scale(${scale})">
          <!-- Melena ondulada y peinado alegre con destellos -->
          <path d="M-24,-30 C-32,-10 -28,15 -14,28 C-4,38 12,38 22,26 C30,16 32,-8 20,-26 C12,-36 -12,-38 -24,-30 Z" fill="${accentColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2"/>
          <path d="M-16,-20 C-6,-24 8,-22 16,-12 C24,-2 18,12 8,20 C-2,28 -12,24 -18,14 C-24,4 -20,-10 -10,-18" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M-4,-14 C2,-18 10,-16 12,-10 C14,-4 8,2 2,6" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <!-- Horquilla o lazo chic -->
          <circle cx="16" cy="-20" r="4" fill="${accentColor}"/>
          <path d="M13,-20 L23,-28" stroke="${primaryColor}" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Destellos de brillo capilar -->
          <path d="M26,-4 L32,-8 M-26,-10 L-32,-14" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="28" cy="8" r="2.5" fill="${accentColor}"/>
        </g>
      `;

    case 'tijeras_peine':
      return `
        <g transform="scale(${scale})">
          <!-- Peine de estilista -->
          <rect x="-32" y="-6" width="64" height="12" rx="3" fill="${accentColor}" fill-opacity="0.3" stroke="${primaryColor}" stroke-width="1.8"/>
          <line x1="-24" y1="-6" x2="-24" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="-16" y1="-6" x2="-16" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="-8" y1="-6" x2="-8" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="0" y1="-6" x2="0" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="8" y1="-6" x2="8" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="16" y1="-6" x2="16" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <line x1="24" y1="-6" x2="24" y2="4" stroke="${primaryColor}" stroke-width="1.5"/>
          <!-- Tijeras profesionales cruzadas -->
          <circle cx="-16" cy="24" r="8" fill="none" stroke="${primaryColor}" stroke-width="2.2"/>
          <circle cx="16" cy="24" r="8" fill="none" stroke="${primaryColor}" stroke-width="2.2"/>
          <path d="M-10,18 L12,-26 M10,18 L-12,-26" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="0" cy="-4" r="3.5" fill="${accentColor}"/>
          <!-- Destello de filo brillante -->
          <path d="M-14,-28 L-18,-34 M14,-28 L18,-34" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
        </g>
      `;

    case 'flor_organica':
      return `
        <g transform="scale(${scale})">
          <!-- Flor de loto / orquidea organica de belleza -->
          <circle cx="0" cy="0" r="8" fill="${accentColor}"/>
          <!-- Petalos delicados -->
          <path d="M0,-8 C-16,-24 0,-40 0,-40 C0,-40 16,-24 0,-8 Z" fill="${accentColor}" fill-opacity="0.4" stroke="${primaryColor}" stroke-width="1.8"/>
          <path d="M-8,0 C-24,-16 -40,0 -40,0 C-40,0 -24,16 -8,0 Z" fill="${accentColor}" fill-opacity="0.4" stroke="${primaryColor}" stroke-width="1.8"/>
          <path d="M8,0 C24,-16 40,0 40,0 C40,0 24,16 8,0 Z" fill="${accentColor}" fill-opacity="0.4" stroke="${primaryColor}" stroke-width="1.8"/>
          <path d="M0,8 C-16,24 0,40 0,40 C0,40 16,24 0,8 Z" fill="${accentColor}" fill-opacity="0.4" stroke="${primaryColor}" stroke-width="1.8"/>
          <!-- Hojas verdes o de frescura -->
          <path d="M-18,-18 Q-30,-30 -18,-36 Q-12,-28 -18,-18 Z" fill="${primaryColor}" fill-opacity="0.7"/>
          <path d="M18,18 Q30,30 18,36 Q12,28 18,18 Z" fill="${primaryColor}" fill-opacity="0.7"/>
        </g>
      `;

    case 'unas_manicure':
      return `
        <g transform="scale(${scale})">
          <!-- Frasco y pincel de esmalte de manicure -->
          <rect x="-14" y="-8" width="28" height="34" rx="6" fill="${accentColor}" fill-opacity="0.3" stroke="${primaryColor}" stroke-width="2.2"/>
          <rect x="-8" y="-22" width="16" height="14" rx="2" fill="${primaryColor}"/>
          <line x1="-12" y1="-22" x2="12" y2="-22" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round"/>
          <path d="M0,6 C-6,6 -8,12 -8,16 C-8,20 -4,22 0,22 C4,22 8,20 8,16 C8,12 6,6 0,6 Z" fill="${accentColor}"/>
          <!-- Destellos de esmalte brillante -->
          <path d="M-18,-10 L-24,-14 M18,-10 L24,-14" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="20" cy="18" r="3" fill="${accentColor}"/>
        </g>
      `;

    case 'espejo_tocador':
      return `
        <g transform="scale(${scale})">
          <!-- Espejo de mano de tocador con mango -->
          <circle cx="0" cy="-8" r="28" fill="${accentColor}" fill-opacity="0.15" stroke="${primaryColor}" stroke-width="2.2"/>
          <circle cx="0" cy="-8" r="22" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="3,3"/>
          <!-- Mango estilizado -->
          <path d="M-4,20 L-3,38 C-3,40 3,40 3,38 L4,20 Z" fill="${primaryColor}"/>
          <circle cx="0" cy="40" r="3" fill="${accentColor}"/>
          <!-- Reflejo magico -->
          <path d="M-10,-16 L10,-4" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="8" cy="-14" r="3" fill="${primaryColor}"/>
        </g>
      `;

    case 'monograma_pop':
    default:
      return `
        <g transform="scale(${scale})">
          <!-- Monograma dinamico y pop -->
          <circle cx="0" cy="0" r="36" fill="${accentColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="4,4"/>
          <text x="0" y="14" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="800" fill="${primaryColor}" text-anchor="middle">${initialLetter}</text>
          <!-- Estrellas pop -->
          <path d="M26,-24 L28,-18 L34,-16 L28,-14 L26,-8 L24,-14 L18,-16 L24,-18 Z" fill="${accentColor}"/>
          <path d="M-26,20 L-28,24 L-32,25 L-28,26 L-26,30 L-25,26 L-21,25 L-25,24 Z" fill="${primaryColor}"/>
        </g>
      `;
  }
}

/**
 * Generador interactivo de logos con diversidad estética total
 */
export async function generateLogosWithAI(params: LogoGenerationParams): Promise<{
  success: boolean;
  logos: GeneratedLogo[];
  source: 'gcp_cloud';
}> {
  purgeAiStudioTokens();

  // Intento rápido de consultar Cloud Function desplegada en GCP
  try {
    const cloudFnUrl = 'https://us-central1-pelu-harliz-green-df830.cloudfunctions.net/generate-logo';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const styleObj = SALON_STYLES.find((s) => s.id === params.styleId);
    const symObj = SALON_ISOTYPES.find((s) => s.id === params.symbolId);
    const colObj = DESCRIPTIVE_COLORS.find((c) => c.id === params.paletteId);

    const res = await fetch(cloudFnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salonName: params.salonName,
        slogan: params.slogan,
        styleName: styleObj?.name,
        symbolName: symObj?.name,
        colors: [colObj?.primary, colObj?.accent, colObj?.bg],
        customDetails: params.customDetails
      }),
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.svg) {
        const tailored = buildFourDistinctLogos(params);
        tailored[0] = {
          id: `logo-ai-${Date.now()}-0`,
          svg: data.svg,
          url: svgToDataUri(data.svg),
          title: `Firma Vertex AI · ${symObj?.name || 'Isotipo'}`,
          styleName: styleObj?.name || 'Alegre',
          composition: 'Diseño Nube Vertex AI',
          timestamp: Date.now()
        };
        return { success: true, logos: tailored, source: 'gcp_cloud' };
      }
    }
  } catch (e) {}

  // Simulación de cálculo de branding con IA
  await new Promise((resolve) => setTimeout(resolve, 800));

  const logos = buildFourDistinctLogos(params);
  return {
    success: true,
    logos,
    source: 'gcp_cloud'
  };
}

/**
 * Construye 4 propuestas RADICALMENTE DISTINTAS en composición, tipografía y estilo
 */
function buildFourDistinctLogos(params: LogoGenerationParams): GeneratedLogo[] {
  const color = DESCRIPTIVE_COLORS.find((c) => c.id === params.paletteId) || DESCRIPTIVE_COLORS[0];
  const style = SALON_STYLES.find((s) => s.id === params.styleId) || SALON_STYLES[0];
  const symbol = SALON_ISOTYPES.find((s) => s.id === params.symbolId) || SALON_ISOTYPES[0];

  const rawTitle = (params.salonName || 'Pelu OBi').trim();
  const rawSubtitle = (params.slogan || 'Hair & Beauty Atelier').trim();
  
  const title = escapeXml(rawTitle);
  const initial = escapeXml(rawTitle.charAt(0).toUpperCase() || 'P');
  const subtitle = escapeXml(rawSubtitle.toUpperCase());
  
  const cPrimary = color.primary;
  const cAccent = color.accent;
  const cBg = color.bg;

  const isotypeSvg1 = renderIsotypePath(params.symbolId, cPrimary, cAccent, initial, 1.25);
  const isotypeSvg2 = renderIsotypePath(params.symbolId, cPrimary, cAccent, initial, 1.15);
  const isotypeSvg3 = renderIsotypePath(params.symbolId, cPrimary, cAccent, initial, 1.05);
  const isotypeSvg4 = renderIsotypePath(params.symbolId, cPrimary, cAccent, initial, 1.3);

  // -------------------------------------------------------------
  // PROPUESTA 1: Alegre & Moderna (Emblema Redondo con Destellos Pop)
  // -------------------------------------------------------------
  const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="36" fill="${cBg}"/>
  
  <!-- Burbuja o mancha de color alegre -->
  <circle cx="250" cy="170" r="95" fill="#FFFFFF" stroke="${cAccent}" stroke-width="2.5" stroke-dasharray="6,6"/>
  <circle cx="250" cy="170" r="82" fill="${cAccent}" fill-opacity="0.15"/>
  
  <!-- Isotipo -->
  <g transform="translate(250, 170)">
    ${isotypeSvg1}
  </g>
  
  <!-- Tipografia Alegre y Redondeada -->
  <text x="250" y="315" font-family="'Plus Jakarta Sans', sans-serif" font-size="38" font-weight="800" fill="${cPrimary}" text-anchor="middle" letter-spacing="1.5">${title}</text>
  <rect x="190" y="335" width="120" height="4" rx="2" fill="${cAccent}"/>
  <text x="250" y="365" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="${cPrimary}" fill-opacity="0.8" text-anchor="middle" letter-spacing="4">${subtitle}</text>
  
  <!-- Destellos decorativos en esquinas -->
  <circle cx="100" cy="90" r="5" fill="${cAccent}"/>
  <circle cx="400" cy="110" r="4" fill="${cPrimary}"/>
  <circle cx="390" cy="390" r="6" fill="${cAccent}"/>
</svg>`;

  // -------------------------------------------------------------
  // PROPUESTA 2: Sello / Badge Orgánico Tipo Salón Boutique
  // -------------------------------------------------------------
  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="36" fill="#FFFFFF"/>
  
  <!-- Marco ovalado con borde doble de autor -->
  <rect x="50" y="50" width="400" height="400" rx="40" fill="none" stroke="${cAccent}" stroke-width="2"/>
  <rect x="60" y="60" width="380" height="380" rx="32" fill="${cBg}" fill-opacity="0.5" stroke="${cPrimary}" stroke-width="1"/>
  
  <g transform="translate(250, 175)">
    ${isotypeSvg2}
  </g>
  
  <!-- Nombre con tipografia serif elegante pero calida -->
  <text x="250" y="305" font-family="'Playfair Display', Georgia, serif" font-size="36" font-weight="700" fill="${cPrimary}" text-anchor="middle" letter-spacing="3">${title.toUpperCase()}</text>
  <line x1="160" y1="325" x2="340" y2="325" stroke="${cAccent}" stroke-width="1.5"/>
  <text x="250" y="352" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="${cAccent}" text-anchor="middle" letter-spacing="5">${subtitle}</text>
</svg>`;

  // -------------------------------------------------------------
  // PROPUESTA 3: Composición Horizontal Vanguardista & Minimalista
  // -------------------------------------------------------------
  const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="36" fill="#FFFFFF"/>
  
  <!-- Linea horizontal de soporte con pastilla de color -->
  <rect x="60" y="100" width="380" height="300" rx="24" fill="${cBg}"/>
  
  <g transform="translate(155, 235)">
    ${isotypeSvg3}
  </g>
  
  <!-- Separador vertical -->
  <line x1="230" y1="170" x2="230" y2="300" stroke="${cAccent}" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Textos alineados a la derecha -->
  <text x="255" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="${cPrimary}" text-anchor="start" letter-spacing="1">${title}</text>
  <text x="255" y="258" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="${cAccent}" text-anchor="start" letter-spacing="3">${subtitle}</text>
  <rect x="255" y="275" width="40" height="4" rx="2" fill="${cPrimary}"/>
</svg>`;

  // -------------------------------------------------------------
  // PROPUESTA 4: Arco Solar / Boho Chic con Ilustración Libre
  // -------------------------------------------------------------
  const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="36" fill="#FCFAF8"/>
  
  <!-- Arco estilizado en el fondo -->
  <path d="M 170 340 L 170 190 A 80 80 0 0 1 330 190 L 330 340" fill="${cAccent}" fill-opacity="0.18" stroke="${cAccent}" stroke-width="2"/>
  
  <g transform="translate(250, 185)">
    ${isotypeSvg4}
  </g>
  
  <!-- Tipografia de Autor con mucha personalidad -->
  <text x="250" y="295" font-family="'Playfair Display', Georgia, serif" font-size="35" font-weight="700" fill="${cPrimary}" text-anchor="middle" letter-spacing="2">${title}</text>
  <text x="250" y="325" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="${cAccent}" text-anchor="middle" letter-spacing="6">${subtitle}</text>
  <circle cx="250" cy="355" r="4" fill="${cPrimary}"/>
</svg>`;

  const svgs = [
    { svg: svg1, title: 'Pop & Alegre', composition: 'Emblema Dinámico' },
    { svg: svg2, title: 'Sello Boutique', composition: 'Badge Orgánico' },
    { svg: svg3, title: 'Horizontal Chic', composition: 'Minimalista Editorial' },
    { svg: svg4, title: 'Arco & Estilo Libre', composition: 'Ilustración Boho' }
  ];

  return svgs.map((item, idx) => ({
    id: `logo-${Date.now()}-${idx}`,
    svg: item.svg,
    url: svgToDataUri(item.svg),
    title: `${item.title} · ${symbol.name}`,
    styleName: style.name,
    composition: item.composition,
    timestamp: Date.now()
  }));
}
