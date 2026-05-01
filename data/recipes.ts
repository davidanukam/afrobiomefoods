export type RecipeCategory = "soups" | "swallows" | "vegetables" | "soft";

export type Recipe = {
  recipe_id: string;
  category: RecipeCategory;
  name_en: string;
  name_ig: string;
  ingredients_en: string[];
  ingredients_ig: string[];
  instructions_en: string[];
  instructions_ig: string[];
  cultural_notes_en: string;
  cultural_notes_ig: string;
  cook_minutes: number;
  difficulty: "easy" | "medium";
  nutrition: { calories: number; protein: number; fiber: number };
  health_tags: string[];
  audio_en?: string;
  audio_ig?: string;
  image_hint: string;
};

export const recipeCategories: { id: RecipeCategory; label_en: string; label_ig: string }[] = [
  { id: "soups", label_en: "Soups", label_ig: "Ofe" },
  { id: "swallows", label_en: "Swallows", label_ig: "Nri e siri tunyere" },
  { id: "vegetables", label_en: "Vegetables", label_ig: "Ahịhịa nri" },
  { id: "soft", label_en: "Soft / senior-friendly", label_ig: "Nri dị nro" },
];

export const recipes: Recipe[] = [
  {
    recipe_id: "ofe-oha",
    category: "soups",
    name_en: "Oha Soup",
    name_ig: "Ofe Oha",
    ingredients_en: ["Oha leaves", "Cocoyam paste", "Stockfish", "Palm oil (moderate)", "Uziza (optional)"],
    ingredients_ig: ["Ahịhịa oha", "Mgbam ede", "Okporoko", "Mmanụ aṅụ (n'ụzọ dị obere)", "Uziza"],
    instructions_en: [
      "Wash and pick oha leaves gently; tear, do not cut finely.",
      "Boil cocoyam until soft, pound or blend into a smooth paste.",
      "Simmer meat and stockfish in seasoned broth.",
      "Thicken with cocoyam paste; adjust salt carefully for heart health.",
      "Add palm oil in moderation; stir in uziza if using.",
      "Fold in oha leaves last; cook briefly to keep aroma.",
    ],
    instructions_ig: [
      "Sacha ahịhịa oha nwayọọ; dọkpụ, echeghị ka a sie ya nke nnukwu.",
      "See ede ruo mgbe ọ dị nro, kụọ ma ọ bụ mee ka ọ dị nro.",
      "See anụ na okporoko n'ọsọ dị mma.",
      "Jiri mgbam ede mee ka ọ dị sara; tụgharịa nnuofe nwayọọ maka obi.",
      "Tinye mmanụ aṅụ n'ụzọ dị obere; kwagide uziza ọ bụrụ na ị na-eji ya.",
      "Kwụsị ị tinye ahịhịa oha ikpeazụ; see obere ka isi dị mma.",
    ],
    cultural_notes_en: "Oha is prized in Igbo cuisine; elders often associate it with hospitality and seasonal abundance.",
    cultural_notes_ig: "Ofe oha bụ nri e kwenyere na ya na ọdịnala Igbo; okenye na-ekọrọ ya na ọbịabịa.",
    cook_minutes: 55,
    difficulty: "medium",
    nutrition: { calories: 320, protein: 22, fiber: 6 },
    health_tags: ["High fiber", "Heart-conscious option with low salt"],
    image_hint: "oha",
  },
  {
    recipe_id: "ofe-onugbu",
    category: "soups",
    name_en: "Bitter Leaf Soup",
    name_ig: "Ofe Onugbu",
    ingredients_en: ["Washed bitter leaf", "Assorted meat", "Cocoyam", "Crayfish", "Spices"],
    ingredients_ig: ["Onugbu asacha", "Anụ dị iche iche", "Ede", "Eriokpo", "Mgbakwụnye"],
    instructions_en: [
      "Parboil bitter leaf until bitterness is mellowed.",
      "Prepare cocoyam paste as thickener.",
      "Cook meats until tender; add crayfish and seasoning.",
      "Combine paste and leaves; simmer to marry flavors.",
    ],
    instructions_ig: [
      "See onugbu ka ọnwụnwu dị obere.",
      "Mee mgbam ede.",
      "See anụ ruo mgbe ọ dị mfe; tinye eriokpo.",
      "Jikọta ede na ahịhịa; see ka ọ dị ụtọ.",
    ],
    cultural_notes_en: "Onugbu supports digestion for many; elders often pair it with lighter swallows.",
    cultural_notes_ig: "Onugbu na-enyere ahụike nri aka; okenye na-eri ya na nri dị fe elu.",
    cook_minutes: 70,
    difficulty: "medium",
    nutrition: { calories: 280, protein: 20, fiber: 7 },
    health_tags: ["Digestive support", "Diabetes-friendly with portion control"],
    image_hint: "onugbu",
  },
  {
    recipe_id: "akpu",
    category: "swallows",
    name_en: "Cassava Fufu (Akpu)",
    name_ig: "Akpu",
    ingredients_en: ["Fermented cassava paste", "Water"],
    ingredients_ig: ["Akpu", "Mmiri"],
    instructions_en: [
      "Bring water to a gentle boil in a pot.",
      "Stir in fermented paste in batches, beating to remove lumps.",
      "Turn until smooth and elastic; wrap in plastic to rest.",
    ],
    instructions_ig: [
      "See mmiri na ite.",
      "Kwakọta akpu n'akụkụ, kụọ ka lumps fọdụrụ.",
      "Kwụsị mgbe ọ dị sọsọ; chọọ ya ka ọ zuru ike.",
    ],
    cultural_notes_en: "Akpu is a communal staple; smaller portions pair well with vegetable-rich soups.",
    cultural_notes_ig: "Akpu bụ nri obodo; obere ọnụ na-ofe nwere ahịhịa dị mma.",
    cook_minutes: 35,
    difficulty: "easy",
    nutrition: { calories: 210, protein: 2, fiber: 3 },
    health_tags: ["Energy", "Pair with low-oil soup for balance"],
    image_hint: "akpu",
  },
  {
    recipe_id: "unripe-plantain-swallow",
    category: "swallows",
    name_en: "Unripe Plantain Swallow",
    name_ig: "Nni Unere Akịdị",
    ingredients_en: ["Green plantains", "Water"],
    ingredients_ig: ["Unere akịdị", "Mmiri"],
    instructions_en: [
      "Boil plantains until very soft.",
      "Pound or use food processor with minimal water.",
      "Shape gently; serve warm with soup of choice.",
    ],
    instructions_ig: [
      "See unere ruo mgbe ọ dị nro.",
      "Kụọ ma ọ bụ jiri ngwa achị achị.",
      "Mee ya ka ọ dị mma; nye ya na ofe ị họrọ.",
    ],
    cultural_notes_en: "Lower glycemic option often suggested for blood sugar awareness.",
    cultural_notes_ig: "Nri a na-akwado maka ndị na-echekwa ọbara sukari.",
    cook_minutes: 25,
    difficulty: "easy",
    nutrition: { calories: 180, protein: 2, fiber: 4 },
    health_tags: ["Diabetes-friendly", "Soft texture"],
    image_hint: "plantain",
  },
  {
    recipe_id: "abacha",
    category: "vegetables",
    name_en: "African Salad (Abacha)",
    name_ig: "Abacha",
    ingredients_en: ["Dried shredded cassava", "Ugba", "Palm oil (light)", "Utazi", "Spices"],
    ingredients_ig: ["Abacha", "Ugba", "Mmanụ aṅụ", "Utazi", "Mgbakwụnye"],
    instructions_en: [
      "Soak abacha until tender; drain well.",
      "Season ugba lightly; mix with abacha.",
      "Dress with warmed palm oil; garnish with utazi.",
    ],
    instructions_ig: [
      "Tụọ abacha ruo mgbe ọ dị mfe; chụọ ya.",
      "Tụgharịa ugba; jikọta ya na abacha.",
      "Jiri mmanụ aṅụ dị ọkụ mee ya; tinye utazi.",
    ],
    cultural_notes_en: "Ugba adds protein and probiotics; use moderate oil for senior-friendly plates.",
    cultural_notes_ig: "Ugba na-enye protein; jiri mmanụ aṅụ dị obere maka okenye.",
    cook_minutes: 30,
    difficulty: "easy",
    nutrition: { calories: 340, protein: 12, fiber: 5 },
    health_tags: ["Probiotic-friendly", "Use low sodium seasoning"],
    image_hint: "abacha",
  },
  {
    recipe_id: "soft-yam-porridge",
    category: "soft",
    name_en: "Soft Yam Porridge",
    name_ig: "Yam Asara",
    ingredients_en: ["Yam", "Vegetables", "Fish", "Light broth"],
    ingredients_ig: ["Ji", "Ahịhịa", "Azụ", "Ọsọ dị fe elu"],
    instructions_en: [
      "Dice yam small; boil in broth until very soft.",
      "Mash partially for easy chewing.",
      "Fold in vegetables and fish; simmer gently.",
    ],
    instructions_ig: [
      "Bee ji obere; see na ọsọ ruo mgbe ọ dị nro.",
      "Kụọ obere ka e si eri ya mfe.",
      "Tinye ahịhịa na azụ; see nwayọọ.",
    ],
    cultural_notes_en: "Adapted texture for dental or swallowing comfort while keeping familiar flavors.",
    cultural_notes_ig: "E mere ya ka ọ dị mfe ịkụọ ma e chekwaa ụtọ.",
    cook_minutes: 40,
    difficulty: "easy",
    nutrition: { calories: 260, protein: 16, fiber: 4 },
    health_tags: ["Soft texture", "Bone-friendly with fish"],
    image_hint: "yam",
  },
];

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return recipes.filter((r) => r.category === category);
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.recipe_id === id);
}
