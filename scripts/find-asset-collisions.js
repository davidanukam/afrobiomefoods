const fs = require("fs");
const path = require("path");

function androidResKey(assetPath) {
  return assetPath
    .replace(/^assets[/\\]images[/\\]/, "assets_images_")
    .replace(/[/\\]/g, "_")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

const dirs = [
  "assets/images/soupsrecipepictures",
  "assets/images/peppersouprecipepictures",
  "assets/images/porridgesrecipepictures",
  "assets/images/delicaciesrecipepictures",
  "assets/images/snacksandstreetfoodrecipepictures",
];

const map = new Map();
for (const d of dirs) {
  for (const f of fs.readdirSync(d)) {
    const p = `${d}/${f}`;
    const key = androidResKey(p);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }
}

const dup = [...map.entries()].filter(([, v]) => v.length > 1);
console.log("folder collisions", dup.length);
dup.forEach(([k, v]) => {
  console.log(k);
  v.forEach((p) => console.log("  ", p));
});

const ts =
  fs.readFileSync("data/recipeFinalImages.ts", "utf8") +
  fs.readFileSync("data/recipeIngredientImages.ts", "utf8");
const reqs = [...ts.matchAll(/require\("([^"]+)"\)/g)].map((m) =>
  m[1].replace(/^\.\.\//, "").replace(/^assets\//, "assets/"),
);

const rmap = new Map();
for (const p of reqs) {
  const ap = p.startsWith("assets/") ? p : `assets/${p}`;
  const key = androidResKey(ap);
  if (!rmap.has(key)) rmap.set(key, []);
  rmap.get(key).push(p);
}

const rdup = [...rmap.entries()].filter(([, v]) => v.length > 1);
console.log("require collisions", rdup.length);
rdup.forEach(([k, v]) => {
  console.log(k);
  v.forEach((p) => console.log("  ", p));
});
