import { Stack } from "expo-router";
import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

const lessons = [
  {
    id: "l1",
    title_en: "Steaming vs frying: ofe adaptations",
    title_ig: "Isee vs ide: mgbanwe ofe",
    level_en: "Beginner",
    level_ig: "Mbido",
  },
  {
    id: "l2",
    title_en: "Cooking for one or two",
    title_ig: "Isee nri maka otu ma ọ bụ abụọ",
    level_en: "Short tips",
    level_ig: "Ndụmọdụ",
  },
  {
    id: "l3",
    title_en: "Texture-soft yam for dental comfort",
    title_ig: "Ji dị nro maka eze",
    level_en: "Senior-friendly",
    level_ig: "Maka okenye",
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
          {language === "ig"
            ? "Vidiyo ndị a bụ ihe atụ; njikọ Zoom/WebRTC na-abịa."
            : "Placeholder lessons—wire Zoom/WebRTC or hosted video when backend is ready."}
        </ThemedText>

        {lessons.map((lesson) => (
          <View key={lesson.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="subtitle">{language === "ig" ? lesson.title_ig : lesson.title_en}</ThemedText>
            <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
              {language === "ig" ? lesson.level_ig : lesson.level_en}
            </ThemedText>
            <Pressable
              style={[styles.btn, { borderColor: colors.forest }]}
              onPress={() =>
                Alert.alert(
                  language === "ig" ? "Ọmụmụ" : "Lesson",
                  language === "ig"
                    ? "Vidiyo na-akwado maka mbipụta ọzọ."
                    : "Playback, subtitles EN/IG, and reminders ship with media CDN + push.",
                )
              }
            >
              <ThemedText variant="label" color="accent">
                {language === "ig" ? "Kwuo vidiyo" : "Play preview"}
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
