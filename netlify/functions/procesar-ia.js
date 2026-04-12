// Usamos el fetch nativo de Node.js 18+ disponible en Netlify

/**
 * Motor central de C DESIGN IA (Versión Instruct-Pix2Pix).
 * Gestiona la transformación de imágenes enviando buffers crudos.
 */
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
        body: "Error: No se ha configurado el HF_TOKEN en las variables de entorno de Netlify." 
      };
    }

    const PROMPTS = {
      "MAQUILLAJE": "Artistic crystal makeup, high-fashion editorial, neon fuchsia glow, 8k, maintain facial features.",
      "MÁSCARAS": "Seamless cinematic face fusion, luxury mask, deep purple lighting, hyper-realistic skin tones.",
      "VESTIDOS": "Professional virtual try-on, elegant drapery, realistic fabric physics, studio lighting, lila aesthetics."
    };

    const prompt = PROMPTS[category] || PROMPTS["MÁSCARAS"];

    // ✅ Convertir base64 a bytes crudos (lo que HF img2img realmente espera)
    const cleanImage = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(cleanImage, "base64");

    // ✅ Modelo img2img real: recibe imagen + prompt de instrucción
    const MODEL_ID = "timbrooks/instruct-pix2pix";

    // Usamos el nuevo endpoint router.huggingface.co
    const response = await fetch(
      `https://router.huggingface.co/models/${MODEL_ID}?prompt=${encodeURIComponent(prompt)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "image/jpeg" // bytes crudos, no JSON
        },
        body: imageBuffer // ✅ imagen directa, no base64 en JSON
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF Error:", response.status, errorText);

      // Fallback: stable-diffusion-xl-refiner también acepta img2img
      const fallback = await fetch(
        `https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-refiner-1.0?prompt=${encodeURIComponent(prompt)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "image/jpeg"
          },
          body: imageBuffer
        }
      );

      if (fallback.ok) {
        const buffer = await fallback.arrayBuffer();
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/plain" },
          body: Buffer.from(buffer).toString("base64")
        };
      }

      return {
        statusCode: response.status,
        body: `Error HuggingFace (${response.status}): ${errorText}`
      };
    }

    const buffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: Buffer.from(buffer).toString("base64")
    };

  } catch (error) {
    console.error("Error en la función:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
