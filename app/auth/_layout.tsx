import { Stack } from "expo-router";

const RegisterLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen
      name="register"
      options={{
        headerTitleAlign: "center",
        headerTitle: "Individual Account",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          color: "#000000",
          fontSize: 18,
        },
        headerTintColor: "#000000",
      }}
    />
    </Stack>
  );
};

export default RegisterLayout;
