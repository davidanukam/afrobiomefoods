import type { PressableProps } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import { minTouchTarget, radii } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/components/ThemedText";

type Props = PressableProps & {
  title: string;
  variant?: "filled" | "outline";
};

export function PrimaryButton({ title, variant = "filled", disabled, onPress, ...rest }: Props) {
  const colors = useThemeColors();
  const { triggerHaptic } = useAppSettings();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={(e) => {
        triggerHaptic();
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.base,
        variant === "filled"
          ? { backgroundColor: colors.forest, borderColor: colors.forest }
          : { backgroundColor: "transparent", borderColor: colors.forest, borderWidth: 1.5 },
        pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
        disabled && { opacity: 0.45 },
      ]}
      {...rest}
    >
      <ThemedText
        variant="label"
        color={variant === "filled" ? "inverse" : "primary"}
        style={variant === "outline" ? { color: colors.forest } : undefined}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget + 4,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
