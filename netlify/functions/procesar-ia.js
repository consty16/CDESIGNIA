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

    // Limpiar el base64 de la foto del usuario (quitar prefijo data:image/...;base64,)
    const cleanUserImage = image.replace(/^data:image\/\w+;base64,/, "");

    // Detectar si el template es una URL o base64
    const targetImageUrl = template.startsWith('http') 
      ? template 
      : template.replace(/^data:image\/\w+;base64,/, "");
      
    // ── Paso 1: crear la predicción en Replicate (lucataco/faceswap) ──
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "9a42989d3132e4d293816edb5da2235e9f8260d3d3d6313174f4b23b378eb8", 
        input: {
          target_image: targetImageUrl,
          swap_image: cleanUserImage,
          source_image: cleanUserImage
        }
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.json().catch(() => ({}));
      console.error("Replicate error:", createResponse.status, JSON.stringify(err));
      return {
        statusCode: createResponse.status,
        body: JSON.stringify({ 
          error: err.detail || err.error || "Error al crear predicción en Replicate",
          details: err
        })
      };
    }

    const prediction = await createResponse.json();
    console.log("REPLICATE RESPONSE:", JSON.stringify(prediction));

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
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
// ...


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