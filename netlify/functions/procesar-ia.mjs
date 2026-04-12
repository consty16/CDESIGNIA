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

    // Descargar asset
    const assetResponse = await fetch(template);
    if (!assetResponse.ok) throw new Error("No se pudo cargar el asset");
    const assetBuffer = await assetResponse.arrayBuffer();
    const assetBase64 = Buffer.from(assetBuffer).toString("base64");

    const prompt = `Analiza la foto del usuario y detecta landmarks faciales.
Coordenadas de 0 a 100 (porcentaje del ancho/alto).

RESPONDE SOLO JSON PURO sin markdown:
{
  "landmarks": {
    "left_eye": {"x": 35, "y": 38},
    "right_eye": {"x": 65, "y": 38},
    "mouth": {"x": 50, "y": 62}
  },
  "advice": "Consejo de estilo personalizado...",
  "tags": ["haute-couture", "editorial"]
}`;

    // ✅ API REST directa — sin dependencias
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: image } },
              { inline_data: { mime_type: "image/png", data: assetBase64 } }
            ]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.json();
      throw new Error(err.error?.message || "Error Gemini API");
    }

    const geminiData = await geminiResponse.json();
    let text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();

    const analysis = JSON.parse(text);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        landmarks: analysis.landmarks,
        advice: analysis.advice,
        tags: analysis.tags
      })
    };

  } catch (error) {
    console.error("Error:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};