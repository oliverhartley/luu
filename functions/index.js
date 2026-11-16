const { VertexAI } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({
  project: 'pelu-harliz-green',
  location: 'us-central1'
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

exports.generateLogo = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { 
      salonName = 'Pelu OBi', 
      slogan = 'Hair & Beauty Atelier', 
      styleName = 'Minimalista & Elegante', 
      symbolName = 'Silueta Femenina de Trazo Fino',
      paletteName = 'Rhode Neutrals',
      colors = ['#2B2824', '#D4B895', '#F5EFEB'],
      customDetails = ''
    } = req.body || {};

    const prompt = `You are an elite creative director specializing in vibrant, trendy, and ULTRA-POP beauty salons (like Glossier, Rhode, Drybar, Starface).
Design a joyful, vibrant, welcoming vector logo in SVG format for:
- Salon Name: "${salonName}"
- Slogan: "${slogan}"
- Aesthetic Style: "${styleName}" (MUST BE ULTRA-POP, VIBRANT, AND COLORFUL)
- Symbol / Motif: "${symbolName}"
- Colors: Primary: ${colors[0]}, Accent: ${colors[1]}, Light: ${colors[2] || '#FFFFFF'}
- Notes: "${customDetails}"

CRITICAL DESIGN RULES:
1. NEVER use mournful, somber, funeral, or stiff formal serif styles. This is an exciting, cheerful beauty salon!
2. Use bold, juicy, energetic shapes, cheerful rounded curves, and playful sparkles.
3. Use bold modern typography (like 'Plus Jakarta Sans' or bold rounded modern sans-serif).
4. Return ONLY valid raw SVG starting with <svg> and ending with </svg>, viewBox="0 0 500 500" width="100%" height="100%".
5. Escape all XML entities properly (&amp;).`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 2048
      }
    });

    const response = await result.response;
    let fullText = '';
    if (response.candidates && response.candidates[0]?.content?.parts) {
      fullText = response.candidates[0].content.parts.map(p => p.text || '').join('\n');
    }

    const svgMatch = fullText.match(/<svg[\s\S]*?<\/svg>/i);
    const cleanSvg = svgMatch ? svgMatch[0] : null;

    res.status(200).json({
      success: !!cleanSvg,
      svg: cleanSvg,
      source: 'vertex_ai_gcp'
    });
  } catch (error) {
    console.error('[Vertex AI] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
