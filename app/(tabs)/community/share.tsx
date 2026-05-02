import { Stack, router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ShareStoryScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { user } = useAuth();
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
      Alert.alert(
        language === "ig" ? "Nkọwa" : "Heads up",
        language === "ig" ? "Biko dee ihe obere." : "Add a short story before posting.",
      );
      return;
    }

    if (isSupabaseConfigured()) {
      if (!user) {
        Alert.alert(
          language === "ig" ? "Banye" : "Sign in required",
          language === "ig"
            ? "Biko banye ka ị bipụta na obodo."
            : "Sign in with email or Google to post to the community wall.",
        );
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
          language: language === "ig" ? "ig" : "en",
          kind: "story",
          audience,
        });
        if (error) {
          throw error;
        }
        router.back();
      } catch (e) {
        Alert.alert(
          language === "ig" ? "Njehie" : "Could not post",
          e instanceof Error ? e.message : String(e),
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    Alert.alert(
      language === "ig" ? "E bipụtala" : "Posted (demo)",
      language === "ig"
        ? "Supabase adịghị—nke a bụ nhọpụta demo."
        : "Supabase is not configured—this is a local demo only.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "shareStory") }} />
      <View style={styles.inner}>
        <ThemedText variant="body" color="muted">
          {t(language, "holdToRecord")}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          style={[styles.record, { borderColor: colors.forest, backgroundColor: colors.card }]}
          onPress={() =>
            Alert.alert(
              language === "ig" ? "Ọdịyo" : "Recording",
              language === "ig" ? "Voice capture na-abịa na mbipụta ọzọ." : "Voice capture arrives in Phase 2 with consent flows.",
            )
          }
        >
          <ThemedText variant="subtitle">🎙</ThemedText>
          <ThemedText variant="label" style={{ marginTop: 8 }}>
            {language === "ig" ? "Jide ka edebaa" : "Hold to record"}
          </ThemedText>
        </Pressable>

        <ThemedText variant="subtitle" style={{ marginTop: 12 }}>
          {language === "ig" ? "Ma dee ederede" : "Or type a short memory"}
        </ThemedText>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          placeholder={language === "ig" ? "Akụkọ gị..." : "Your story..."}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.card, fontSize: 18 },
          ]}
        />

        <ThemedText variant="caption" color="muted">
          {language === "ig" ? "Họrọ ndị ị ga-ekekọrịta ya" : "Choose who can see this first draft"}
        </ThemedText>
        <View style={styles.row}>
          <Pressable
            onPress={() => setAudience("community")}
            style={[
              styles.choice,
              { borderColor: audience === "community" ? colors.forest : colors.border, backgroundColor: colors.card },
            ]}
          >
            <ThemedText variant="label">{language === "ig" ? "Obodo" : "Community"}</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setAudience("family")}
            style={[
              styles.choice,
              { borderColor: audience === "family" ? colors.forest : colors.border, backgroundColor: colors.card },
            ]}
          >
            <ThemedText variant="label">{language === "ig" ? "Ezinaụlọ" : "Family only"}</ThemedText>
          </Pressable>
        </View>

        <PrimaryButton title={t(language, "post")} onPress={() => void post()} disabled={submitting} />
        {submitting ? <ActivityIndicator accessibilityLabel={language === "ig" ? "Na-eziga" : "Posting"} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 20, gap: 12 },
  record: {
    marginTop: 8,
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  input: {
    minHeight: 140,
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
  },
  row: { flexDirection: "row", gap: 12 },
  choice: { flex: 1, minHeight: 52, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
