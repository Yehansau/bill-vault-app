import { CustomButton } from "@/components/ui";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Background } from "@react-navigation/elements";


export default function RegistrationSuccessScreen() {
  const handleContinue = () => {
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Account Created!</Text>
      <Text style={styles.subtitle}>
        Your account has been created successfully.
      </Text>
      <Text style={styles.message}>
        Please login to start managing your bills.
      </Text>

      {/* Continue Button */}
      <CustomButton
        title="Continue to Login"
        onPress={handleContinue}
        gradientColors={["#944ABC", "#3B0856"] as const}
        variant="primary"
        style={{ borderRadius: 30, width: "70%", alignSelf: "center", marginBottom: 40}}
        innerStyle={{ borderRadius: 30 }}
        textStyle={{ fontSize: 18, color: "#FFFFFF"}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  message: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
});
