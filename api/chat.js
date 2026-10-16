export default async function handler(req, res) {
  // CORS xatoligini oldini olish uchun header'lar
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  // API kalitni to'g'ridan-to'g'ri shu yerga yozamiz (xavfsiz turadi, chunki serverda bajariladi)
  const apiKey = "AQ.Ab8RN6Ip32y8j6dJ5uDbj4Wh7kO4m-XfRLTFtCsT7aDdSkJjOg";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Sening isming bekuzAI. Sen aqlli va xushfayl assistentsan. Foydalanuvchiga qisqa va aniq javob ber: " + message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Javob olishda xatolik yuz berdi.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
