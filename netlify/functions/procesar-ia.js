// Usamos el fetch nativo de Node.js 18+ disponible en Netlify

/**
 * Motor central de C DESIGN IA.
 * Gestiona la comunicación con Hugging Face para las 3 categorías.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image, template } = JSON.parse(event.body);
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
    
    // Modelo que soporta img2img de forma robusta por API
    const MODEL_ID = "runwayml/stable-diffusion-v1-5";

    const response = await fetch(`https://router.huggingface.co/models/${MODEL_ID}`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: cleanImage,
        parameters: {
          prompt: PROMPTS[category],
          negative_prompt: "low quality, blurry, distorted, deformed face, bad anatomy",
          strength: 0.5,
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
      const errorMsg = errorData.error || response.statusText;
      console.error("HF Error:", errorMsg);
      return { statusCode: response.status, body: `Error HuggingFace (${response.status}): ${errorMsg}` };
    }

    const buffer = await response.arrayBuffer();
    const base64Body = Buffer.from(buffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: base64Body
    };

  } catch (error) {
    console.error("Error en la función:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
