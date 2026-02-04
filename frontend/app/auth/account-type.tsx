import { CustomButton } from "@/components/ui";
import AuthHeader from "@/components/AuthHeader"
import { router } from "expo-router";
import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image ,Alert} from "react-native";
import logo from "../../assets/images/LogoPicture.png";
import BackButton from "@/components/ui/BackButton";

const AccountTypeScreen = () => {
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>

      {/* Back Arrow */}
      <BackButton/>

      {/* Header */}
      <AuthHeader
        logo={logo}
        title="Choose Account Type"
        subtitle="How will you use BillVault?"
      />


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
      </TouchableOpacity>

      {/* Business Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => Alert.alert('OOPS !', 'This feature is coming soon.')}
      >
        <View style={[styles.cardIcon, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.iconText}>💼</Text>
        </View>
        <Text style={styles.cardTitle}>Business</Text>
        <Text style={styles.cardSubtitle}>
          For invoice & expense management
        </Text>
      </TouchableOpacity>

      
    </ScrollView>
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
