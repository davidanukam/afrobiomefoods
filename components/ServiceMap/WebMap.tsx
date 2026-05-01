import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import type { ServiceMapProps } from "@/components/ServiceMap/types";

export function ServiceMap({ webMessage, webBorderColor }: ServiceMapProps) {
  return (
    <View style={[styles.mapFallback, { borderColor: webBorderColor }]}>
      <ThemedText variant="body" color="muted" style={{ textAlign: "center", padding: 16 }}>
        {webMessage}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  mapFallback: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, minHeight: 200, justifyContent: "center" },
});
