import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

// Temporary placeholder screens
function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>BILLVAULT</Text>
      <Text style={styles.subtitle}>NEVER LOSE A BILL AGAIN</Text>
    </View>
  );
}

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Screen</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
