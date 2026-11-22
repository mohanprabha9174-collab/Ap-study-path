// Shared AI layer: one function that talks to Claude, OpenAI, or Gemini.
// Keys come only from environment variables (.env locally, the host's settings in production).

const CLAUDE_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Accept common mistakes when the key is pasted into a host's settings page:
// surrounding spaces or quotes, "Bearer " prefixes, and a few alternate names.
const ALIASES = {
  OPENAI_API_KEY: ["OPENAI_KEY", "OPEN_AI_API_KEY", "OPENAI_APIKEY", "OPENAI_TOKEN", "CHATGPT_API_KEY"],
  ANTHROPIC_API_KEY: ["CLAUDE_API_KEY", "ANTHROPIC_KEY"],
  GEMINI_API_KEY: ["GOOGLE_API_KEY", "GEMINI_KEY"]
};
function clean(v) {
  return String(v || "").trim().replace(/^["']|["']$/g, "").replace(/^Bearer\s+/i, "").trim();
}
function normalizeKeys() {
  // Match variable names case-insensitively and ignoring stray spaces.
  const byLoose = {};
  for (const name of Object.keys(process.env)) byLoose[name.trim().toUpperCase()] = name;
  for (const [canonical, alts] of Object.entries(ALIASES)) {
    const found = [canonical, ...alts].map((n) => byLoose[n]).find((n) => n && clean(process.env[n]));
    if (found) process.env[canonical] = clean(process.env[found]);
  }
}
normalizeKeys();

/** Names (never values) of AI-related settings the server can see, for troubleshooting. */
export function aiSettingsSeen() {
  return Object.keys(process.env).filter((n) => /(OPENAI|OPEN_AI|CHATGPT|ANTHROPIC_API|CLAUDE_API|GEMINI|GOOGLE_API)|(API_?KEY|_KEY)\s*$/i.test(n))
    .map((n) => `${n.trim()}${clean(process.env[n]) ? "" : " (empty)"}`);
}

export function aiProvider() {
  const available = {
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY)
  };
  const wanted = (process.env.AI_PROVIDER || "").toLowerCase();
  if (available[wanted]) return wanted;
  return ["claude", "openai", "gemini"].find((p) => available[p]) || null;
}

export function aiEnabled() {
  return aiProvider() !== null;
}

// Never let a key show up in an error message or log.
function scrub(text) {
  return String(text)
    .replace(/sk-[A-Za-z0-9_\-]{8,}/g, "[key]")
    .replace(/AIza[0-9A-Za-z_\-]{20,}/g, "[key]");
}

async function failed(res, name) {
  const detail = await res.text().catch(() => "");
  return new Error(`${name} error ${res.status}: ${scrub(detail).slice(0, 300)}`);
}

/**
 * Send a conversation to the configured model.
 * @param {object} opts
 * @param {string} opts.system  system instructions
 * @param {{role:"user"|"assistant", content:string}[]} opts.messages
 * @param {{name:string, type:string, data:string}[]} [opts.attachments] base64 images/PDFs added to the first user message
 * @param {boolean} [opts.json] ask for a JSON object reply
 * @param {number} [opts.maxTokens]
 * @returns {Promise<string>} the model's reply text
 */
export async function chat({ system, messages, attachments = [], json = false, maxTokens = 2000 }) {
  const provider = aiProvider();
  if (!provider) throw new Error("No AI key configured");
  const firstUser = messages.findIndex((m) => m.role === "user");
  const withFiles = (i, build) => (attachments.length && i === firstUser ? build() : null);

  if (provider === "claude") {
    const res = await fetch(CLAUDE_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: maxTokens,
        system,
        messages: messages.map((m, i) => ({
          role: m.role,
          content: withFiles(i, () => [
            ...attachments.map((f) => f.type === "application/pdf"
              ? { type: "document", source: { type: "base64", media_type: f.type, data: f.data } }
              : { type: "image", source: { type: "base64", media_type: f.type, data: f.data } }),
            { type: "text", text: m.content }
          ]) || m.content
        }))
      }),
      signal: AbortSignal.timeout(90000)
    });
    if (!res.ok) throw await failed(res, "Claude");
    const data = await res.json();
    return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  }

  if (provider === "openai") {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        messages: [
          { role: "system", content: system },
          ...messages.map((m, i) => ({
            role: m.role,
            content: withFiles(i, () => [
              ...attachments.map((f) => f.type === "application/pdf"
                ? { type: "file", file: { filename: f.name || "project.pdf", file_data: `data:${f.type};base64,${f.data}` } }
                : { type: "image_url", image_url: { url: `data:${f.type};base64,${f.data}` } }),
              { type: "text", text: m.content }
            ]) || m.content
          }))
        ],
        ...(json ? { response_format: { type: "json_object" } } : {}),
        // reasoning models spend part of this budget thinking, so leave room
        max_completion_tokens: maxTokens * 3
      }),
      signal: AbortSignal.timeout(90000)
    });
    if (!res.ok) throw await failed(res, "OpenAI");
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const res = await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m, i) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: withFiles(i, () => [...attachments.map((f) => ({ inline_data: { mime_type: f.type, data: f.data } })), { text: m.content }]) || [{ text: m.content }]
      })),
      generationConfig: { ...(json ? { responseMimeType: "application/json" } : {}), temperature: 0.3, maxOutputTokens: maxTokens * 2 }
    }),
    signal: AbortSignal.timeout(90000)
  });
  if (!res.ok) throw await failed(res, "Gemini");
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
}
