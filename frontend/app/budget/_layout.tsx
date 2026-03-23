// app/upload/_layout.tsx
import { Stack } from "expo-router";

export default function BudgetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Budget Setting",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { color: "#000000", fontSize: 18 },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
