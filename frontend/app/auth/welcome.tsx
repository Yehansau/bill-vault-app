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

// Capture screen width once at module level for responsive sizing calculations
const { width } = Dimensions.get("window");

// WelcomeScreen 
// First screen a new user sees after the splash.
// Split into two sections: a purple gradient hero image on top and a
// white curved content panel on the bottom.
const WelcomeScreen = () => {

  // State 
  // Controls the loading state on the Get Started button during navigation
  const [loading, setLoading] = useState(false);

  // Handlers 

  // Brief loading pulse before navigating to the auth-choice screen.
  // The 500 ms delay gives the button press animation time to complete
  // before the screen transition begins.
  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("./auth-choice");
    }, 500);
  };

  // Render 
  return (
    // Dark purple base colour shows through any gaps between the two sections
    <View style={styles.container}>

      {/* 1. Top Purple Hero Section */}
      {/* Full-bleed gradient that fills the upper portion of the screen */}
      <LinearGradient colors={["#944ABC", "#3B0856"]} style={styles.topSection}>
        {/* SafeAreaView keeps the illustration clear of the status bar */}
        <SafeAreaView style={styles.imageContainer}>
          <Image
            source={illustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </SafeAreaView>
      </LinearGradient>

      {/* 2. Bottom White Section */}
      {/* Large border radii + scaleX: 1.5 create the wide upward-curving
          "wave" edge that overlaps the gradient section above */}
      <View style={styles.bottomSection}>

        {/* scaleX: 0.67 (= 1 / 1.5) undoes the parent's horizontal stretch
            so that text, logo, and button render at their true proportions */}
        <View style={styles.contentWrapper}>

          {/* App logo — pulled upward with a negative marginTop so it
              visually peeks into the curved edge of the white panel */}
          <Image
            source={mainLogo}
            style={styles.logoStyle}
            resizeMode="contain"
          />

          {/* Tagline copy encouraging the user to sign up */}
          <Text style={styles.description}>
            Every bill you need, right when you need it most. Connect with us
            and secure yours now!
          </Text>

          {/* Primary CTA */}
          {/* loading prop is commented out — uncomment once the navigation
              delay UX is confirmed as desirable */}
          <View>
            <CustomButton
              title="Get Started"
              onPress={handleGetStarted}
              // loading={loading}
              style={{ marginTop: 30 }}
              innerStyle={{ borderRadius: 30 }}  // pill shape on the button interior
            />
          </View>

        </View>
      </View>
    </View>
  );
};

// Styles 
const styles = StyleSheet.create({
  // Dark purple base ensures no white flicker appears during screen transitions
  container: {
    flex: 1,
    backgroundColor: "#3B0856",
  },

  // ── Top Section ──
  // flex: 1.1 gives the hero image slightly more vertical space than the
  // bottom panel so the illustration dominates the first impression
  topSection: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Full screen-width container so the oversized illustration centres correctly
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },

  // Illustration is intentionally oversized (1.8× screen width) and offset
  // to create a dramatic bleed effect beyond the screen edges
  illustration: {
    width: width * 1.8,
    height: width * 1.8,
    marginTop: 20,
    marginRight: 38,    // shifts the figure slightly left for visual balance
  },

  // Bottom Section
  // borderTopLeftRadius + borderTopRightRadius set to 60% of screen width
  // combined with scaleX: 1.5 produces a wide, shallow upward curve
  // overflow: "hidden" clips any child content that escapes the curved boundary
  bottomSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: width * 0.6,
    borderTopRightRadius: width * 0.6,
    transform: [{ scaleX: 1.5 }],
    alignItems: "center",
    overflow: "hidden",
  },

  // Counter-scales the content back to natural proportions after the
  // parent's 1.5× horizontal stretch; width: width compensates for the
  // narrower effective space after scaling
  contentWrapper: {
    transform: [{ scaleX: 0.67 }],
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    paddingTop: 0,
    flex: 1,
  },

  // Large logo pulled up with negative marginTop so it overlaps the curve edge;
  // negative marginBottom closes the gap between the logo and the description
  logoStyle: {
    width: width * 0.9,
    height: 300,
    resizeMode: "contain",
    marginTop: -40,
    marginBottom: -100,
  },

  description: {
    fontSize: 17,
    color: "#000",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "600",
    paddingHorizontal: 15,
    marginTop: 20,
  },

  // Unused styles (kept for reference / future custom button implementation)
  buttonContainer: {
    width: "100%",
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
  // Lavender pill-shaped button — superseded by CustomButton but retained
  // in case the design reverts to a fully custom implementation
  getStartedBtn: {
    backgroundColor: "#A289C3",   // lavender shade from the original design spec
    borderRadius: 35,             // high radius for a perfect pill shape
    height: 65,
    width: width * 0.85,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,               // subtle outline visible in close-up mockups
    borderColor: "rgba(0,0,0,0.1)",
  },
  getStartedText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
  },
});

export default WelcomeScreen;