import { useEffect } from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/images/LogoPicture.png";

export default function SplashScreen() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Wait 2 seconds (splash screen delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user has token
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // User is logged in - go to home
        router.replace("/(tabs)" as any);
      } else {
        // New user - go to welcome
        router.replace("/auth/welcome" as any);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Error - default to welcome
      router.replace("/auth/welcome" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>BILLVAULT</Text>
      <Text style={styles.subtitle}>NEVER LOSE A BILL AGAIN</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
