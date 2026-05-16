import { router, type Href } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LANG_OPTIONS } from "@/lib/locale";
import { t, type Lang } from "@/lib/i18n";

export default function LanguageScreen() {
  const colors = useThemeColors();
  const { language, setLanguage, triggerHaptic } = useAppSettings();

  const pick = (lang: Lang) => {
    triggerHaptic();
    setLanguage(lang);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <View style={styles.inner}>
        <ThemedText variant="title" style={styles.center}>
          {t(language, "appTitle")}
        </ThemedText>
        <ThemedText variant="body" color="muted" style={[styles.center, styles.sub]}>
          {t(language, "appSubtitle")}
        </ThemedText>

        <ThemedText variant="subtitle" style={styles.section}>
          {t(language, "chooseLanguage")}
        </ThemedText>

        <View style={styles.row}>
          {LANG_OPTIONS.map(({ id, label }) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              onPress={() => pick(id)}
              style={[
                styles.langCard,
                {
                  borderColor: language === id ? colors.forest : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <ThemedText variant="label" style={{ textAlign: "center" }}>
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText variant="caption" color="muted" style={styles.center}>
          {t(language, "audioPromptAvailable")}
        </ThemedText>

        <View style={styles.spacer} />

        <PrimaryButton title={t(language, "continue")} onPress={() => router.push("/onboarding/accessibility" as Href)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 24, gap: 16 },
  center: { textAlign: "center" },
  sub: { marginTop: 4 },
  section: { marginTop: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  langCard: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 96,
    minHeight: 72,
    borderWidth: 2,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  spacer: { flex: 1 },
});
