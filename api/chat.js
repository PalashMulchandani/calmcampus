// /api/chat.js
// Vercel Serverless Function — acts as a secure proxy between the CalmCampus
// frontend and the Anthropic API. The real API key lives ONLY here, as an
// environment variable on Vercel — it is never sent to the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'Server is missing ANTHROPIC_API_KEY. Set it in Vercel → Project → Settings → Environment Variables.' }
    });
  }

  try {
    const { system, messages, max_tokens } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: { message: 'messages array is required' } });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1000,
        system,
        messages
      })
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message || 'Unknown server error' } });
  }
}
