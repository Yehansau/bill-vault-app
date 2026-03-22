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

// ─── Colour tokens (matches the rest of the app) ─────────────────────────────
const COLORS = {
  primary: "#7C3AED",       // purple
  primaryLight: "#EDE9FE",
  secondary: "#3B0856",
  accent: "#F5F3FF",
  gold: "#F59E0B",
  text: "#1F2937",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  border: "#E5E7EB",
  streakOrange: "#F97316",
  green: "#10B981",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const STREAK_COUNT = 12;
const TOTAL_TIME = 2847;
const LONGEST_STREAK = 28;

const RECENT_ACTIVITY = [
  { label: "Today", uploads: 3 },
  { label: "Yesterday", uploads: 2 },
  { label: "2 days ago", uploads: 1 },
];

const ACHIEVEMENTS = [
  { id: 1, icon: "⚔️",  title: "Warrior",  subtitle: "10 uploads",  unlocked: true  },
  { id: 2, icon: "👑",  title: "Champion", subtitle: "25 uploads",  unlocked: true  },
  { id: 3, icon: "⭐",  title: "Legend",   subtitle: "50 uploads",  unlocked: false },
  { id: 4, icon: "🏆",  title: "Master",   subtitle: "100 uploads", unlocked: false },
];

const PREMIUM_PERKS = [
  "Extra storage (5GB → 50GB)",
  "Unlimited language translations",
  "Priority customer support",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"home" | "search" | "add" | "bell" | "person">("person");
  const [photo, setPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    AsyncStorage.getAllKeys().then((keys) => console.log("Keys:", keys));

    AsyncStorage.getItem("full_name").then((name) =>
      setUserName(name || "Your name")
    );

    AsyncStorage.getItem("email").then((email) =>
      setEmail(email || "Your email"),
    );

  }, []);

    // functions after hooks
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push("/auth/login");
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* ── Top bar ── */}
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
        {/* ── Avatar + name ── */}
        <View style={styles.avatarSection}>
        
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto}>
  {photo ? (
    <Image source={{ uri: photo }} style={styles.avatarCircle} />
  ) : (
    <View style={styles.avatarCircle}>
      <Ionicons name="person" size={44} color={COLORS.white} />
    </View>
  )}
  <View style={styles.cameraIcon}>
    <Ionicons name="camera" size={12} color={COLORS.white} />
  </View>
</TouchableOpacity>

<Text style={styles.userName}>{userName}</Text>
<Text style={styles.userEmail}>{email}</Text>

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

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatBox value={247} label="Documents" />
          <View style={styles.statDivider} />
          <StatBox value={12} label="This Month" />
          <View style={styles.statDivider} />
          <StatBox value="45.2" label="MB Saved" />
        </View>

        {/* ── Streak card ── */}
        <View style={styles.card}>
          <View style={styles.streakHeader}>
            <View>
              <View style={styles.streakTitleRow}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakLabel}>Streak</Text>
              </View>
              <Text style={styles.streakSubtitle}>Keep uploading daily!</Text>
            </View>
            <Text style={styles.streakCount}>{STREAK_COUNT}</Text>
          </View>

          <View style={styles.streakStatsRow}>
            {/* Longest streak */}
            <View style={styles.streakStatBox}>
              <Text style={styles.streakStatValueLarge}>{LONGEST_STREAK}</Text>
              <Text style={styles.streakStatLabel}>Longest{"\n"}Streak</Text>
            </View>
            {/* Time hours */}
            <View style={styles.streakStatBox}>
              <Text style={styles.streakStatValueLarge}>{TOTAL_TIME}</Text>
              <Text style={styles.streakStatLabel}>Time{"\n"}Hours</Text>
            </View>
          </View>

          {/* Recent Activity */}
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

        {/* ── Achievements ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((a) => (
              <AchievementCard key={a.id} {...a} />
            ))}
          </View>
        </View>

        {/* ── Premium card ── */}
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
          {PREMIUM_PERKS.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </LinearGradient>

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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: 15
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Avatar section
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarWrapper: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // Stats row
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

  // Generic card
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

  // Streak card
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
  streakFire: {
    fontSize: 18,
    marginRight: 4,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  streakSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  streakCount: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
  },
  streakStatsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  streakStatBox: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakStatValueLarge: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },
  streakStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  recentActivityBox: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
  },
  recentActivityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  activityLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  activityUploads: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // Achievements grid
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  achievementCard: {
    width: "47%",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  achievementLocked: {
    backgroundColor: "#F3F4F6",
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  achievementSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  lockedText: {
    color: "#9CA3AF",
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unlockedText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "600",
  },
  courseText: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  // Premium card
  premiumCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  premiumSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 12,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  perkText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  // Bottom tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
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
  borderColor: COLORS.white,
  },
});

export default ProfileScreen;