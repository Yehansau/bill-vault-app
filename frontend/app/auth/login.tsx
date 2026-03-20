import { CustomButton, CustomInput } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
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
      const token = response.data.access;
      if (token) await AsyncStorage.setItem("token", token);
      if (email) {
        await AsyncStorage.setItem("email", email);
      }
      if (response.data.user["full_name"]) {
        await AsyncStorage.setItem(
          "full_name",
          response.data.user["full_name"],
        );
      }
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#944ABC", "#3B0856"]} style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.helloText}>Hello!</Text>
        <Text style={styles.subText}>Great to see you back.</Text>
      </View>

      {/* White Card Section */}
      <View style={styles.whiteCard}>
        <View style={styles.inputGap}>
          <CustomInput
            placeholder="Username"
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

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot password</Text>
        </TouchableOpacity>

        <View style={styles.loginButtonContainer}>
          <CustomButton
            title="LOGIN"
            onPress={handleLogin}
            loading={loading}
            variant="secondary"
            style={{ borderWidth: 0, width: 160 }}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <Image style={styles.socialIcon} source={googleImage} />
          <Image style={styles.socialIcon} source={emailImage} />
          <Image style={styles.socialIcon} source={facebookImage} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 20,
    borderRadius: 20,
  },
  helloText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },
  subText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
    opacity: 0.9,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 40,
    paddingTop: 50,
    alignItems: "center",
  },
  inputGap: {
    width: "100%",
    marginBottom: 20,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -10,
    marginRight: 10,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  loginButtonContainer: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 30,
  },
  socialIcon: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
});

export default LoginScreen;
