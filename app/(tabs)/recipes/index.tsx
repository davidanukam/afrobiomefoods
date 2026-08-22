import { router, type Href } from "expo-router";
import { FlatList, Image, Pressable, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppRefreshControl } from "@/components/AppRefreshControl";
import { Chip } from "@/components/Chip";
import { ThemedText } from "@/components/ThemedText";
import { cardShadow, radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localized } from "@/lib/localized";
import {
  recipeCategories,
  recipeCategoryLabel,
  recipeDisplayName,
  type RecipeCategory,
} from "@/data/recipes";
import { useMemo, useState } from "react";

const chips: {
  id: RecipeCategory | "all";
  label_en: string;
  label_ig: string;
  label_fr: string;
}[] = [
  { id: "all", label_en: "All", label_ig: "Ha niile", label_fr: "Tout" },
  ...recipeCategories,
];

export default function RecipeCategoriesScreen() {
  const colors = useThemeColors();
  const { language, highContrast } = useAppSettings();
  const { recipes, refresh } = useRemoteRecipes();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RecipeCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        const matchesCat = category === "all" || r.category === category;
        const matchesQuery =
          !q ||
          r.name_en.toLowerCase().includes(q) ||
          r.name_ig.toLowerCase().includes(q) ||
          r.health_tags.some((h) => h.toLowerCase().includes(q));
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => recipeDisplayName(a, language).localeCompare(recipeDisplayName(b, language)));
  }, [category, language, query, recipes]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.recipe_id}
        refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, gap: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListHeaderComponent={
          <View style={styles.pad}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t(language, "search")}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.search,
                {
                  color: colors.text,
                  backgroundColor: colors.card,
                  borderColor: highContrast ? colors.border : "transparent",
                  borderWidth: highContrast ? 2 : 0,
                },
              ]}
              accessibilityLabel={t(language, "search")}
            />

            <FlatList
              horizontal
              data={chips}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 14 }}
              renderItem={({ item }) => {
                const active = category === item.id;
                let label: string;
                if (item.id === "all") {
                  label = localized(language, { en: item.label_en, ig: item.label_ig, fr: item.label_fr });
                } else {
                  const cat = recipeCategories.find((c) => c.id === item.id)!;
                  label = recipeCategoryLabel(cat, language);
                }
                return <Chip label={label} active={active} onPress={() => setCategory(item.id)} />;
              }}
            />
          </View>
        }
        renderItem={({ item }) => {
          const name = recipeDisplayName(item, language);
          return (
            <Pressable
              onPress={() => router.push(`/recipes/${item.recipe_id}` as Href)}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border, borderWidth: highContrast ? 2 : 0 },
                !highContrast && cardShadow,
              ]}
            >
              <Image
                source={item.final_image}
                style={styles.thumb}
                resizeMode="cover"
                fadeDuration={0}
                accessibilityLabel={name}
              />
              <View style={styles.cardText}>
                <ThemedText variant="subtitle">{name}</ThemedText>
                <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
                  {item.cook_minutes} min · {item.health_tags[0] ?? ""}
                </ThemedText>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <ThemedText variant="body" color="muted" style={{ textAlign: "center", marginTop: 24 }}>
            {t(language, "recipesEmpty")}
          </ThemedText>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pad: { paddingTop: 8 },
  search: {
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    minHeight: 48,
    fontSize: 17,
  },
  card: {
    borderRadius: radii.lg,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 10,
    paddingRight: 16,
  },
  thumb: { width: 92, height: 92, borderRadius: radii.md },
  cardText: { flex: 1, minWidth: 0 },
});
