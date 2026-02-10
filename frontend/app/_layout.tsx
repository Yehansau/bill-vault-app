import "./global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Splash screen */}
        <Stack.Screen name="index" />

        {/* Auth folder (all auth screens) */}
        <Stack.Screen name="auth" />

        {/* Main app tabs */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
