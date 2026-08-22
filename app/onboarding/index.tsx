import { router, type Href } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "@/components/Chip";
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
        <ThemedText variant="eyebrow" color="muted" style={styles.center}>
          {t(language, "appSubtitle")}
        </ThemedText>
        <ThemedText variant="title" style={styles.center}>
          {t(language, "appTitle")}
        </ThemedText>

        <ThemedText variant="subtitle" style={styles.section}>
          {t(language, "chooseLanguage")}
        </ThemedText>

        <View style={styles.row}>
          {LANG_OPTIONS.map(({ id, label }) => (
            <Chip key={id} flex label={label} active={language === id} onPress={() => pick(id)} />
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
  section: { marginTop: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  spacer: { flex: 1 },
});
