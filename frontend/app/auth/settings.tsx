import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#7C3AED",
  text: "#1F2937",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  border: "#E5E7EB",
  background: "#F9FAFB",
  iconBg: "#EDE9FE",
};

const SETTINGS_ITEMS = [
  { label: "Account Settings", icon: "settings-outline" },
  { label: "Notifications",    icon: "notifications-outline" },
  { label: "Privacy & Security", icon: "shield-outline" },
  { label: "Help & Support",   icon: "help-circle-outline" },
];

const SettingsScreen: React.FC = () => {

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push("/auth/login" as any);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* ── Settings items ── */}
      <View style={styles.listContainer}>
        {SETTINGS_ITEMS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Log out button ── */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
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
    marginTop: 18,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  // List
  listContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  // Logout
  logoutWrapper: {
    position: "absolute",
    bottom: -350,
    left: 16,
    right: 16,
  },
  logoutButton: {
    backgroundColor: "#A78BCA",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default SettingsScreen;