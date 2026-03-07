import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import illustration from "../../assets/images/happy_woman.png";
import mainLogo from "../../assets/images/billvault-black-image.png";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("./auth-choice");
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Purple Section (Background) */}
      <LinearGradient colors={["#944ABC", "#3B0856"]} style={styles.topSection}>
        <SafeAreaView style={styles.imageContainer}>
          <Image
            source={illustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </SafeAreaView>
      </LinearGradient>

      {/* 2. Bottom White Section with the "Upward" Curve */}
      <View style={styles.bottomSection}>
        {/* Content Wrapper scales back to 1 to undo the flattening transform */}
        <View style={styles.contentWrapper}>
          <Image
            source={mainLogo}
            style={styles.logoStyle}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Every bill you need, right when you need it most. Connect with us
            and secure yours now!
          </Text>

          <View>
            <CustomButton
              title="Get Started"
              onPress={handleGetStarted}
              //loading={loading}
              style={{ marginTop: 30 }}
              innerStyle={{ borderRadius: 30 }} // Pass the bold black text style here
            />
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B0856",
  },
  topSection: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  illustration: {
    width: width * 1.8,
    height: width * 1.8,
    marginTop: 20,
    marginRight: 38
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: width * 0.6,
    borderTopRightRadius: width * 0.6,
    transform: [{ scaleX: 1.5 }],
    alignItems: "center",
    overflow: "hidden", // Keeps the content inside the curve area
  },
  contentWrapper: {
    transform: [{ scaleX: 0.67 }],
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    paddingTop: 0, // Moves everything up closer to the curve
    flex: 1,
  },
  logoStyle: {
    width: width * 0.9,
    height: 300, // Large logo as requested
    resizeMode: "contain",
    marginTop: -40, // Pulls the logo up into the curve
    marginBottom: -100,
  },
  description: {
    fontSize: 17,
    color: "#000", // Solid black text
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "600", // Bolder weight
    paddingHorizontal: 15,
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
  getStartedBtn: {
    backgroundColor: "#A289C3", // The specific lavender shade
    borderRadius: 35, // Increased to 35 for a perfect "pill" shape
    height: 65,
    width: width * 0.85, // Slightly wider for better balance
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Adds the subtle outline seen in the close-up
    borderColor: "rgba(0,0,0,0.1)",
  },

  getStartedText: {
    color: "#000", // Bold black text
    fontSize: 22, // Large and clear
    fontWeight: "700", // Thick bold weight
  },
});

export default WelcomeScreen;
