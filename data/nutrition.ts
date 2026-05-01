export type ConditionTopic = {
  id: string;
  title_en: string;
  title_ig: string;
  summary_en: string;
  summary_ig: string;
  tips_en: string[];
  tips_ig: string[];
};

export const conditionTopics: ConditionTopic[] = [
  {
    id: "bp",
    title_en: "Blood pressure support",
    title_ig: "Nkwado maka ọbara",
    summary_en: "Traditional plates can stay flavorful with less salt and smart swaps.",
    summary_ig: "Nri omenala nwere ike ịdị ụtọ na-enweghị nnu nnukwu.",
    tips_en: [
      "Rinse fermented ingredients to reduce sodium.",
      "Lean on uziza, utazi, and lime for aroma instead of extra bouillon.",
      "Measure palm oil with a spoon; heat carries flavor farther.",
    ],
    tips_ig: [
      "Sacha ihe e fermented ka sodium belata.",
      "Jiri uziza na utazi maka isi.",
      "Ọnụọgụgụ mmanụ aṅụ na ngaji obere.",
    ],
  },
  {
    id: "diabetes",
    title_en: "Diabetes-aware choices",
    title_ig: "Nhọrọ maka ọrịa sukari",
    summary_en: "Pair soups rich in vegetables with lower-glycemic swallows.",
    summary_ig: "Jikọta ofe ahịhịa na nri dị mfe.",
    tips_en: [
      "Try unripe plantain swallow in modest portions.",
      "Load the bowl with okra, spinach relatives, and lean proteins.",
      "Space meals evenly and hydrate with water.",
    ],
    tips_ig: [
      "Nwalee nni unere n'obere ọnụ.",
      "Jiri ofe ahịhịa na anụ dị mfe.",
      "Kụọ oge nri ma ṅụọ mmiri.",
    ],
  },
  {
    id: "digest",
    title_en: "Digestive comfort",
    title_ig: "Nri na-enyere nri ịgba",
    summary_en: "Fiber-forward leaves and fermented sides support gentle digestion.",
    summary_ig: "Ahịhịa na ugba na-enyere ahụike nri.",
    tips_en: [
      "Bitter leaf soups, well washed, are elder favorites for a reason.",
      "Introduce ugba gradually if you are new to fermented foods.",
      "Chew slowly; softer swallows help when teeth are tender.",
    ],
    tips_ig: [
      "Ofe onugbu asacha dị mma.",
      "Bidoro ugba nwayọọ.",
      "Jiri nri dị nro ma ị na-achụ nwayọọ.",
    ],
  },
];

export type IngredientSpotlight = {
  id: string;
  name_en: string;
  name_ig: string;
  uses_en: string;
  uses_ig: string;
  science_en: string;
  science_ig: string;
};

export const ingredients: IngredientSpotlight[] = [
  {
    id: "ugba",
    name_en: "Ugba (oil bean)",
    name_ig: "Ugba",
    uses_en: "Adds savory depth to salads and soups; often fermented for complexity.",
    uses_ig: "Na-enye ofe na saladi isi dị ụtọ.",
    science_en: "Fermentation can support gut-friendly microbes—watch sodium from seasonings.",
    science_ig: "Ọrụ ugba nwere ike inyere nri aka; lelee nnu.",
  },
  {
    id: "utazi",
    name_en: "Utazi",
    name_ig: "Utazi",
    uses_en: "Bitter-aromatic leaf used in abacha and some soups.",
    uses_ig: "Ahịhịa isi na abacha na ofe ụfọdụ.",
    science_en: "Bitter principles may aid digestion; use as flavor to reduce salt.",
    science_ig: "Nwere ike inyere nri aka; jiri ya maka isi.",
  },
  {
    id: "oha",
    name_en: "Oha",
    name_ig: "Oha",
    uses_en: "Distinctive soup leaf; added at the end to preserve oils that carry aroma.",
    uses_ig: "Ahịhịa ofe a kachasị; etinye na njedebe.",
    science_en: "Rich in fiber and plant antioxidants when paired with vegetable-heavy broths.",
    science_ig: "Nwere fiber na ihe na-enyere ahụike ahụ.",
  },
];

export const mythFacts = [
  {
    myth_en: "Palm oil should always be avoided.",
    myth_ig: "A kwesịghị eji mmanụ aṅụ ọ bụla.",
    fact_en: "Small measured amounts in vegetable-rich meals can fit many eating plans—work with your clinician.",
    fact_ig: "Obere mmanụ aṅụ n'ofe ahịhịa nwere ike ịdabara—kparịta ọnụ na dọkịta.",
  },
  {
    myth_en: "Traditional swallows are always bad for diabetes.",
    myth_ig: "Nni e siri tunyere niile ọjọọ maka ọrịa sukari.",
    fact_en: "Portion size, pairing, and choices like unripe plantain swallow change the story.",
    fact_ig: "Ọnụ, nhọpụta, na unere nwere ike ịgbanwe okwu ahụ.",
  },
];
