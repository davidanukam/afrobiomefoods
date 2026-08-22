import type { ViewProps } from "react-native";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export function Card({ style, ...rest }: ViewProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
});
