export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { prompt: userPrompt, template: assetUrl } = JSON.parse(event.body);
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "GEMINI_API_KEY no configurada en el entorno." }) };
    }

    // 1. Gemini: Optimizador de Prompt (Prompt Engineering Automático)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `Actúa como un Diseñador Jefe de Moda Digital (Haute Couture).
    Tu misión es traducir el deseo del usuario y la referencia de estilo en un PROMPT MAESTRO en INGLÉS para un motor de generación FLUX.
    
    REFERENCIA DE ESTILO: La imagen adjunta es la base estética.
    DESEO DEL USUARIO: "${userPrompt}"
    
    ESTRUCTURA DEL PROMPT:
    - Describe a una modelo profesional luciendo el diseño.
    - Usa términos como: "8k ultra-high resolution", "editorial high fashion photography", "Vogue style", "cinematic lighting", "intricate fabric textures".
    - El prompt DEBE estar en INGLÉS.
    
    RESPONDE EXCLUSIVAMENTE CON ESTE JSON:
    {
      "refined_prompt": "Prompt maestro detallado en inglés...",
      "advice": "Breve consejo de estilo en español sobre esta visión...",
      "tags": ["luxury", "editorial", "digital-fashion"]
    }`;

    // Descargar el asset para referencia
    const assetResponse = await fetch(assetUrl);
    const assetBuffer = await assetResponse.arrayBuffer();
    const assetBase64 = Buffer.from(assetBuffer).toString("base64");

    const geminiPayload = {
      contents: [{
        parts: [
          { text: systemPrompt },
          { inline_data: { mime_type: "image/png", data: assetBase64 } }
        ]
      }],
      generationConfig: { response_mime_type: "application/json" }
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    if (!geminiRes.ok) throw new Error("Error en la optimización creativa (Gemini)");
    
    const geminiData = await geminiRes.json();
    const creativeData = JSON.parse(geminiData.candidates[0].content.parts[0].text);

    // 2. Pollinations AI: Motor de Imagen de Respaldo (Rápido y fiable)
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(creativeData.refined_prompt)}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

    // 3. Conversión a Base64 para asegurar Descarga Local
    const imageRes = await fetch(pollinationsUrl);
    if (!imageRes.ok) throw new Error("Fallo en la generación de imagen final");
    
    const imageBuffer = await imageRes.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const finalUrl = `data:image/jpeg;base64,${imageBase64}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: finalUrl,
        advice: creativeData.advice,
        tags: creativeData.tags
      })
    };

  } catch (error) {
    console.error("Nova Lab Critical Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};