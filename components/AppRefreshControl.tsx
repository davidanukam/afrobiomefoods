import { RefreshControl } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
};

export function AppRefreshControl({ refreshing, onRefresh }: Props) {
  const colors = useThemeColors();
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.forest}
      colors={[colors.forest]}
      progressBackgroundColor={colors.card}
    />
  );
}
