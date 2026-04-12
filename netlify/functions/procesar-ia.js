exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image, template } = JSON.parse(event.body);
    const TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!TOKEN) {
      return { statusCode: 500, body: JSON.stringify({ error: "No se encontró REPLICATE_API_TOKEN en Netlify." }) };
    }

    const PROMPTS = {
      "MAQUILLAJE": "Masterpiece, professional studio lighting, high fashion model with artistic crystal makeup, neon fuchsia glow, editorial photography, 8k, ultra realistic, highly detailed skin, beauty campaign, sharp focus, skin pores visible, dramatic violet rim light",
      "MÁSCARAS": "Masterpiece, professional studio lighting, luxury fashion model wearing elegant ornate mask, deep purple cinematic lighting, hyper-realistic, haute couture, mysterious, 8k, highly detailed skin, sharp focus, cinematic atmosphere, intricate textures",
      "VESTIDOS": "Masterpiece, professional studio lighting, elegant fashion model wearing luxury evening dress, lila purple aesthetics, vogue editorial style, ultra realistic, 8k, highly detailed skin, sharp focus, expensive fabric texture, soft bokeh background"
    };

    const prompt = PROMPTS[category] || PROMPTS["MÁSCARAS"];
    const imageDataUrl = `data:image/jpeg;base64,${image}`;

    // ── Paso 1: crear la predicción en Replicate ──
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
        input: {
          image: imageDataUrl,
          prompt: prompt,
          negative_prompt: "bad quality, blurry, low resolution, distorted, extra limbs, ugly, watermark, text, grainy",
          style: "3D", // Estilo base de alta calidad para fofr
          instant_id_strength: 1.0,
          denoising_strength: 0.65,
          prompt_strength: 7,
          scheduler: "K_EULER_ANCESTRAL",
          num_inference_steps: 30
        }
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.json().catch(() => ({}));
      console.error("Replicate error:", createResponse.status, JSON.stringify(err));
      return {
        statusCode: createResponse.status,
        body: JSON.stringify({ error: err.detail || "Error al crear predicción en Replicate" })
      };
    }

    const prediction = await createResponse.json();

    // Si el resultado ya viene (Prefer: wait), devolverlo
    if (prediction.status === "succeeded" && prediction.output) {
      const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;

      // Descargar la imagen y devolverla como base64
      const imgResponse = await fetch(imageUrl);
      const buffer = await imgResponse.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: base64
      };
    }

    // Si está en proceso, hacer polling
    if (prediction.id) {
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 2000));

        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        });

        const result = await pollResponse.json();

        if (result.status === "succeeded" && result.output) {
          const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
          const imgResponse = await fetch(imageUrl);
          const buffer = await imgResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");

          return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: base64
          };
        }

        if (result.status === "failed") {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: result.error || "Replicate falló" })
          };
        }
      }

      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Timeout esperando resultado de Replicate" })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Respuesta inesperada de Replicate" })
    };

  } catch (error) {
    console.error("Error general:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};