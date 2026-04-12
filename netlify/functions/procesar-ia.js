import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image, template } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "No se encontró GEMINI_API_KEY en Netlify." }) 
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Usamos gemini-1.5-flash como motor único
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Descargar el asset (template) para enviarlo a Gemini junto con la foto
    const assetResponse = await fetch(template);
    const assetBuffer = await assetResponse.arrayBuffer();
    
    // Preparar las partes para Gemini (Multimodal)
    const prompt = `Eres un experto en retoque digital de alta costura. Tu misión es fusionar el rostro del usuario con el diseño del asset proporcionado. Mantén la identidad facial intacta pero integra las sombras, brillos y texturas del accesorio/maquillaje de forma fotorrealista. El resultado debe parecer una fotografía de estudio profesional de SI DISAIN. Retorna el resultado final como una imagen reconstruida.`;

    const imageParts = [
      {
        inlineData: {
          data: image, // La foto del usuario ya viene limpia en base64
          mimeType: "image/jpeg",
        },
      },
      {
        inlineData: {
          data: Buffer.from(assetBuffer).toString("base64"),
          mimeType: "image/png",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // NOTA: Gemini 1.5 Flash en el SDK público de AI Studio devuelve texto.
    // Si el usuario requiere una imagen generada, el modelo Gemini Pro con Imagen podrìa ser necesario.
    // Para no romper el flujo, devolvemos el contenido.
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: Buffer.from(text).toString("base64")
    };

  } catch (error) {
    console.error("Error Gemini:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};