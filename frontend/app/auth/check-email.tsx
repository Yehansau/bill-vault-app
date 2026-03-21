import { CustomButton } from "@/components/ui";
import { router } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CheckEmailScreen: React.FC = () => {

  const handleOpenEmail = () => {
    Linking.openURL("mailto:");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* ── Email icon ── */}
        <LinearGradient
          colors={["#9B4FD6", "#6D28D9"]}
          style={styles.iconWrapper}
        >
          <Ionicons name="mail" size={48} color="#FFFFFF" />
        </LinearGradient>

        {/* ── Title & subtitle ── */}
        <Text style={styles.title}>Check your mail</Text>
        <Text style={styles.subtitle}>
          We have sent a password recover{"\n"}instructions to your email.
        </Text>

        {/* ── Open email button ── */}
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Open email app"
            onPress={handleOpenEmail}
            style={styles.openButton}
          />
        </View>

        {/* ── Skip link ── */}
        <TouchableOpacity onPress={() => router.push("/(tabs)" as any)}>
          <Text style={styles.skipText}>Skip, I'll confirm later</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom note ── */}
      <View style={styles.bottomNote}>
        <Text style={styles.bottomText}>
          Did not receive the email? Check your spam filter,{"\n"}
          or{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.back()}
          >
            try another email address
          </Text>
        </Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 36,
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  openButton: {
    borderWidth: 0,
    borderRadius: 14,
    height: 52,
  },
  skipText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  bottomNote: {
    paddingBottom: 32,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  bottomText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  linkText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
});

export default CheckEmailScreen;