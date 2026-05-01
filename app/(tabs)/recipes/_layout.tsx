import { Stack } from "expo-router";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

export default function RecipesStackLayout() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontSize: 20, fontWeight: "700" },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ title: t(language, "recipes") }} />
      <Stack.Screen name="[id]" options={{ title: "" }} />
      <Stack.Screen name="cooking/[id]" options={{ title: t(language, "cookingMode") }} />
    </Stack>
  );
}
