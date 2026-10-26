import { en } from './locales/en.js';
import { id } from './locales/id.js';
import type { LocaleDictionary } from './types.js';

export type SupportedLanguage = 'en' | 'id';

export function getDictionary(lang: string = 'en'): LocaleDictionary {
  if (lang.toLowerCase().startsWith('id')) {
    return id;
  }
  return en;
}

export * from './types.js';
