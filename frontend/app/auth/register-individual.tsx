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

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      text && !emailRegex.test(text) ? "Enter a valid email address" : ""
    );
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

    setPasswordError(
      !strongRegex.test(text)
        ? "12+ characters (14+ recommended) with upper, lower, number & symbol"
        : ""
    );
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text && text !== password ? "Passwords do not match" : ""
    );
  };

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
      Alert.alert("Fix required", "Please complete the form correctly");
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

      const response = await authAPI.register(payload, {
        headers: { Authorization: undefined },
      });

      if (response.data?.token) {
        await AsyncStorage.setItem("token", response.data.token);
      }

      // Save the name the user typed so home screen can show "Hi [name]!"
      if (name) {
        await AsyncStorage.setItem("full_name", name);
      }

      // Alert.alert("Success 🎉", "Your account has been created");
      router.push("/auth/registration-success");
    } catch {
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.accent, COLORS.background]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View className="items-center mt-10">
              <View
                style={{ backgroundColor: COLORS.primary }}
                className="rounded-3xl size-16 justify-center items-center shadow-xl"
              >
                <Image source={profile} className="size-10" />
              </View>

              <Text
                style={{ color: COLORS.primary }}
                className="text-3xl font-extrabold mt-5 tracking-wide"
              >
                Create Account
              </Text>

              <Text
                style={{ color: COLORS.secondary }}
                className="text-base mt-2"
              >
                Smart bill tracking starts here
              </Text>
            </View>

            {/* Form Card */}
            <View className="mx-5 mt-7 relative">
              <View
                style={{ backgroundColor: COLORS.accent }}
                className="absolute -top-3 -left-3 -right-3 h-20 rounded-[30px] opacity-60"
              />

              <View className="bg-white p-6 rounded-[28px] shadow-lg">
                <Animated.View style={{ transform: [{ scale: focusAnim }] }}>
                  <CustomInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    icon="person-outline"
                  />

                  <CustomInput
                    label="Email Address"
                    value={email}
                    onChangeText={validateEmail}
                    error={emailError}
                    icon="mail-outline"
                  />

                  <CustomInput
                    label="Phone Number (Optional)"
                    value={number}
                    onChangeText={setNumber}
                    icon="call-outline"
                  />

                  <CustomInput
                    label="Password"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry
                    error={passwordError}
                    icon="lock-closed-outline"
                  />

                  <CustomInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={validateConfirmPassword}
                    secureTextEntry
                    error={confirmPasswordError}
                    icon="lock-closed-outline"
                  />
                </Animated.View>

                {/* Terms */}
                <View className="flex-row items-center mt-5">
                  <Checkbox
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? COLORS.primary : undefined}
                  />
                  <Text className="ml-3 text-sm text-gray-500">
                    I agree to the Terms & Privacy Policy
                  </Text>
                </View>

                <View className="mt-6">
                  <CustomButton
                    title="Create Individual Account"
                    onPress={handlePress}
                    loading={loading}
                    disabled={!isChecked}
                  />
                </View>
              </View>
            </View>

            {/* Footer */}
            <View className="mt-5 mb-2">
              <Text className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="./auth/login"
                  style={{
                    color: COLORS.secondary,
                    fontWeight: "700",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign in
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
