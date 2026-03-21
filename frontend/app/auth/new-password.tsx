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

const NewPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Both passwords must match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your actual API call
      // await authAPI.newPassword({ password });
      await new Promise((res) => setTimeout(res, 1200));
      Alert.alert("Success", "Your password has been reset!", [
        { text: "OK", onPress: () => router.push("/auth/login" as any) },
      ]);
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
        <Ionicons name="arrow-back" size={22} color="#1F2937" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Create new password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different{"\n"}from previous used passwords.
        </Text>

        {/* Password */}
        <Text style={styles.inputLabel}>Password</Text>
        <CustomInput
          placeholder="Create a strong password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />
        <Text style={styles.hintText}>Must be at least 8 characters</Text>

        {/* Confirm Password */}
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Confirm Password</Text>
        <CustomInput
          placeholder=""
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />
        <Text style={styles.hintText}>Both passwords must match</Text>

        {/* Button */}
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
    lineHeight: 21,
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
  },
  buttonWrapper: {
    marginTop: 32,
  },
  resetButton: {
    borderWidth: 0,
    borderRadius: 14,
    height: 52,
  },
});

export default NewPasswordScreen;