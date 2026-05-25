/**
 * api/claude.js — Vercel Serverless Function
 * Proxies AI requests to OpenRouter (Claude models) server-side
 * so the API key is never exposed to the browser.
 *
 * POST /api/claude
 * Body: { messages: [...], system?: string, max_tokens?: number }
 * Returns: { content: string }
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { messages, system, max_tokens = 4000 } = req.body;

  if (!messages?.length) {
    return res.status(400).json({ error: "messages required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nassa-gestione.vercel.app",
        "X-Title": "Nassa Marketing Studio",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        max_tokens,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter error",
      });
    }

    const content = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
