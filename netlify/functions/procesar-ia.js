// Usamos el fetch nativo de Node.js 18+ disponible en Netlify

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image } = JSON.parse(event.body);
    const TOKEN = process.env.HF_TOKEN;

    if (!TOKEN) {
      console.error("Falta HF_TOKEN en las variables de entorno");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "No se encontró el HF_TOKEN en la configuración de Netlify." })
      };
    }

    const PROMPTS = {
      "MAQUILLAJE": "Artistic crystal makeup, high-fashion editorial, neon fuchsia glow, 8k, maintain facial features.",
      "MÁSCARAS":   "Seamless cinematic face fusion, luxury mask, deep purple lighting, hyper-realistic skin tones.",
      "VESTIDOS":   "Professional virtual try-on, elegant drapery, realistic fabric physics, studio lighting, lila aesthetics."
    };

    const prompt = PROMPTS[category] || PROMPTS["MÁSCARAS"];
    const cleanImage = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(cleanImage, "base64");

    // ✅ AbortController para gestionar el tiempo de espera
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s para la IA

    let response;
    try {
      // Usamos router.huggingface.co para evitar el error 410 (Gone)
      response = await fetch(
        `https://router.huggingface.co/models/timbrooks/instruct-pix2pix?prompt=${encodeURIComponent(prompt)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "image/jpeg",
            "x-wait-for-model": "true"
          },
          body: imageBuffer,
          signal: controller.signal
        }
      );
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return {
          statusCode: 503,
          body: JSON.stringify({ 
            error: "El modelo IA está cargando o el servidor está saturado. Intentá de nuevo en un momento." 
          })
        };
      }
      throw fetchError;
    } finally {
      clearTimeout(timeout);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok || contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      console.error("HF respondió con error:", response.status, JSON.stringify(errorData));

      if (errorData.estimated_time || response.status === 503) {
        return {
          statusCode: 503,
          body: JSON.stringify({ 
            error: `Modelo cargando. Estimado: ${Math.ceil(errorData.estimated_time || 30)}s. Intentá de nuevo.` 
          })
        };
      }

      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error || response.statusText })
      };
    }

    const buffer = await response.arrayBuffer();
    const base64Body = Buffer.from(buffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: base64Body
    };

  } catch (error) {
    console.error("Error general en la función:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
