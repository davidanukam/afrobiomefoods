import type { Lang } from "@/lib/i18n";

/** Bilingual (or trilingual) content fields; French falls back to English when omitted. */
export type LocalizedFields<T = string> = {
  en: T;
  ig: T;
  fr?: T;
};

export function localized<T>(lang: Lang, fields: LocalizedFields<T>): T {
  switch (lang) {
    case "ig":
      return fields.ig;
    case "fr":
      return fields.fr ?? fields.en;
    default:
      return fields.en;
  }
}

export function localizedList(lang: Lang, fields: { en: string[]; ig: string[]; fr?: string[] }): string[] {
  switch (lang) {
    case "ig":
      return fields.ig;
    case "fr":
      return fields.fr ?? fields.en;
    default:
      return fields.en;
  }
}
