import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { ServiceMapProps } from "@/components/ServiceMap/types";

export function ServiceMap({ region, items, accessibilityLabel }: ServiceMapProps) {
  return (
    <View style={styles.mapWrap}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={region} accessibilityLabel={accessibilityLabel}>
        {items.map((s) => (
          <Marker
            key={s.service_id}
            coordinate={{ latitude: s.lat, longitude: s.lng }}
            title={s.name}
            description={s.hours_en}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 240, marginHorizontal: 20, borderRadius: 16, overflow: "hidden" },
});
