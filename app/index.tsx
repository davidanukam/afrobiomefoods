import { Redirect, type Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function Index() {
  const { hydrated, onboardingComplete } = useAppSettings();
  const colors = useThemeColors();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator size="large" color={colors.forest} />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href={"/onboarding" as Href} />;
  }

  return <Redirect href={"/home" as Href} />;
}
