import { Pressable, StyleSheet } from "react-native";
import { minTouchTarget, radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/components/ThemedText";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  flex?: boolean;
};

export function Chip({ label, active, onPress, flex }: Props) {
  const colors = useThemeColors();
  const { highContrast } = useAppSettings();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[
        styles.chip,
        flex && styles.flex,
        {
          backgroundColor: active ? colors.forest : colors.card,
          borderColor: highContrast ? colors.border : "transparent",
          borderWidth: highContrast ? 2 : 0,
        },
      ]}
    >
      <ThemedText variant="label" color={active ? "inverse" : "primary"} style={{ textAlign: "center" }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: minTouchTarget,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
});
