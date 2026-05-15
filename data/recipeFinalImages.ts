import type { ImageSourcePropType } from "react-native";

/**
 * Default when no labelled photo exists for a recipe id.
 * Swap/add entries in `RECIPE_FINAL_IMAGE_SOURCES` as new assets land (paths must stay string literals for Metro).
 */
export const RECIPE_FINAL_IMAGE_PLACEHOLDER =
  require("../assets/images/icon.png") as ImageSourcePropType;

const RECIPE_FINAL_IMAGE_SOURCES: Record<string, ImageSourcePropType> = {
  "ofe-owerri": require("../assets/images/soupsrecipepictures/Owerri soup (Ofe Owerri).jpg"),
  "ofe-egusi": require("../assets/images/soupsrecipepictures/Melon seed soup (Ofe Egusi).jpeg"),
  "ofe-onugbu": require("../assets/images/soupsrecipepictures/Bitter leaf soup (Ofe Onugbu-1).jpeg"),
  "ofe-okra": require("../assets/images/soupsrecipepictures/Okra soup.png"),
  "ofe-ogbono": require("../assets/images/soupsrecipepictures/Ogbono soup (Ofe Ogbono).jpeg"),
  "ofe-achara": require("../assets/images/soupsrecipepictures/Achara soup (ofe Achara-1).jpg"),
  "ofe-akwu": require("../assets/images/soupsrecipepictures/Palm fruit souo (Banga).png"),
  "ofe-okazi": require("../assets/images/soupsrecipepictures/Okazi-Soup-1.jpg"),
  "ofe-ukpo": require("../assets/images/soupsrecipepictures/Ukpo soup.jpeg"),
  "ofe-ahihara": require("../assets/images/soupsrecipepictures/Molokhia soup.png"),
  "ofe-ugba": require("../assets/images/soupsrecipepictures/African Oil Bean soup (Ofe ugba-1).png"),
  "ofe-oha": require("../assets/images/soupsrecipepictures/Oha soup.png"),
  "ofe-nsala": require("../assets/images/soupsrecipepictures/White soup (Nsala).png"),
  "ofe-uziza": require("../assets/images/soupsrecipepictures/Uziza soup.jpg"),
  "ofe-green": require("../assets/images/soupsrecipepictures/Amaranthus green soup.png"),
  "ofe-achi": require("../assets/images/soupsrecipepictures/Achi thickened soup.png"),
  "ofe-ojii": require("../assets/images/soupsrecipepictures/Black soup.png"),
  "ofe-groundnut": require("../assets/images/soupsrecipepictures/Groundnut soup.png"),
  "goat-pepper-soup": require("../assets/images/peppersouprecipepictures/Goat pepper soup.jpeg"),
  "fish-pepper-soup": require("../assets/images/peppersouprecipepictures/fish pepper soup.jpg"),
  "yam-pepper-soup": require("../assets/images/peppersouprecipepictures/Yam pepper soup.jpeg"),
  "corn-porridge": require("../assets/images/porridgesrecipepictures/Corn porridge.jpeg"),
  "yam-porridge": require("../assets/images/porridgesrecipepictures/Yam porridge.jpg"),
  "plantain-porridge": require("../assets/images/porridgesrecipepictures/Plantain Porridge.jpg"),
  "akidi-porridge": require("../assets/images/porridgesrecipepictures/Akidi porridge.jpg"),
  "cocoyam-porridge": require("../assets/images/porridgesrecipepictures/Cocoyam porridge.png"),
  "beans-porridge": require("../assets/images/porridgesrecipepictures/Beans porridge.png"),
  "beans-plantain": require("../assets/images/porridgesrecipepictures/Beans and unripe plantain porridge.png"),
  "foi-foi": require("../assets/images/porridgesrecipepictures/Fio-Fio (Pigeon pea) porridge.jpg"),
  "okpa": require("../assets/images/delicaciesrecipepictures/Okpa (Bambara nut pudding).jpg"),
  "ukwa": require("../assets/images/delicaciesrecipepictures/Ukwa.jpg"),
  "abacha": require("../assets/images/delicaciesrecipepictures/African salad (Abacha).jpg"),
  "nkwobi": require("../assets/images/delicaciesrecipepictures/Nkwobi (Spicy Cow Foot).jpg"),
  "isi-ewu": require("../assets/images/delicaciesrecipepictures/Isi Ewu.jpg"),
  "jollof-rice": require("../assets/images/delicaciesrecipepictures/Igbo Style Jollof-Rice.jpg"),
  "ji-akwukwo-nri": require("../assets/images/delicaciesrecipepictures/Vegetable yam (Ji akwokwo nri).jpg"),
  "moi-moi": require("../assets/images/snacksandstreetfoodrecipepictures/Moi moi (steamed Bean pudding).png"),
  "akara": require("../assets/images/snacksandstreetfoodrecipepictures/Akara (Fried Bean Cakes).png"),
  "agidi": require("../assets/images/snacksandstreetfoodrecipepictures/Agidi.jpg"),
  "mkporoshi-oka": require("../assets/images/snacksandstreetfoodrecipepictures/Mkporoshi Oka (Corn pudding).jpg"),
  "akamu": require("../assets/images/snacksandstreetfoodrecipepictures/akamu.png"),
  "puff-puff": require("../assets/images/snacksandstreetfoodrecipepictures/Puff-puff.jpg"),
  "chin-chin": require("../assets/images/snacksandstreetfoodrecipepictures/Chin-chin.jpeg"),
  "buns": require("../assets/images/snacksandstreetfoodrecipepictures/Nigerian Buns.jpg"),
  "doughnuts": require("../assets/images/snacksandstreetfoodrecipepictures/Doughnuts.jpeg"),
  "fish-pie": require("../assets/images/snacksandstreetfoodrecipepictures/Fish Pie.jpg"),
  "meat-pie": require("../assets/images/snacksandstreetfoodrecipepictures/Meat Pie.jpg"),
  "egg-roll": require("../assets/images/snacksandstreetfoodrecipepictures/Egg rolls.jpg"),
  "ikpo-oka": require("../assets/images/snacksandstreetfoodrecipepictures/Ikpo Oka or Epiti.jpg"),
};

export function recipeFinalImage(recipeId: string): ImageSourcePropType {
  return RECIPE_FINAL_IMAGE_SOURCES[recipeId] ?? RECIPE_FINAL_IMAGE_PLACEHOLDER;
}
