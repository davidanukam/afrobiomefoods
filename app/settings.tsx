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
import { LANG_OPTIONS } from "@/lib/locale";
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
    const next: Lang = language === "en" ? "ig" : language === "ig" ? "fr" : "en";
    setLanguage(next);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "settings") }} />
      <View style={styles.inner}>
        {supabaseEnabled ? (
          <View style={{ gap: 8, marginBottom: 8 }}>
            <ThemedText variant="subtitle">{t(language, "account")}</ThemedText>
            {user ? (
              <>
                <ThemedText variant="body" color="muted">
                  {user.email ?? user.id}
                </ThemedText>
                {isAdmin ? (
                  <ThemedText variant="label" color="accent">
                    {t(language, "admin")}
                  </ThemedText>
                ) : null}
                <PrimaryButton
                  title={t(language, "refreshPermissions")}
                  variant="outline"
                  onPress={() => void refreshClaims()}
                />
                {isAdmin ? (
                  <PrimaryButton
                    title={t(language, "editRecipesAdmin")}
                    variant="outline"
                    onPress={() => router.push("/admin/recipes" as Href)}
                  />
                ) : null}
                <PrimaryButton
                  title={t(language, "signOut")}
                  variant="outline"
                  onPress={() => void signOutUser()}
                />
              </>
            ) : (
              <ThemedText variant="body" color="muted">
                {t(language, "guestNotSignedIn")}
              </ThemedText>
            )}
          </View>
        ) : null}

        <ThemedText variant="subtitle">{t(language, "language")}</ThemedText>
        <View style={styles.row}>
          {LANG_OPTIONS.map(({ id, label }) => (
            <Pressable
              key={id}
              onPress={() => setLanguage(id)}
              style={[
                styles.chip,
                {
                  borderColor: language === id ? colors.forest : colors.border,
                  backgroundColor: language === id ? colors.gold + "44" : colors.card,
                },
              ]}
            >
              <ThemedText variant="label">{label}</ThemedText>
            </Pressable>
          ))}
          <Pressable onPress={cycleLang} style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="caption">{t(language, "toggle")}</ThemedText>
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
          title={t(language, "replayOnboarding")}
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
