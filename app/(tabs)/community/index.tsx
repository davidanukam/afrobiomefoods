import { router, type Href } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import type { CommunityPost } from "@/data/community";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteCommunity } from "@/hooks/useRemoteCommunity";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t, type I18nKey } from "@/lib/i18n";
import { localized } from "@/lib/localized";

type PostFilter = "all" | "recipe" | "memory";

function kindLabel(kind: CommunityPost["kind"]): I18nKey {
  if (kind === "recipe") return "kindRecipe";
  if (kind === "memory") return "kindMemory";
  return "kindStory";
}

export default function CommunityScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { posts: communityPosts } = useRemoteCommunity();
  const [filter, setFilter] = useState<PostFilter>("all");

  const visiblePosts = useMemo(() => {
    if (filter === "all") return communityPosts;
    return communityPosts.filter((post) => post.kind === filter);
  }, [communityPosts, filter]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={visiblePosts}
        extraData={filter}
        keyExtractor={(item) => item.post_id}
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 36 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <ThemedText variant="body" color="muted" style={{ paddingVertical: 12 }}>
            {t(language, "communityEmpty")}
          </ThemedText>
        }
        ListHeaderComponent={
          <View style={styles.pad}>
            <ThemedText variant="body" color="muted">
              {t(language, "communityIntro")}
            </ThemedText>
            <View style={styles.pills}>
              <Chip label={t(language, "allPosts")} active={filter === "all"} onPress={() => setFilter("all")} />
              <Chip
                label={t(language, "kindRecipe")}
                active={filter === "recipe"}
                onPress={() => setFilter("recipe")}
              />
              <Chip
                label={t(language, "kindMemory")}
                active={filter === "memory"}
                onPress={() => setFilter("memory")}
              />
            </View>
            <PrimaryButton
              title={t(language, "shareRecipe")}
              onPress={() => router.push("/community/share?kind=recipe" as Href)}
            />
            <PrimaryButton
              title={t(language, "shareMemory")}
              variant="outline"
              onPress={() => router.push("/community/share?kind=memory" as Href)}
            />
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
                  {t(language, kindLabel(item.kind))}
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
  postHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
