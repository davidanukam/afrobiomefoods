import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { Recipe } from "@/data/recipes";
import { recipes as fallbackRecipes, recipeDisplayName } from "@/data/recipes";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useState, type ComponentProps } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** One random featured recipe index per app launch. */
let homeSessionFeaturedRecipeIndex: number | null = null;

function pickFeaturedIndex(count: number, exclude?: number | null): number {
  if (count <= 1) return 0;
  let next = Math.floor(Math.random() * count);
  if (exclude != null && next === exclude) {
    next = (next + 1) % count;
  }
  return next;
}

function getSessionFeaturedRecipe(recipes: Recipe[], fallback: Recipe): Recipe {
  const n = recipes.length;
  if (n === 0) return fallback;
  if (homeSessionFeaturedRecipeIndex === null) {
    homeSessionFeaturedRecipeIndex = pickFeaturedIndex(n);
  }
  const idx = Math.min(homeSessionFeaturedRecipeIndex, n - 1);
  return recipes[idx]!;
}

const HERO_HEIGHT = 240;
const PAGE_GUTTER = 40;

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function HomeScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { recipes } = useRemoteRecipes();
  const [heroWidth, setHeroWidth] = useState(() =>
    Math.max(Dimensions.get("window").width - PAGE_GUTTER, 1),
  );
  const featured = getSessionFeaturedRecipe(recipes, fallbackRecipes[0]);
  const featuredTitle = recipeDisplayName(featured, language);

  const tiles: { label: string; href: Href; icon: IconName }[] = [
    {
      label: t(language, "nutrition"),
      href: "/nutrition" as Href,
      icon: "leaf-outline",
    },
    {
      label: t(language, "recipes"),
      href: "/recipes" as Href,
      icon: "book-outline",
    },
    {
      label: t(language, "community"),
      href: "/community" as Href,
      icon: "people-outline",
    },
    {
      label: t(language, "services"),
      href: "/services" as Href,
      icon: "location-outline",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.cream }]}
      edges={["left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push(`/recipes/${featured.recipe_id}?from=home` as Href)
          }
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== heroWidth) {
              setHeroWidth(next);
            }
          }}
          style={[styles.heroWrap, { backgroundColor: colors.border }]}
        >
          <Image
            source={featured.final_image}
            style={{ width: heroWidth, height: HERO_HEIGHT }}
            resizeMode="cover"
            resizeMethod="resize"
            fadeDuration={0}
            accessibilityLabel={featuredTitle}
          />
          <View
            style={[styles.heroScrim, { backgroundColor: colors.overlay }]}
          />
          <View style={styles.heroCopy}>
            <ThemedText variant="eyebrow" color="inverse">
              {t(language, "featuredRecipe")}
            </ThemedText>
            <ThemedText
              variant="subtitle"
              color="inverse"
              style={{ marginTop: 6 }}
            >
              {featuredTitle}
            </ThemedText>
          </View>
        </Pressable>

        <Card style={{ backgroundColor: colors.forest }}>
          <ThemedText variant="eyebrow" color="inverse">
            {t(language, "healthTipToday")}
          </ThemedText>
          <ThemedText variant="body" color="inverse" style={{ marginTop: 8 }}>
            {t(language, "healthTipUtazi")}
          </ThemedText>
        </Card>

        <ThemedText variant="subtitle" style={{ marginTop: 4 }}>
          {t(language, "quickActions")}
        </ThemedText>
        <View style={styles.grid}>
          {tiles.map((tile) => (
            <QuickTile
              key={tile.label}
              {...tile}
              onPress={() => router.push(tile.href)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickTile({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [{ width: "47%" }, pressed && { opacity: 0.9 }]}
    >
      <Card style={styles.tile}>
        <View style={[styles.tileIcon, { backgroundColor: colors.cream }]}>
          <Ionicons name={icon} size={22} color={colors.forest} />
        </View>
        <ThemedText variant="label" style={{ textAlign: "center" }}>
          {label}
        </ThemedText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 36, gap: 16 },
  heroWrap: { height: HERO_HEIGHT, width: "100%", borderRadius: radii.xl, overflow: "hidden" },
  heroScrim: { ...StyleSheet.absoluteFillObject },
  heroCopy: { position: "absolute", left: 18, right: 18, bottom: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    minHeight: 108,
    width: "100%",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
