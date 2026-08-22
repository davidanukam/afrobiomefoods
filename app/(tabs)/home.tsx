import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { events as fallbackEvents } from "@/data/events";
import type { Recipe } from "@/data/recipes";
import { recipes as fallbackRecipes, recipeDisplayName } from "@/data/recipes";
import { useRemoteEvents } from "@/hooks/useRemoteEvents";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localeTag } from "@/lib/locale";
import { localized } from "@/lib/localized";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import type { ComponentProps } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radii } from "@/constants/theme";

/** One random featured recipe index per app launch (JS session); not reshuffled when revisiting Home. */
let homeSessionFeaturedRecipeIndex: number | null = null;

function getSessionFeaturedRecipe(recipes: Recipe[], fallback: Recipe): Recipe {
  const n = recipes.length;
  if (n === 0) return fallback;
  if (homeSessionFeaturedRecipeIndex === null) {
    homeSessionFeaturedRecipeIndex = Math.floor(Math.random() * n);
  }
  const idx = Math.min(homeSessionFeaturedRecipeIndex, n - 1);
  return recipes[idx]!;
}

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function HomeScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { recipes } = useRemoteRecipes();
  const { events } = useRemoteEvents();
  const featured = getSessionFeaturedRecipe(recipes, fallbackRecipes[0]);
  const nextEvent = events[0] ?? fallbackEvents[0];
  const featuredTitle = recipeDisplayName(featured, language);
  const eventDate = new Date(nextEvent.date);

  const tiles: { label: string; href: Href; icon: IconName }[] = [
    { label: t(language, "recipes"), href: "/recipes" as Href, icon: "book-outline" },
    { label: t(language, "classes"), href: "/classes" as Href, icon: "school-outline" },
    { label: t(language, "community"), href: "/community" as Href, icon: "people-outline" },
    { label: t(language, "events"), href: "/events" as Href, icon: "calendar-outline" },
    { label: t(language, "nutrition"), href: "/nutrition" as Href, icon: "leaf-outline" },
    { label: t(language, "services"), href: "/services" as Href, icon: "location-outline" },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/recipes/${featured.recipe_id}` as Href)}
          style={styles.heroWrap}
        >
          <Image
            source={featured.final_image}
            style={styles.heroImg}
            resizeMode="cover"
            fadeDuration={0}
            accessibilityLabel={featuredTitle}
          />
          <View style={[styles.heroScrim, { backgroundColor: colors.overlay }]} />
          <View style={styles.heroCopy}>
            <ThemedText variant="eyebrow" color="inverse">
              {t(language, "featuredRecipe")}
            </ThemedText>
            <ThemedText variant="subtitle" color="inverse" style={{ marginTop: 6 }}>
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

        <Pressable onPress={() => router.push("/events" as Href)} accessibilityRole="button">
          <Card style={styles.eventCard}>
            <View style={[styles.dateBadge, { backgroundColor: colors.forest }]}>
              <ThemedText variant="caption" color="inverse">
                {eventDate.toLocaleDateString(localeTag(language), { month: "short" }).toUpperCase()}
              </ThemedText>
              <ThemedText variant="subtitle" color="inverse">
                {eventDate.getDate()}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="eyebrow" color="muted">
                {t(language, "upcoming")}
              </ThemedText>
              <ThemedText variant="subtitle" style={{ marginTop: 4 }}>
                {localized(language, {
                  en: nextEvent.title_en,
                  ig: nextEvent.title_ig,
                  fr: nextEvent.title_fr,
                })}
              </ThemedText>
              <ThemedText variant="caption" color="accent" style={{ marginTop: 6 }}>
                {t(language, "events")}
              </ThemedText>
            </View>
          </Card>
        </Pressable>

        <ThemedText variant="subtitle" style={{ marginTop: 4 }}>
          {t(language, "quickActions")}
        </ThemedText>
        <View style={styles.grid}>
          {tiles.map((tile) => (
            <QuickTile key={tile.label} {...tile} onPress={() => router.push(tile.href)} />
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
  heroWrap: { height: 240, borderRadius: radii.xl, overflow: "hidden" },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroScrim: { ...StyleSheet.absoluteFillObject },
  heroCopy: { position: "absolute", left: 18, right: 18, bottom: 18 },
  eventCard: { flexDirection: "row", gap: 14, alignItems: "center" },
  dateBadge: {
    width: 64,
    borderRadius: radii.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: { minHeight: 108, width: "100%", alignItems: "center", gap: 10, paddingVertical: 16 },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
