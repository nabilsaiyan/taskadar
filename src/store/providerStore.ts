import { useSyncExternalStore } from 'react';
import { PROVIDERS } from '@/data/providers';
import type { Provider } from '@/data/types';

/**
 * Tiny in-memory store for the demo.
 *
 * It seeds from the mock catalogue and lets the seller screen append new
 * listings at runtime (local state only — nothing is persisted). Using an
 * external store with `useSyncExternalStore` means listings added on the seller
 * screen instantly become searchable on the buyer side, reinforcing the
 * two-sided-marketplace story. Swap this for a real API/query cache later.
 */

let providers: Provider[] = [...PROVIDERS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const providerStore = {
  getAll(): Provider[] {
    return providers;
  },
  add(provider: Provider) {
    providers = [provider, ...providers];
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/** React hook returning the live provider list. */
export function useProviders(): Provider[] {
  return useSyncExternalStore(
    providerStore.subscribe,
    providerStore.getAll,
    providerStore.getAll,
  );
}
