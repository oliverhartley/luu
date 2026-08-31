/**
 * Servicio de Generación de Logos e Identidad Visual para Salones
 * Configurado con estética POP, alegre, colorida y 100% acogedora
 */

export interface DescriptiveColor {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  accent: string;
  secondary: string;
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
 * Colores POP, intensos y vibrantes pedidos por Oliver
 */
export const DESCRIPTIVE_COLORS: DescriptiveColor[] = [
  {
    id: 'naranja_coral',
    name: 'Naranja Melocotón / Coral Vivo',
    emoji: '🍊',
    primary: '#FF5722',
    accent: '#FFD166',
    secondary: '#FF007F',
    bg: '#FFF5EB'
  },
  {
    id: 'verde_lechuga',
    name: 'Verde Lechuga / Menta Fresca',
    emoji: '🥬',
    primary: '#00B074',
    accent: '#CCFF00',
    secondary: '#06D6A0',
    bg: '#E8FDF5'
  },
  {
    id: 'azul_oceano',
    name: 'Azul Océano / Brisa Marina',
    emoji: '🌊',
    primary: '#0077B6',
    accent: '#48CAE4',
    secondary: '#7209B7',
    bg: '#EBF8FF'
  },
  {
    id: 'rosa_chicle',
    name: 'Rosa Chicle / Algodón Dulce',
    emoji: '🌸',
    primary: '#FF2A85',
    accent: '#FFD166',
    secondary: '#9B5DE5',
    bg: '#FFF0F6'
  },
  {
    id: 'lavanda_silvestre',
    name: 'Lavanda Silvestre / Lila Pastel',
    emoji: '💜',
    primary: '#8338EC',
    accent: '#FF006E',
    secondary: '#3A86FF',
    bg: '#F5EEFF'
  },
  {
    id: 'amarillo_sol',
    name: 'Amarillo Sol / Mostaza Alegre',
    emoji: '☀️',
    primary: '#FF9F1C',
    accent: '#FFE400',
    secondary: '#E71D36',
    bg: '#FFFBEB'
  },
  {
    id: 'negro_glam',
    name: 'Negro Glam & Neón Dorado',
    emoji: '🖤',
    primary: '#18181B',
    accent: '#F59E0B',
    secondary: '#EC4899',
    bg: '#FAFAFA'
  },
  {
    id: 'caramelo_miel',
    name: 'Caramelo & Miel Cálida',
    emoji: '☕',
    primary: '#C05C2E',
    accent: '#F4A261',
    secondary: '#E76F51',
    bg: '#FDF6EE'
  }
];

/**
 * Isotipos temáticos con personalidad alegre y cero aburrida
 */
export const SALON_ISOTYPES: LogoIsotype[] = [
  {
    id: 'flor_organica',
    name: 'Flor Pop & Margarita Radiante',
    emoji: '🌸',
    description: 'Flor alegre retro-pop con centro brillante y destellos'
  },
  {
    id: 'peinado_ondas',
    name: 'Peinado & Melena con Movimiento',
    emoji: '💇‍♀️',
    description: 'Cabello voluminoso, trenza chic y brillo capilar'
  },
  {
    id: 'tijeras_peine',
    name: 'Tijeras & Peine Pop',
    emoji: '✂️',
    description: 'Tijeras dinámicas con destellos de corte y peine amigable'
  },
  {
    id: 'unas_manicure',
    name: 'Uñas & Esmalte Chic',
    emoji: '💅',
    description: 'Frasco de esmalte brillante con gotita pop y estrellas'
  },
  {
    id: 'espejo_tocador',
    name: 'Espejo Glam & Destellos',
    emoji: '🪞',
    description: 'Espejo de tocador con reflejos mágicos de salón'
  },
  {
    id: 'monograma_pop',
    name: 'Inicial de Autor & Estrellas',
    emoji: '⚡',
    description: 'Letra inicial pop con relámpago y estrellas vibrantes'
  }
];

/**
 * Estilos visuales con energía y enfoque salonero moderno
 */
export const SALON_STYLES: LogoStyle[] = [
  {
    id: 'colorido',
    name: 'Colorido & Vibrante',
    emoji: '🎨',
    description: 'Colores intensos, sombras pop y máxima energía'
  },
  {
    id: 'alegre',
    name: 'Alegre & Juguetón',
    emoji: '✨',
    description: 'Curvas suaves, destellos chispeantes y calidez total'
  },
  {
    id: 'minimalista',
    name: 'Minimalista Pop',
    emoji: '🤍',
    description: 'Líneas limpias, tipografía gruesa y estética moderna'
  },
  {
    id: 'elegante',
    name: 'Boutique Chic',
    emoji: '👑',
    description: 'Alta cosmética con toques dorados y aire glam'
  },
  {
    id: 'boho',
    name: 'Boho & Calidez Solar',
    emoji: '🌿',
    description: 'Arcos cálidos, sol sonriente y naturaleza'
  },
  {
    id: 'urbano',
    name: 'Urbano & Trendy',
    emoji: '⚡',
    description: 'Estilo sticker neo-brutalista, stickers y audacia'
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
 * Dibuja un isotipo POP, llamativo, con colores contrastados y destellos
 */
function renderPopIsotype(
  isotypeId: string, 
  primary: string, 
  accent: string, 
  secondary: string, 
  initial: string, 
  scale: number = 1
): string {
  switch (isotypeId) {
    case 'flor_organica':
      return `
        <g transform="scale(${scale})">
          <!-- Flor Pop tipo Margarita Retro con 5 petalos coloridos -->
          <circle cx="0" cy="-30" r="18" fill="${primary}"/>
          <circle cx="28" cy="-9" r="18" fill="${primary}"/>
          <circle cx="18" cy="24" r="18" fill="${primary}"/>
          <circle cx="-18" cy="24" r="18" fill="${primary}"/>
          <circle cx="-28" cy="-9" r="18" fill="${primary}"/>
          <!-- Centro de la flor brillante -->
          <circle cx="0" cy="0" r="19" fill="${accent}" stroke="#FFFFFF" stroke-width="4.5"/>
          <circle cx="-5" cy="-6" r="4" fill="#FFFFFF"/>
          <!-- Destellos de alegria -->
          <path d="M34,-26 L36,-20 L42,-18 L36,-16 L34,-10 L32,-16 L26,-18 L32,-20 Z" fill="${secondary}"/>
          <path d="M-34,-26 L-32,-20 L-26,-18 L-32,-16 L-34,-10 L-36,-16 L-42,-18 L-36,-20 Z" fill="${accent}"/>
          <circle cx="36" cy="18" r="4" fill="${secondary}"/>
          <circle cx="-36" cy="18" r="3.5" fill="${accent}"/>
        </g>
      `;

    case 'peinado_ondas':
      return `
        <g transform="scale(${scale})">
          <!-- Melena POP con volumen y movimiento libre -->
          <path d="M-30,-22 C-38,-4 -34,22 -18,34 C-4,44 14,44 26,30 C36,18 38,-10 24,-30 C14,-42 -14,-42 -26,-32 Z" fill="${primary}"/>
          <!-- Mechones ondulados con color de acento -->
          <path d="M-18,-14 C-8,-20 8,-18 16,-8 C24,2 18,18 8,26 C-2,34 -14,30 -20,18" fill="none" stroke="${accent}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M-6,-6 C2,-10 10,-8 14,-2 C16,4 12,12 4,16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <!-- Horquilla / Gancho Chic -->
          <rect x="14" y="-24" width="16" height="7" rx="3.5" fill="${secondary}" transform="rotate(-25 22 -20)"/>
          <circle cx="28" cy="-28" r="4" fill="${accent}"/>
          <!-- Destellos -->
          <path d="M36,-6 L39,-1 L44,0 L39,2 L37,7 L35,2 L30,0 L35,-1 Z" fill="${accent}"/>
          <circle cx="-32" cy="-14" r="3.5" fill="${secondary}"/>
        </g>
      `;

    case 'tijeras_peine':
      return `
        <g transform="scale(${scale})">
          <!-- Peine colorido de fondo -->
          <rect x="-34" y="-8" width="68" height="15" rx="5" fill="${accent}" stroke="#FFFFFF" stroke-width="2"/>
          <line x1="-24" y1="-8" x2="-24" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="-16" y1="-8" x2="-16" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="-8" y1="-8" x2="-8" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="0" y1="-8" x2="0" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="8" y1="-8" x2="8" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="16" y1="-8" x2="16" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <line x1="24" y1="-8" x2="24" y2="4" stroke="${primary}" stroke-width="2.2"/>
          <!-- Tijeras pop cruzadas -->
          <circle cx="-16" cy="24" r="9" fill="${secondary}" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="16" cy="24" r="9" fill="${primary}" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="-16" cy="24" r="4" fill="#FFFFFF"/>
          <circle cx="16" cy="24" r="4" fill="#FFFFFF"/>
          <path d="M-10,18 L14,-28 M10,18 L-14,-28" stroke="${primary}" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="0" cy="-5" r="4.5" fill="${accent}" stroke="#FFFFFF" stroke-width="2"/>
          <!-- Lineas de corte chispeante -->
          <path d="M22,-24 L28,-30 M-22,-24 L-28,-30" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;

    case 'unas_manicure':
      return `
        <g transform="scale(${scale})">
          <!-- Botellita de esmalte pop -->
          <rect x="-16" y="-6" width="32" height="38" rx="8" fill="${primary}" stroke="#FFFFFF" stroke-width="3"/>
          <rect x="-9" y="-22" width="18" height="16" rx="3" fill="${secondary}"/>
          <!-- Franja de color liquido -->
          <path d="M-12,12 Q0,20 12,12 L12,24 Q0,28 -12,24 Z" fill="${accent}"/>
          <circle cx="-6" cy="4" r="3" fill="#FFFFFF"/>
          <!-- Gotita de brillo -->
          <path d="M22,-4 C22,-4 28,4 28,8 C28,11 25,14 22,14 C19,14 16,11 16,8 C16,4 22,-4 22,-4 Z" fill="${secondary}"/>
          <!-- Estrellitas -->
          <path d="M-24,-14 L-22,-9 L-17,-7 L-22,-5 L-24,0 L-26,-5 L-31,-7 L-26,-9 Z" fill="${accent}"/>
        </g>
      `;

    case 'espejo_tocador':
      return `
        <g transform="scale(${scale})">
          <!-- Espejo de mano vibrante con mango -->
          <circle cx="0" cy="-8" r="32" fill="${accent}" stroke="${primary}" stroke-width="4"/>
          <circle cx="0" cy="-8" r="23" fill="#FFFFFF"/>
          <!-- Reflejo chispeante -->
          <path d="M-12,-16 L12,-2" stroke="${primary}" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="8" cy="-14" r="3.5" fill="${secondary}"/>
          <!-- Mango -->
          <path d="M-5,24 L-4,42 C-4,45 4,45 4,42 L5,24 Z" fill="${primary}"/>
          <circle cx="0" cy="44" r="4" fill="${secondary}"/>
          <!-- Estrellas alrededor -->
          <circle cx="28" cy="-28" r="5" fill="${secondary}"/>
          <circle cx="-28" cy="14" r="4" fill="${accent}"/>
        </g>
      `;

    case 'monograma_pop':
    default:
      return `
        <g transform="scale(${scale})">
          <!-- Placa circular pop con sombra offset -->
          <circle cx="3" cy="3" r="38" fill="${secondary}"/>
          <circle cx="0" cy="0" r="38" fill="${accent}" stroke="#FFFFFF" stroke-width="4"/>
          <text x="0" y="16" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="46" font-weight="900" fill="${primary}" text-anchor="middle">${initial}</text>
          <!-- Rayo / Estrellas -->
          <path d="M24,-24 L27,-17 L34,-15 L27,-13 L24,-6 L22,-13 L15,-15 L22,-17 Z" fill="${primary}"/>
          <circle cx="-26" cy="24" r="5" fill="${secondary}"/>
        </g>
      `;
  }
}

/**
 * Generador interactivo de logos POP
 */
export async function generateLogosWithAI(params: LogoGenerationParams): Promise<{
  success: boolean;
  logos: GeneratedLogo[];
  source: 'gcp_cloud';
}> {
  purgeAiStudioTokens();

  // Simulación de diseño de branding pop
  await new Promise((resolve) => setTimeout(resolve, 600));

  const logos = buildFourDistinctLogos(params);
  return {
    success: true,
    logos,
    source: 'gcp_cloud'
  };
}

/**
 * Construye 4 propuestas POP, súper diferentes, llamativas y acogedoras
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
  const cSecondary = color.secondary;
  const cBg = color.bg;

  const icon1 = renderPopIsotype(params.symbolId, cPrimary, cAccent, cSecondary, initial, 1.35);
  const icon2 = renderPopIsotype(params.symbolId, cPrimary, cAccent, cSecondary, initial, 1.2);
  const icon3 = renderPopIsotype(params.symbolId, cPrimary, cAccent, cSecondary, initial, 1.15);
  const icon4 = renderPopIsotype(params.symbolId, cPrimary, cAccent, cSecondary, initial, 1.3);

  // -------------------------------------------------------------------------
  // PROPUESTA 1: STICKER BADGE POP (Insignia moderna, sombra 3D, ultra llamativa)
  // -------------------------------------------------------------------------
  const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="44" fill="${cBg}"/>
  
  <!-- Sombra 3D tipo Sticker -->
  <rect x="52" y="52" width="400" height="400" rx="40" fill="${cPrimary}" opacity="0.25" transform="translate(6, 6)"/>
  <rect x="50" y="50" width="400" height="400" rx="40" fill="#FFFFFF" stroke="${cPrimary}" stroke-width="4.5"/>
  
  <!-- Burbuja circular alegre detrás del ícono -->
  <circle cx="250" cy="180" r="85" fill="${cAccent}" fill-opacity="0.35"/>
  
  <!-- Isotipo POP -->
  <g transform="translate(250, 180)">
    ${icon1}
  </g>
  
  <!-- Tipografía Bubbly Bold POP (Cero fúnebre) -->
  <text x="250" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="44" font-weight="900" fill="${cPrimary}" text-anchor="middle" letter-spacing="1">${title}</text>
  
  <!-- Pastilla vibrante para el eslogan -->
  <rect x="110" y="348" width="280" height="34" rx="17" fill="${cPrimary}"/>
  <text x="250" y="370" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">${subtitle}</text>
  
  <!-- Destellos pop en esquinas -->
  <circle cx="95" cy="95" r="9" fill="${cAccent}"/>
  <circle cx="405" cy="100" r="12" fill="${cSecondary}"/>
  <circle cx="400" cy="390" r="8" fill="${cAccent}"/>
  <circle cx="100" cy="395" r="7" fill="${cSecondary}"/>
</svg>`;

  // -------------------------------------------------------------------------
  // PROPUESTA 2: RETRO DAISY & SUNNY VIBE (Cálida, veraniega, energía positiva)
  // -------------------------------------------------------------------------
  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Fondo con color de acento vivo -->
  <rect width="500" height="500" rx="44" fill="#FFFFFF"/>
  <circle cx="250" cy="250" r="215" fill="${cBg}"/>
  <circle cx="250" cy="250" r="200" fill="none" stroke="${cAccent}" stroke-width="4" stroke-dasharray="10,8"/>
  
  <!-- Arco o sol naciente -->
  <path d="M 120 320 A 130 130 0 0 1 380 320 Z" fill="${cAccent}" fill-opacity="0.3"/>
  
  <g transform="translate(250, 195)">
    ${icon2}
  </g>
  
  <!-- Nombre del Salón con personalidad y alegría -->
  <text x="250" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="40" font-weight="900" fill="${cPrimary}" text-anchor="middle" letter-spacing="2">${title.toUpperCase()}</text>
  <line x1="160" y1="345" x2="340" y2="345" stroke="${cSecondary}" stroke-width="3" stroke-linecap="round"/>
  <text x="250" y="375" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="800" fill="${cSecondary}" text-anchor="middle" letter-spacing="4">${subtitle}</text>
</svg>`;

  // -------------------------------------------------------------------------
  // PROPUESTA 3: BOLD COLOR BLOCK & CHIC (Estilo salón cosmopolita tipo Glossier)
  // -------------------------------------------------------------------------
  const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="44" fill="#FFFFFF"/>
  
  <!-- Bloque de color contrastado -->
  <rect x="40" y="80" width="420" height="340" rx="32" fill="${cPrimary}"/>
  <rect x="48" y="88" width="404" height="324" rx="26" fill="none" stroke="${cAccent}" stroke-width="3" stroke-dasharray="8,6"/>
  
  <!-- Contenedor blanco para el isotipo a la izquierda -->
  <circle cx="160" cy="250" r="70" fill="#FFFFFF" stroke="${cAccent}" stroke-width="4"/>
  <g transform="translate(160, 250)">
    ${icon3}
  </g>
  
  <!-- Texto en blanco brillante y acento dorado/amarillo -->
  <text x="260" y="235" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="36" font-weight="900" fill="#FFFFFF" text-anchor="start" letter-spacing="1">${title}</text>
  <text x="260" y="270" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="800" fill="${cAccent}" text-anchor="start" letter-spacing="3">${subtitle}</text>
  <rect x="260" y="288" width="60" height="5" rx="2.5" fill="${cSecondary}"/>
</svg>`;

  // -------------------------------------------------------------------------
  // PROPUESTA 4: CURVAS DINÁMICAS & ENERGÍA TOTAL (Moderna, fresca y con gancho)
  // -------------------------------------------------------------------------
  const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" rx="44" fill="${cBg}"/>
  
  <!-- Onda dinámica y alegre en el fondo -->
  <path d="M 0,220 C 150,140 350,300 500,220 L 500,500 L 0,500 Z" fill="#FFFFFF"/>
  <path d="M 0,210 C 150,130 350,290 500,210" fill="none" stroke="${cAccent}" stroke-width="6"/>
  
  <!-- Insignia del isotipo con borde pop -->
  <circle cx="250" cy="180" r="80" fill="#FFFFFF" stroke="${cPrimary}" stroke-width="4"/>
  <g transform="translate(250, 180)">
    ${icon4}
  </g>
  
  <text x="250" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="42" font-weight="900" fill="${cPrimary}" text-anchor="middle" letter-spacing="1.5">${title}</text>
  <text x="250" y="358" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="800" fill="${cSecondary}" text-anchor="middle" letter-spacing="4">${subtitle}</text>
  
  <!-- Estrellas y destellos -->
  <circle cx="250" cy="388" r="5" fill="${cAccent}"/>
  <circle cx="230" cy="388" r="3" fill="${cPrimary}"/>
  <circle cx="270" cy="388" r="3" fill="${cPrimary}"/>
</svg>`;

  const svgs = [
    { svg: svg1, title: 'Sticker Pop 3D', composition: 'Insignia de Salón' },
    { svg: svg2, title: 'Retro Daisy & Glow', composition: 'Círculo Veraniego' },
    { svg: svg3, title: 'Bold Color Block', composition: 'Cosmopolita Chic' },
    { svg: svg4, title: 'Onda Dinámica Pop', composition: 'Movimiento & Frescura' }
  ];

  return svgs.map((item, idx) => ({
    id: `logo-${Date.now()}-${idx}`,
    svg: item.svg,
    url: svgToDataUri(item.svg),
    title: `${item.title} · ${symbol.name.split('&')[0].trim()}`,
    styleName: style.name,
    composition: item.composition,
    timestamp: Date.now()
  }));
}
