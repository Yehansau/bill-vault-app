import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import girlImage from "../../assets/images/bills_woman.png";
import { Dimensions } from "react-native";

// Get the device's screen width for responsive image sizing
const { width } = Dimensions.get("window");

// AuthChoiceScreen
// Landing screen shown to unauthenticated users.
// Offers two paths: log in to an existing account or create a new one.
const AuthChoiceScreen = () => {
  // Controls the loading spinner on both buttons while navigation is pending
  const [loginLoading, setLoginLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Handlers 

  // Briefly shows a loading state, then navigates to the login screen
  const handleLogin = () => {
    setLoginLoading(true);
    setTimeout(() => setLoginLoading(false), 2000);
    router.push("./login");
  };

  // Briefly shows a loading state, then navigates to the account-type picker
  const handleCreateAccount = () => {
    setCreateLoading(true);
    setTimeout(() => setCreateLoading(false), 2000);
    router.push("./account-type");
  };

  // Render
  return (
    // Full-screen vertical gradient: light purple at the top, deep purple at the bottom
    <LinearGradient
      colors={["#9B4FD6", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Branding Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        {/* App name styled larger and in white to stand out against the gradient */}
        <Text style={styles.brand}>BillVault.</Text>
      </View>

      {/* Hero Image */}
      {/* Illustrative graphic that fills most of the screen's visual space */}
      <View style={styles.imageContainer}>
        <Image source={girlImage} style={styles.image} />
      </View>

      {/* Action Buttons */}
      {/* Stacked vertically; both share the same loading state */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Login"
          onPress={handleLogin}
          loading={loginLoading}
          variant="secondary"
          style={{ width: "80%", borderWidth: 0 }}
        />

        {/* Vertical gap between the two buttons */}
        <View style={styles.spacing} />

        <CustomButton
          title="Create Account"
          onPress={handleCreateAccount}
          loading={createLoading}
          variant="secondary"
          style={{ width: "80%", borderWidth: 0 }}
        />
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  // Fills the full screen; content flows top-down with generous horizontal padding
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    justifyContent: "flex-start",
  },

  // Slight left indent to visually align the text with the rest of the layout
  header: {
    marginTop: 20,
    marginLeft: 35,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "black",
  },

  // Larger and white so the brand name dominates the header area
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  // Scales the image proportionally to 85% of screen width on any device
  // Negative bottom margin pulls the button section upward, closing the gap
  image: {
    width: width * 0.85,
    height: width * 0.85,
    resizeMode: "contain",
    marginBottom: -30,
  },

  // Centred column; bottom padding keeps the buttons clear of the home indicator
  buttonContainer: {
    paddingBottom: 50,
    marginTop: 80,
    alignItems: "center",
  },

  // Fixed-height spacer between the Login and Create Account buttons
  spacing: {
    height: 18,
  },
});

export default AuthChoiceScreen;