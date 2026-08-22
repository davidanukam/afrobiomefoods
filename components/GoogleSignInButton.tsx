import * as Google from "expo-auth-session/providers/google";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { radii } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Props = {
  label?: string;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};

/** Web: browser redirect via Supabase Auth (configure Google provider + redirect URLs in the dashboard). */
function GoogleSignInWeb({ label, onError }: Props) {
  const colors = useThemeColors();

  const onPress = async () => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Supabase", "Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY.");
      return;
    }
    try {
      const supabase = getSupabaseClient();
      const redirectTo =
        typeof window !== "undefined" && window.location?.origin
          ? `${window.location.origin}/`
          : Linking.createURL("/");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        throw error;
      }
    } catch (e) {
      onError?.(e);
      Alert.alert("Google Sign-In", e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => void onPress()}
      style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.card }]}
    >
      <ThemedText variant="label">{label ?? "Continue with Google"}</ThemedText>
    </Pressable>
  );
}

function GoogleSignInNativeConfigured({ label, onSuccess, onError }: Props) {
  const colors = useThemeColors();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "";
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() ?? webClientId;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() ?? webClientId;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    if (response?.type !== "success") {
      return;
    }
    const params = response.params as { id_token?: string };
    const token = params.id_token;
    if (typeof token !== "string" || !token) {
      return;
    }
    if (!isSupabaseConfigured()) {
      return;
    }
    void getSupabaseClient()
      .auth.signInWithIdToken({ provider: "google", token })
      .then(({ error }) => {
        if (error) {
          throw error;
        }
        onSuccess?.();
      })
      .catch((e) => {
        onError?.(e);
        Alert.alert("Google Sign-In", e instanceof Error ? e.message : "Something went wrong.");
      });
  }, [response, onSuccess, onError]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!request}
      onPress={() => void promptAsync()}
      style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.card }]}
    >
      {!request ? (
        <ActivityIndicator color={colors.forest} />
      ) : (
        <ThemedText variant="label">{label ?? "Continue with Google"}</ThemedText>
      )}
    </Pressable>
  );
}

function GoogleSignInNative(props: Props) {
  const colors = useThemeColors();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "";

  if (!webClientId) {
    return (
      <View style={[styles.btn, { borderColor: colors.border, opacity: 0.6 }]}>
        <ThemedText variant="caption" color="muted">
          Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID for native Google Sign-In with Supabase
        </ThemedText>
      </View>
    );
  }

  return <GoogleSignInNativeConfigured {...props} />;
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});

export const GoogleSignInButton = Platform.OS === "web" ? GoogleSignInWeb : GoogleSignInNative;
