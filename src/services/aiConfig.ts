/**
 * AI provider configuration for the "bring your own key" (BYOK) matcher.
 *
 * The user picks a provider and pastes their own API key; it's stored locally
 * on device/browser only (see `store/apiKeyStore`) and sent directly to the
 * chosen provider from the client. This is the same pattern used in cvpulse —
 * appropriate here because Taskadar is a client-only app with no backend.
 */

export type ProviderId = 'gemini' | 'claude' | 'openai';

export interface ProviderInfo {
  id: ProviderId;
  label: string;
  /** Very short label for compact chips. */
  short: string;
  /** The exact model id used for requests. */
  model: string;
  /** Short human description shown in the picker. */
  description: string;
  keyPlaceholder: string;
  /** Where to get a key. */
  keyUrl: string;
  keyHint: string;
  isFree: boolean;
  /** Accent color for the provider chip. */
  color: string;
}

export const AI_PROVIDERS: Record<ProviderId, ProviderInfo> = {
  gemini: {
    id: 'gemini',
    label: 'Gemini 2.5 Flash',
    short: 'Gemini',
    model: 'gemini-2.5-flash',
    description: 'Free tier · no credit card · Google AI Studio',
    keyPlaceholder: 'AIza…',
    keyUrl: 'https://aistudio.google.com/apikey',
    keyHint: 'Get a free key at aistudio.google.com/apikey',
    isFree: true,
    color: '#1BA5C4',
  },
  claude: {
    id: 'claude',
    // Model id is authoritative — Claude Opus 4.8.
    label: 'Claude Opus 4.8',
    short: 'Claude',
    model: 'claude-opus-4-8',
    description: 'Anthropic · most capable · paid',
    keyPlaceholder: 'sk-ant-api03-…',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyHint: 'Get a key at console.anthropic.com',
    isFree: false,
    color: '#D97757',
  },
  openai: {
    id: 'openai',
    label: 'GPT-4o mini',
    short: 'GPT-4o',
    model: 'gpt-4o-mini',
    description: 'OpenAI · fast & affordable · paid',
    keyPlaceholder: 'sk-…',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyHint: 'Get a key at platform.openai.com',
    isFree: false,
    color: '#10A37F',
  },
};

export const PROVIDER_LIST = Object.values(AI_PROVIDERS);
export const DEFAULT_PROVIDER: ProviderId = 'gemini';

/** Mask a key for display, e.g. "sk-ant…4f9a". */
export function maskKey(key: string): string {
  if (key.length <= 10) return '••••••';
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}
