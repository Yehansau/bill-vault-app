import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import logo from "../../assets/images/LogoPicture.png";

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
      colors={["#944ABC", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>BILLVAULT</Text>
        <Text style={styles.subtitle}>NEVER LOSE A BILL AGAIN</Text>
      </View>

      <View style={styles.buttonContainer}>

        <CustomButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
          variant="secondary"
        />
        </View>

        <View style={styles.spacing} />
        {/* <CustomButton
          title="Create Account"
          onPress={handleCreateAccount}
          loading={loading}
          variant="secondary"
        /> */}

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 130,
    width: 130,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    marginTop: 20,
  },
  spacing: {
    height: 20
  },
});

export default AuthChoiceScreen;
