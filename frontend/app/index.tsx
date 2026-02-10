import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import logo from "../assets/images/LogoPicture.png";

export default function SplashScreen() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = await AsyncStorage.getItem("token");

      if (token) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/auth/welcome" as any);
      }
    } catch (error) {
      router.replace("/auth/welcome" as any);
    }
  };

  return (
    <LinearGradient colors={["#8E44AD", "#4A0D66"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Logo background */}
      <View style={styles.logoBox}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* App name */}
      <Text style={styles.title}>BILLVAULT</Text>

      {/* Tagline */}
      <Text style={styles.subtitle}>NEVER LOSE A BILL AGAIN</Text>

      {/* Loader */}
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  logo: {
    width: 90,
    height: 90,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },

  subtitle: {
    fontSize: 12,
    color: "#E6D6EE",
    marginTop: 8,
    letterSpacing: 1,
  },

  loader: {
    marginTop: 40,
  },
});
