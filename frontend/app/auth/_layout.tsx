import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Welcome screen */}

      
      <Stack.Screen name="welcome" />

      {/* Auth choice: Login or Create Account */}
      <Stack.Screen name="auth-choice" />

      {/* Login screen */}
      <Stack.Screen name="login" />

      {/* Account type selection */}
      <Stack.Screen name="account-type" />

      {/* Registration screens */}
      <Stack.Screen
        name="register-individual"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Individual Account",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { color: "#000000", fontSize: 18 },
          headerTintColor: "#000000",
        }}
      />

      <Stack.Screen
        name="register-business"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "Business Account",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { color: "#000000", fontSize: 18 },
          headerTintColor: "#000000",
        }}
      />

      <Stack.Screen
        name="registration-success"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default AuthLayout;
