import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens (placeholders for now, will be built by team)
import SplashScreen from "../screens/auth/SplashScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import AuthChoiceScreen from "../screens/auth/AuthChoiceScreen";
import AccountTypeSelectionScreen from "../screens/auth/AccountTypeSelectionScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import IndividualRegisterScreen from "../screens/auth/IndividualRegisterScreen";
import BusinessRegisterScreen from "../screens/auth/BusinessRegisterScreen";

// Placeholder for Home screen (will be built later)
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Hide header for all screens
          animation: "slide_from_right",
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen
          name="AccountTypeSelection"
          component={AccountTypeSelectionScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="IndividualRegister"
          component={IndividualRegisterScreen}
        />
        <Stack.Screen
          name="BusinessRegister"
          component={BusinessRegisterScreen}
        />

        {/* Main App */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
