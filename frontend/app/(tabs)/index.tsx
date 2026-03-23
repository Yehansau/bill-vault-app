/*import { View, Text, StyleSheet } from "react-native";
import { auth } from "../../firebaseConfig";
// import { auth } from "../firebaseConfig.js";

export default function Index() {
  console.log("Firebase initialized:", auth.app.name);

  return (
    <View style={styles.container}>
      <Text>BillVault - Firebase Connected! ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
*/

// app/(tabs)/index.tsx

import arrow from "@/assets/images/arrow.png";
import bell from "@/assets/images/icons/bell.png";
import vault from "@/assets/images/vault.png";
import FilesCard from "@/components/home/RecentBillCard";
import ProgressBar from "@/components/home/ProgressBar";
import SearchBar from "@/components/home/SearchBar";
import WarrantyCard from "@/components/home/WarrantyTrackerCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";

// Warranty service and types from the files we created
import { getWarranties } from "../../services/warrantyService";
import { Warranty } from "../../types/warranty.types";

// ─────────────────────────────────────────
// Small reusable divider line between sections
// ─────────────────────────────────────────
import { router } from "expo-router";

const HorizontalRule = () => {
  return <View className="w-3/4 bg-gray-200 h-1 my-4 mx-auto" />;
};

export default function App() {
  const router = useRouter();

  // ========== WARRANTY STATE ==========

  // Stores first 4 warranties for the preview section
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  // Controls the loading spinner while Firebase fetches data
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // ========== FETCH WARRANTIES ON LOAD ==========

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setLoadingWarranties(true);

      // Call the service from File 3 — fetches all warranties
      const allWarranties = await getWarranties();

      // Only show first 4 on HomeScreen preview
      // User can tap "View All" to see everything
      setWarranties(allWarranties.slice(0, 4));
    } catch (error) {
      console.error("Error fetching warranties for HomeScreen:", error);
    } finally {
      setLoadingWarranties(false);
    }
  };

  // ========== DATE FORMATTING ==========
  // Shows current date in header e.g. "Friday, 20th March"

  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("full_name").then((name) =>
      setUserName(name || "there"),
    );
  }, []);

  const getOrdinal = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const formattedDate = `${day}${getOrdinal(day)} ${month}`;

  // Dummy data for recent uploads section (unchanged from original)
  const recentUploadsData = ["upload 1", "upload 2", "upload 3", "upload 4"];

  // ========== NAVIGATION ==========

  // Navigates to the full warranty list screen
  // Works even if warranties array is empty
  const handleViewAllWarranties = () => {
    router.push("/warranty/warranty-tracker");
  };

  // ========== MAIN RENDER ==========

  return (
    <View className="flex-1 flex-col bg-white px-7 pt-14">
      {/* ── Top Bar: Weekday + Notification Bell ── */}
      <View className="flex-1 flex-col bg-white px-5 pt-14">
        <View className="flex-row justify-between">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#808080]">{weekday}</Text>
            <Text className="text-lg font-bold">{formattedDate}</Text>
          </View>

          <Image
            source={bell}
            className="flex-end size-9"
            resizeMode="contain"
          />
        </View>

        {/* ── Greeting ── */}
        <Text className="text-2xl font-bold mt-2">Hi John!</Text>
        <Text className="text-2xl font-bold mt-2">Hi {userName}!</Text>
        <SearchBar />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 10,
          }}
        >
          {/* ── Cloud Storage Card ── */}
          <View className="rounded-lg h-[160px] overflow-hidden w-full">
            <LinearGradient
              colors={["#944ABC", "#3B0856"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            >
              <View className="flex-row justify-between pl-4 mt-4">
                <View className="flex-col justify-between">
                  <View className="flex-row justify-evenly">
                    <Image source={vault} className="size-24" />
                    <View className="flex-col">
                      <Text className="text-white font-semibold text-2xl">
                        Cloud Storage
                      </Text>
                      <Text className="text-white font-semibold text-md">
                        247 Secured Documents
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white text-md font-semibold">
                    20GB of 35GB Used
                  </Text>
                  <View className="w-full pt-2">
                    <ProgressBar progress={67} />
                  </View>
                </View>
                <Image source={arrow} className="w-14 h-24 mt-12" />
              </View>
            </LinearGradient>
          </View>

          <HorizontalRule />

          {/* ── Warranty Tracker Section ── */}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold">Warranty Tracker</Text>

            {/* View All — always tappable, even with 0 warranties */}
            <TouchableOpacity onPress={handleViewAllWarranties}>
              <Text className="text-sm text-gray-400 font-bold">View All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/upload/bill-review")}
            >
              <Text className="text-sm text-gray-400 font-bold">View All</Text>
            </TouchableOpacity>
          </View>

          {/* Warranty Preview — 3 states: loading / empty / data */}
          <View style={{ height: 155, marginVertical: 10 }}>
            {loadingWarranties ? (
              // State 1: Still fetching from Firebase
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#944ABC" />
              </View>
            ) : warranties.length === 0 ? (
              // State 2: Fetched but no warranties exist yet
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400 text-base">
                  No warranties yet
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Scan a warranty card to get started!
                </Text>
              </View>
            ) : (
              // State 3: Has warranties — show horizontal scroll cards
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={warranties}
                renderItem={({ item }) => <WarrantyCard warranty={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 10 }}
              />
            )}
          </View>

          <HorizontalRule />

          {/* ── Recent Uploads Section (unchanged) ── */}
          <View className="flex-row justify-between">
            <Text className="text-2xl font-bold">Recent Uploads</Text>
            <Text className="text-sm text-gray-400 font-bold">View All</Text>
          </View>

          <View style={{ minHeight: 170, marginVertical: 10 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recentUploadsData}
              renderItem={({ item }) => <FilesCard />}
              contentContainerStyle={{ gap: 10 }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
