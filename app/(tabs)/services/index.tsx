import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { FlatList, Pressable, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Platform entry: ServiceMap/index.web.tsx | index.native.tsx (see service-map.d.ts for TS)
// eslint-disable-next-line import/no-unresolved -- folder uses platform-specific index.*.tsx
import { AppRefreshControl } from "@/components/AppRefreshControl";
// Platform entry: ServiceMap/index.web.tsx | index.native.tsx (see service-map.d.ts for TS)
// eslint-disable-next-line import/no-unresolved -- folder uses platform-specific index.*.tsx
import { ServiceMap } from "@/components/ServiceMap";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useRemoteServices } from "@/hooks/useRemoteServices";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import type { ServiceItem } from "@/data/services";

const DEFAULT_REGION = {
  latitude: 6.45,
  longitude: 7.5,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const regionFrom = (items: ServiceItem[]) => {
  const valid = items.filter(
    (s) => Number.isFinite(s.lat) && Number.isFinite(s.lng) && Math.abs(s.lat) <= 90 && Math.abs(s.lng) <= 180,
  );
  if (valid.length === 0) return DEFAULT_REGION;
  const lat = valid.reduce((a, b) => a + b.lat, 0) / valid.length;
  const lng = valid.reduce((a, b) => a + b.lng, 0) / valid.length;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return DEFAULT_REGION;
  return { latitude: lat, longitude: lng, latitudeDelta: 0.08, longitudeDelta: 0.08 };
};

export default function ServicesScreen() {
  const colors = useThemeColors();
  const { language } = useAppSettings();
  const { services, refresh } = useRemoteServices();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);
  const [mode, setMode] = useState<"list" | "map">("list");
  const region = useMemo(() => regionFrom(services), [services]);

  const call = (phone: string) => {
    void Linking.openURL(`tel:${phone.replace(/[^\d+]/g, "")}`);
  };

  const webMapMessage = t(language, "mapWebHint");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.service_id}
        refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View>
            <View style={styles.toggleRow}>
              <Chip flex label={t(language, "listView")} active={mode === "list"} onPress={() => setMode("list")} />
              <Chip flex label={t(language, "mapView")} active={mode === "map"} onPress={() => setMode("map")} />
            </View>
            {mode === "map" ? (
              <ServiceMap
                region={region}
                items={services}
                accessibilityLabel={t(language, "mapView")}
                webMessage={webMapMessage}
                webBorderColor={colors.border}
                openInMapsLabel={t(language, "openInMaps")}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Card>
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
                {t(language, "call")} {item.contact}
              </ThemedText>
            </Pressable>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  toggleRow: { flexDirection: "row", gap: 10, marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 12 },
  call: { marginTop: 14, minHeight: 48, borderRadius: radii.pill, alignItems: "center", justifyContent: "center" },
});
