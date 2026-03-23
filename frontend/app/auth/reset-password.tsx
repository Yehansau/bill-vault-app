import { CustomButton, CustomInput } from "@/components/ui";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ResetPasswordScreen
// First step of the forgot-password flow.
// Collects and validates the user's email, then sends reset instructions to it.
const ResetPasswordScreen: React.FC = () => {

  // State
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false); // locks the button while the request is in-flight

  // Handlers

  const handleSend = async () => {

    // Client-side validation (runs before any network call)

    // Guard: field must not be empty or whitespace-only
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    // Guard: basic RFC-style regex to catch obvious typos (e.g. missing @, no TLD)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // API call
    setLoading(true);
    try {
      // TODO: replace the simulated delay with the real API call:
      // await authAPI.resetPassword({ email: email.trim().toLowerCase() });
      await new Promise((res) => setTimeout(res, 1200));

      // Navigate to the check-email screen so the user knows to look
      // in their inbox for the reset instructions
      router.push("/auth/check-email" as any);
    } catch {
      // Generic error message — specific server errors should be surfaced
      // here once the real API is wired in
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      // Always re-enable the button regardless of success or failure
      setLoading(false);
    }
  };

  // Render 
  return (
    <SafeAreaView style={styles.container}>

      {/* ── Back Navigation ── */}
      {/* Returns to the login screen so the user can try signing in instead */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#1F2937" />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>

        {/* Screen heading and explanatory copy */}
        <Text style={styles.title}>Reset password</Text>
        {/* Describes exactly what will happen so the user knows what to expect */}
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send an email
          with instructions to reset your password.
        </Text>

        {/* Email Input */}
        {/* keyboardType="email-address" surfaces the @ key and disables auto-capitalisation */}
        <Text style={styles.inputLabel}>Email address</Text>
        <CustomInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
          keyboardType="email-address"
        />

        {/* Submit Button */}
        {/* Disabled implicitly via the loading prop while the request is in-flight */}
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Send Instructions"
            onPress={handleSend}
            loading={loading}
            style={styles.sendButton}
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  // White background keeps the single-field form clean and focused
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Fixed-size hit target for the back arrow; marginTop clears the status bar
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
  },

  // Horizontal padding applied once here rather than on every child element
  // Large paddingTop creates breathing room below the back button
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
  },

  // Muted colour and relaxed line-height make the longer subtitle easy to scan
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 32,
  },

  // Bold label sits directly above the email input field
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },

  // Top margin creates a clear visual gap between the input and the CTA
  buttonWrapper: {
    marginTop: 32,
  },

  sendButton: {
    borderWidth: 0,     // overrides any default border on CustomButton
    borderRadius: 14,
    height: 52,
  },
});

export default ResetPasswordScreen;