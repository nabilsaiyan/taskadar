import type { Provider } from '@/data/types';
import type { AiSearchResult } from './ai';
import { extractKeywords } from './ai';
import { AI_PROVIDERS, type ProviderId } from './aiConfig';

/**
 * Real AI matching layer (BYOK).
 *
 * `matchWithModel` sends the user's natural-language query plus a compact
 * provider catalogue to the chosen LLM and asks it to return ranked provider
 * ids, extracted keywords and a friendly summary. We call each provider's REST
 * endpoint directly with `fetch` (rather than three separate SDKs) so the same
 * thin client runs identically on iOS, Android and web with no backend.
 *
 * The keyword-based `matchProvidersFromQuery` in `ai.ts` remains the automatic
 * fallback when no key is configured or a request fails.
 */

const SYSTEM_PROMPT = `You are the matching engine for Taskadar, a local-services marketplace.
The user describes a task in plain language. You are given a catalogue of service providers.
Pick ONLY the providers genuinely relevant to the request, ranked best first, and respond with STRICT JSON:
{
  "matchedIds": string[],   // provider ids, most relevant first; [] if none fit
  "keywords": string[],     // 2-6 key terms you extracted from the request
  "summary": string         // one friendly sentence, e.g. "Found 3 bakers who can deliver a cake tomorrow."
}
Rules: Only include a provider if it can plausibly do the task. Prefer providers available at the requested time when timing is mentioned. Do not invent ids. Respond with JSON only — no prose, no code fences.`;

interface ModelMatch {
  matchedIds: string[];
  keywords: string[];
  summary: string;
}

/** Compact catalogue we hand to the model (keeps token use low). */
function catalogueForPrompt(catalogue: Provider[]) {
  return catalogue.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    tags: p.tags,
    description: p.description,
    priceRange: p.priceRange,
    availability: p.availability,
  }));
}

function buildUserPrompt(query: string, catalogue: Provider[]): string {
  return `User request: "${query}"\n\nProvider catalogue (JSON):\n${JSON.stringify(
    catalogueForPrompt(catalogue),
  )}`;
}

/** Pull a JSON object out of a model response that may include fences/prose. */
function parseModelJson(text: string): ModelMatch | null {
  if (!text) return null;
  let cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    return {
      matchedIds: Array.isArray(obj.matchedIds) ? obj.matchedIds.map(String) : [],
      keywords: Array.isArray(obj.keywords) ? obj.keywords.map(String) : [],
      summary: typeof obj.summary === 'string' ? obj.summary : '',
    };
  } catch {
    return null;
  }
}

const TIMEOUT_MS = 25000;

async function withTimeout(input: RequestInfo, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Raw model call → assistant text. Throws on non-2xx with a helpful message. */
async function callModel(provider: ProviderId, apiKey: string, query: string, catalogue: Provider[]): Promise<string> {
  const model = AI_PROVIDERS[provider].model;
  const userPrompt = buildUserPrompt(query, catalogue);

  if (provider === 'claude') {
    const res = await withTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for direct browser (web) calls; harmless on native.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    if (!res.ok) throw new Error(await errorText(res, 'Claude'));
    const data = await res.json();
    const block = (data.content ?? []).find((b: any) => b.type === 'text');
    return block?.text ?? '';
  }

  if (provider === 'openai') {
    const res = await withTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(await errorText(res, 'OpenAI'));
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  // Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey,
  )}`;
  const res = await withTimeout(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error(await errorText(res, 'Gemini'));
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
}

async function errorText(res: Response, name: string): Promise<string> {
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error?.message || body?.error?.type || '';
  } catch {
    /* ignore */
  }
  if (res.status === 401 || res.status === 403) return `${name}: invalid or unauthorized API key.`;
  if (res.status === 429) return `${name}: rate limited — try again in a moment.`;
  return `${name} request failed (${res.status})${detail ? `: ${detail}` : ''}.`;
}

/**
 * Run the real model matcher. Returns the same `AiSearchResult` shape the UI
 * already consumes, plus which provider produced it.
 */
export async function matchWithModel(
  query: string,
  catalogue: Provider[],
  config: { provider: ProviderId; apiKey: string },
): Promise<AiSearchResult> {
  const text = await callModel(config.provider, config.apiKey, query, catalogue);
  const parsed = parseModelJson(text);
  if (!parsed) throw new Error('Could not read the AI response.');

  const byId = new Map(catalogue.map((p) => [p.id, p]));
  const matches: Provider[] = [];
  const seen = new Set<string>();
  for (const id of parsed.matchedIds) {
    const p = byId.get(id);
    if (p && !seen.has(id)) {
      seen.add(id);
      matches.push(p);
    }
  }

  const keywords = parsed.keywords.length ? parsed.keywords : extractKeywords(query);
  const summary =
    parsed.summary ||
    (matches.length
      ? `Found ${matches.length} ${matches.length === 1 ? 'provider' : 'providers'} for your request.`
      : "I couldn't find a clear match for that — try describing the task differently.");

  return { matches, summary, keywords, engine: config.provider };
}
