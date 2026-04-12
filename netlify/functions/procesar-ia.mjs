import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { image, template } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "GEMINI_API_KEY no configurada." }) 
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analiza la foto del usuario y detecta la posición de los ojos y la boca. 
    Devuelve las coordenadas NORMALIZADAS de 0 a 100 (donde 0 es arriba/izquierda y 100 es abajo/derecha).
    
    RESPONDE ÚNICAMENTE CON ESTE FORMATO JSON:
    {
      "landmarks": {
        "left_eye": {"x": 50, "y": 40},
        "right_eye": {"x": 60, "y": 40},
        "mouth": {"x": 55, "y": 60}
      },
      "advice": "Consejo editorial de moda...",
      "tags": ["estilo", "nova"]
    }`;

    const assetResponse = await fetch(template);
    const assetBuffer = await assetResponse.arrayBuffer();

    // Usando los campos exactos solicitados por el usuario
    const result = await model.generateContent([
      prompt,
      {
        inline_data: {
          data: image,
          mime_type: "image/jpeg",
        },
      },
      {
        inline_data: {
          data: Buffer.from(assetBuffer).toString("base64"),
          mime_type: "image/png",
        },
      },
    ]);

    const response = await result.response;
    let text = response.text();
    
    // Limpieza robusta de Markdown
    text = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(text);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysis)
    };

  } catch (error) {
    console.error("Backend Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};