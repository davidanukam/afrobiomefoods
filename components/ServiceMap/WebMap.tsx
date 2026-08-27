import { createElement, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { buildMapHtml } from "@/components/ServiceMap/buildMapHtml";
import type { ServiceMapProps } from "@/components/ServiceMap/types";

export function ServiceMap({
  region,
  items,
  accessibilityLabel,
  webBorderColor,
  openInMapsLabel = "Open in Maps",
}: ServiceMapProps) {
  const html = useMemo(
    () => buildMapHtml(region, items, openInMapsLabel),
    [region, items, openInMapsLabel],
  );

  return (
    <View
      style={[styles.mapWrap, { borderColor: webBorderColor }]}
      accessibilityLabel={accessibilityLabel}
    >
      {createElement("iframe", {
        title: accessibilityLabel,
        srcDoc: html,
        style: iframeStyle,
        sandbox: "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin",
      })}
    </View>
  );
}

const iframeStyle = { border: "0", width: "100%", height: "100%" };

const styles = StyleSheet.create({
  mapWrap: {
    height: 280,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E4EBE3",
  },
});
