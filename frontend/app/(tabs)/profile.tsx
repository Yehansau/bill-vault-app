import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Design Tokens 
// Centralised colour palette shared across the app for visual consistency
const COLORS = {
  primary: "#7C3AED",       // brand purple
  primaryLight: "#EDE9FE",  // light purple tint used for backgrounds/badges
  secondary: "#3B0856",     // deep purple for contrast elements
  accent: "#F5F3FF",        // very light purple for subtle section backgrounds
  gold: "#F59E0B",          // gold used for premium/achievement accents
  text: "#1F2937",          // primary text colour
  textMuted: "#6B7280",     // secondary/hint text colour
  white: "#FFFFFF",
  border: "#E5E7EB",        // light grey for dividers and borders
  streakOrange: "#F97316",  // orange reserved for streak highlights
  green: "#10B981",         // success/unlocked state colour
};

// Mock Data
// Placeholder values until real API data is wired in
const STREAK_COUNT = 12;       // current daily upload streak
const TOTAL_TIME = 2847;       // cumulative time (hours) spent on the platform
const LONGEST_STREAK = 28;     // all-time best streak

// Recent upload activity shown inside the streak card
const RECENT_ACTIVITY = [
  { label: "Today",       uploads: 3 },
  { label: "Yesterday",   uploads: 2 },
  { label: "2 days ago",  uploads: 1 },
];

// Achievement definitions — unlocked flag drives locked/unlocked UI state
const ACHIEVEMENTS = [
  { id: 1, icon: "⚔️",  title: "Warrior",  subtitle: "10 uploads",  unlocked: true  },
  { id: 2, icon: "👑",  title: "Champion", subtitle: "25 uploads",  unlocked: true  },
  { id: 3, icon: "⭐",  title: "Legend",   subtitle: "50 uploads",  unlocked: false },
  { id: 4, icon: "🏆",  title: "Master",   subtitle: "100 uploads", unlocked: false },
];

// Bullet points displayed inside the premium benefits card
const PREMIUM_PERKS = [
  "Extra storage (5GB → 50GB)",
  "Unlimited language translations",
  "Priority customer support",
];

// StatBox Component
// Displays a single metric (value + label) in the stats row
const StatBox = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// AchievementCard Component
// Renders one achievement tile; visually dimmed when the achievement is locked
const AchievementCard = ({
  icon,
  title,
  subtitle,
  unlocked,
}: {
  icon: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
}) => (
  <View style={[styles.achievementCard, !unlocked && styles.achievementLocked]}>
    <Text style={styles.achievementIcon}>{icon}</Text>
    <Text style={[styles.achievementTitle, !unlocked && styles.lockedText]}>
      {title}
    </Text>
    <Text style={[styles.achievementSub, !unlocked && styles.lockedText]}>
      {subtitle}
    </Text>

    {/* Show a green "Unlocked" badge for earned achievements, progress text otherwise */}
    {unlocked ? (
      <View style={styles.unlockedBadge}>
        <Ionicons name="checkmark" size={10} color={COLORS.white} />
        <Text style={styles.unlockedText}> Unlocked</Text>
      </View>
    ) : (
      <Text style={styles.courseText}>0 courses</Text>
    )}
  </View>
);

// ProfileScreen
// Main profile page: avatar, stats, streak, achievements, premium card, logout
const ProfileScreen: React.FC = () => {
  // Active bottom-tab state (kept here for tab-bar highlight logic)
  const [activeTab, setActiveTab] = useState<"home" | "search" | "add" | "bell" | "person">("person");

  // Profile photo URI selected from the device library (null = show default icon)
  const [photo, setPhoto] = useState<string | null>(null);

  // User identity fields populated from AsyncStorage on mount
  const [userName, setUserName] = useState("");
  const [email, setEmail]       = useState("");

  // Lifecycle
  useEffect(() => {
    // Debug: log all stored keys to the console during development
    AsyncStorage.getAllKeys().then((keys) => console.log("Keys:", keys));

    // Hydrate display name; fall back to placeholder if key is absent
    AsyncStorage.getItem("full_name").then((name) =>
      setUserName(name || "Your name")
    );

    // Hydrate email; fall back to placeholder if key is absent
    AsyncStorage.getItem("email").then((email) =>
      setEmail(email || "Your email")
    );
  }, []);

  // Handlers

  // Clears all local storage and redirects the user to the login screen
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push("/auth/login");
  };

  // Opens the device photo library and updates the avatar with the chosen image
  const handlePickPhoto = async () => {
    // Request read access to the media library before opening the picker
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,   // enables the in-picker crop tool
      aspect: [1, 1],        // enforce square crop for the circular avatar
      quality: 0.8,          // slight compression to reduce memory footprint
    });

    // Only update state when the user confirms a selection (not on cancel)
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Render
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── Top Navigation Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/auth/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Avatar + Identity Section ── */}
        <View style={styles.avatarSection}>

          {/* Tapping the avatar wrapper triggers the photo picker */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto}>
            {/* Render chosen photo; fall back to generic person icon */}
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarCircle} />
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={44} color={COLORS.white} />
              </View>
            )}
            {/* Camera overlay icon signals that the avatar is tappable */}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={12} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          {/* Gradient badge indicating the current account tier */}
          <LinearGradient
            colors={["#7C3AED", "#4C1D95"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.accountTypeBadge}
          >
            <Ionicons name="person-outline" size={14} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.accountTypeText}>Individual Account</Text>
          </LinearGradient>

        </View>

        {/* ── Summary Stats Row ── */}
        <View style={styles.statsRow}>
          <StatBox value={247}    label="Documents"   />
          <View style={styles.statDivider} />
          <StatBox value={12}     label="This Month"  />
          <View style={styles.statDivider} />
          <StatBox value="45.2"  label="MB Saved"    />
        </View>

        {/* ── Streak Card ── */}
        <View style={styles.card}>
          {/* Header: streak label on the left, current streak count on the right */}
          <View style={styles.streakHeader}>
            <View>
              <View style={styles.streakTitleRow}>
                <Text style={styles.streakFire}> fire image</Text>
                <Text style={styles.streakLabel}>Streak</Text>
              </View>
              <Text style={styles.streakSubtitle}>Keep uploading daily!</Text>
            </View>
            <Text style={styles.streakCount}>{STREAK_COUNT}</Text>
          </View>

          {/* Two mini stat boxes: longest streak and total hours */}
          <View style={styles.streakStatsRow}>
            <View style={styles.streakStatBox}>
              <Text style={styles.streakStatValueLarge}>{LONGEST_STREAK}</Text>
              <Text style={styles.streakStatLabel}>Longest{"\n"}Streak</Text>
            </View>
            <View style={styles.streakStatBox}>
              <Text style={styles.streakStatValueLarge}>{TOTAL_TIME}</Text>
              <Text style={styles.streakStatLabel}>Time{"\n"}Hours</Text>
            </View>
          </View>

          {/* Daily upload history for the past few days */}
          <View style={styles.recentActivityBox}>
            <Text style={styles.recentActivityTitle}>Recent Activity</Text>
            {RECENT_ACTIVITY.map((item) => (
              <View key={item.label} style={styles.activityRow}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityUploads}>
                  {item.uploads} upload{item.uploads !== 1 ? "s" : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Achievements Section ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {/* 2-column grid of achievement tiles */}
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((a) => (
              <AchievementCard key={a.id} {...a} />
            ))}
          </View>
        </View>

        {/* ── Premium Benefits Card ── */}
        <LinearGradient
          colors={["#7C3AED", "#4C1D95"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumCard}
        >
          <View style={styles.premiumHeader}>
            <Text style={styles.premiumTitle}>Premium Benefits</Text>
            <MaterialCommunityIcons name="crown" size={20} color={COLORS.gold} />
          </View>
          <Text style={styles.premiumSub}>Unlock advanced features</Text>

          {/* Render each perk with a gold checkmark */}
          {PREMIUM_PERKS.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </LinearGradient>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: 15,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Scroll Container
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Avatar Section
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight, // light halo around the avatar
    marginBottom: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  accountTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },

  // Generic Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  // Streak Card
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  streakTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakFire:  { fontSize: 18, marginRight: 4 },
  streakLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  streakSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  streakCount: { fontSize: 36, fontWeight: "900", color: COLORS.primary },
  streakStatsRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  streakStatBox: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakStatValueLarge: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  streakStatLabel: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },

  // Recent Activity
  recentActivityBox: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
  },
  recentActivityTitle: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  activityLabel: { fontSize: 12, color: COLORS.textMuted },
  activityUploads: { fontSize: 12, fontWeight: "600", color: COLORS.primary },

  // Achievements Grid
  achievementsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  achievementCard: {
    width: "47%",           // two columns with a small gap
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  achievementLocked: { backgroundColor: "#F3F4F6", opacity: 0.7 },
  achievementIcon:   { fontSize: 28, marginBottom: 6 },
  achievementTitle:  { fontSize: 14, fontWeight: "700", color: COLORS.text },
  achievementSub:    { fontSize: 11, color: COLORS.textMuted, marginTop: 2, marginBottom: 6 },
  lockedText:        { color: "#9CA3AF" },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unlockedText: { fontSize: 10, color: COLORS.white, fontWeight: "600" },
  courseText:   { fontSize: 11, color: "#9CA3AF" },

  // Premium Card
  premiumCard: { borderRadius: 16, padding: 18, marginBottom: 14 },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  premiumTitle: { fontSize: 16, fontWeight: "800", color: COLORS.white },
  premiumSub:   { fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 12 },
  perkRow:      { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  perkText:     { color: COLORS.white, fontSize: 13, fontWeight: "500", flex: 1 },

  // Bottom Tab Bar (kept for reference, rendered elsewhere)
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem:      { flex: 1, alignItems: "center", justifyContent: "center" },
  tabAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,          // floats above the tab bar
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "#A78BCA",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 1,
    marginBottom: 8,
  },
  logoutText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Camera Overlay Icon
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,  // white ring separates icon from avatar edge
  },
});

export default ProfileScreen;