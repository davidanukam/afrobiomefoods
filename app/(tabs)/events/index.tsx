import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { events } from "@/data/events";

export default function EventsScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="body" color="muted">
          {language === "ig"
            ? "Ihe omume: ịntanetị na nzụụ."
            : "Workshops, festivals, and gentle reminders for seniors."}
        </ThemedText>

        {events.map((ev) => {
          const when = new Date(ev.date);
          const title = language === "ig" ? ev.title_ig : ev.title_en;
          const loc = language === "ig" ? ev.location_ig : ev.location_en;
          const summary = language === "ig" ? ev.summary_ig : ev.summary_en;
          return (
            <View key={ev.event_id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <ThemedText variant="caption" color="muted">
                {when.toLocaleDateString(language === "ig" ? "ig-NG" : "en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </ThemedText>
              <ThemedText variant="subtitle" style={{ marginTop: 6 }}>
                {title}
              </ThemedText>
              <ThemedText variant="caption" color="accent" style={{ marginTop: 4 }}>
                {ev.isVirtual ? (language === "ig" ? "N'ịntanetị" : "Virtual") : (language === "ig" ? "N'ebe" : "In person")}{" "}
                · {loc}
              </ThemedText>
              <ThemedText variant="body" style={{ marginTop: 8 }}>
                {summary}
              </ThemedText>
              <View style={styles.row}>
                <Pressable
                  style={[styles.btn, { borderColor: colors.forest }]}
                  onPress={() =>
                    Alert.alert(
                      t(language, "register"),
                      language === "ig"
                        ? "Debanye aha ga-ejikọta na kalenda na ọkwa."
                        : "Registration will connect to calendar sync & push in Phase 2.",
                    )
                  }
                >
                  <ThemedText variant="label" color="accent">
                    {t(language, "register")}
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.btn, { borderColor: colors.border }]}
                  onPress={() =>
                    Alert.alert(
                      t(language, "details"),
                      language === "ig" ? "Nkọwa zuru oke na-abịa." : "Full detail sheets ship with CMS content.",
                    )
                  }
                >
                  <ThemedText variant="label">{t(language, "details")}</ThemedText>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 16, paddingBottom: 32 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  btn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
