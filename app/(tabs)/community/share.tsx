import { Stack, router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppRefreshControl } from "@/components/AppRefreshControl";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ShareStoryScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { user } = useAuth();
  const { refreshing, onRefresh } = usePullToRefresh();
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<"community" | "family">("community");
  const [submitting, setSubmitting] = useState(false);

  const displayName =
    (typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null) ??
    user?.email?.split("@")[0] ??
    "Member";

  const post = async () => {
    const body = text.trim();
    if (!body) {
      Alert.alert(t(language, "headsUp"), t(language, "storyTooShort"));
      return;
    }

    if (isSupabaseConfigured()) {
      if (!user) {
        Alert.alert(t(language, "signInRequired"), t(language, "signInToPost"));
        return;
      }
      setSubmitting(true);
      try {
        const title = body.length > 120 ? `${body.slice(0, 117)}…` : body;
        const { error } = await getSupabaseClient().from("community_posts").insert({
          title,
          content: body,
          author_uid: user.id,
          author_name: displayName,
          language,
          kind: "story",
          audience,
        });
        if (error) {
          throw error;
        }
        router.back();
      } catch (e) {
        Alert.alert(t(language, "errorPost"), e instanceof Error ? e.message : String(e));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    Alert.alert(t(language, "postedDemo"), t(language, "demoPostNoSupabase"), [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: "" }} />
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical
        refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ThemedText variant="body" color="muted">
          {t(language, "holdToRecord")}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          style={[styles.record, { borderColor: colors.forest, backgroundColor: colors.card }]}
          onPress={() => Alert.alert(t(language, "recording"), t(language, "voicePhase2"))}
        >
          <ThemedText variant="subtitle">🎙</ThemedText>
          <ThemedText variant="label" style={{ marginTop: 8 }}>
            {t(language, "holdToRecord")}
          </ThemedText>
        </Pressable>

        <ThemedText variant="subtitle" style={{ marginTop: 12 }}>
          {t(language, "typeMemory")}
        </ThemedText>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          placeholder={t(language, "storyPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.card, fontSize: 18 },
          ]}
        />

        <ThemedText variant="caption" color="muted">
          {t(language, "chooseAudience")}
        </ThemedText>
        <View style={styles.row}>
          <Chip flex label={t(language, "community")} active={audience === "community"} onPress={() => setAudience("community")} />
          <Chip flex label={t(language, "familyOnly")} active={audience === "family"} onPress={() => setAudience("family")} />
        </View>

        <PrimaryButton title={t(language, "post")} onPress={() => void post()} disabled={submitting} />
        {submitting ? <ActivityIndicator accessibilityLabel={t(language, "posting")} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, gap: 12, paddingBottom: 36 },
  record: {
    marginTop: 8,
    borderWidth: 0,
    borderRadius: radii.lg,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFCF8",
  },
  input: {
    minHeight: 140,
    borderWidth: 0,
    borderRadius: radii.lg,
    padding: 14,
  },
  row: { flexDirection: "row", gap: 12 },
});
