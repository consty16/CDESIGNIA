import { GoogleGenAI } from "@google/genai";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image, template } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
       return { statusCode: 500, body: JSON.stringify({ error: "GEMINI_API_KEY no configurada." }) };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = ai.models.get("gemini-1.5-flash");

    // ── Paso 1: Análisis Multimodal y Retoque Inteligente ──
    const prompt = `Eres un experto en retoque digital de alta costura para la agencia Nova AI. 
    Analiza la foto del usuario y el asset (máscara/maquillaje) proporcionado.
    
    INSTRUCCIONES TÉCNICAS:
    1. Define las coordenadas (x, y) relativas (0 a 1000) de los ojos y la boca en la foto del usuario.
    2. Genera un consejo de estilo personalizado basado en las facciones detectadas.
    3. Genera etiquetas de moda automáticas.
    
    RESPONDE EXCLUSIVAMENTE EN FORMATO JSON:
    {
      "landmarks": {
        "left_eye": {"x": 0, "y": 0},
        "right_eye": {"x": 0, "y": 0},
        "mouth": {"x": 0, "y": 0}
      },
      "advice": "Texto del consejo...",
      "tags": ["tag1", "tag2"],
      "image_description": "Descripción para el renderizado..."
    }`;

    // Descargar asset para que Gemini lo vea
    const assetResponse = await fetch(template);
    const assetBuffer = await assetResponse.arrayBuffer();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: image, mimeType: "image/jpeg" } },
            { inlineData: { data: Buffer.from(assetBuffer).toString("base64"), mimeType: "image/png" } }
          ]
        }
      ],
      generationConfig: { responseMimeType: "application/json" }
    });

    const analysis = JSON.parse(result.response.text());
    console.log("Gemini Analysis:", analysis);

    // ── Paso 2: Renderizado de Alta Gama (Fallback Inteligente) ──
    // En un flujo ideal, usaríamos Landmarks para posicionar la máscara.
    // Por ahora, devolvemos el análisis y una señal para el frontend.
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: image, // Por ahora devolvemos la original hasta conectar el renderizador
        advice: analysis.advice,
        tags: analysis.tags,
        landmarks: analysis.landmarks
      })
    };

  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};