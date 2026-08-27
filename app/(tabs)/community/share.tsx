import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const WORD_LIMITS = { recipe: 250, memory: 150 } as const;
type PostKind = keyof typeof WORD_LIMITS;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function parseKind(value: string | string[] | undefined): PostKind {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "recipe" ? "recipe" : "memory";
}

export default function ShareStoryScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ kind?: string | string[] }>();
  const [kind, setKind] = useState<PostKind>(() => parseKind(params.kind));
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<"community" | "family">("community");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setKind(parseKind(params.kind));
  }, [params.kind]);

  const maxWords = WORD_LIMITS[kind];
  const words = countWords(text);
  const overLimit = words > maxWords;

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
    if (countWords(body) > maxWords) {
      Alert.alert(t(language, "headsUp"), t(language, "storyTooLong", { max: maxWords }));
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
          kind,
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
      <Stack.Screen options={{ title: kind === "recipe" ? t(language, "shareRecipe") : t(language, "shareMemory") }} />
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical
      >
        <ThemedText variant="caption" color="muted">
          {t(language, "choosePostType")}
        </ThemedText>
        <View style={styles.row}>
          <Chip flex label={t(language, "kindRecipe")} active={kind === "recipe"} onPress={() => setKind("recipe")} />
          <Chip flex label={t(language, "kindMemory")} active={kind === "memory"} onPress={() => setKind("memory")} />
        </View>

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {kind === "recipe" ? t(language, "typeRecipePrompt") : t(language, "typeMemoryPrompt")}
        </ThemedText>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          placeholder={kind === "recipe" ? t(language, "recipePlaceholder") : t(language, "memoryPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.card, fontSize: 18 },
          ]}
        />
        <ThemedText variant="caption" color="muted" style={overLimit ? { color: colors.danger } : undefined}>
          {t(language, "wordCount", { count: words, max: maxWords })}
        </ThemedText>

        <ThemedText variant="caption" color="muted">
          {t(language, "chooseAudience")}
        </ThemedText>
        <View style={styles.row}>
          <Chip flex label={t(language, "community")} active={audience === "community"} onPress={() => setAudience("community")} />
          <Chip flex label={t(language, "familyOnly")} active={audience === "family"} onPress={() => setAudience("family")} />
        </View>

        <PrimaryButton title={t(language, "post")} onPress={() => void post()} disabled={submitting || overLimit} />
        {submitting ? <ActivityIndicator accessibilityLabel={t(language, "posting")} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, gap: 12, paddingBottom: 36 },
  input: {
    minHeight: 160,
    borderWidth: 0,
    borderRadius: radii.lg,
    padding: 14,
  },
  row: { flexDirection: "row", gap: 12 },
});
