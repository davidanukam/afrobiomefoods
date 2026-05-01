export type EventItem = {
  event_id: string;
  title_en: string;
  title_ig: string;
  date: string;
  isVirtual: boolean;
  location_en: string;
  location_ig: string;
  summary_en: string;
  summary_ig: string;
};

export const events: EventItem[] = [
  {
    event_id: "cook-1",
    title_en: "Virtual cooking class: Ofe Oha",
    title_ig: "Ụlọ ọmụmụ n'ịntanetị: Ofe Oha",
    date: "2026-05-12T18:00:00",
    isVirtual: true,
    location_en: "Zoom (link TBD)",
    location_ig: "Zoom",
    summary_en: "Step-by-step session with subtitles in English and Igbo.",
    summary_ig: "Nzọụkwụ site n'ịgba anya na Bekee na Igbo.",
  },
  {
    event_id: "festival-1",
    title_en: "Community food fair",
    title_ig: "Ahịa nri obodo",
    date: "2026-05-20T12:00:00",
    isVirtual: false,
    location_en: "Regional cultural center",
    location_ig: "Ebe omenala",
    summary_en: "Farmers' stalls, tastings, and storytelling circle.",
    summary_ig: "Ahịa ndị ọrụ ugbo na akụkọ.",
  },
  {
    event_id: "health-1",
    title_en: "Nutrition in the golden years",
    title_ig: "Nri n'oge ọkara",
    date: "2026-06-02T15:00:00",
    isVirtual: true,
    location_en: "Live stream",
    location_ig: "N'ịntanetị",
    summary_en: "Low-sodium and diabetes-aware meal planning.",
    summary_ig: "Atụmatụ nri maka ahụike.",
  },
];
