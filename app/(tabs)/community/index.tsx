import { router, type Href } from "expo-router";
import { FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppRefreshControl } from "@/components/AppRefreshControl";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useRemoteCommunity } from "@/hooks/useRemoteCommunity";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localized } from "@/lib/localized";

export default function CommunityScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { posts: communityPosts, refresh } = useRemoteCommunity();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={communityPosts}
        keyExtractor={(item) => item.post_id}
        refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.pad}>
            <ThemedText variant="body" color="muted">
              {t(language, "communityIntro")}
            </ThemedText>
            <View style={styles.pills}>
              {[t(language, "storyWall"), t(language, "voiceStories"), t(language, "recipeSwap")].map((label) => (
                <View key={label} style={[styles.tag, { backgroundColor: colors.card }]}>
                  <ThemedText variant="caption">{label}</ThemedText>
                </View>
              ))}
            </View>
            <PrimaryButton title={t(language, "shareStory")} onPress={() => router.push("/community/share" as Href)} />
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.postHead}>
              <View style={[styles.avatar, { backgroundColor: colors.forest }]}>
                <ThemedText variant="label" color="inverse">
                  {item.author.slice(0, 1).toUpperCase()}
                </ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{item.author}</ThemedText>
                <ThemedText variant="caption" color="muted">
                  {item.kind}
                </ThemedText>
              </View>
            </View>
            <ThemedText variant="body" style={{ marginTop: 12 }}>
              {localized(language, { en: item.content_en, ig: item.content_ig })}
            </ThemedText>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pad: { gap: 14, paddingBottom: 14 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
  postHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
