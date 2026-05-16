export type CommunityPost = {
  post_id: string;
  author: string;
  content_en: string;
  content_ig: string;
  language: "en" | "ig" | "fr";
  timestamp: string;
  kind: "memory" | "recipe" | "story";
};

export const communityPosts: CommunityPost[] = [
  {
    post_id: "p1",
    author: "Mama K.",
    content_en: "I remember grinding pepper on the stone with my mother before every Ofe Nsala feast.",
    content_ig: "E cheta m ịkụọ ose na nkume na nne m tupu emume ofe nsala.",
    language: "en",
    timestamp: "2026-04-28T10:00:00",
    kind: "memory",
  },
  {
    post_id: "p2",
    author: "Nna O.",
    content_en: "We add a little utazi to abacha—it wakes up the bowl without extra salt.",
    content_ig: "Anyị na-etinye obere utazi na abacha—ọ na-eme ya ụtọ na-enweghị nnu karịa.",
    language: "ig",
    timestamp: "2026-04-27T15:30:00",
    kind: "recipe",
  },
  {
    post_id: "p3",
    author: "Adaeze",
    content_en: "The New Yam festival was when our street smelled of roasted yam and palm oil.",
    content_ig: "Emume ji ọhụrụ bụ mgbe ụzọ anyị nwere isi ji na mmanụ aṅụ.",
    language: "en",
    timestamp: "2026-04-26T09:00:00",
    kind: "story",
  },
];
