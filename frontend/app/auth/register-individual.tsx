import profile from "@/assets/images/icons/profile.png";
import { CustomButton, CustomInput } from "@/components/ui";
import { Checkbox } from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authAPI } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#3B1E54",
  secondary: "#9B7EBD",
  accent: "#D4BEE4",
  background: "#EEEEEE",
};

const RegisterScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const focusAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFocus = () => {
    Animated.spring(focusAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Validate email
  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(text && !emailRegex.test(text) ? "Enter a valid email address" : "");
  };

  // Validate password (min 8 characters)
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text.length < 8 ? "Password must be at least 8 characters" : "");
  };

  // Validate confirm password
  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(text && text !== password ? "Passwords do not match" : "");
  };

  // Register handler
  const handlePress = async () => {
    if (
      !name ||
      !email ||
      emailError ||
      !password ||
      passwordError ||
      !confirmPassword ||
      confirmPasswordError ||
      !isChecked
    ) {
      Alert.alert("Fix required", "Please fill all the required fields. ");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        confirmPassword,
        accountType: "individual",
        number,
        agreeTerms: isChecked,
      };

      const response = await authAPI.register(payload);

      const data = response.data as { token?: string; access?: string };

      if (data?.access) {
        await AsyncStorage.setItem("token", data.access);
      }
      if (name) await AsyncStorage.setItem("full_name", name);
      if (email) await AsyncStorage.setItem("email", email);

      Alert.alert("Success 🎉", "Your account has been created");
      router.push("/auth/registration-success");
    } catch (error: any) {
      console.log("REGISTER ERROR:", error?.response?.data || error.message);
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || "Check your internet or backend server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.accent, COLORS.background]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: 30 }}
        >
          <Animated.View
            style={{
              flex: 1,
              paddingHorizontal: 16,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              flex: 1,
            }}
          >
            {/* Header */}
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 24,
                  width: 64,
                  height: 64,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={profile} style={{ width: 40, height: 40 }} />
              </View>

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 26,
                  fontWeight: "bold",
                  marginTop: 16,
                }}
              >
                Create Account
              </Text>

              <Text style={{ color: COLORS.secondary, marginTop: 6 }}>
                Smart bill tracking starts here
              </Text>
            </View>

            {/* Form */}
            <View style={{ marginTop: 20 }}>
              <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 24 }}>
                <Animated.View style={{ transform: [{ scale: focusAnim }] }}>
                  <CustomInput label="Full Name" value={name} onChangeText={setName} />
                  <CustomInput
                    label="Email Address"
                    value={email}
                    onChangeText={validateEmail}
                    error={emailError}
                  />
                  <CustomInput
                    label="Phone Number (Optional)"
                    value={number}
                    onChangeText={setNumber}
                  />
                  <CustomInput
                    label="Password"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry
                    error={passwordError}
                  />
                  <CustomInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={validateConfirmPassword}
                    secureTextEntry
                    error={confirmPasswordError}
                  />
                </Animated.View>

                {/* Terms */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? COLORS.primary : undefined}
                  />
                  <Text style={{ marginLeft: 10, color: "#555" }}>
                    I agree to Terms & Privacy Policy
                  </Text>
                </View>

                {/* Button */}
                <View style={{ marginTop: 20 }}>
                  <CustomButton
                    title="Create Account"
                    onPress={handlePress}
                    loading={loading}
                    disabled={!isChecked}
                    style={{ minHeight: 50 }}
                    textStyle={{ 
                      numberOfLines: 1,
                      adjustsFontSizeToFit: true,
                      flexShrink: 1
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ textAlign: "center", color: "#555" }}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  style={{
                    color: COLORS.secondary,
                    fontWeight: "700",
                    textDecorationLine: "underline",
                  }}
                >
                  Log in
                </Link>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RegisterScreen;