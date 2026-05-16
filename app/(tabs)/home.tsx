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
import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function HomeScreen() {
    const colors = useThemeColors();
    const { language } = useAppSettings();
    const { recipes } = useRemoteRecipes();
    const { events } = useRemoteEvents();
    const featured = getSessionFeaturedRecipe(recipes, fallbackRecipes[0]);
    const nextEvent = events[0] ?? fallbackEvents[0];
    const featuredTitle = recipeDisplayName(featured, language);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["left", "right"]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Card style={styles.featured}>
                    <Card style={{ justifyContent: "center", alignItems: "center" }}><ThemedText variant="subtitle">{t(language, "featuredRecipe")}</ThemedText></Card>
                    <Image
                        source={featured.final_image}
                        style={styles.featuredImg}
                        contentFit="cover"
                        accessibilityLabel={featuredTitle}
                    />
                    <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
                        {featuredTitle}
                    </ThemedText>
                    <ThemedText variant="caption" color="muted">
                        {t(language, "randomPickSession")}
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
                        {t(language, "healthTipUtazi")}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText variant="subtitle">{t(language, "upcoming")}</ThemedText>
                    <ThemedText variant="body" style={{ marginTop: 8 }}>
                        {new Date(nextEvent.date).toLocaleDateString(localeTag(language), {
                            month: "long",
                            day: "numeric",
                        })}
                        {" · "}
                        {localized(language, {
                            en: nextEvent.title_en,
                            ig: nextEvent.title_ig,
                            fr: nextEvent.title_fr,
                        })}
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
