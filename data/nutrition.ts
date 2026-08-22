export type ConditionTopic = {
  id: string;
  title_en: string;
  title_ig: string;
  title_fr: string;
  summary_en: string;
  summary_ig: string;
  summary_fr: string;
  tips_en: string[];
  tips_ig: string[];
  tips_fr: string[];
};

export const conditionTopics: ConditionTopic[] = [
  {
    id: "bp",
    title_en: "Blood pressure support",
    title_ig: "Nkwado maka ọbara",
    title_fr: "Soutien tension artérielle",
    summary_en: "Traditional plates can stay flavorful with less salt and smart swaps.",
    summary_ig: "Nri omenala nwere ike ịdị ụtọ na-enweghị nnu nnukwu.",
    summary_fr: "Les plats traditionnels restent savoureux avec moins de sel et de bons substituts.",
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
    tips_fr: [
      "Rincer les ingrédients fermentés pour réduire le sodium.",
      "Utiliser uziza, utazi et citron vert pour l'arôme plutôt que plus de bouillon.",
      "Mesurer l'huile de palme à la cuillère.",
    ],
  },
  {
    id: "diabetes",
    title_en: "Diabetes-aware choices",
    title_ig: "Nhọrọ maka ọrịa sukari",
    title_fr: "Choix adaptés au diabète",
    summary_en: "Pair soups rich in vegetables with lower-glycemic swallows.",
    summary_ig: "Jikọta ofe ahịhịa na nri dị mfe.",
    summary_fr: "Associer soupes riches en légumes à des accompagnements à index glycémique modéré.",
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
    tips_fr: [
      "Essayer l'accompagnement de plantain vert en portions modestes.",
      "Garnir de gombo, verdures et protéines maigres.",
      "Répartir les repas et bien s'hydrater.",
    ],
  },
  {
    id: "digest",
    title_en: "Digestive comfort",
    title_ig: "Nri na-enyere nri ịgba",
    title_fr: "Confort digestif",
    summary_en: "Fiber-forward leaves and fermented sides support gentle digestion.",
    summary_ig: "Ahịhịa na ugba na-enyere ahụike nri.",
    summary_fr: "Feuilles riches en fibres et sides fermentés aident une digestion douce.",
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
    tips_fr: [
      "Les soupes à feuilles amères bien lavées sont appréciées des aînés.",
      "Introduire l'ugba progressivement si vous débutez.",
      "Mâcher lentement ; textures molles si les dents sont sensibles.",
    ],
  },
];

export type IngredientSpotlight = {
  id: string;
  name_en: string;
  name_ig: string;
  name_fr: string;
  uses_en: string;
  uses_ig: string;
  uses_fr: string;
  science_en: string;
  science_ig: string;
  science_fr: string;
};

export const ingredients: IngredientSpotlight[] = [
  {
    id: "ugba",
    name_en: "Ugba (oil bean)",
    name_ig: "Ugba",
    name_fr: "Ugba (fève à huile)",
    uses_en: "Adds savory depth to salads and soups; often fermented for complexity.",
    uses_ig: "Na-enye ofe na saladi isi dị ụtọ.",
    uses_fr: "Apporte de la profondeur aux salades et soupes ; souvent fermenté.",
    science_en: "Fermentation can support gut-friendly microbes. Watch sodium from seasonings.",
    science_ig: "Ọrụ ugba nwere ike inyere nri aka; lelee nnu.",
    science_fr: "La fermentation peut soutenir le microbiote. Surveiller le sodium des assaisonnements.",
  },
  {
    id: "utazi",
    name_en: "Utazi",
    name_ig: "Utazi",
    name_fr: "Utazi",
    uses_en: "Bitter-aromatic leaf used in abacha and some soups.",
    uses_ig: "Ahịhịa isi na abacha na ofe ụfọdụ.",
    uses_fr: "Feuille amère-aromatique dans l'abacha et certaines soupes.",
    science_en: "Bitter principles may aid digestion; use as flavor to reduce salt.",
    science_ig: "Nwere ike inyere nri aka; jiri ya maka isi.",
    science_fr: "Les principes amers peuvent aider la digestion ; réduire le sel.",
  },
  {
    id: "oha",
    name_en: "Oha",
    name_ig: "Oha",
    name_fr: "Oha",
    uses_en: "Distinctive soup leaf; added at the end to preserve oils that carry aroma.",
    uses_ig: "Ahịhịa ofe a kachasị; etinye na njedebe.",
    uses_fr: "Feuille de soupe distinctive ; ajoutée en fin de cuisson.",
    science_en: "Rich in fiber and plant antioxidants when paired with vegetable-heavy broths.",
    science_ig: "Nwere fiber na ihe na-enyere ahụike ahụ.",
    science_fr: "Riche en fibres et antioxydants végétaux avec bouillons de légumes.",
  },
];

export const mythFacts = [
  {
    myth_en: "Palm oil should always be avoided.",
    myth_ig: "A kwesịghị eji mmanụ aṅụ ọ bụla.",
    myth_fr: "L'huile de palme doit toujours être évitée.",
    fact_en: "Small measured amounts in vegetable-rich meals can fit many eating plans. Work with your clinician.",
    fact_ig: "Obere mmanụ aṅụ n'ofe ahịhịa nwere ike ịdabara. Kparịta ọnụ na dọkịta.",
    fact_fr: "De petites quantités mesurées dans des repas riches en légumes peuvent convenir. Parlez-en à votre médecin.",
  },
  {
    myth_en: "Traditional swallows are always bad for diabetes.",
    myth_ig: "Nni e siri tunyere niile ọjọọ maka ọrịa sukari.",
    myth_fr: "Les accompagnements traditionnels sont toujours mauvais pour le diabète.",
    fact_en: "Portion size, pairing, and choices like unripe plantain swallow change the story.",
    fact_ig: "Ọnụ, nhọpụta, na unere nwere ike ịgbanwe okwu ahụ.",
    fact_fr: "Portions, associations et choix comme le plantain vert changent la donne.",
  },
];
