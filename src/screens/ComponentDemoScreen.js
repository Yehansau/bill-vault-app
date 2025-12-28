import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
// Assuming CustomInput, CustomButton, and LoadingSpinner are in "../components"
import { CustomInput, CustomButton, LoadingSpinner } from "../components";

export default function ComponentDemoScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Use separate states for each button that can be clicked
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false);
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(false);

  // Handler for the first (primary) button
  const handlePrimaryPress = () => {
    setIsLoadingPrimary(true);
    // Simulate loading for the primary button only
    setTimeout(() => setIsLoadingPrimary(false), 2000);
  };

  // Handler for the second (secondary) button
  const handleSecondaryPress = () => {
    setIsLoadingSecondary(true);
    // Simulate loading for the secondary button only
    setTimeout(() => setIsLoadingSecondary(false), 2000);
  };

  // Determine if *any* button is loading to show the bottom spinner (optional)
  const isAnyLoading = isLoadingPrimary || isLoadingSecondary;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Component Demo</Text>

      <Text style={styles.sectionTitle}>Custom Inputs:</Text>
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomInput
        label="Email with Error"
        placeholder="test@example.com"
        error="Please enter a valid email"
      />

      <Text style={styles.sectionTitle}>Custom Buttons:</Text>

      {/* Button 1: Uses primary loading state and handler */}
      <CustomButton
        title="Create Individual Account"
        onPress={handlePrimaryPress}
        loading={isLoadingPrimary}
      />

      <View style={{ height: 16 }} />

      {/* Button 2: Uses secondary loading state and handler */}
      <CustomButton
        title="Login"
        onPress={handleSecondaryPress}
        loading={isLoadingSecondary} // Added loading prop here
        variant="secondary"
      />

      <View style={{ height: 16 }} />

      {/* Button 3: Remains disabled permanently */}
      <CustomButton
        title="Disabled Button"
        onPress={() => {}} // Empty handler as it's disabled
        disabled
      />

      {isAnyLoading && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Loading Spinner:</Text>
          <LoadingSpinner size="large" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
});
