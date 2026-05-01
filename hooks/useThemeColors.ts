import { useMemo } from "react";
import { highContrastPalette, palette } from "@/constants/theme";
import { useAppSettings } from "@/context/AppSettingsContext";

export function useThemeColors() {
  const { highContrast } = useAppSettings();
  return useMemo(() => (highContrast ? highContrastPalette : palette), [highContrast]);
}
