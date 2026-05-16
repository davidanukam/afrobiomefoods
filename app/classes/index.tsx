import { Stack } from "expo-router";
import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localized } from "@/lib/localized";

const lessons = [
  {
    id: "l1",
    title_en: "Steaming vs frying: ofe adaptations",
    title_ig: "Isee vs ide: mgbanwe ofe",
    title_fr: "Vapeur ou friture : adapter les ofe",
    level_en: "Beginner",
    level_ig: "Mbido",
    level_fr: "Débutant",
  },
  {
    id: "l2",
    title_en: "Cooking for one or two",
    title_ig: "Isee nri maka otu ma ọ bụ abụọ",
    title_fr: "Cuisiner pour une ou deux personnes",
    level_en: "Short tips",
    level_ig: "Ndụmọdụ",
    level_fr: "Conseils rapides",
  },
  {
    id: "l3",
    title_en: "Texture-soft yam for dental comfort",
    title_ig: "Ji dị nro maka eze",
    title_fr: "Igname tendre pour le confort dentaire",
    level_en: "Senior-friendly",
    level_ig: "Maka okenye",
    level_fr: "Adapté aux aînés",
  },
];

export default function ClassesScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: t(language, "classes") }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="body" color="muted">
          {t(language, "classesPlaceholder")}
        </ThemedText>

        {lessons.map((lesson) => (
          <View key={lesson.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="subtitle">
              {localized(language, { en: lesson.title_en, ig: lesson.title_ig, fr: lesson.title_fr })}
            </ThemedText>
            <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
              {localized(language, { en: lesson.level_en, ig: lesson.level_ig, fr: lesson.level_fr })}
            </ThemedText>
            <Pressable
              style={[styles.btn, { borderColor: colors.forest }]}
              onPress={() => Alert.alert(t(language, "lesson"), t(language, "lessonPlaybackMsg"))}
            >
              <ThemedText variant="label" color="accent">
                {t(language, "playPreview")}
              </ThemedText>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 32 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  btn: { marginTop: 8, minHeight: 48, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
