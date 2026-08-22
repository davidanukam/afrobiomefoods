import { Stack, router, type Href } from "expo-router";
import { View, StyleSheet, Switch, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
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
      <Stack.Screen options={{ title: t(language, "settings"), headerShadowVisible: false }} />
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        {supabaseEnabled ? (
          <Card style={{ gap: 10 }}>
            <ThemedText variant="eyebrow" color="muted">
              {t(language, "account")}
            </ThemedText>
            {user ? (
              <>
                <ThemedText variant="subtitle">{user.email ?? user.id}</ThemedText>
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
                <PrimaryButton title={t(language, "signOut")} variant="outline" onPress={() => void signOutUser()} />
              </>
            ) : (
              <ThemedText variant="body" color="muted">
                {t(language, "guestNotSignedIn")}
              </ThemedText>
            )}
          </Card>
        ) : null}

        <Card style={{ gap: 12 }}>
          <ThemedText variant="eyebrow" color="muted">
            {t(language, "language")}
          </ThemedText>
          <View style={styles.row}>
            {LANG_OPTIONS.map(({ id, label }) => (
              <Chip key={id} label={label} active={language === id} onPress={() => setLanguage(id)} />
            ))}
            <Chip label={t(language, "toggle")} onPress={cycleLang} />
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <ThemedText variant="eyebrow" color="muted">
            {t(language, "fontSize")}
          </ThemedText>
          <View style={styles.row}>
            {sizes.map(({ key, labelKey }) => (
              <Chip key={key} label={t(language, labelKey)} active={fontScale === key} onPress={() => setFontScale(key)} />
            ))}
          </View>
          <View style={styles.toggleRow}>
            <ThemedText variant="body" style={{ flex: 1 }}>
              {t(language, "highContrast")}
            </ThemedText>
            <Switch
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
              value={audioGuidance}
              onValueChange={setAudioGuidance}
              trackColor={{ true: colors.forestLight, false: colors.border }}
            />
          </View>
        </Card>

        <ThemedText variant="caption" color="muted">
          {t(language, "notifications")}
        </ThemedText>
        <ThemedText variant="caption" color="muted">
          {t(language, "privacy")}
        </ThemedText>

        <PrimaryButton
          title={t(language, "replayOnboarding")}
          variant="outline"
          onPress={() => {
            resetOnboarding();
            router.replace("/onboarding" as Href);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, gap: 16, paddingBottom: 36 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  toggleRow: { flexDirection: "row", alignItems: "center", minHeight: minTouchTarget, gap: 12 },
});
