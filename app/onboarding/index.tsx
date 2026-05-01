import { router, type Href } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
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
          <Pressable
            accessibilityRole="button"
            onPress={() => pick("en")}
            style={[
              styles.langCard,
              { borderColor: language === "en" ? colors.forest : colors.border, backgroundColor: colors.card },
            ]}
          >
            <ThemedText variant="subtitle">English</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => pick("ig")}
            style={[
              styles.langCard,
              { borderColor: language === "ig" ? colors.forest : colors.border, backgroundColor: colors.card },
            ]}
          >
            <ThemedText variant="subtitle">Asụsụ Igbo</ThemedText>
          </Pressable>
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
  row: { flexDirection: "row", gap: 12 },
  langCard: {
    flex: 1,
    minHeight: 72,
    borderWidth: 2,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: { flex: 1 },
});
