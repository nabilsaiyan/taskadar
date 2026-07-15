import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PROVIDER, type ProviderId, AI_PROVIDERS } from '@/services/aiConfig';

/**
 * Local, in-memory store for the user's chosen AI provider + API key, mirrored
 * to AsyncStorage so it survives app restarts. The key never leaves the device
 * except in direct requests to the chosen provider. Works on iOS, Android and
 * web (AsyncStorage uses localStorage on web).
 */

const KEY_STORAGE = 'taskadar.ai.key';
const PROVIDER_STORAGE = 'taskadar.ai.provider';

interface State {
  apiKey: string;
  provider: ProviderId;
  hydrated: boolean;
}

let state: State = { apiKey: '', provider: DEFAULT_PROVIDER, hydrated: false };
const listeners = new Set<() => void>();

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const apiKeyStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Load persisted values once at app start. */
  async hydrate() {
    try {
      const [key, provider] = await Promise.all([
        AsyncStorage.getItem(KEY_STORAGE),
        AsyncStorage.getItem(PROVIDER_STORAGE),
      ]);
      const resolvedProvider =
        provider && provider in AI_PROVIDERS ? (provider as ProviderId) : DEFAULT_PROVIDER;
      setState({ apiKey: key ?? '', provider: resolvedProvider, hydrated: true });
    } catch {
      setState({ hydrated: true });
    }
  },
  async save(apiKey: string, provider: ProviderId) {
    setState({ apiKey, provider });
    try {
      await AsyncStorage.multiSet([
        [KEY_STORAGE, apiKey],
        [PROVIDER_STORAGE, provider],
      ]);
    } catch {
      /* storage unavailable — keep in-memory value */
    }
  },
  async clear() {
    setState({ apiKey: '', provider: DEFAULT_PROVIDER });
    try {
      await AsyncStorage.multiRemove([KEY_STORAGE, PROVIDER_STORAGE]);
    } catch {
      /* ignore */
    }
  },
};

/** React hook exposing the live AI-key state. */
export function useApiKey() {
  const snapshot = useSyncExternalStore(apiKeyStore.subscribe, apiKeyStore.getState, apiKeyStore.getState);
  return {
    ...snapshot,
    hasKey: snapshot.apiKey.trim().length > 0,
  };
}
