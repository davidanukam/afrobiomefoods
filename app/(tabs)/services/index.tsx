import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { FlatList, Pressable, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Platform entry: ServiceMap/index.web.tsx | index.native.tsx (see service-map.d.ts for TS)
// eslint-disable-next-line import/no-unresolved -- folder uses platform-specific index.*.tsx
import { ServiceMap } from "@/components/ServiceMap";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteServices } from "@/hooks/useRemoteServices";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import type { ServiceItem } from "@/data/services";

const regionFrom = (items: ServiceItem[]) => {
  const lat = items.reduce((a, b) => a + b.lat, 0) / items.length;
  const lng = items.reduce((a, b) => a + b.lng, 0) / items.length;
  return { latitude: lat, longitude: lng, latitudeDelta: 0.08, longitudeDelta: 0.08 };
};

export default function ServicesScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { services } = useRemoteServices();
  const [mode, setMode] = useState<"list" | "map">("list");
  const region = useMemo(() => regionFrom(services), [services]);

  const call = (phone: string) => {
    void Linking.openURL(`tel:${phone.replace(/[^\d+]/g, "")}`);
  };

  const webMapMessage =
    language === "ig"
      ? "Maapụ kachasị mma na ngwa iOS/Android."
      : "Interactive maps are best on the iOS/Android builds.";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setMode("list")}
          style={[
            styles.toggle,
            { borderColor: mode === "list" ? colors.forest : colors.border, backgroundColor: colors.card },
          ]}
        >
          <ThemedText variant="label">{t(language, "listView")}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setMode("map")}
          style={[
            styles.toggle,
            { borderColor: mode === "map" ? colors.forest : colors.border, backgroundColor: colors.card },
          ]}
        >
          <ThemedText variant="label">{t(language, "mapView")}</ThemedText>
        </Pressable>
      </View>

      <ThemedText variant="subtitle" style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        {t(language, "servicesNearYou")}
      </ThemedText>

      {mode === "map" ? (
        <ServiceMap
          region={region}
          items={services}
          accessibilityLabel={t(language, "mapView")}
          webMessage={webMapMessage}
          webBorderColor={colors.border}
        />
      ) : null}

      <FlatList
        data={services}
        keyExtractor={(item) => item.service_id}
        contentContainerStyle={{ padding: 20, paddingTop: mode === "list" ? 0 : 12, gap: 12, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <ThemedText variant="subtitle">{item.name}</ThemedText>
            <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
              {item.distance_km.toFixed(1)} km · {item.hours_en}
            </ThemedText>
            <ThemedText variant="body" style={{ marginTop: 8 }}>
              {item.accessibility_notes_en}
            </ThemedText>
            <Pressable
              style={[styles.call, { backgroundColor: colors.forest }]}
              onPress={() => call(item.contact)}
              accessibilityRole="button"
            >
              <ThemedText variant="label" color="inverse">
                {language === "ig" ? "Kpọ" : "Call"} {item.contact}
              </ThemedText>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  toggleRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  toggle: { flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  call: { marginTop: 12, minHeight: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
