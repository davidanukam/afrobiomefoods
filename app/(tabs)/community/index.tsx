import { router, type Href } from "expo-router";
import { FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteCommunity } from "@/hooks/useRemoteCommunity";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

export default function CommunityScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { posts: communityPosts } = useRemoteCommunity();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <View style={styles.pad}>
        <ThemedText variant="body" color="muted">
          {language === "ig"
            ? "Ogbako: akụkọ, ncheta, na nhọrọ nri."
            : "Story wall, recipe swaps, and gentle community prompts."}
        </ThemedText>

        <View style={styles.pills}>
          <ThemedText variant="label">🗣 {t(language, "storyWall")}</ThemedText>
          <ThemedText variant="label">🎙 {t(language, "voiceStories")}</ThemedText>
          <ThemedText variant="label">🍲 {t(language, "recipeSwap")}</ThemedText>
        </View>

        <PrimaryButton title={t(language, "shareStory")} onPress={() => router.push("/community/share" as Href)} />
      </View>

      <FlatList
        data={communityPosts}
        keyExtractor={(item) => item.post_id}
        contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="caption" color="muted">
              {item.author} · {item.kind}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 8 }}>
              {language === "ig" ? item.content_ig : item.content_en}
            </ThemedText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pad: { padding: 20, gap: 12 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 4 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
});
