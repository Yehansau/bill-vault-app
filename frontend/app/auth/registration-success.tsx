import { CustomButton } from "@/components/ui";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Background } from "@react-navigation/elements";

// RegistrationSuccessScreen
// Confirmation screen shown immediately after a successful account creation.
// Gives the user positive feedback before routing them into the main app.
export default function RegistrationSuccessScreen() {

  // Handlers

  // Uses replace() instead of push() so the user cannot navigate back
  // to this confirmation screen via the hardware/gesture back action
  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  // Render
  return (
    <View style={styles.container}>

      {/* Success Icon */}
      {/* Large green checkmark immediately communicates a positive outcome */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
      </View>

      {/* Confirmation Copy */}
      {/* Three-level hierarchy: bold title → green confirmation → muted nudge */}
      <Text style={styles.title}>Account Created!</Text>
      <Text style={styles.subtitle}>
        Your account has been created successfully.
      </Text>
      {/* Soft call-to-action that guides the user toward the continue button */}
      <Text style={styles.message}>Click to start managing bills.</Text>

      {/* Primary CTA */}
      {/* router.replace ensures this screen is removed from the back stack */}
      <CustomButton
        title="Continue to Home"
        onPress={handleContinue}
        gradientColors={["#944ABC", "#3B0856"] as const} // matches the app-wide brand gradient
        variant="primary"
        style={{
          borderRadius: 30,   // pill shape to distinguish it from regular buttons
          width: "70%",       // narrower than full-width to feel less aggressive
          alignSelf: "center",
          marginBottom: 40,
        }}
        innerStyle={{ borderRadius: 30 }}  // inner radius must match outer to avoid clipping
        textStyle={{ fontSize: 18, color: "#FFFFFF" }}
      />

    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Centred layout — both vertically and horizontally — keeps the success
  // message feeling balanced and celebration-worthy
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Bottom margin separates the icon from the text block below it
  iconContainer: {
    marginBottom: 30,
  },

  // Large bold title grabs attention first
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },

  // Green colour echoes the checkmark icon, reinforcing the success state
  subtitle: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  // Muted grey nudges the user toward the next action without competing
  // with the title and subtitle above it
  message: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 40,   // generous gap before the button
    textAlign: "center",
    lineHeight: 24,     // relaxed line-height aids readability on smaller screens
  },
});