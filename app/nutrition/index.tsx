import { Stack } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback } from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { conditionTopics, ingredients, mythFacts } from "@/data/nutrition";

export default function NutritionHubScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  const summarize = useCallback(
    (text: string) => {
      Speech.stop();
      Speech.speak(text, { language: language === "ig" ? "ig-NG" : "en-US", rate: 0.95 });
    },
    [language],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "nutrition") }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="subtitle">{t(language, "conditionGuides")}</ThemedText>
        {conditionTopics.map((topic) => {
          const title = language === "ig" ? topic.title_ig : topic.title_en;
          const summary = language === "ig" ? topic.summary_ig : topic.summary_en;
          const tips = language === "ig" ? topic.tips_ig : topic.tips_en;
          return (
            <View key={topic.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <ThemedText variant="subtitle">{title}</ThemedText>
              <ThemedText variant="body" style={{ marginTop: 8 }}>
                {summary}
              </ThemedText>
              {tips.map((tip) => (
                <ThemedText key={tip} variant="body" style={{ marginTop: 6 }}>
                  • {tip}
                </ThemedText>
              ))}
              <Pressable
                style={[styles.audio, { backgroundColor: colors.forestLight }]}
                onPress={() => summarize(`${title}. ${summary}`)}
              >
                <ThemedText variant="label" color="inverse">
                  {t(language, "listen")} (TTS)
                </ThemedText>
              </Pressable>
            </View>
          );
        })}

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {t(language, "ingredientSpotlight")}
        </ThemedText>
        {ingredients.map((ing) => {
          const title = language === "ig" ? ing.name_ig : ing.name_en;
          const uses = language === "ig" ? ing.uses_ig : ing.uses_en;
          const sci = language === "ig" ? ing.science_ig : ing.science_en;
          return (
            <View key={ing.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <ThemedText variant="subtitle">{title}</ThemedText>
              <ThemedText variant="body" style={{ marginTop: 8 }}>
                {uses}
              </ThemedText>
              <ThemedText variant="caption" color="muted" style={{ marginTop: 8 }}>
                {sci}
              </ThemedText>
            </View>
          );
        })}

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {t(language, "mythVsFact")}
        </ThemedText>
        {mythFacts.map((mf, idx) => (
          <View key={idx} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="caption" color="muted">
              {language === "ig" ? "Ekwensu" : "Myth"}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 4 }}>
              {language === "ig" ? mf.myth_ig : mf.myth_en}
            </ThemedText>
            <ThemedText variant="caption" color="accent" style={{ marginTop: 10 }}>
              {language === "ig" ? "Eziokwu" : "Fact"}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 4 }}>
              {language === "ig" ? mf.fact_ig : mf.fact_en}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 32 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  audio: { marginTop: 12, minHeight: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
