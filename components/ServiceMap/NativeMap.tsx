import { useCallback, useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { ThemedText } from "@/components/ThemedText";
import { buildMapHtml, isValidCoord } from "@/components/ServiceMap/buildMapHtml";
import type { ServiceMapProps } from "@/components/ServiceMap/types";
import { mapsSearchUrl } from "@/data/services";

export function ServiceMap({
  region,
  items,
  accessibilityLabel,
  webBorderColor,
  openInMapsLabel = "Open in Maps",
}: ServiceMapProps) {
  const [failed, setFailed] = useState(false);
  const html = useMemo(
    () => buildMapHtml(region, items, openInMapsLabel),
    [region, items, openInMapsLabel],
  );

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        lat?: number;
        lng?: number;
        name?: string;
        address?: string;
      };
      if (data.type === "error") {
        setFailed(true);
        return;
      }
      if (data.type === "open") {
        void Linking.openURL(
          mapsSearchUrl({
            address: data.address ?? "",
            lat: data.lat ?? 0,
            lng: data.lng ?? 0,
            name: data.name ?? "",
          }),
        );
      }
    } catch {
      // Ignore malformed messages from the map document.
    }
  }, []);

  if (failed) {
    return (
      <View
        style={[styles.mapWrap, styles.fallback, { borderColor: webBorderColor }]}
        accessibilityLabel={accessibilityLabel}
      >
        {items.filter(isValidCoord).map((s) => (
          <Pressable
            key={s.service_id}
            onPress={() => void Linking.openURL(mapsSearchUrl(s))}
            accessibilityRole="button"
            accessibilityLabel={`${openInMapsLabel}: ${s.name}`}
            style={styles.fallbackRow}
          >
            <ThemedText variant="label">{s.name}</ThemedText>
            <ThemedText variant="caption" color="muted">
              {openInMapsLabel}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.mapWrap} collapsable={false} accessibilityLabel={accessibilityLabel}>
      <WebView
        source={{ html, baseUrl: "https://unpkg.com" }}
        originWhitelist={["*"]}
        onMessage={onMessage}
        onError={() => setFailed(true)}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height: 280,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E4EBE3",
  },
  webview: { flex: 1, backgroundColor: "transparent" },
  fallback: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, justifyContent: "center" },
  fallbackRow: { minHeight: 48, justifyContent: "center", paddingVertical: 6 },
});
