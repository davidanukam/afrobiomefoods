export type EventItem = {
  event_id: string;
  title_en: string;
  title_ig: string;
  title_fr: string;
  date: string;
  isVirtual: boolean;
  location_en: string;
  location_ig: string;
  location_fr: string;
  summary_en: string;
  summary_ig: string;
  summary_fr: string;
};

export const events: EventItem[] = [
  {
    event_id: "cook-1",
    title_en: "Virtual cooking class: Ofe Oha",
    title_ig: "Ụlọ ọmụmụ n'ịntanetị: Ofe Oha",
    title_fr: "Cours de cuisine virtuel : Ofe Oha",
    date: "2026-05-12T18:00:00",
    isVirtual: true,
    location_en: "Zoom (link TBD)",
    location_ig: "Zoom",
    location_fr: "Zoom (lien à venir)",
    summary_en: "Step-by-step session with subtitles in English and Igbo.",
    summary_ig: "Nzọụkwụ site n'ịgba anya na Bekee na Igbo.",
    summary_fr: "Session pas à pas avec sous-titres en anglais et en igbo.",
  },
  {
    event_id: "festival-1",
    title_en: "Community food fair",
    title_ig: "Ahịa nri obodo",
    title_fr: "Foire alimentaire communautaire",
    date: "2026-05-20T12:00:00",
    isVirtual: false,
    location_en: "Regional cultural center",
    location_ig: "Ebe omenala",
    location_fr: "Centre culturel régional",
    summary_en: "Farmers' stalls, tastings, and storytelling circle.",
    summary_ig: "Ahịa ndị ọrụ ugbo na akụkọ.",
    summary_fr: "Étalages, dégustations et cercle de récits.",
  },
  {
    event_id: "health-1",
    title_en: "Nutrition in the golden years",
    title_ig: "Nri n'oge ọkara",
    title_fr: "Nutrition dans les années dorées",
    date: "2026-06-02T15:00:00",
    isVirtual: true,
    location_en: "Live stream",
    location_ig: "N'ịntanetị",
    location_fr: "Diffusion en direct",
    summary_en: "Low-sodium and diabetes-aware meal planning.",
    summary_ig: "Atụmatụ nri maka ahụike.",
    summary_fr: "Planification de repas pauvre en sel et adaptée au diabète.",
  },
];
