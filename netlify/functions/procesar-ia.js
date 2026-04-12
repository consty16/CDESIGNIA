const fetch = require('node-fetch');

/**
 * Motor central de C DESIGN IA.
 * Gestiona la comunicación con Hugging Face para las 3 categorías.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { image, template, category } = JSON.parse(event.body);
    const TOKEN = process.env.HF_TOKEN;

    if (!TOKEN) {
      return { statusCode: 500, body: "Error: No se encontró el HF_TOKEN en Netlify." };
    }

    // Modelos específicos para cada tipo de tarea
    const MODELOS = {
      "MAQUILLAJE": "zylim0702/makeup-transfer",
      "MÁSCARAS": "deepinsight/insightface",
      "VESTIDOS": "yisol/IDM-VTON"
    };

    const endpoint = MODELOS[category] || MODELOS["MÁSCARAS"];

    // Instrucciones de estilo Nova IA (PROMPTS_ESTILO)
    const PROMPTS = {
      "MAQUILLAJE": "Artistic crystal makeup transfer, high-fashion editorial, neon fuchsia glow, 8k, maintain facial features.",
      "MÁSCARAS": "Seamless cinematic face fusion, luxury mask integration, deep purple lighting, hyper-realistic, match skin tones.",
      "VESTIDOS": "Professional virtual try-on, elegant drapery, realistic fabric physics, studio lighting, lila aesthetics."
    };

    const cleanImage = image.replace(/^data:image\/\w+;base64,/, "");
    
    // Usamos un modelo más estándar y potente que soporte Image-to-Image por API
    const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: cleanImage,
        parameters: {
          prompt: PROMPTS[category],
          negative_prompt: "low quality, blurry, distorted, bad anatomy, nudity",
          strength: 0.5 // Mantiene rasgos del usuario pero aplica el estilo
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("HF Error:", err);
      // Si falla SDXL, intentamos con v1.5 como fallback
      if (response.status === 503 || response.status === 404) {
          const fallbackResponse = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
              headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ inputs: cleanImage, parameters: { prompt: PROMPTS[category], strength: 0.6 } })
          });
          if (fallbackResponse.ok) {
              const buffer = await fallbackResponse.arrayBuffer();
              return { statusCode: 200, headers: { "Content-Type": "text/plain" }, body: Buffer.from(buffer).toString('base64') };
          }
      }
      return { statusCode: response.status, body: `Error HuggingFace: ${err}` };
    }

    const buffer = await response.arrayBuffer();
    const base64Body = Buffer.from(buffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: base64Body
    };

  } catch (error) {
    return { statusCode: 500, body: "Error interno: " + error.message };
  }
};
