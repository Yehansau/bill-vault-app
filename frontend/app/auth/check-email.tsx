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

// CheckEmailScreen
// Shown after the user submits a forgot-password request.
// Prompts them to open their email app and follow the recovery instructions.
const CheckEmailScreen: React.FC = () => {

  // Handlers 

  // Opens the device's default mail app via the mailto: URI scheme
  const handleOpenEmail = () => {
    Linking.openURL("mailto:");
  };

  // Render
  return (
    <SafeAreaView style={styles.container}>

      {/* Main Content (centred vertically) */}
      <View style={styles.content}>

        {/* Gradient icon badge — visually anchors the screen's purpose */}
        <LinearGradient
          colors={["#9B4FD6", "#6D28D9"]}
          style={styles.iconWrapper}
        >
          <Ionicons name="mail" size={48} color="#FFFFFF" />
        </LinearGradient>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Check your mail</Text>
        {/* Explicit line break keeps the subtitle to two balanced lines */}
        <Text style={styles.subtitle}>
          We have sent a password recover{"\n"}instructions to your email.
        </Text>

        {/* Primary CTA: opens the mail app */}
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Open email app"
            onPress={handleOpenEmail}
            style={styles.openButton}
          />
        </View>

        {/* Secondary action: dismiss and confirm the email later */}
        <TouchableOpacity onPress={() => router.push("/(tabs)" as any)}>
          <Text style={styles.skipText}>Skip, I'll confirm later</Text>
        </TouchableOpacity>

      </View>

      {/* Dev / Temp shortcut: jump directly to the new-password screen
           TODO: remove or gate behind a flag before production release */}
      <TouchableOpacity onPress={() => router.push("/auth/new-password" as any)}>
        <Text style={styles.skipText}>New Password</Text>
      </TouchableOpacity>

      {/* Bottom Help Note */}
      {/* Gives the user a fallback if the email never arrives */}
      <View style={styles.bottomNote}>
        <Text style={styles.bottomText}>
          Did not receive the email? Check your spam filter,{"\n"}
          or{" "}
          {/* Inline pressable text navigates back so the user can re-enter their email */}
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

// Styles 
const styles = StyleSheet.create({
  // White background keeps the focus on the purple icon and text
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Flex-1 + centred layout so the icon/text block sits in the middle of the screen
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // Rounded square badge housing the mail icon; border-radius gives a squircle feel
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
    lineHeight: 22,       // generous line-height improves multi-line readability
    textAlign: "center",
    marginBottom: 36,
  },

  // Full-width wrapper ensures the button stretches edge-to-edge within the padded content area
  buttonWrapper: {
    width: "100%",
    marginBottom: 16,
  },

  openButton: {
    borderWidth: 0,       // overrides any default border on CustomButton
    borderRadius: 14,
    height: 52,
  },

  // Shared style for both the "Skip" and "New Password" ghost links
  skipText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  // Sits outside the flex-1 content block so it always sticks to the bottom
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

  // Purple + bold to draw the eye to the actionable "try another email" link
  linkText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
});

export default CheckEmailScreen;