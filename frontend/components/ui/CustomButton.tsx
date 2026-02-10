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
  gradientColors?: readonly [string, string];
  style?: any; 
  innerStyle?: any; // 👈 optional (for gradient/view container)
  textStyle?: any; // 👈 optional (for text)
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  gradientColors,
  style,
  innerStyle,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimaryAndDisabled = variant === "primary" && isDisabled;

  const wrapperStyles = [
    styles.button,
    isPrimaryAndDisabled && styles.buttonDisabledPrimaryWrapper,
    variant === "secondary" && styles.buttonSecondary,
    variant === "secondary" && isDisabled && styles.buttonSecondaryDisabled,
    style,
  ];

  const innerContainerStyles = [
    styles.innerGradientContainer,
    innerStyle,
  ];

  const textStyles = [
    styles.buttonText,
    variant === "secondary" && styles.buttonTextSecondary,
    isDisabled && styles.buttonTextDisabled,
    textStyle,
  ];

  const defaultGradient: readonly [string, string] = ["#3B1E54", "#8342BA"];

const primaryGradientColors: readonly [string, string] =
  isPrimaryAndDisabled
    ? ["#FFFFFF", "#FFFFFF"]
    : gradientColors ?? defaultGradient;

  // Conditionally render LinearGradient or View
  if (variant === "primary") {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={onPress}
        activeOpacity={0.7}
        style={wrapperStyles}
      >
        <LinearGradient
          style={innerContainerStyles}
          colors={primaryGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary variant - use View
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={wrapperStyles}
    >
      <View style={innerContainerStyles}>
        {loading ? (
          <ActivityIndicator size="small" color="#7E22CE" />
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
  borderRadius: 20,
  width: "100%",
  minHeight: 60,
},

buttonText: {
  color: "#FFF",
  fontSize: 20,
  fontWeight: "600",
  lineHeight: 24,             // ✅ VERY IMPORTANT
  textAlign: "center",
},

  innerGradientContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  buttonDisabledPrimaryWrapper: {
    borderWidth: 2,
    borderColor: "#000000",
  },
  buttonSecondary: {
    backgroundColor: "#9B7EBD",
    borderWidth: 2,
    borderColor: "#000000",
  },
  buttonSecondaryDisabled: {
    backgroundColor: "#FFFFFF",
    borderColor: "#B5A7D8",
  },

  buttonTextSecondary: {
    color: "#000000",
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#333333",
  },
});
