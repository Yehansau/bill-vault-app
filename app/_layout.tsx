import { LoadingSpinner } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./globals.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to auth
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // User logged in, redirect to app
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}