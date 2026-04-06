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
});*/

// app/(tabs)/index.tsx

/**
 * ============================================================================
 * HOME SCREEN
 * ============================================================================
 * 
 * Main dashboard showing:
 * - Date and user greeting
 * - Cloud storage card
 * - Warranty tracker preview (first 4 warranties)
 * - Recent uploads section
 */

import arrow from "@/assets/images/arrow.png";
import bell from "@/assets/images/icons/bell.png";
import vault from "@/assets/images/vault.png";
import FilesCard from "@/components/home/RecentBillCard";
import WarrantyCard from "@/components/home/WarrantyTrackerCard";
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

// ✅ WARRANTY TRACKER IMPORTS (ADDED)
import { getWarranties } from "../../services/warrantyService";
import { Warranty } from "../../types/warranty.types";
import SearchBar from "@/components/home/SearchBar";
import ProgressBar from "@/components/home/ProgressBar";

/**
 * Horizontal divider line between sections
 */
const HorizontalRule = () => {
  return <View className="w-3/4 bg-gray-200 h-1 my-4 mx-auto" />;
};

/**
 * Home Screen Component
 */
export default function App() {
  const router = useRouter();

  // ========== WARRANTY STATE (ADDED) ==========
  
  /** First 4 warranties for preview section */
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  
  /** Loading state while fetching warranties */
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // ========== FETCH WARRANTIES (ADDED) ==========
  
  useEffect(() => {
    fetchWarranties();
  }, []);

  /**
   * Fetch warranties from Firestore
   * Only show first 4 for HomeScreen preview
   */
  const fetchWarranties = async () => {
    try {
      setLoadingWarranties(true);
      const allWarranties = await getWarranties();
      // Only show first 4 for preview
      setWarranties(allWarranties.slice(0, 4));
    } catch (error) {
      console.error("Error fetching warranties:", error);
    } finally {
      setLoadingWarranties(false);
    }
  };

  // ========== DATE FORMATTING (EXISTING - UNCHANGED) ==========
  
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
  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });
  const formattedDate = `${day}${getOrdinal(day)} ${month}`;

  // Dummy data for recent uploads (EXISTING - UNCHANGED)
  const recentUploadsData = ["upload 1", "upload 2", "upload 3", "upload 4"];

  // ========== NAVIGATION (ADDED) ==========
  
  /**
   * Navigate to warranty tracker screen
   * Always works, even with 0 warranties
   */
  const handleViewAllWarranties = () => {
    router.push("/warranty/warranty-tracker");
  };

  // ========== MAIN RENDER ==========

  return (
    <View className="flex-1 flex-col bg-white px-7 pt-14">
      
      {/* ────────────────────────────────────────
          TOP BAR: DATE + NOTIFICATION BELL
          (EXISTING - UNCHANGED)
      ──────────────────────────────────────── */}
      <View className="flex-row justify-between">
        <View className="flex-col">
          <Text className="text-lg font-bold text-[#808080]">{weekday}</Text>
          <Text className="text-lg font-bold">{formattedDate}</Text>
        </View>

        <Link href="./auth">
          <Image
            source={bell}
            className="flex-end size-9"
            resizeMode="contain"
          />
        </Link>
      </View>

      {/* ────────────────────────────────────────
          GREETING
          (EXISTING - UNCHANGED)
      ──────────────────────────────────────── */}
      <Text className="text-2xl font-bold mt-2">Hi John!</Text>

      <SearchBar />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        {/* ────────────────────────────────────────
            CLOUD STORAGE CARD
            (EXISTING - UNCHANGED)
        ──────────────────────────────────────── */}
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
                <ProgressBar progress={67}/>
                <Text className="text-white text-md font-semibold">
                  20GB of 35GB Used
                </Text>
              </View>

              <Image source={arrow} className="w-14 h-24 mt-12" />
            </View>
          </LinearGradient>
        </View>

        <HorizontalRule />

        {/* ────────────────────────────────────────
            WARRANTY TRACKER SECTION
            (MODIFIED - ONLY THIS SECTION CHANGED)
        ──────────────────────────────────────── */}
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold">Warranty Tracker</Text>
          
          {/* ✅ MODIFIED: Now navigates to warranty tracker screen */}
          <TouchableOpacity onPress={handleViewAllWarranties}>
            <Text className="text-sm text-gray-400 font-bold">View All</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ MODIFIED: Now shows real warranty data with 3 states */}
        <View style={{ height: 155, marginVertical: 10 }}>
          {loadingWarranties ? (
            // State 1: Loading from Firebase
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#944ABC" />
            </View>
          ) : warranties.length === 0 ? (
            // State 2: No warranties yet
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400">No warranties yet</Text>
              <Text className="text-gray-400 text-xs">
                Scan a warranty card to get started!
              </Text>
            </View>
          ) : (
            // State 3: Display warranty cards
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={warranties}
              renderItem={({ item }) => <WarrantyCard warranty={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                gap: 10,
              }}
            />
          )}
        </View>

        <HorizontalRule />

        {/* ────────────────────────────────────────
            RECENT UPLOADS SECTION
            (EXISTING - UNCHANGED)
        ──────────────────────────────────────── */}
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
            contentContainerStyle={{
              gap: 10,
            }}
          />
        </View>
        <TouchableOpacity className="text-2xl font-bold text-black" onPress={() => router.push("/upload/bill-review")}>
          <Text>test</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}