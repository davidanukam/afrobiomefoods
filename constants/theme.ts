export const palette = {
  forest: "#16382A",
  forestLight: "#2F6A4C",
  cream: "#F3EEE6",
  gold: "#C9A36A",
  goldMuted: "#B8924A",
  text: "#14201A",
  textMuted: "#5C6560",
  border: "#E4D9CB",
  card: "#FFFCF8",
  accent: "#2F6A4C",
  danger: "#9B2226",
  overlay: "rgba(20, 32, 26, 0.45)",
};

export const highContrastPalette = {
  forest: "#000000",
  forestLight: "#1A1A1A",
  cream: "#FFFFFF",
  gold: "#FFD700",
  goldMuted: "#FFD700",
  text: "#000000",
  textMuted: "#000000",
  border: "#000000",
  card: "#FFFFFF",
  accent: "#006400",
  danger: "#8B0000",
  overlay: "rgba(0, 0, 0, 0.55)",
};

export type FontScaleKey = "normal" | "large" | "xlarge";

export const fontScaleMultipliers: Record<FontScaleKey, number> = {
  normal: 1,
  large: 1.15,
  xlarge: 1.3,
};

export const minTouchTarget = 48;

export const radii = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const cardShadow = {
  shadowColor: "#14201A",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 4,
};
