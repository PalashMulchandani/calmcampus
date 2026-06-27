// /api/chat.js
// Vercel Serverless Function — proxies requests to Groq's free LLM API.
// The real Groq API key lives ONLY here, as a server-side environment
// variable. It never reaches the browser.
//
// NOTE: Groq's API is OpenAI-compatible, not Anthropic-compatible. This
// function translates between the two so script.js (which still sends/
// expects the original Anthropic-style shape) doesn't need any changes.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'Server is missing GROQ_API_KEY. Set it in Vercel → Project → Settings → Environment Variables.' }
    });
  }

  try {
    const { system, messages, max_tokens } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: { message: 'messages array is required' } });
    }

    // Groq/OpenAI format wants the system prompt as the first message
    // in the array, not a separate top-level field.
    const groqMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 1000,
        messages: groqMessages
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: { message: data?.error?.message || 'Groq API error' } });
    }

    // Reshape Groq/OpenAI's response into the Anthropic-style shape
    // script.js already expects: { content: [ { type: 'text', text: '...' } ] }
    const text = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    return res.status(500).json({ error: { message: err.message || 'Unknown server error' } });
  }
}
