export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { image, template } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "API Key de Gemini no configurada en el servidor." }) 
      };
    }

    // 1. Descargar asset (máscara/vestido)
    let assetBase64 = "";
    try {
      const assetResponse = await fetch(template);
      if (!assetResponse.ok) throw new Error(`Status ${assetResponse.status}`);
      const assetBuffer = await assetResponse.arrayBuffer();
      assetBase64 = Buffer.from(assetBuffer).toString("base64");
    } catch (e) {
      console.error("Error al cargar asset:", e.message);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: `Error al descargar el recurso: ${e.message}` }) 
      };
    }

    const prompt = `Analiza la imagen del usuario para detectar landmarks faciales precisos.
    NECESITO LAS COORDENADAS exactas de los ojos (centro de la pupila) en formato 0-100 relativo al ancho y alto.
    
    RESPONDE ÚNICAMENTE CON ESTE FORMATO JSON (sin texto adicional ni markdown):
    {
      "landmarks": {
        "left_eye": {"x": 35, "y": 38},
        "right_eye": {"x": 65, "y": 38},
        "mouth": {"x": 50, "y": 62}
      },
      "advice": "Breve consejo de estilo premium basado en sus facciones...",
      "tags": ["estilo-vanguardista", "elegancia-digital"]
    }`;

    // 2. Llamada a Gemini con configuraciones de seguridad relajadas para permitir análisis facial
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const geminiPayload = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: image } }
        ]
      }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API Error Detail:", JSON.stringify(errorData));
      throw new Error(errorData.error?.message || "Fallo en la comunicación con la IA");
    }

    const geminiData = await geminiResponse.json();
    let resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Limpieza robusta de JSON
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultText = jsonMatch[0];
      }
      
      const analysis = JSON.parse(resultText);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landmarks: analysis.landmarks,
          advice: analysis.advice,
          tags: analysis.tags
        })
      };
    } catch (e) {
      console.error("Error parseando JSON de Gemini:", resultText);
      throw new Error("La IA devolvió un formato de datos ilegible.");
    }

  } catch (error) {
    console.error("Function Error:", error.message);
    return { 
      statusCode: 500, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};