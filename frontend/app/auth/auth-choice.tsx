import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import girlImage from "../../assets/images/woman_bills.png"; // replace with your girl image

const AuthChoiceScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    router.push("./login");
  };

  const handleCreateAccount = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    router.push("./account-type");
  };

  return (
    <LinearGradient
      colors={["#9B4FD6", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Top Text */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.brand}>BillVault.</Text>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={girlImage} style={styles.image} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
          variant="secondary"
          style={{ width: "80%" }}
        />

        <View style={styles.spacing} />

        <CustomButton
          title="Create Account"
          onPress={handleCreateAccount}
          loading={loading}
          variant="secondary"
          style={{ width: "80%" }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    justifyContent: "flex-start",
  },

  header: {
    marginTop: 20,
    marginLeft: 35
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "black",
  },

  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 60
  },

  image: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },

  buttonContainer: {
    paddingBottom: 50,
    marginTop: 80,
    alignItems: "center",
  },

  spacing: {
    height: 18,
  },
});

export default AuthChoiceScreen;