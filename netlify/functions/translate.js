const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { text } = JSON.parse(event.body || "{}");
  if (!text) return { statusCode: 400, body: JSON.stringify({ error: "Geen tekst opgegeven" }) };

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "GROQ_API_KEY niet ingesteld in Netlify" }) };
  }

  const payload = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: "Je bent een vertaler. Vertaal de tekst die de gebruiker stuurt naar het Nederlands. Geef alleen de vertaling terug, geen uitleg of opmerkingen.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.groq.com",
        path: "/openai/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              resolve({ statusCode: 500, body: JSON.stringify({ error: parsed.error.message }) });
              return;
            }
            const translated = parsed.choices?.[0]?.message?.content || "";
            resolve({
              statusCode: 200,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ translation: translated }),
            });
          } catch (e) {
            resolve({ statusCode: 500, body: JSON.stringify({ error: "Parsefout: " + e.message }) });
          }
        });
      }
    );
    req.on("error", (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
    req.write(payload);
    req.end();
  });
};
