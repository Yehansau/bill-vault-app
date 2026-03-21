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

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with your actual API call
      // await authAPI.resetPassword({ email: email.trim().toLowerCase() });
      await new Promise((res) => setTimeout(res, 1200));
      Alert.alert(
        "Email Sent",
        "Check your inbox for instructions to reset your password.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#1F2937"/>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send an email
          with instructions to reset your password.
        </Text>

        <Text style={styles.inputLabel}>Email address</Text>
        <CustomInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
          keyboardType="email-address"
        />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
  },
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
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  buttonWrapper: {
    marginTop: 32,
  },
  sendButton: {
    borderWidth: 0,
    borderRadius: 14,
    height: 52,
  },
});

export default ResetPasswordScreen;