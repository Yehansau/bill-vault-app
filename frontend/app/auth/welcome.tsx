import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import logo from "../../assets/images/LogoPicture.png";

const WelcomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    router.push("./auth-choice"); // Go to choice screen
  };

  return (
    <LinearGradient
      colors={["#944ABC", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>BILLVAULT</Text>
        <Text style={styles.subtitle}>NEVER LOSE A BILL AGAIN</Text>
      </View>

      <View style={styles.ButtonContainer}>
        <Text style={styles.welcomeText}>WELCOME</Text>

        {/* Only ONE button: Get Started */}
        <CustomButton
          title="Get Started"
          onPress={handleGetStarted}
          loading={loading}
          variant="secondary"
        />
      </View>
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    height: 100,
    width: 100,
    marginTop: 100,
  },

  view: {
    flex: 1,
  },

  billVaultImage: {
    height: 100,
    width: 310,
    marginTop: 10,
  },

  welcomeText: {
    fontSize: 45,
    color: "white",
    marginBottom: 200,
    marginTop: 50,
  },

  imageContainer: {
    alignItems: "center",
  },

  ButtonContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 80,
    paddingHorizontal: 50,
    justifyContent: "center",
  },

  button: {
    marginTop: 20,
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },

});

export default WelcomeScreen;
