import type { ImageSourcePropType } from "react-native";
import { RECIPE_FINAL_IMAGE_PLACEHOLDER } from "./recipeFinalImages";

/** Ingredient / before-state photo; falls back to app icon when no asset is mapped. */
export const RECIPE_INGREDIENT_IMAGE_PLACEHOLDER = RECIPE_FINAL_IMAGE_PLACEHOLDER;

const RECIPE_INGREDIENT_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  "ofe-owerri": require("../assets/images/soupsrecipepictures/Owerri soup leaves.png"),
  "ofe-egusi": require("../assets/images/soupsrecipepictures/Melon seeds (Egusi seeds-2).jpg"),
  "ofe-onugbu": require("../assets/images/soupsrecipepictures/Bitter leaf.jpg"),
  "ofe-okra": require("../assets/images/soupsrecipepictures/Okra-2.jpeg"),
  "ofe-ogbono": require("../assets/images/soupsrecipepictures/ogbono seed.jpg"),
  "ofe-achara": require("../assets/images/soupsrecipepictures/Achara-1.jpg"),
  "ofe-akwu": require("../assets/images/soupsrecipepictures/Palm fruits.jpg"),
  "ofe-okazi": require("../assets/images/soupsrecipepictures/Okazi leaf.jpg"),
  "ofe-ukpo": require("../assets/images/soupsrecipepictures/Ukpo-seed.jpg"),
  "ofe-ahihara": require("../assets/images/soupsrecipepictures/Molokhia leaf (Ahihara leaf).jpg"),
  "ofe-ugba": require("../assets/images/soupsrecipepictures/African Oil Bean (Ugba seeds).png"),
  "ofe-oha": require("../assets/images/soupsrecipepictures/Oha leaf.png"),
  "ofe-nsala": require("../assets/images/soupsrecipepictures/White soup (Nsala) base.png"),
  "ofe-uziza": require("../assets/images/soupsrecipepictures/Uziza leaf.jpg"),
  "ofe-green": require("../assets/images/soupsrecipepictures/Amaranthus green leaf.png"),
  "ofe-achi": require("../assets/images/soupsrecipepictures/Achi seeds.jpg"),
  "ofe-ojii": require("../assets/images/soupsrecipepictures/Black soup leaf-base.png"),
  "ofe-groundnut": require("../assets/images/soupsrecipepictures/Groundnut.png"),
  "goat-pepper-soup": require("../assets/images/peppersouprecipepictures/Goat leg.jpg"),
  "fish-pepper-soup": require("../assets/images/peppersouprecipepictures/Fish pepper soup base.png"),
  "yam-pepper-soup": require("../assets/images/peppersouprecipepictures/Yam.jpg"),
  "corn-porridge": require("../assets/images/porridgesrecipepictures/Corn.jpg"),
  "yam-porridge": require("../assets/images/porridgesrecipepictures/Yam-2.jpg"),
  "plantain-porridge": require("../assets/images/porridgesrecipepictures/Plantain-1.jpg"),
  "akidi-porridge": require("../assets/images/porridgesrecipepictures/Akidi-2.jpg"),
  "cocoyam-porridge": require("../assets/images/porridgesrecipepictures/Cocoyam (Ede Uhie).jpg"),
  "beans-porridge": require("../assets/images/porridgesrecipepictures/Beans.jpg"),
  "beans-plantain": require("../assets/images/porridgesrecipepictures/Beans and plantain.png"),
  "foi-foi": require("../assets/images/porridgesrecipepictures/Fio-fio.jpg"),
  "okpa": require("../assets/images/delicaciesrecipepictures/Okpa nut.png"),
  "ukwa": require("../assets/images/delicaciesrecipepictures/Ukwa-African-Breadfruit.png"),
  "abacha": require("../assets/images/delicaciesrecipepictures/African salad -Abacha.png"),
  "nkwobi": require("../assets/images/delicaciesrecipepictures/Nkwobi cow foot.jpg"),
  "isi-ewu": require("../assets/images/delicaciesrecipepictures/Isi ewu (head).jpg"),
  "jollof-rice": require("../assets/images/delicaciesrecipepictures/Rice.jpg"),
  "ji-akwukwo-nri": require("../assets/images/delicaciesrecipepictures/Vegetable yam (Ji akwokwo nri) base.png"),
  "moi-moi": require("../assets/images/snacksandstreetfoodrecipepictures/Moi-moi Beans.png"),
  "akara": require("../assets/images/snacksandstreetfoodrecipepictures/Akara Beans base.jpg"),
  "agidi": require("../assets/images/snacksandstreetfoodrecipepictures/Agidi (with white corn).jpg"),
  "mkporoshi-oka": require("../assets/images/snacksandstreetfoodrecipepictures/Corn.jpg"),
  "akamu": require("../assets/images/snacksandstreetfoodrecipepictures/Akamu Corn base.jpg"),
  "puff-puff": require("../assets/images/snacksandstreetfoodrecipepictures/All purpose flour.png"),
  "chin-chin": require("../assets/images/snacksandstreetfoodrecipepictures/Chin- chin base (All purpose flour).jpg"),
  "buns": require("../assets/images/snacksandstreetfoodrecipepictures/Nigerian Buns base (All purpose flour).png"),
  "doughnuts": require("../assets/images/snacksandstreetfoodrecipepictures/All purpose flour_1.png"),
  "fish-pie": require("../assets/images/snacksandstreetfoodrecipepictures/Fish pie base.png"),
  "meat-pie": require("../assets/images/snacksandstreetfoodrecipepictures/Meat pie base.png"),
  "egg-roll": require("../assets/images/snacksandstreetfoodrecipepictures/Egg roll base.png"),
  "ikpo-oka": require("../assets/images/snacksandstreetfoodrecipepictures/Ikpo Oka or Epiti base.png"),
};

/** Recipe ids that use the placeholder for the top (ingredient) image. */
export const RECIPE_IDS_MISSING_INGREDIENT_IMAGE = ["ofe-onugbu"] as const;

export function recipeIngredientImage(recipeId: string): ImageSourcePropType {
  return RECIPE_INGREDIENT_IMAGE_SOURCES[recipeId] ?? RECIPE_INGREDIENT_IMAGE_PLACEHOLDER;
}
