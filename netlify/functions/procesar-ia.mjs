export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { prompt: userPrompt, template: assetUrl } = JSON.parse(event.body);
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!GEMINI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "GEMINI_API_KEY no configurada." }) };
    }

    // 1. Gemini: Optimizador de Prompt Creativo
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // El prompt de sistema para Gemini
    const systemPrompt = `Actúa como un motor de generación de imágenes de moda ultra-realista y experto en prompts de Stable Diffusion / Flux.
    Tu tarea es crear un PROMPT MAESTRO basado en una referencia de estilo (imagen) y el deseo del usuario.
    
    ESTILO SELECCIONADO: La imagen adjunta es la referencia estética primordial.
    DESCRIPCIÓN DEL USUARIO: "${userPrompt}"
    
    REGLAS:
    - Combina armoniosamente los elementos visuales de la referencia con la idea del usuario.
    - El resultado debe ser fotorrealista, iluminación de estudio profesional, calidad 8k, cinematográfico.
    - Incluye detalles técnicos: "ultra-detailed", "textures of silk/metal", "vogue editorial style", "high fashion photography".
    
    RESPONDE EXCLUSIVAMENTE CON UN JSON:
    {
      "refined_prompt": "El prompt final en inglés optimizado para generación de imagen...",
      "advice": "Un consejo de estilo en español sobre esta combinación...",
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    // Descargar el asset para que Gemini lo vea
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

    if (!geminiRes.ok) throw new Error("Gemini Prompt Optimization Failed");
    
    const geminiData = await geminiRes.json();
    const creativeData = JSON.parse(geminiData.candidates[0].content.parts[0].text);

    // 2. Hugging Face: Generación de Imagen (Motor de Creación)
    // Si no hay HF_TOKEN, devolvemos un error informativo o usamos un modelo público si es posible
    if (!HF_TOKEN) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "HF_TOKEN no configurado para generación de imágenes." }) 
      };
    }

    const modelId = "black-forest-labs/FLUX.1-schnell"; // Modelo ultra-rápido y de alta calidad
    const hfUrl = `https://api-inference.huggingface.co/models/${modelId}`;
    
    const hfResponse = await fetch(hfUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: creativeData.refined_prompt,
        parameters: {
          width: 1024,
          height: 1024,
        }
      })
    });

    if (!hfResponse.ok) {
      console.error("HF Error:", await hfResponse.text());
      throw new Error("Hugging Face Image Generation Failed");
    }

    const imageBuffer = await hfResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl,
        advice: creativeData.advice,
        tags: creativeData.tags
      })
    };

  } catch (error) {
    console.error("Nova Lab Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};