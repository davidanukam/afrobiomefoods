import { Stack } from "expo-router";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

export default function ServicesStackLayout() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontSize: 22, fontWeight: "800" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t(language, "services") }}
      />
    </Stack>
  );
}
