import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider } from "@/context/AuthContext";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { palette } from "@/constants/theme";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={palette.cream} />
        <Stack
          screenOptions={{
            headerBackTitle: "Back",
            headerTitleStyle: { fontSize: 20, fontWeight: "800" },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </AppSettingsProvider>
  );
}
