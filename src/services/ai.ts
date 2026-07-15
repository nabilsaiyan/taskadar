import type { Provider } from '@/data/types';
import type { ProviderId } from './aiConfig';

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  MOCK "AI" MATCHING LAYER
 * ────────────────────────────────────────────────────────────────────────────
 *
 * This is a *simulated* natural-language matcher for the portfolio demo. It
 * performs lightweight keyword extraction from the user's plain-English request
 * and scores each provider against their `tags`, category and description.
 *
 * ▶ In a PRODUCTION build, `matchProvidersFromQuery` would instead send the raw
 *   query to a real LLM (e.g. the Claude Messages API or OpenAI) with a prompt
 *   like "extract the service intent, timing and location from this request and
 *   return ranked provider matches". The rest of the app is written against the
 *   return shape below, so that swap requires no UI changes — only the body of
 *   these two functions.
 *
 *   Example of the future real call:
 *     const res = await fetch('https://api.anthropic.com/v1/messages', { ... });
 *     return res.matches;
 */

/** Words that carry no matching signal and are ignored during extraction. */
const STOP_WORDS = new Set([
  'i', 'a', 'an', 'the', 'to', 'for', 'of', 'and', 'or', 'my', 'me', 'need',
  'want', 'looking', 'someone', 'some', 'please', 'can', 'you', 'help', 'with',
  'get', 'find', 'in', 'on', 'at', 'this', 'that', 'is', 'it', 'do', 'have',
  'would', 'like', 'near', 'area', 'local', 'good', 'best', 'cheap', 'asap',
]);

/** Timing keywords we surface in the AI summary line. */
const TIMING: Record<string, string> = {
  today: 'today',
  tonight: 'today',
  now: 'today',
  tomorrow: 'tomorrow',
  weekend: 'this weekend',
  saturday: 'this weekend',
  sunday: 'this weekend',
};

export interface MatchResult {
  provider: Provider;
  score: number;
}

export interface AiSearchResult {
  matches: Provider[];
  /** Friendly, AI-style summary sentence shown at the top of the results. */
  summary: string;
  /** The normalised keywords the "AI" extracted (shown as a debug/insight row). */
  keywords: string[];
  timing?: string;
  /** Which engine produced this result — a real model, or the local mock. */
  engine?: 'mock' | ProviderId;
  /** Set when a real AI call failed and we fell back to the local matcher. */
  engineError?: string;
}

/** Break a natural-language query into meaningful, de-duplicated keywords. */
export function extractKeywords(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !STOP_WORDS.has(w) && w.length > 1);
  return Array.from(new Set(words));
}

/** Detect a timing hint (today / tomorrow / weekend) from the query. */
function detectTiming(query: string): { key?: string; label?: string } {
  const lower = query.toLowerCase();
  for (const key of Object.keys(TIMING)) {
    if (lower.includes(key)) return { key: TIMING[key] === 'today' ? 'today' : TIMING[key] === 'tomorrow' ? 'tomorrow' : 'weekend', label: TIMING[key] };
  }
  return {};
}

/**
 * Score a single provider against the extracted keywords. Tag hits weigh most,
 * with category and description providing softer signal — a stand-in for what a
 * real semantic model would infer.
 */
function scoreProvider(provider: Provider, keywords: string[]): number {
  if (keywords.length === 0) return 0;
  const tagText = provider.tags.join(' ');
  const categoryText = provider.category.toLowerCase();
  const descText = provider.description.toLowerCase();

  let score = 0;
  for (const kw of keywords) {
    // Strong signal: keyword appears in the provider's matching tags. Short
    // words must match exactly to avoid noise (e.g. "fit" ≠ "fitting").
    const fuzzyOk = kw.length >= 4;
    if (provider.tags.some((t) => t === kw || (fuzzyOk && (t.includes(kw) || kw.includes(t))))) {
      score += 5;
    } else if (fuzzyOk && tagText.includes(kw)) {
      score += 3;
    }
    if (categoryText.includes(kw)) score += 3;
    if (descText.includes(kw)) score += 1;
  }
  // No genuine keyword overlap → not a match (keeps irrelevant, highly-rated
  // providers from leaking into every result set).
  if (score === 0) return 0;
  // Gentle quality nudge so strong matches with better ratings rank higher.
  score += (provider.rating - 4) * 0.5;
  return score;
}

/**
 * The core mock-AI entry point. Given a natural-language query and the current
 * provider catalogue, returns ranked matches plus a human-friendly summary.
 *
 * Structured to be swapped 1:1 for a real AI API call in production.
 */
export function matchProvidersFromQuery(
  query: string,
  catalogue: Provider[],
): AiSearchResult {
  const keywords = extractKeywords(query);
  const { key: timingKey, label: timingLabel } = detectTiming(query);

  const scored: MatchResult[] = catalogue
    .map((provider) => ({ provider, score: scoreProvider(provider, keywords) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // If timing was requested, gently prioritise providers who are available then.
  const ranked = scored.sort((a, b) => {
    if (timingKey) {
      const aAvail = a.provider.availability.includes(timingKey) ? 1 : 0;
      const bAvail = b.provider.availability.includes(timingKey) ? 1 : 0;
      if (aAvail !== bAvail) return bAvail - aAvail;
    }
    return b.score - a.score;
  });

  const matches = ranked.map((r) => r.provider).slice(0, 8);
  const summary = buildSummary(matches, keywords, timingLabel);

  return { matches, summary, keywords, timing: timingLabel, engine: 'mock' };
}

/** Compose the friendly summary line, e.g. the "Found 3 providers…" sentence. */
function buildSummary(
  matches: Provider[],
  keywords: string[],
  timing?: string,
): string {
  if (matches.length === 0) {
    return "I couldn't find a clear match for that yet — try describing the task a little differently.";
  }
  const topCategory = matches[0].category.toLowerCase();
  const count = matches.length;
  const plural = count === 1 ? 'provider' : 'providers';
  const timingText = timing ? `, available ${timing}` : '';
  return `Found ${count} ${plural} who can help with ${topCategory}${timingText}.`;
}
