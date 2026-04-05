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

// LoginScreen 
// Handles user authentication: collects credentials, calls the login API,
// persists the returned token + user data, then navigates into the main app.
const LoginScreen = () => {
  // State 
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false); // disables the button while the request is in-flight

  // Handlers 

  const handleLogin = async () => {
    // Guard: both fields must be filled before hitting the API
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      // Normalise the email (trim whitespace, lowercase) before sending
      const response: any = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response.data.access;

      // Persist the JWT so subsequent API calls can attach it to request headers
      if (token) await AsyncStorage.setItem("token", token);

      // Store the email locally for display in the profile screen
      if (email) await AsyncStorage.setItem("email", email);

      // Store the full name if the API returned one (used in the profile header)
      if (response.data.user["full_name"]) {
        await AsyncStorage.setItem("full_name", response.data.user["full_name"]);
      }

      // Navigate into the main tab navigator on successful login
      router.replace("/(tabs)");
    } catch (error: any) {
      // Surface a generic message — avoid leaking which field was wrong
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      // Always re-enable the button regardless of success or failure
      setLoading(false);
    }
  };

  // Render 
  return (
    // Vertical purple-to-deep-purple gradient fills the whole screen
    <LinearGradient colors={["#944ABC", "#3B0856"]} style={styles.container}>

      {/* Branded Header (on the gradient) */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.helloText}>Hello!</Text>
        <Text style={styles.subText}>Great to see you back.</Text>
      </View>

      {/* White Card (slides up over the gradient) */}
      {/* Large top-left/right border radius creates the "sheet" effect */}
      <View style={styles.whiteCard}>

        {/* Email input — wrapped in a View to apply bottom margin independently */}
        <View style={styles.inputGap}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password input — secureTextEntry masks the typed characters */}
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {/* Forgot password link — right-aligned beneath the password field */}
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => router.push("/auth/reset-password" as any)}
        >
          <Text style={styles.forgotText}>Forgot password</Text>
        </TouchableOpacity>

        {/* Primary CTA */}
        <View style={styles.loginButtonContainer}>
          <CustomButton
            title="LOGIN"
            onPress={handleLogin}
            loading={loading}
            variant="secondary"
            style={{ borderWidth: 0, width: 160 }}
          />
        </View>

        {/* "Or" Divider */}
        {/* Horizontal lines on either side of the word "Or" separate
            the primary login from the social sign-in options */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Sign-In Icons */}
        {/* Icons are currently static images; tap handlers to be wired up */}
        <View style={styles.socialContainer}>
          <Image style={styles.socialIcon} source={googleImage} />
          <Image style={styles.socialIcon} source={emailImage} />
          <Image style={styles.socialIcon} source={facebookImage} />
        </View>

      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  // Gradient fills the entire screen including the area behind the status bar
  container: {
    flex: 1,
  },

  // Gradient Header Area
  header: {
    paddingTop: 60,         // clears the status bar on most devices
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 20,
    borderRadius: 20,       // softens the logo into a rounded square
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
    opacity: 0.9,           // slightly translucent to create visual hierarchy
  },

  // White Card
  whiteCard: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 50,  // large radius creates the overlapping sheet look
    borderTopRightRadius: 50,
    paddingHorizontal: 40,
    paddingTop: 50,
    alignItems: "center",
  },

  // Adds bottom spacing between the email and password inputs
  inputGap: {
    width: "100%",
    marginBottom: 20,
  },

  // Pulls the forgot-password link flush to the right edge of the card
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -10,         // tucks it tighter under the password field
    marginRight: 10,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  // Centres the fixed-width LOGIN button within the full-width card
  loginButtonContainer: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },

  // "Or" Divider 
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",  // light grey rule on either side of "Or"
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },

  // Social Icons Row
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",             // narrower than the card so icons feel grouped
    marginTop: 30,
  },
  socialIcon: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
});

export default LoginScreen;