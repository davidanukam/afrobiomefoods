import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteEvents } from "@/hooks/useRemoteEvents";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { localized } from "@/lib/localized";
import { localeTag } from "@/lib/locale";

export default function EventsScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { events } = useRemoteEvents();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText variant="body" color="muted">
          {t(language, "eventsIntro")}
        </ThemedText>

        {events.map((ev) => {
          const when = new Date(ev.date);
          const title = localized(language, { en: ev.title_en, ig: ev.title_ig, fr: ev.title_fr });
          const loc = localized(language, { en: ev.location_en, ig: ev.location_ig, fr: ev.location_fr });
          const summary = localized(language, { en: ev.summary_en, ig: ev.summary_ig, fr: ev.summary_fr });
          return (
            <View key={ev.event_id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <ThemedText variant="caption" color="muted">
                {when.toLocaleDateString(localeTag(language), {
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
                {ev.isVirtual ? t(language, "virtual") : t(language, "inPerson")} · {loc}
              </ThemedText>
              <ThemedText variant="body" style={{ marginTop: 8 }}>
                {summary}
              </ThemedText>
              <View style={styles.row}>
                <Pressable
                  style={[styles.btn, { borderColor: colors.forest }]}
                  onPress={() => Alert.alert(t(language, "register"), t(language, "eventRegPhase2"))}
                >
                  <ThemedText variant="label" color="accent">
                    {t(language, "register")}
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.btn, { borderColor: colors.border }]}
                  onPress={() => Alert.alert(t(language, "details"), t(language, "eventDetailCMS"))}
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
