// i18n/index.ts
import ru from "./locales/ru";
import uz from "./locales/uz";

export const dictionaries = { ru, uz } as const;
export type Lang = keyof typeof dictionaries;

export function getDict(lang: Lang) {
  return dictionaries[lang] ?? dictionaries.ru;
}

export function t(dict: any, key: string): string {
  return key.split(".").reduce((o, k) => o?.[k], dict) ?? key;
}

// ✅ добавь это
export function tF(dict: any, key: string, fallback: string): string {
  const v = key.split(".").reduce((o, k) => o?.[k], dict);
  return typeof v === "string" && v.trim() ? v : fallback;
}
