// Shared AI layer: one function that talks to Claude, OpenAI, or Gemini.
// Keys come only from environment variables (.env locally, the host's settings in production).

const CLAUDE_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Accept common mistakes when the key is pasted into a host's settings page:
// surrounding spaces or quotes, "Bearer " prefixes, and a few alternate names.
const ALIASES = {
  OPENAI_API_KEY: ["OPENAI_KEY", "OPEN_AI_API_KEY", "OPEN_API_KEY", "OPENAPI_KEY", "OPENAI_SECRET_KEY", "OPENAI_APIKEY", "OPENAI_TOKEN", "CHATGPT_API_KEY"],
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
    // Prefer the newest numbered copy (e.g. ANTHROPIC_API_KEY_2 over ANTHROPIC_API_KEY_1 over ANTHROPIC_API_KEY),
    // since people often add a new key next to an old one instead of replacing it.
    const numbered = Object.keys(byLoose)
      .map((loose) => ({ loose, m: loose.match(new RegExp(`^${canonical}[ _-]*(\\d+)$`)) }))
      .filter((x) => x.m)
      .sort((a, b) => Number(b.m[1]) - Number(a.m[1]))
      .map((x) => byLoose[x.loose]);
    const found = [...numbered, canonical, ...alts].map((n) => byLoose[String(n).trim().toUpperCase()] || n)
      .find((n) => n && clean(process.env[n]));
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

// ---------- cost control ----------
// Haiku 5.5 is the default: about 20x cheaper than Sonnet and good at rubric grading and
// tutoring. Set ANTHROPIC_GRADER_MODEL / ANTHROPIC_HELP_MODEL to use a different model per job.
const DEFAULT_CLAUDE = "claude-haiku-5-5";
function claudeModel(purpose) {
  if (purpose === "grade" && process.env.ANTHROPIC_GRADER_MODEL) return process.env.ANTHROPIC_GRADER_MODEL;
  if (purpose === "help" && process.env.ANTHROPIC_HELP_MODEL) return process.env.ANTHROPIC_HELP_MODEL;
  return process.env.ANTHROPIC_MODEL || DEFAULT_CLAUDE;
}

// US dollars per million tokens: [input, output, cache read, cache write]. Used only to
// estimate spend for the budget cap, so a close guess is fine for unknown models.
const PRICES = [
  [/haiku-5/, (inTok) => (inTok > 100000 ? [0.5, 2.5, 0.05, 0.625] : [0.1, 0.5, 0.01, 0.125])],
  [/haiku/, () => [1, 5, 0.1, 1.25]],
  [/sonnet/, () => [2, 10, 0.1, 2.5]],
  [/opus/, () => [4, 20, 0.2, 5]],
  [/fable|mythos/, () => [10, 50, 0.25, 12.5]],
  [/gpt|o\d/, () => [0.25, 2, 0.025, 0.25]],
  [/gemini/, () => [0.3, 2.5, 0.03, 0.3]]
];
export function estimateCostUsd({ model, input = 0, output = 0, cacheRead = 0, cacheWrite = 0 }) {
  const entry = PRICES.find(([re]) => re.test(model)) || [null, () => [2, 10, 0.2, 2.5]];
  const [pi, po, pr, pw] = entry[1](input + cacheRead + cacheWrite);
  return (input * pi + output * po + cacheRead * pr + cacheWrite * pw) / 1e6;
}
let recordUsage = () => {};
/** The server registers a function here to add each call's estimated cost to its budget. */
export function onUsage(fn) { recordUsage = fn; }

/**
 * Send a conversation to the configured model.
 * @param {object} opts
 * @param {string} opts.system  system instructions
 * @param {{role:"user"|"assistant", content:string}[]} opts.messages
 * @param {{name:string, type:string, data:string}[]} [opts.attachments] base64 images/PDFs added to the first user message
 * @param {boolean} [opts.json] ask for a JSON object reply
 * @param {number} [opts.maxTokens]
 * @param {"grade"|"help"} [opts.purpose] picks the model and labels the cost
 * @returns {Promise<string>} the model's reply text
 */
export async function chat({ system, messages, attachments = [], json = false, maxTokens = 2000, purpose = "help" }) {
  const provider = aiProvider();
  if (!provider) throw new Error("No AI key configured");
  const firstUser = messages.findIndex((m) => m.role === "user");
  const withFiles = (i, build) => (attachments.length && i === firstUser ? build() : null);

  if (provider === "claude") {
    const res = await fetch(CLAUDE_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: claudeModel(purpose),
        max_tokens: maxTokens,
        // The instructions repeat across students, so mark them cacheable (cache reads cost ~10%).
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
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
    const u = data.usage || {};
    recordUsage({ purpose, model: data.model || claudeModel(purpose), input: u.input_tokens || 0, output: u.output_tokens || 0, cacheRead: u.cache_read_input_tokens || 0, cacheWrite: u.cache_creation_input_tokens || 0 });
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
    const u = data.usage || {};
    recordUsage({ purpose, model: data.model || "gpt", input: u.prompt_tokens || 0, output: u.completion_tokens || 0 });
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
  const u = data.usageMetadata || {};
  recordUsage({ purpose, model, input: u.promptTokenCount || 0, output: u.candidatesTokenCount || 0 });
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
}
