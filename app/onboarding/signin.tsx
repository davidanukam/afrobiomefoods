import { router, Stack, type Href } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

export default function SignInScreen() {
  const colors = useThemeColors();
  const { language, completeOnboarding } = useAppSettings();
  const [pin, setPin] = useState("");

  const finishGuest = () => {
    completeOnboarding({ guest: true, pin: null });
    router.replace("/home" as Href);
  };

  const finishWithPin = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Alert.alert("PIN", language === "ig" ? "Tinye PIN nke anọ" : "Please enter a 4-digit PIN.");
      return;
    }
    completeOnboarding({ guest: false, pin });
    router.replace("/home" as Href);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <Stack.Screen options={{ headerShown: true, title: language === "ig" ? "Banye" : "Sign in" }} />
      <View style={styles.inner}>
        <ThemedText variant="body" color="muted" style={styles.center}>
          {language === "ig"
            ? "Ị nwere ike ịga dị ka ọbịa ma ọ bụ tinye PIN dị mfe."
            : "Start quickly as a guest or save a simple 4-digit PIN on this device."}
        </ThemedText>

        <PrimaryButton title={t(language, "guestContinue")} onPress={finishGuest} />

        <ThemedText variant="subtitle" style={{ marginTop: 8 }}>
          {t(language, "setPin")}
        </ThemedText>
        <TextInput
          value={pin}
          onChangeText={(v) => setPin(v.replace(/\D/g, "").slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          placeholder={t(language, "pinPlaceholder")}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.card,
              fontSize: 20,
            },
          ]}
        />

        <PrimaryButton title={t(language, "continue")} variant="outline" onPress={finishWithPin} />

        <ThemedText variant="caption" color="muted" style={styles.center}>
          {language === "ig"
            ? "Nke a bụ nhọpụta demo; banye biometric nwere ike ịbịa na mbipụta ọzọ."
            : "Demo only; biometric sign-in can ship in a later build."}
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, padding: 24, gap: 16 },
  center: { textAlign: "center" },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    letterSpacing: 4,
  },
});
