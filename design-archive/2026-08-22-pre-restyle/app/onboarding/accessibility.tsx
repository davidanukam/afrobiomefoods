import { router, Stack, type Href } from "expo-router";
import { View, StyleSheet, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import type { FontScaleKey } from "@/constants/theme";
import { minTouchTarget } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

const sizes: { key: FontScaleKey; labelKey: "normal" | "large" | "extraLarge" }[] = [
  { key: "normal", labelKey: "normal" },
  { key: "large", labelKey: "large" },
  { key: "xlarge", labelKey: "extraLarge" },
];

export default function AccessibilityScreen() {
  const colors = useThemeColors();
  const {
    language,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    audioGuidance,
    setAudioGuidance,
  } = useAppSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <Stack.Screen options={{ headerShown: true, title: t(language, "accessibilityTitle") }} />
      <View style={styles.inner}>
        <ThemedText variant="subtitle">{t(language, "textSize")}</ThemedText>
        <View style={styles.sizeRow}>
          {sizes.map(({ key, labelKey }) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              onPress={() => setFontScale(key)}
              style={[
                styles.sizeChip,
                {
                  borderColor: fontScale === key ? colors.forest : colors.border,
                  backgroundColor: fontScale === key ? colors.gold + "55" : colors.card,
                },
              ]}
            >
              <ThemedText variant="label">{t(language, labelKey)}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.toggleRow}>
          <ThemedText variant="body" style={{ flex: 1 }}>
            {t(language, "highContrast")}
          </ThemedText>
          <Switch
            accessibilityLabel={t(language, "highContrast")}
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ true: colors.forestLight, false: colors.border }}
          />
        </View>

        <View style={styles.toggleRow}>
          <ThemedText variant="body" style={{ flex: 1 }}>
            {t(language, "audioNavigation")}
          </ThemedText>
          <Switch
            accessibilityLabel={t(language, "audioNavigation")}
            value={audioGuidance}
            onValueChange={setAudioGuidance}
            trackColor={{ true: colors.forestLight, false: colors.border }}
          />
        </View>

        <View style={styles.spacer} />

        <PrimaryButton title={t(language, "continue")} onPress={() => router.push("/onboarding/signin" as Href)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 24, gap: 20 },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  sizeChip: {
    minHeight: minTouchTarget,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: minTouchTarget,
  },
  spacer: { flex: 1 },
});
