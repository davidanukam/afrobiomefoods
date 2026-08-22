import type { ViewProps } from "react-native";
import { View, StyleSheet } from "react-native";
import { cardShadow, radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";

export function Card({ style, ...rest }: ViewProps) {
  const colors = useThemeColors();
  const { highContrast } = useAppSettings();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: highContrast ? 2 : 0,
        },
        !highContrast && cardShadow,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: 18,
  },
});
