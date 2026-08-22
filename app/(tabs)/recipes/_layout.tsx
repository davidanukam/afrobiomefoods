import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function RecipesStackLayout() {
  const colors = useThemeColors();

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "" }} />
      <Stack.Screen name="cooking/[id]" options={{ title: "" }} />
    </Stack>
  );
}
