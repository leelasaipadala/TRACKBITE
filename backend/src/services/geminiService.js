const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGeminiFlashApi(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Backend Gemini API call returned non-200 status');
      return null;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error('Gemini API request error in backend:', err.message);
    return null;
  }
}

module.exports = {
  callGeminiFlashApi
};
