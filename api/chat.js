export default async function handler(req, res) {
  // CORS sozlamalari
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6Ip32y8j6dJ5uDbj4Wh7kO4m-XfRLTFtCsT7aDdSkJjOg";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "Isming bekuzAI. Foydalanuvchiga qisqa o'zbekcha javob ber: " + (message || "Salom") }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Agar Google API xatolik qaytarsa
    if (data.error) {
      return res.status(400).json({ reply: "API Xatosi: " + data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Javob olinmadi.";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ reply: "Server xatosi: " + error.message });
  }
}
