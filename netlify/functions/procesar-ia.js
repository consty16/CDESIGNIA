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

    // Instrucciones de estilo Nova IA
    const PROMPTS = {
      "MAQUILLAJE": "High-fashion crystal makeup, neon fuchsia details, hyper-realistic skin, 8k resolution.",
      "MÁSCARAS": "Luxury mask fusion, cinematic lighting, neon purple highlights, seamless integration, editorial style.",
      "VESTIDOS": "Professional virtual try-on, elegant fabric flow, realistic shadows, tucumano design essence."
    };

    const response = await fetch(`https://api-inference.huggingface.co/models/${endpoint}`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: {
          image: image,
          parameter_image: template,
          prompt: PROMPTS[category]
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: `Error IA: ${err}` };
    }

    const buffer = await response.arrayBuffer();
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    return { statusCode: 500, body: "Error interno: " + error.message };
  }
};
