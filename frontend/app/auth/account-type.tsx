import { CustomButton } from "@/components/ui";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import logo from "../../assets/images/LogoPicture.png";

const AccountTypeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Choose Account Type</Text>
        <Text style={styles.subtitle}>
          Select how you'll be using BillVault
        </Text>
      </View>

      {/* Individual Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("./register-individual")}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.iconText}>👤</Text>
        </View>
        <Text style={styles.cardTitle}>Individual</Text>
        <Text style={styles.cardSubtitle}>For personal bill management</Text>

        <View style={styles.features}>
          <Text style={styles.feature}>• OCR Scanning</Text>
          <Text style={styles.feature}>• Smart Categories</Text>
          <Text style={styles.feature}>• Warranty Tracking</Text>
          <Text style={styles.feature}>• Digital Backup</Text>
        </View>
      </TouchableOpacity>

      {/* Business Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("./register-business")}
      >
        <View style={[styles.cardIcon, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.iconText}>💼</Text>
        </View>
        <Text style={styles.cardTitle}>Business</Text>
        <Text style={styles.cardSubtitle}>
          For invoice & expense management
        </Text>

        <View style={styles.features}>
          <Text style={styles.feature}>• QR Code Processing</Text>
          <Text style={styles.feature}>• Customer Tracking</Text>
          <Text style={styles.feature}>• Expense Dashboard</Text>
          <Text style={styles.feature}>• Team Collaboration</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.signinText}>
        Already have an account?{" "}
        <Text
          style={styles.signinLink}
          onPress={() => router.push("./auth/login")}
        >
          Sign in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
  },
  features: {
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 6,
  },
  signinText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 10,
  },
  signinLink: {
    color: "#6C63FF",
    fontWeight: "600",
  },
});

export default AccountTypeScreen;
