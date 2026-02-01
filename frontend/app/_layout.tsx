//import { LoadingSpinner } from "@/components/ui";
//import { useAuth } from "@/hooks/useAuth";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
//import { useEffect } from "react";
import "react-native-reanimated";
import "./globals.css";

export default function RootLayout() {
  //const { user, loading } = useAuth();
  //const segments = useSegments();
  //const router = useRouter();

  /*useEffect(() => {
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
  }*/

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
