import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/constants";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Home Screen</Text>
      <Text style={styles.subtext}>(Will be built in Sprint 2)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtext: { fontSize: 14, color: COLORS.textSecondary },
});
