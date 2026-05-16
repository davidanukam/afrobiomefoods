import { HeaderBackButton } from "@react-navigation/elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams, type Href } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView, View, StyleSheet, Pressable, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getRecipeById, recipeCopy } from "@/data/recipes";
import { speechLang } from "@/lib/locale";
import { t, type Lang } from "@/lib/i18n";

export default function RecipeDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { language, scale } = useAppSettings();
  const { getById } = useRemoteRecipes();
  const recipe = id ? getById(id) ?? getRecipeById(id) : undefined;

  const copy = useMemo(
    () => (recipe ? recipeCopy(recipe, language) : null),
    [recipe, language],
  );

  const goBackToRecipes = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/recipes" as Href);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop();
      };
    }, []),
  );

  if (!recipe || !copy) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
        <ThemedText variant="body">{t(language, "recipeNotFound")}</ThemedText>
      </SafeAreaView>
    );
  }

  const { name: title, ingredients, instructions, cultural } = copy;

  const speak = (text: string, lang: Lang) => {
    Speech.stop();
    Speech.speak(text, { language: speechLang(lang), rate: 0.95 });
  };

  const readAll = (readLang: Lang) => {
    const c = recipeCopy(recipe, readLang);
    const body = [
      ...c.ingredients,
      "",
      ...c.instructions.map((s, idx) => `Step ${idx + 1}. ${s}`),
    ].join(". ");
    speak(body, readLang);
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
      <Stack.Screen
        options={{
          title,
          headerBackTitle: t(language, "recipes"),
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={goBackToRecipes}
              accessibilityLabel={t(language, "back")}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="caption" color="muted" style={{ marginBottom: 6 }}>
          {t(language, "finishedDishPhoto")}
        </ThemedText>
        <Image
          source={recipe.final_image}
          style={[styles.dishPhoto, { borderColor: colors.border }]}
          contentFit="cover"
          accessibilityLabel={title}
        />

        <View style={styles.row}>
          <Pressable
            style={[styles.audioBtn, { backgroundColor: colors.forest }]}
            onPress={() => readAll("en")}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listenEn")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.audioBtn, { backgroundColor: colors.forestLight }]}
            onPress={() => readAll("ig")}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listenIg")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.audioBtn, { backgroundColor: colors.forestLight }]}
            onPress={() => readAll("fr")}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "listenFr")}
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
          {t(language, "culturalNotes")}
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
              onPress={() => Alert.alert(t(language, "save"), t(language, "savedRecipesPhase2"))}
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
  dishPhoto: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  audioBtn: {
    flexGrow: 1,
    flexBasis: "30%",
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
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
