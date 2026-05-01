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
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 13, fontWeight: "600" },
        tabBarStyle: {
          minHeight: 58,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontSize: 20, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t(language, "home"),
          tabBarIcon: ({ color, size }) => tabIcon("home", color, size),
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
              <Ionicons
                name="settings-outline"
                size={26}
                color={colors.forest}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: t(language, "recipes"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("book", color, size),
        }}
      />
      <Tabs.Screen
        name="comm"
        options={{
          title: t(language, "comm"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("people", color, size),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t(language, "events"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("calendar", color, size),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t(language, "services"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcon("location", color, size),
        }}
      />
    </Tabs>
  );
}
