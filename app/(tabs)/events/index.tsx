import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText variant="body" color="muted">
          {t(language, "eventsIntro")}
        </ThemedText>

        {events.map((ev) => {
          const when = new Date(ev.date);
          const title = localized(language, { en: ev.title_en, ig: ev.title_ig, fr: ev.title_fr });
          const loc = localized(language, { en: ev.location_en, ig: ev.location_ig, fr: ev.location_fr });
          const summary = localized(language, { en: ev.summary_en, ig: ev.summary_ig, fr: ev.summary_fr });
          return (
            <Card key={ev.event_id} style={styles.card}>
              <View style={styles.top}>
                <View style={[styles.dateBadge, { backgroundColor: colors.forest }]}>
                  <ThemedText variant="caption" color="inverse">
                    {when.toLocaleDateString(localeTag(language), { month: "short" }).toUpperCase()}
                  </ThemedText>
                  <ThemedText variant="subtitle" color="inverse">
                    {when.getDate()}
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="caption" color="muted">
                    {when.toLocaleTimeString(localeTag(language), { hour: "numeric", minute: "2-digit" })}
                  </ThemedText>
                  <ThemedText variant="subtitle" style={{ marginTop: 4 }}>
                    {title}
                  </ThemedText>
                  <ThemedText variant="caption" color="accent" style={{ marginTop: 4 }}>
                    {ev.isVirtual ? t(language, "virtual") : t(language, "inPerson")} · {loc}
                  </ThemedText>
                </View>
              </View>
              <ThemedText variant="body" style={{ marginTop: 12 }}>
                {summary}
              </ThemedText>
              <View style={styles.row}>
                <Pressable
                  style={[styles.btn, { backgroundColor: colors.forest }]}
                  onPress={() => Alert.alert(t(language, "register"), t(language, "eventRegPhase2"))}
                >
                  <ThemedText variant="label" color="inverse">
                    {t(language, "register")}
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.btn, { backgroundColor: colors.cream }]}
                  onPress={() => Alert.alert(t(language, "details"), t(language, "eventDetailCMS"))}
                >
                  <ThemedText variant="label">{t(language, "details")}</ThemedText>
                </Pressable>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 16, paddingBottom: 36 },
  card: { gap: 4 },
  top: { flexDirection: "row", gap: 14, alignItems: "center" },
  dateBadge: {
    width: 64,
    borderRadius: radii.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  btn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
