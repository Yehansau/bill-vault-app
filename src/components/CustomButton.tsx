import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary", // 'primary' or 'secondary'
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const Wrapper = TouchableOpacity;
  const InnerContainer = variant === "primary" ? LinearGradient : View; // Use View for secondary variant

  // Determine if we need the *primary* specific disabled wrapper style (white inside, black border)
  const isPrimaryAndDisabled = variant === "primary" && isDisabled;

  // Styles for the outer TouchableOpacity/Wrapper
  const wrapperStyles = [
    styles.button,
    // Apply the border/wrapper style ONLY if it's primary AND disabled
    isPrimaryAndDisabled && styles.buttonDisabledPrimaryWrapper,
    // Secondary button styles (which already handle their own border/background)
    variant === "secondary" && styles.buttonSecondary,
    variant === "secondary" && isDisabled && styles.buttonSecondaryDisabled,
  ];

  // Styles for the inner container (LinearGradient or View)
  const innerContainerStyles = [
    styles.innerGradientContainer, // Provides padding and flex
    // Secondary variant does not need these styles because the wrapper handles background/border
  ];

  // Define shared text styles including the disabled text style
  const textStyles = [
    styles.buttonText,
    variant === "secondary" && styles.buttonTextSecondary,
    // Apply general disabled text color rule
    isDisabled && styles.buttonTextDisabled,
  ];

  // Colors for the inner LinearGradient (white for disabled primary, gradient otherwise)
  const primaryGradientColors: readonly [string, string] = isPrimaryAndDisabled
    ? ["#FFFFFF", "#FFFFFF"]
    : ["#3B1E54", "#8342BA"];

  return (
    <Wrapper
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={wrapperStyles} // Outer wrapper handles borders/size
    >
      <InnerContainer
        style={innerContainerStyles}
        // Only pass colors prop if it's actually the LinearGradient component
        colors={
          variant === "primary" ? primaryGradientColors : ["#fff", "#000"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color={"#7E22CE"} />
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </InnerContainer>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 0, // Inner container handles padding
    width: "100%",
    minHeight: 50,
    overflow: "hidden",
  },
  innerGradientContainer: {
    // This makes the inner content fill the parent wrapper
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  // --- NEW STYLE FOR DISABLED PRIMARY BUTTON WRAPPER (White fill, black border) ---
  buttonDisabledPrimaryWrapper: {
    borderWidth: 2,
    borderColor: "#000000", // Black border for the disabled primary button
  },
  // --------------------------------------------------------------------------------

  // Secondary Button Styles (Solid background, dark text)
  buttonSecondary: {
    backgroundColor: "#9B7EBD",
    borderWidth: 2,
    borderColor: "#000000",
  },
  buttonSecondaryDisabled: {
    // Ensure the secondary disabled background is handled correctly
    backgroundColor: "#FFFFFF",
    borderColor: "#B5A7D8",
  },

  // Text Styles
  buttonText: {
    color: "#FFF", // Primary button text remains white
    fontSize: 20,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#000000",
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    // All disabled buttons get this text color
    color: "#333333",
  },
});
