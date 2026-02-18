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
import logo1 from "../assets/images/Mask group.png";

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
    <LinearGradient colors={["#944ABC", "#3B0856"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Logo background */}

      <View style={styles.logoBox}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <Image source={logo1} style={styles.logo1} resizeMode="contain" />

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

    alignItems: "center",
    justifyContent: "center",
    marginBlock: -70,
  },

  logo: {
    width: 100,
    height: 100,
  },

  logo1: {
    width: 300,
    height: 300,
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
