import type { TextProps } from "react-native";
import { Text } from "react-native";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
  variant?: "title" | "subtitle" | "body" | "caption" | "label";
  color?: "primary" | "muted" | "inverse" | "accent";
};

const baseSizes = {
  title: 26,
  subtitle: 20,
  body: 18,
  caption: 16,
  label: 17,
};

export function ThemedText({ variant = "body", color = "primary", style, ...rest }: Props) {
  const { scale } = useAppSettings();
  const colors = useThemeColors();
  const size = baseSizes[variant] * scale;

  const colorVal =
    color === "primary"
      ? colors.text
      : color === "muted"
        ? colors.textMuted
        : color === "inverse"
          ? colors.cream
          : colors.accent;

  return (
    <Text
      allowFontScaling
      style={[{ color: colorVal, fontSize: size, lineHeight: Math.round(size * 1.35) }, style]}
      {...rest}
    />
  );
}
