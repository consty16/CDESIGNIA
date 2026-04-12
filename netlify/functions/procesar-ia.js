import { GoogleGenAI } from "@google/genai";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { image, template } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
       return { statusCode: 500, body: JSON.stringify({ error: "GEMINI_API_KEY no configurada." }) };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = ai.models.get("gemini-1.5-flash");

    const prompt = `Analiza la foto del usuario y detecta la posición de los ojos y la boca. 
    Devuelve las coordenadas NORMALIZADAS de 0 a 100 (donde 0 es arriba/izquierda y 100 es abajo/derecha).
    
    RESPONDE ÚNICAMENTE CON ESTE FORMATO JSON:
    {
      "landmarks": {
        "left_eye": {"x": 50, "y": 40},
        "right_eye": {"x": 60, "y": 40},
        "mouth": {"x": 55, "y": 60}
      },
      "advice": "Un consejo de estilo breve y profesional...",
      "tags": ["elegante", "nova"]
    }`;

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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysis)
    };

  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};