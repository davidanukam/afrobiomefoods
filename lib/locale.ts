import type { Lang } from "@/lib/i18n";

/** BCP 47 tags for `Intl` date/time formatting. */
export function localeTag(lang: Lang): string {
  switch (lang) {
    case "ig":
      return "ig-NG";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
}

/** `expo-speech` language codes. */
export function speechLang(lang: Lang): string {
  switch (lang) {
    case "ig":
      return "ig-NG";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
}

export const LANG_OPTIONS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ig", label: "Igbo" },
  { id: "fr", label: "Français" },
];
