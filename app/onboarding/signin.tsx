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
      Alert.alert(
        "Supabase",
        language === "ig"
          ? "Tinye ntọala Supabase na .env.local"
          : "Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to .env.local.",
      );
      return;
    }
    const em = email.trim();
    if (!em.includes("@") || password.length < 6) {
      Alert.alert(
        language === "ig" ? "Nkọwa" : "Check input",
        language === "ig"
          ? "Email kwesịrị ịdị mma; paswọọd opekata nhọrọ 6."
          : "Use a valid email and password (at least 6 characters).",
      );
      return;
    }
    if (mode === "register" && password !== confirm) {
      Alert.alert(
        language === "ig" ? "Paswọọd" : "Password",
        language === "ig" ? "Paswọọd abụọ adabaghị." : "Passwords do not match.",
      );
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
      Alert.alert(language === "ig" ? "Njehie" : "Auth error", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
      <Stack.Screen options={{ headerShown: true, title: language === "ig" ? "Banye" : "Sign in" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ThemedText variant="body" color="muted" style={styles.center}>
            {language === "ig"
              ? "Jị Supabase wee banye (ịmeelu ma ọ bụ Google), ma ọ bụ gaa dị ka ọbịa."
              : "Sign in with email or Google (Supabase), or continue as a guest."}
          </ThemedText>

          {!supabaseEnabled ? (
            <ThemedText variant="caption" color="muted" style={styles.center}>
              {language === "ig"
                ? "Supabase adịghị na nhọrọ a — ọbịa ka ọ na-arụ ọrụ."
                : "Supabase env vars missing — guest mode still works."}
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
              <ThemedText variant="label">{language === "ig" ? "Banye" : "Sign in"}</ThemedText>
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
              <ThemedText variant="label">{language === "ig" ? "Debanye aha" : "Register"}</ThemedText>
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
            {language === "ig" ? "Paswọọd" : "Password"}
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
                {language === "ig" ? "Kwado paswọọd" : "Confirm password"}
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
                ? language === "ig"
                  ? "Banye"
                  : "Sign in"
                : language === "ig"
                  ? "Meelu akaụntụ"
                  : "Create account"
            }
            onPress={() => void submitEmailAuth()}
            disabled={busy}
          />

          {supabaseEnabled ? (
            <>
              <ThemedText variant="caption" color="muted" style={[styles.center, { marginTop: 8 }]}>
                {language === "ig" ? "Maọ bụ" : "Or"}
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
