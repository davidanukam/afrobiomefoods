export const palette = {
  forest: "#1B4332",
  forestLight: "#2D6A4F",
  cream: "#F8F5F0",
  gold: "#D4A574",
  goldMuted: "#C9A227",
  text: "#1A1A1A",
  textMuted: "#4A4A4A",
  border: "#E0D8CC",
  card: "#FFFFFF",
  accent: "#40916C",
  danger: "#9B2226",
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
};

export type FontScaleKey = "normal" | "large" | "xlarge";

export const fontScaleMultipliers: Record<FontScaleKey, number> = {
  normal: 1,
  large: 1.15,
  xlarge: 1.3,
};

export const minTouchTarget = 48;
