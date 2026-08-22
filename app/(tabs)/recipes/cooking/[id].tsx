import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { cardShadow } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getRecipeById, recipeCopy, recipeDisplayName } from "@/data/recipes";
import { speechLang } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function CookingModeScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const recipe = id ? getRecipeById(id) : undefined;
  const steps = useMemo(() => {
    if (!recipe) return [];
    return recipeCopy(recipe, language).instructions;
  }, [recipe, language]);

  const [index, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop();
      };
    }, []),
  );

  if (!recipe || steps.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
        <ThemedText variant="body">{t(language, "noStepsFound")}</ThemedText>
      </SafeAreaView>
    );
  }

  const title = recipeDisplayName(recipe, language);
  const current = steps[Math.min(index, steps.length - 1)];

  const speakStep = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: speechLang(language), rate: 0.92 });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title }} />
      <View style={styles.inner}>
        <ThemedText variant="subtitle">{t(language, "cookingMode")}</ThemedText>
        <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
          {t(language, "stepOf", { current: index + 1, total: steps.length })}
        </ThemedText>

        <View style={[styles.stepCard, { backgroundColor: colors.card }, cardShadow]}>
          <ThemedText variant="body" style={{ marginTop: 8 }}>
            {current}
          </ThemedText>
        </View>

        <ThemedText variant="caption" color="muted" style={{ marginTop: 8 }}>
          {t(language, "cookingDemoNote")}
        </ThemedText>

        <View style={styles.controls}>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.forest }]}
            onPress={() => {
              Speech.stop();
            }}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "pause")}
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.btn, { backgroundColor: colors.forestLight }]} onPress={() => speakStep(current)}>
            <ThemedText variant="label" color="inverse">
              {t(language, "replay")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.forest }]}
            onPress={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
            disabled={index >= steps.length - 1}
          >
            <ThemedText variant="label" color="inverse">
              {t(language, "nextStep")}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20 },
  stepCard: { marginTop: 16, borderRadius: 22, padding: 22 },
  controls: { marginTop: 24, gap: 12 },
  btn: { minHeight: 52, borderRadius: 999, alignItems: "center", justifyContent: "center" },
});
