import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "@/context/AppSettingsContext";

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerTitleStyle: { fontSize: 18 },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppSettingsProvider>
  );
}
