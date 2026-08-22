import type { TextProps } from "react-native";
import { Text } from "react-native";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
  variant?: "title" | "subtitle" | "body" | "caption" | "label" | "eyebrow";
  color?: "primary" | "muted" | "inverse" | "accent";
};

const baseSizes = {
  title: 30,
  subtitle: 20,
  body: 17,
  caption: 14,
  label: 16,
  eyebrow: 12,
};

const weights: Record<NonNullable<Props["variant"]>, "400" | "600" | "700" | "800"> = {
  title: "800",
  subtitle: "700",
  body: "400",
  caption: "400",
  label: "700",
  eyebrow: "700",
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
      style={[
        {
          color: colorVal,
          fontSize: size,
          lineHeight: Math.round(size * (variant === "title" ? 1.2 : 1.4)),
          fontWeight: weights[variant],
          letterSpacing: variant === "eyebrow" ? 0.8 : variant === "title" ? -0.4 : 0,
          textTransform: variant === "eyebrow" ? "uppercase" : "none",
        },
        style,
      ]}
      {...rest}
    />
  );
}
