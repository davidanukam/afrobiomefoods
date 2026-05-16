import { router, Stack, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function SignInScreen() {
  const colors = useThemeColors();
  const { language, completeOnboarding } = useAppSettings();
  const { signInWithEmail, registerWithEmail, supabaseEnabled, user, ready } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready || !supabaseEnabled || !user?.id) {
      return;
    }
    completeOnboarding({ guest: false, pin: null });
    router.replace("/home" as Href);
  }, [ready, supabaseEnabled, user?.id, completeOnboarding]);

  const goHome = () => {
    router.replace("/home" as Href);
  };

  const finishGuest = () => {
    completeOnboarding({ guest: true, pin: null });
    goHome();
  };

  const submitEmailAuth = async () => {
    if (!supabaseEnabled || !isSupabaseConfigured()) {
      Alert.alert("Supabase", t(language, "supabaseEnvSetup"));
      return;
    }
    const em = email.trim();
    if (!em.includes("@") || password.length < 6) {
      Alert.alert(t(language, "checkInput"), t(language, "invalidEmailPassword"));
      return;
    }
    if (mode === "register" && password !== confirm) {
      Alert.alert(t(language, "password"), t(language, "passwordsMismatch"));
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await signInWithEmail(em, password);
      } else {
        await registerWithEmail(em, password);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      Alert.alert(t(language, "authError"), msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <Stack.Screen options={{ headerShown: true, title: t(language, "signIn") }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ThemedText variant="body" color="muted" style={styles.center}>
            {t(language, "signInSubtitle")}
          </ThemedText>

          {!supabaseEnabled ? (
            <ThemedText variant="caption" color="muted" style={styles.center}>
              {t(language, "supabaseMissingGuest")}
            </ThemedText>
          ) : null}

          <View style={styles.toggleRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMode("login")}
              style={[
                styles.modeChip,
                {
                  borderColor: mode === "login" ? colors.forest : colors.border,
                  backgroundColor: mode === "login" ? colors.gold + "44" : colors.card,
                },
              ]}
            >
              <ThemedText variant="label">{t(language, "signIn")}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMode("register")}
              style={[
                styles.modeChip,
                {
                  borderColor: mode === "register" ? colors.forest : colors.border,
                  backgroundColor: mode === "register" ? colors.gold + "44" : colors.card,
                },
              ]}
            >
              <ThemedText variant="label">{t(language, "register")}</ThemedText>
            </Pressable>
          </View>

          <ThemedText variant="caption" color="muted">
            Email
          </ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          />

          <ThemedText variant="caption" color="muted">
            {t(language, "password")}
          </ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          />

          {mode === "register" ? (
            <>
              <ThemedText variant="caption" color="muted">
                {t(language, "confirmPassword")}
              </ThemedText>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              />
            </>
          ) : null}

          <PrimaryButton
            title={
              mode === "login"
                ? busy
                  ? t(language, "signingIn")
                  : t(language, "signIn")
                : busy
                  ? t(language, "creatingAccount")
                  : t(language, "createAccount")
            }
            onPress={() => void submitEmailAuth()}
            disabled={busy}
          />

          {supabaseEnabled ? (
            <>
              <ThemedText variant="caption" color="muted" style={[styles.center, { marginTop: 8 }]}>
                {t(language, "orWord")}
              </ThemedText>
              <GoogleSignInButton />
            </>
          ) : null}

          <View style={styles.divider} />

          <PrimaryButton title={t(language, "guestContinue")} variant="outline" onPress={finishGuest} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, gap: 10, paddingBottom: 40 },
  center: { textAlign: "center" },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    fontSize: 17,
  },
  toggleRow: { flexDirection: "row", gap: 10, marginVertical: 8 },
  modeChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: "#ccc", opacity: 0.3, marginVertical: 16 },
});
