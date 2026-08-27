import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import { FlatList, Pressable, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Platform entry: ServiceMap/index.web.tsx | index.native.tsx (see service-map.d.ts for TS)
// eslint-disable-next-line import/no-unresolved -- folder uses platform-specific index.*.tsx
import { ServiceMap } from "@/components/ServiceMap";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useRemoteServices } from "@/hooks/useRemoteServices";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { mapsSearchUrl, splitEmails, type ServiceItem } from "@/data/services";

const DEFAULT_REGION = {
  latitude: 42.9849,
  longitude: -81.2453,
  latitudeDelta: 0.14,
  longitudeDelta: 0.18,
};

const regionFrom = (items: ServiceItem[]) => {
  const valid = items.filter(
    (s) => Number.isFinite(s.lat) && Number.isFinite(s.lng) && Math.abs(s.lat) <= 90 && Math.abs(s.lng) <= 180,
  );
  if (valid.length === 0) return DEFAULT_REGION;
  const lats = valid.map((s) => s.lat);
  const lngs = valid.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.06),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.06),
  };
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

  const webMapMessage = t(language, "mapWebHint");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.service_id}
        contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View>
            <View style={styles.intro}>
              <ThemedText variant="subtitle">{t(language, "sourcingGuide")}</ThemedText>
              <ThemedText variant="body" color="muted">
                {t(language, "sourcingGuideIntro")}
              </ThemedText>
            </View>
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
        renderItem={({ item }) => {
          const emails = splitEmails(item.email);
          return (
            <Card>
              <ThemedText variant="subtitle">{item.name}</ThemedText>
              {item.address ? (
                <Pressable
                  onPress={() => void Linking.openURL(mapsSearchUrl(item))}
                  accessibilityRole="link"
                  accessibilityLabel={`${t(language, "openInMaps")}: ${item.address}`}
                >
                  <ThemedText variant="body" style={{ marginTop: 8 }}>
                    {item.address}
                  </ThemedText>
                </Pressable>
              ) : null}
              {emails.map((email) => (
                <Pressable
                  key={email}
                  onPress={() => void Linking.openURL(`mailto:${email}`)}
                  accessibilityRole="link"
                  accessibilityLabel={`${t(language, "emailLabel")}: ${email}`}
                  style={styles.linkRow}
                >
                  <ThemedText variant="caption" color="accent">
                    {email}
                  </ThemedText>
                </Pressable>
              ))}
              {item.website ? (
                <Pressable
                  onPress={() => void Linking.openURL(item.website!)}
                  accessibilityRole="link"
                  accessibilityLabel={`${t(language, "websiteLabel")}: ${item.website}`}
                  style={styles.linkRow}
                >
                  <ThemedText variant="caption" color="accent">
                    {item.website.replace(/^https?:\/\//, "")}
                  </ThemedText>
                </Pressable>
              ) : null}
              <Pressable
                style={[styles.call, { backgroundColor: colors.forest }]}
                onPress={() => call(item.contact)}
                accessibilityRole="button"
              >
                <ThemedText variant="label" color="inverse">
                  {t(language, "call")}: {item.contact}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.mapsBtn, { borderColor: colors.forest }]}
                onPress={() => void Linking.openURL(mapsSearchUrl(item))}
                accessibilityRole="button"
              >
                <ThemedText variant="label" color="accent">
                  {t(language, "openInMaps")}
                </ThemedText>
              </Pressable>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  intro: { gap: 8, paddingTop: 8, paddingBottom: 4 },
  toggleRow: { flexDirection: "row", gap: 10, marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 12 },
  linkRow: { marginTop: 8, minHeight: 32, justifyContent: "center" },
  call: { marginTop: 14, minHeight: 48, borderRadius: radii.pill, alignItems: "center", justifyContent: "center" },
  mapsBtn: {
    marginTop: 10,
    minHeight: 48,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
