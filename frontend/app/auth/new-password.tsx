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

// NewPasswordScreen 
// Final step of the password-reset flow.
// Collects and validates a new password + confirmation, then submits to the API.
const NewPasswordScreen: React.FC = () => {

  // State 
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]                 = useState(false); // locks the button during the API call

  // Handlers 

  const handleReset = async () => {

    // Client-side validation (runs before any network call) 

    // Guard: both fields must be filled
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    // Guard: enforce minimum password length
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    // Guard: the two fields must be identical before submitting
    if (password !== confirmPassword) {
      Alert.alert("Error", "Both passwords must match.");
      return;
    }

    // API call 
    setLoading(true);
    try {
      // TODO: replace the simulated delay with the real API call:
      // await authAPI.newPassword({ password });
      await new Promise((res) => setTimeout(res, 1200));

      // On success, inform the user then redirect to login so they can sign in
      // with their new credentials
      Alert.alert("Success", "Your password has been reset!", [
        { text: "OK", onPress: () => router.replace("/auth/login" as any) },
      ]);
    } catch {
      // Generic error — specific server messages should be surfaced here once
      // the real API is wired in
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      // Always re-enable the button regardless of outcome
      setLoading(false);
    }
  };

  // Render
  return (
    <SafeAreaView style={styles.container}>

      {/* Back Navigation */}
      {/* Returns to the previous screen (typically the check-email screen) */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#1F2937" />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>

        {/* Screen heading and context copy */}
        <Text style={styles.title}>Create new password</Text>
        {/* Explicit line break keeps the subtitle to two balanced lines */}
        <Text style={styles.subtitle}>
          Your new password must be different{"\n"}from previous used passwords.
        </Text>

        {/* New Password Field */}
        <Text style={styles.inputLabel}>Password</Text>
        <CustomInput
          placeholder="Create a strong password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry   // masks input characters
          icon="lock-closed-outline"
        />
        {/* Inline hint mirrors the validation rule so the user knows the requirement upfront */}
        <Text style={styles.hintText}>Must be at least 8 characters</Text>

        {/* Confirm Password Field */}
        {/* marginTop applied inline to avoid a one-off style entry for a single rule */}
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Confirm Password</Text>
        <CustomInput
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry   // masks input characters
          icon="lock-closed-outline"
        />
        {/* Inline hint mirrors the match validation rule */}
        <Text style={styles.hintText}>Both passwords must match</Text>

        {/* Submit Button */}
        {/* Disabled implicitly via the loading prop while the request is in-flight */}
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Reset Password"
            onPress={handleReset}
            loading={loading}
            style={styles.resetButton}
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

// Styles 
const styles = StyleSheet.create({
  // White background keeps the form clean and distraction-free
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Fixed size hit-target for the back arrow; marginTop clears the status bar
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
  },

  // Horizontal padding applied once here rather than on every child element
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,     // generous line-height improves two-line readability
    marginBottom: 28,
  },

  // Bold label sits directly above each input field
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },

  // Muted helper text shown below each input to guide the user
  hintText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
  },

  buttonWrapper: {
    marginTop: 32,
  },

  resetButton: {
    borderWidth: 0,     // overrides any default border on CustomButton
    borderRadius: 14,
    height: 52,
  },
});

export default NewPasswordScreen;