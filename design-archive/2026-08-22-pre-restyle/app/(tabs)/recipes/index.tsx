import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import { FlatList, Pressable, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
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
  const { language } = useAppSettings();
  const { recipes } = useRemoteRecipes();
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
      .sort((a, b) =>
        recipeDisplayName(a, language).localeCompare(recipeDisplayName(b, language)),
      );
  }, [category, language, query, recipes]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <View style={styles.pad}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t(language, "search")}
          placeholderTextColor={colors.textMuted}
          style={[styles.search, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          accessibilityLabel={t(language, "search")}
        />

        <FlatList
          horizontal
          data={chips}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
          renderItem={({ item }) => {
            const active = category === item.id;
            let label: string;
            if (item.id === "all") {
              label = localized(language, { en: item.label_en, ig: item.label_ig, fr: item.label_fr });
            } else {
              const cat = recipeCategories.find((c) => c.id === item.id)!;
              label = recipeCategoryLabel(cat, language);
            }
            return (
              <Pressable
                onPress={() => setCategory(item.id)}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? colors.forest : colors.border,
                    backgroundColor: active ? colors.gold + "44" : colors.card,
                  },
                ]}
              >
                <ThemedText variant="caption">{label}</ThemedText>
              </Pressable>
            );
          }}
        />

        <ThemedText variant="subtitle" style={{ marginBottom: 8 }}>
          {t(language, "categories")}
        </ThemedText>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.recipe_id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const name = recipeDisplayName(item, language);
          return (
            <Pressable
              onPress={() => router.push(`/recipes/${item.recipe_id}` as Href)}
              style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <View style={styles.cardRow}>
                <Image
                  source={item.final_image}
                  style={[styles.thumb, { borderColor: colors.border }]}
                  contentFit="cover"
                  accessibilityLabel={name}
                />
                <View style={styles.cardText}>
                  <ThemedText variant="subtitle">{name}</ThemedText>
                  <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
                    ⏱ {item.cook_minutes} min · {item.health_tags[0] ?? ""}
                  </ThemedText>
                </View>
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
  pad: { paddingHorizontal: 20, paddingTop: 8 },
  search: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    fontSize: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  thumb: { width: 72, height: 72, borderRadius: 12, borderWidth: 1 },
  cardText: { flex: 1, minWidth: 0 },
});
