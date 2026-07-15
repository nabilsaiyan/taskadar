import type { Provider } from '@/data/types';
import { providerStore } from '@/store/providerStore';
import { apiKeyStore } from '@/store/apiKeyStore';
import { matchProvidersFromQuery, type AiSearchResult } from './ai';
import { matchWithModel } from './aiClient';

/**
 * Data-access layer.
 *
 * These functions are intentionally shaped like a real REST/GraphQL client:
 * they are async, return promises and add a small artificial latency so the UI
 * exercises real loading states. Today they read from the in-memory mock store;
 * swapping to a real backend means changing only the bodies below (e.g.
 * `return fetch('/api/providers').then(r => r.json())`).
 */

/** Simulate network latency so loading states feel real. */
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export async function getProviders(): Promise<Provider[]> {
  await delay(120);
  return providerStore.getAll();
}

export async function getProvider(id: string): Promise<Provider | undefined> {
  await delay(90);
  return providerStore.getAll().find((p) => p.id === id);
}

/**
 * Natural-language search. Runs the (mock) AI matcher over the live catalogue
 * and returns ranked results plus an AI-style summary. The deliberate delay
 * simulates real model-inference time.
 */
export async function searchProviders(query: string): Promise<AiSearchResult> {
  const catalogue = providerStore.getAll();
  const { apiKey, provider } = apiKeyStore.getState();

  // Real AI path when the user has configured a key (BYOK). The network round
  // trip provides real latency, so no artificial delay is needed here.
  if (apiKey.trim()) {
    try {
      return await matchWithModel(query, catalogue, { provider, apiKey: apiKey.trim() });
    } catch (e) {
      // Never leave the user empty-handed — fall back to the local matcher and
      // surface why the AI call didn't run.
      const fallback = matchProvidersFromQuery(query, catalogue);
      return { ...fallback, engineError: e instanceof Error ? e.message : 'AI request failed' };
    }
  }

  // No key configured — use the local mock matcher (with a lifelike delay).
  await delay(850);
  return matchProvidersFromQuery(query, catalogue);
}

/** Add a new provider listing (seller side). Local/in-memory only for the demo. */
export async function addProviderListing(provider: Provider): Promise<Provider> {
  await delay(300);
  providerStore.add(provider);
  return provider;
}
