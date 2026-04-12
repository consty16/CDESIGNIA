exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { category, image, template } = JSON.parse(event.body);
    const TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!TOKEN) {
      return { statusCode: 500, body: JSON.stringify({ error: "No se encontró REPLICATE_API_TOKEN." }) };
    }

    // Usamos el Base64 LIMPIO (sin prefijo) tal como pidió el usuario
    const cleanUserImage = image.replace(/^data:image\/\w+;base64,/, "");
    // El template ya viene como URL absoluta desde el frontend
    const targetImageUrl = template;

    // ── Paso 1: Crear predicción (lucataco/faceswap - Versión Estable) ──
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "9a42373a1e3463b3989c9733cc951fdb69b2cd37ca473136b13cf8640822588e", 
        input: {
          target_image: targetImageUrl,
          swap_image: cleanUserImage
        }
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.json().catch(() => ({}));
      return {
        statusCode: createResponse.status,
        body: JSON.stringify({ error: err.detail || "Error en Replicate" })
      };
    }

    const prediction = await createResponse.json();

    if (prediction.status === "succeeded" && prediction.output) {
      const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      const imgResponse = await fetch(imageUrl);
      const buffer = await imgResponse.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: base64
      };
    }

    if (prediction.id) {
      for (let i = 0; i < 20; i++) {
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
          return { statusCode: 200, headers: { "Content-Type": "text/plain" }, body: base64 };
        }
        if (result.status === "failed") {
          return { statusCode: 500, body: JSON.stringify({ error: "Fallo en el servidor de IA" }) };
        }
      }
      return { statusCode: 503, body: JSON.stringify({ error: "Timeout" }) };
    }

    return { statusCode: 500, body: JSON.stringify({ error: "Error inesperado" }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};