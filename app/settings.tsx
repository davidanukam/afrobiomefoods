import { Stack, router, type Href } from "expo-router";
import { View, StyleSheet, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import type { FontScaleKey } from "@/constants/theme";
import { minTouchTarget } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t, type Lang } from "@/lib/i18n";

const sizes: { key: FontScaleKey; labelKey: "normal" | "large" | "extraLarge" }[] = [
  { key: "normal", labelKey: "normal" },
  { key: "large", labelKey: "large" },
  { key: "xlarge", labelKey: "extraLarge" },
];

export default function SettingsScreen() {
  const colors = useThemeColors();
  const {
    language,
    setLanguage,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    audioGuidance,
    setAudioGuidance,
    resetOnboarding,
    triggerHaptic,
  } = useAppSettings();
  const { user, isAdmin, supabaseEnabled, signOutUser, refreshClaims } = useAuth();

  const cycleLang = () => {
    triggerHaptic();
    setLanguage(language === "en" ? "ig" : "en");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "settings") }} />
      <View style={styles.inner}>
        {supabaseEnabled ? (
          <View style={{ gap: 8, marginBottom: 8 }}>
            <ThemedText variant="subtitle">
              {language === "ig" ? "Akaụntụ" : "Account"}
            </ThemedText>
            {user ? (
              <>
                <ThemedText variant="body" color="muted">
                  {user.email ?? user.id}
                </ThemedText>
                {isAdmin ? (
                  <ThemedText variant="label" color="accent">
                    {language === "ig" ? "Admin" : "Admin"}
                  </ThemedText>
                ) : null}
                <PrimaryButton
                  title={language === "ig" ? "Melite ikike" : "Refresh permissions"}
                  variant="outline"
                  onPress={() => void refreshClaims()}
                />
                {isAdmin ? (
                  <PrimaryButton
                    title={language === "ig" ? "Dezie recipes (Admin)" : "Edit recipes (Admin)"}
                    variant="outline"
                    onPress={() => router.push("/admin/recipes" as Href)}
                  />
                ) : null}
                <PrimaryButton
                  title={language === "ig" ? "Pụọ" : "Sign out"}
                  variant="outline"
                  onPress={() => void signOutUser()}
                />
              </>
            ) : (
              <ThemedText variant="body" color="muted">
                {language === "ig" ? "Ọbịa / agaghị abanye" : "Guest or not signed in"}
              </ThemedText>
            )}
          </View>
        ) : null}

        <ThemedText variant="subtitle">{t(language, "language")}</ThemedText>
        <View style={styles.row}>
          {(["en", "ig"] as Lang[]).map((lang) => (
            <Pressable
              key={lang}
              onPress={() => setLanguage(lang)}
              style={[
                styles.chip,
                {
                  borderColor: language === lang ? colors.forest : colors.border,
                  backgroundColor: language === lang ? colors.gold + "44" : colors.card,
                },
              ]}
            >
              <ThemedText variant="label">{lang === "en" ? "English" : "Igbo"}</ThemedText>
            </Pressable>
          ))}
          <Pressable onPress={cycleLang} style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="caption">{language === "ig" ? "Gbanwee" : "Toggle"}</ThemedText>
          </Pressable>
        </View>

        <ThemedText variant="subtitle" style={{ marginTop: 12 }}>
          {t(language, "fontSize")}
        </ThemedText>
        <View style={styles.sizeRow}>
          {sizes.map(({ key, labelKey }) => (
            <Pressable
              key={key}
              onPress={() => setFontScale(key)}
              style={[
                styles.sizeChip,
                {
                  borderColor: fontScale === key ? colors.forest : colors.border,
                  backgroundColor: fontScale === key ? colors.gold + "44" : colors.card,
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
          <Switch value={highContrast} onValueChange={setHighContrast} trackColor={{ true: colors.forestLight, false: colors.border }} />
        </View>

        <View style={styles.toggleRow}>
          <ThemedText variant="body" style={{ flex: 1 }}>
            {t(language, "audioNavigation")}
          </ThemedText>
          <Switch value={audioGuidance} onValueChange={setAudioGuidance} trackColor={{ true: colors.forestLight, false: colors.border }} />
        </View>

        <ThemedText variant="caption" color="muted" style={{ marginTop: 8 }}>
          {t(language, "notifications")}
        </ThemedText>
        <ThemedText variant="caption" color="muted">
          {t(language, "privacy")}
        </ThemedText>

        <View style={styles.spacer} />

        <PrimaryButton
          title={language === "ig" ? "Laghachi onboarding" : "Replay onboarding"}
          variant="outline"
          onPress={() => {
            resetOnboarding();
            router.replace("/onboarding" as Href);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20, gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: minTouchTarget - 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sizeChip: {
    minHeight: minTouchTarget,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleRow: { flexDirection: "row", alignItems: "center", minHeight: minTouchTarget, gap: 12 },
  spacer: { flex: 1 },
});
