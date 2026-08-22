import { Ionicons } from "@expo/vector-icons";
import { Tabs, router, type Href } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t } from "@/lib/i18n";

type IconName = ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName, color: string, size: number) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  const colors = useThemeColors();
  const { language } = useAppSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          minHeight: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#14201A",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
        },
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontSize: 22, fontWeight: "800" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t(language, "home"),
          tabBarIcon: ({ color, size }) => tabIcon("home", String(color), size),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/settings" as Href)}
              accessibilityRole="button"
              accessibilityLabel={t(language, "settings")}
              style={{
                paddingHorizontal: 16,
                minWidth: 48,
                minHeight: 48,
                justifyContent: "center",
              }}
            >
              <Ionicons name="settings-outline" size={24} color={colors.forest} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: t(language, "recipes"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("book", String(color), size),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t(language, "community"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("people", String(color), size),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t(language, "events"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("calendar", String(color), size),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t(language, "services"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("location", String(color), size),
        }}
      />
    </Tabs>
  );
}
