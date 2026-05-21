export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vercel va chercher la clé stockée secrètement dans ses paramètres
  const apiKey = process.env.GEMINI_API_KEY;
  const { image, prompt } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: image } }
      ]
    }],
    generationConfig: { temperature: 0.1 }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text.trim();

    return res.status(200).json({ result: resultText });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur avec l'API Gemini" });
  }
}
