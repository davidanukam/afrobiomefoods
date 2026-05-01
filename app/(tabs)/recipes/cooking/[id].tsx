import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { getRecipeById } from "@/data/recipes";

export default function CookingModeScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const recipe = id ? getRecipeById(id) : undefined;
  const steps = useMemo(() => {
    if (!recipe) return [];
    return language === "ig" ? recipe.instructions_ig : recipe.instructions_en;
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
        <ThemedText variant="body">{language === "ig" ? "Achọtaghị nzọụkwụ." : "No steps found."}</ThemedText>
      </SafeAreaView>
    );
  }

  const title = language === "ig" ? recipe.name_ig : recipe.name_en;
  const current = steps[Math.min(index, steps.length - 1)];

  const speakStep = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: language === "ig" ? "ig-NG" : "en-US", rate: 0.92 });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title }} />
      <View style={styles.inner}>
        <ThemedText variant="subtitle">{t(language, "cookingMode")}</ThemedText>
        <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
          {t(language, "stepOf", { current: index + 1, total: steps.length })}
        </ThemedText>

        <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
        </View>

        <Pressable
          style={[styles.next, { backgroundColor: colors.gold }]}
          onPress={() => {
            const next = Math.min(index + 1, steps.length - 1);
            setIndex(next);
            speakStep(steps[next]);
          }}
        >
          <ThemedText variant="label" color="primary">
            {t(language, "nextStep")}
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20, gap: 12 },
  stepCard: { marginTop: 12, padding: 16, borderRadius: 16, borderWidth: 1, minHeight: 140 },
  controls: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, minHeight: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  next: { marginTop: 12, minHeight: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
