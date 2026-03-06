import { CustomButton, CustomInput } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import logo from "../../assets/images/LogoPicture.png";
import emailImage from "../../assets/images/icons/emailImage.png";
import facebookImage from "../../assets/images/icons/facebookImage.png";
import googleImage from "../../assets/images/icons/googleImage.png";
import { authAPI } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      // assuming backend returns: { token: "..." }
      const token = response.data.access;
      const fullName = response.data.user.full_name || response.data.name || "";

      if (token) {
        await AsyncStorage.setItem("token", token); // only save if defined
      } else {
        console.warn("Login response has no access token");
      }

      if (fullName) {
        await AsyncStorage.setItem("full_name", fullName);
      }

      Alert.alert("Success", "Logged in successfully");

      router.push("/(tabs)");
    } catch (error: any) {
      const message = "Invalid email or password";

      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#944ABC", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.userNameInput}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View style={styles.loginButton}>
          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            variant="secondary"
            style={{ borderWidth: 0}}
          />
        </View>
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
          <Text style={styles.text}>Or</Text>
          <View style={styles.rectangle} />
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.image} source={googleImage} />
          <Image style={styles.image} source={emailImage} />
          <Image style={styles.image} source={facebookImage} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  logo: {
    height: 110,
    width: 110,
    marginTop: 120,
    marginBottom: 80,
  },

  imageContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 40,
  },

  rectangleContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 60,
    justifyContent: "center",
  },

  rectangle: {
    height: 2,
    width: "38%",
    backgroundColor: "black",
  },

  text: {
    fontSize: 16,
    color: "black",
    marginHorizontal: 10, // ✅ IMPORTANT
    fontWeight: "500",
  },

  image: {
    height: 30,
    width: 30,
  },

  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    width: "100%",
    marginTop: 40,
  },

  userNameInput: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    width: "100%",
  },
});

export default LoginScreen;
