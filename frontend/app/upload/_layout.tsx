// app/upload/_layout.tsx
import { Stack } from "expo-router";

export default function UploadLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="bill-review"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Scanned Bill Results",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { color: "#000000", fontSize: 18 },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
