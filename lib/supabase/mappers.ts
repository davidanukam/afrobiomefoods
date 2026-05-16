import type { Recipe, RecipeCategory } from "@/data/recipes";
import { RECIPE_FINAL_IMAGE_PLACEHOLDER } from "@/data/recipeFinalImages";
import { RECIPE_INGREDIENT_IMAGE_PLACEHOLDER } from "@/data/recipeIngredientImages";
import type { EventItem } from "@/data/events";
import type { ServiceItem, ServiceCategory } from "@/data/services";
import type { CommunityPost } from "@/data/community";

type LooseDoc = Record<string, unknown>;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

/** Postgres timestamptz, ISO strings, or legacy `{ toDate() }` timestamps. */
function tsToIso(v: unknown): string {
  if (v instanceof Date) {
    return v.toISOString();
  }
  if (typeof v === "string") {
    return v;
  }
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("toDate" in o && typeof o.toDate === "function") {
      const d = (o.toDate as () => Date)();
      return d instanceof Date ? d.toISOString() : new Date().toISOString();
    }
  }
  return new Date().toISOString();
}

/** Maps a stored recipe JSON document (plus id) to the app's Recipe shape. */
export function mapRecipeDoc(id: string, data: LooseDoc): Recipe {
  const ingredients = asStringArray(data.ingredients);
  const ingredientsIg = asStringArray(data.ingredientsIg).length ? asStringArray(data.ingredientsIg) : ingredients;
  const instructions = asStringArray(data.instructions);
  const instructionsIg = asStringArray(data.instructionsIg).length ? asStringArray(data.instructionsIg) : instructions;

  const title = asString(data.title);
  const nutrition = data.nutrition as { calories?: number; protein?: number; fiber?: number } | undefined;

  return {
    recipe_id: id,
    category: (asString(data.category) as RecipeCategory) || "soups",
    name_en: asString(data.name_en) || title,
    name_ig: asString(data.name_ig) || asString(data.titleIg) || title,
    ingredients_en: asStringArray(data.ingredients_en).length ? asStringArray(data.ingredients_en) : ingredients,
    ingredients_ig: asStringArray(data.ingredients_ig).length ? asStringArray(data.ingredients_ig) : ingredientsIg,
    instructions_en: asStringArray(data.instructions_en).length ? asStringArray(data.instructions_en) : instructions,
    instructions_ig: asStringArray(data.instructions_ig).length ? asStringArray(data.instructions_ig) : instructionsIg,
    cultural_notes_en: asString(data.cultural_notes_en) || asString(data.description),
    cultural_notes_ig: asString(data.cultural_notes_ig) || asString(data.descriptionIg) || asString(data.description),
    cook_minutes: typeof data.cook_minutes === "number" ? data.cook_minutes : 45,
    servings: typeof data.servings === "number" ? data.servings : 4,
    difficulty:
      data.difficulty === "easy" || data.difficulty === "medium" || data.difficulty === "hard"
        ? data.difficulty
        : "medium",
    nutrition: {
      calories: nutrition?.calories ?? 200,
      protein: nutrition?.protein ?? 10,
      fiber: nutrition?.fiber ?? 4,
    },
    health_tags: asStringArray(data.health_tags).length ? asStringArray(data.health_tags) : ["Traditional"],
    audio_en: asString(data.audio_en) || undefined,
    audio_ig: asString(data.audio_ig) || undefined,
    image_hint: asString(data.image_hint) || "recipe",
    final_image: RECIPE_FINAL_IMAGE_PLACEHOLDER,
    ingredient_image: RECIPE_INGREDIENT_IMAGE_PLACEHOLDER,
  };
}

export function mapEventDoc(id: string, data: LooseDoc): EventItem {
  const title = asString(data.title);
  const titleEn = asString(data.title_en) || title;
  const locationEn = asString(data.location_en) || asString(data.location);
  const summaryEn = asString(data.summary_en) || asString(data.description);
  return {
    event_id: id,
    title_en: titleEn,
    title_ig: asString(data.title_ig) || title,
    title_fr: asString(data.title_fr) || titleEn,
    date: tsToIso(data.date),
    isVirtual: Boolean(data.isVirtual),
    location_en: locationEn,
    location_ig: asString(data.location_ig) || asString(data.location),
    location_fr: asString(data.location_fr) || locationEn,
    summary_en: summaryEn,
    summary_ig: asString(data.summary_ig) || asString(data.description),
    summary_fr: asString(data.summary_fr) || summaryEn,
  };
}

export function mapServiceDoc(id: string, data: LooseDoc): ServiceItem {
  return {
    service_id: id,
    name: asString(data.name),
    category: (asString(data.category) as ServiceCategory) || "kitchen",
    lat: typeof data.lat === "number" ? data.lat : 0,
    lng: typeof data.lng === "number" ? data.lng : 0,
    distance_km: typeof data.distance_km === "number" ? data.distance_km : 0,
    contact: asString(data.contact) || asString(data.contactInfo),
    hours_en: asString(data.hours_en) || asString(data.hours) || "",
    accessibility_notes_en: asString(data.accessibility_notes_en) || asString(data.description),
  };
}

export function mapCommunityRow(id: string, data: LooseDoc): CommunityPost {
  const content = asString(data.content);
  return {
    post_id: id,
    author: asString(data.authorName) || asString(data.author_name) || asString(data.author) || "Member",
    content_en: asString(data.content_en) || content,
    content_ig: asString(data.content_ig) || content,
    language: data.language === "ig" ? "ig" : data.language === "fr" ? "fr" : "en",
    timestamp: tsToIso(data.timestamp ?? data.created_at),
    kind: data.kind === "memory" || data.kind === "recipe" || data.kind === "story" ? data.kind : "story",
  };
}
