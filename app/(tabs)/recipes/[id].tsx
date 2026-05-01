import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Stack, router, useLocalSearchParams, type Href } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View, StyleSheet, Pressable, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { getRecipeById } from "@/data/recipes";

export default function RecipeDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const colors = useThemeColors();
  const { language, scale } = useAppSettings();
  const recipe = id ? getRecipeById(id) : undefined;

  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop();
      };
    }, []),
  );

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
        <ThemedText variant="body">{language === "ig" ? "Achọtaghị nri a." : "Recipe not found."}</ThemedText>
      </SafeAreaView>
    );
  }

  const title = language === "ig" ? recipe.name_ig : recipe.name_en;
  const ingredients = language === "ig" ? recipe.ingredients_ig : recipe.ingredients_en;
  const instructions = language === "ig" ? recipe.instructions_ig : recipe.instructions_en;
  const cultural = language === "ig" ? recipe.cultural_notes_ig : recipe.cultural_notes_en;

  const speak = (text: string, langCode: string) => {
    Speech.stop();
    Speech.speak(text, { language: langCode, rate: 0.95 });
  };

  const readAll = (langCode: "en-US" | "ig-NG") => {
    const body = [
      ...ingredients.map((i) => i),
      "",
      ...instructions.map((s, idx) => `Step ${idx + 1}. ${s}`),
    ].join(". ");
    speak(body, langCode);
  };

  const onShare = async () => {
    try {
      await Share.share({
        title,
        message: `${title}\n\n${ingredients.map((i) => `• ${i}`).join("\n")}`,
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.row}>
          <Pressable
            style={[styles.audioBtn, { backgroundColor: colors.forest }]}
            onPress={() => readAll("en-US")}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listenEn")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.audioBtn, { backgroundColor: colors.forestLight }]}
            onPress={() => readAll("ig-NG")}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listenIg")}
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
          {t(language, "ingredients")}
        </ThemedText>
        {ingredients.map((line) => (
          <ThemedText key={line} variant="body" style={{ marginTop: 6 }}>
            • {line}
          </ThemedText>
        ))}

        <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
          {t(language, "instructions")}
        </ThemedText>
        {instructions.map((line, idx) => (
          <ThemedText key={idx} variant="body" style={{ marginTop: 8 }}>
            {idx + 1}. {line}
          </ThemedText>
        ))}

        <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
          {language === "ig" ? "Akụkọ omenala" : "Cultural notes"}
        </ThemedText>
        <ThemedText variant="body" style={{ marginTop: 6 }}>
          {cultural}
        </ThemedText>

        <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
          {t(language, "healthBenefits")}
        </ThemedText>
        <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
          kcal: {recipe.nutrition.calories} · Protein: {recipe.nutrition.protein}g · Fiber:{" "}
          {recipe.nutrition.fiber}g
        </ThemedText>
        {recipe.health_tags.map((tag) => (
          <ThemedText key={tag} variant="body" style={{ marginTop: 4 }}>
            • {tag}
          </ThemedText>
        ))}

        <View style={styles.actions}>
          <PrimaryButton
            title={t(language, "startCookingMode")}
            onPress={() => router.push(`/recipes/cooking/${recipe.recipe_id}` as Href)}
          />
          <View style={styles.row}>
            <Pressable
              style={[styles.secondary, { borderColor: colors.forest }]}
              onPress={() => Alert.alert(t(language, "save"), language === "ig" ? "Na-abịa n'ọrụ" : "Saved recipes ship in Phase 2.")}
            >
              <ThemedText variant="label" color="accent">
                {t(language, "save")}
              </ThemedText>
            </Pressable>
            <Pressable style={[styles.secondary, { borderColor: colors.forest }]} onPress={onShare}>
              <ThemedText variant="label" color="accent">
                {t(language, "share")}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <ThemedText variant="caption" color="muted" style={{ marginTop: 8, marginBottom: 24, fontSize: 14 * scale }}>
          {t(language, "demoAudio")}
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20 },
  row: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  audioBtn: { flex: 1, minHeight: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  actions: { marginTop: 24, gap: 12 },
  secondary: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
