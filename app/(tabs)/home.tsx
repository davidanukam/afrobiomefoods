import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteEvents } from "@/hooks/useRemoteEvents";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { events as fallbackEvents } from "@/data/events";
import { recipes as fallbackRecipes } from "@/data/recipes";

const heroUri =
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80&auto=format&fit=crop";

export default function HomeScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { recipes } = useRemoteRecipes();
  const { events } = useRemoteEvents();
  const featured = recipes[0] ?? fallbackRecipes[0];
  const nextEvent = events[0] ?? fallbackEvents[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* <ThemedText variant="title">{name}</ThemedText> */}
        {/* <ThemedText variant="body" color="muted" style={{ marginTop: 4 }}>
          {t(language, "appSubtitle")}
        </ThemedText> */}

        <Card style={styles.featured}>
          <ThemedText variant="subtitle">{t(language, "featuredRecipe")}</ThemedText>
          <Image source={{ uri: heroUri }} style={styles.featuredImg} contentFit="cover" accessibilityLabel={featured.name_en} />
          <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
            {language === "ig" ? featured.name_ig : featured.name_en}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            {language === "ig" ? "Nri oge a" : "Food of the season"}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/recipes/${featured.recipe_id}` as Href)}
            style={[styles.listen, { backgroundColor: colors.forestLight }]}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listen")} →
            </ThemedText>
          </Pressable>
        </Card>

        <Card>
          <ThemedText variant="subtitle">{t(language, "healthTipToday")}</ThemedText>
          <ThemedText variant="body" style={{ marginTop: 8 }}>
            {language === "ig"
              ? "Utazi na-enyere nri ịgba ma jiri ya belata nnuofe."
              : "Utazi adds aroma and can help you use less salt—wash bitter leaves well."}
          </ThemedText>
        </Card>

        <Card>
          <ThemedText variant="subtitle">{t(language, "upcoming")}</ThemedText>
          <ThemedText variant="body" style={{ marginTop: 8 }}>
            {new Date(nextEvent.date).toLocaleDateString(language === "ig" ? "ig-NG" : "en-US", {
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {language === "ig" ? nextEvent.title_ig : nextEvent.title_en}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/events" as Href)}
            style={{ marginTop: 12, alignSelf: "flex-start" }}
          >
            <ThemedText variant="label" color="accent">
              {t(language, "events")} →
            </ThemedText>
          </Pressable>
        </Card>

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {t(language, "quickActions")}
        </ThemedText>
        <View style={styles.grid}>
          <QuickTile label={t(language, "recipes")} onPress={() => router.push("/recipes" as Href)} />
          <QuickTile label={t(language, "classes")} onPress={() => router.push("/classes" as Href)} />
          <QuickTile label={t(language, "community")} onPress={() => router.push("/community" as Href)} />
          <QuickTile label={t(language, "events")} onPress={() => router.push("/events" as Href)} />
          <QuickTile label={t(language, "nutrition")} onPress={() => router.push("/nutrition" as Href)} />
          <QuickTile label={t(language, "services")} onPress={() => router.push("/services" as Href)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickTile({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.9 },
      ]}
    >
      <ThemedText variant="label" style={{ textAlign: "center" }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 32, gap: 16 },
  featured: { gap: 4 },
  featuredImg: { width: "100%", height: 180, borderRadius: 12, marginTop: 8 },
  listen: { marginTop: 12, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    width: "47%",
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
