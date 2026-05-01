import { Stack, router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

export default function ShareStoryScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<"community" | "family">("community");

  const post = () => {
    if (!text.trim()) {
      Alert.alert(
        language === "ig" ? "Nkọwa" : "Heads up",
        language === "ig" ? "Biko dee ihe obere." : "Add a short story before posting.",
      );
      return;
    }
    Alert.alert(
      language === "ig" ? "E bipụtala" : "Posted (demo)",
      language === "ig"
        ? "Nke a bụ nhọpụta demo; backend ga-echekwa moderation."
        : "Demo only—backend moderation ships with Supabase/Firebase.",
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

        <PrimaryButton title={t(language, "post")} onPress={post} />
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
