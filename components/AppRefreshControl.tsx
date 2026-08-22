import { RefreshControl, type RefreshControlProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

/** Must forward children: ScrollView clones this and injects the native list as a child. */
export function AppRefreshControl({
  refreshing,
  onRefresh,
  children,
  ...rest
}: RefreshControlProps) {
  const colors = useThemeColors();
  return (
    <RefreshControl
      {...rest}
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.forest}
      colors={[colors.forest]}
      progressBackgroundColor={colors.card}
    >
      {children}
    </RefreshControl>
  );
}
