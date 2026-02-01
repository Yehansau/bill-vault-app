import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../../utils/constants";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾</Text>
      <Text style={styles.appName}>BILLVAULT</Text>
      <Text style={styles.tagline}>NEVER LOSE A BILL AGAIN</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.loader}
      />
      <Text style={styles.note}>(Being built by Yuwani - FE-2A)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 80, marginBottom: 20 },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  tagline: { fontSize: 14, color: "#FFF", marginBottom: 40 },
  loader: { marginTop: 20 },
  note: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 20 },
});
