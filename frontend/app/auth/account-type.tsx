import AuthHeader from "@/components/AuthHeader";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackButton from "@/components/ui/BackButton";
import { Ionicons } from "@expo/vector-icons";

const FeatureItem = ({ text }: { text: string }) => (
  <View style={styles.featureItem}>
    <Ionicons name="checkmark-done-sharp" size={16} color="#22C55E" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const AccountTypeScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <BackButton title="Create Account" />

      <AuthHeader
        title="Choose Account Type"
        subtitle="Select how you'll be using BillVault"
      />

      {/* Individual Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("./register-individual")}
      >
        <View style={styles.rowTop}>
          <View style={[styles.iconCircle, { backgroundColor: "#E9D5FF" }]}>
            <Ionicons name="person-outline" size={28} color="#7C3AED" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Individual</Text>
            <Text style={styles.cardSubtitle}>
              Personal bill management
            </Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={22} color="#999" />
        </View>

        <View style={styles.featuresGrid}>
          <FeatureItem text="OCR Scanning" />
          <FeatureItem text="Smart Categories" />
          <FeatureItem text="Warranty Tracking" />
          <FeatureItem text="Digital Returns" />
        </View>
      </TouchableOpacity>

      {/* Business Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => Alert.alert("OOPS !", "This feature is coming soon.")}
      >
        <View style={styles.rowTop}>
          <View style={[styles.iconCircle, { backgroundColor: "#D1FAE5" }]}>
            <Ionicons name="business-outline" size={28} color="#059669" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Business</Text>
            <Text style={styles.cardSubtitle}>
              For companies & retailers
            </Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={22} color="#999" />
        </View>

        <View style={styles.featuresGrid}>
          <FeatureItem text="Team Collaboration" />
          <FeatureItem text="Customer Sharing" />
          <FeatureItem text="Bulk Processing" />
          <FeatureItem text="Analytics Dashboard" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    maxHeight: 220,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },

  featureText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444",
  },
});


export default AccountTypeScreen;
