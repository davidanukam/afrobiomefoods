import { Stack } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback } from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localized, localizedList } from "@/lib/localized";
import { speechLang } from "@/lib/locale";
import { conditionTopics, ingredients, mythFacts } from "@/data/nutrition";

export default function NutritionHubScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  const summarize = useCallback(
    (text: string) => {
      Speech.stop();
      Speech.speak(text, { language: speechLang(language), rate: 0.95 });
    },
    [language],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "nutrition") }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="subtitle">{t(language, "conditionGuides")}</ThemedText>
        {conditionTopics.map((topic) => {
          const title = localized(language, {
            en: topic.title_en,
            ig: topic.title_ig,
            fr: topic.title_fr,
          });
          const summary = localized(language, {
            en: topic.summary_en,
            ig: topic.summary_ig,
            fr: topic.summary_fr,
          });
          const tips = localizedList(language, {
            en: topic.tips_en,
            ig: topic.tips_ig,
            fr: topic.tips_fr,
          });
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
                  {t(language, "listenTTS")}
                </ThemedText>
              </Pressable>
            </View>
          );
        })}

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {t(language, "ingredientSpotlight")}
        </ThemedText>
        {ingredients.map((ing) => {
          const title = localized(language, { en: ing.name_en, ig: ing.name_ig, fr: ing.name_fr });
          const uses = localized(language, { en: ing.uses_en, ig: ing.uses_ig, fr: ing.uses_fr });
          const sci = localized(language, { en: ing.science_en, ig: ing.science_ig, fr: ing.science_fr });
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
              {t(language, "myth")}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 4 }}>
              {localized(language, { en: mf.myth_en, ig: mf.myth_ig, fr: mf.myth_fr })}
            </ThemedText>
            <ThemedText variant="caption" color="accent" style={{ marginTop: 10 }}>
              {t(language, "fact")}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 4 }}>
              {localized(language, { en: mf.fact_en, ig: mf.fact_ig, fr: mf.fact_fr })}
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
