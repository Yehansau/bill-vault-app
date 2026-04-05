import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Design Tokens 
// Centralised colour palette shared across the app for visual consistency
const COLORS = {
  primary:    "#7C3AED",  // brand purple — used for icons and accents
  text:       "#1F2937",  // primary text colour
  textMuted:  "#6B7280",  // secondary/hint text and chevron icons
  white:      "#FFFFFF",
  border:     "#E5E7EB",  // light grey dividers between list items
  background: "#F9FAFB",  // off-white page background
  iconBg:     "#EDE9FE",  // light purple tint behind each setting icon
};

// Settings Item Definitions
// Drives the rendered list — add, remove, or reorder items here without
// touching the JSX. Each entry needs a display label and an Ionicons icon name.
const SETTINGS_ITEMS = [
  { label: "Account Settings",   icon: "settings-outline"       },
  { label: "Notifications",      icon: "notifications-outline"  },
  { label: "Privacy & Security", icon: "shield-outline"         },
  { label: "Help & Support",     icon: "help-circle-outline"    },
];

// SettingsScreen
// Displays a grouped list of app settings and a logout button.
// Individual setting rows are currently navigation stubs — handlers to be
// wired up as each sub-screen is built.
const SettingsScreen: React.FC = () => {

  // Handlers

  // Wipes all locally stored data (token, user info) then redirects to login
  const handleLogout = () => {
  Alert.alert(
    "Log Out",                    // ← title
    "Are you sure you want to log out?",  // ← message
    [
      {
        text: "Cancel",           // ← first button
        style: "cancel",          // ← styled as cancel (grey on iOS)
        onPress: () => {},        // ← does nothing, just closes the dialog
      },
      {
        text: "Log Out",          // ← second button
        style: "destructive",     // ← styled as red on iOS (warns the user)
        onPress: async () => {    // ← actual logout happens here
          await AsyncStorage.clear();
          router.replace("/auth/login" as any);
        },
      },
    ]
  );
};

  // Render 
  return (
    <SafeAreaView style={styles.container}>

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        {/* Invisible spacer keeps the title visually centred between the
            back arrow and the right edge */}
        <View style={{ width: 22 }} />
      </View>

      {/* Settings List */}
      {/* Rendered from SETTINGS_ITEMS so the list is easy to extend */}
      <View style={styles.listContainer}>
        {SETTINGS_ITEMS.map((item, index) => (
          // TODO: add onPress handler to each item once sub-screens are built
          <TouchableOpacity key={index} style={styles.item}>

            {/* Icon badge + label on the left */}
            <View style={styles.itemLeft}>
              {/* Rounded purple badge visually groups the icon with its label */}
              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>

            {/* Chevron on the right signals the row is tappable */}
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />

          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      {/* Positioned absolutely so it sits at the bottom of the screen
          regardless of how many settings items are in the list */}
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

// Styles
const styles = StyleSheet.create({
  // Off-white background differentiates the page from the white list card
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    marginTop: 18,      // clears the status bar on most devices
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Settings List Card
  listContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",   // clips the top/bottom items to the card's rounded corners
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,   // hairline divider between rows
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,              // consistent spacing between icon badge and label
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,           // squircle shape consistent with iOS icon style
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  // Logout Button
  // NOTE: bottom: -350 is a magic number that pins the button near the foot
  // of the screen on most devices — consider replacing with a flex layout
  // or KeyboardAvoidingView for more robust positioning across screen sizes
  logoutWrapper: {
    flex: 1,                    // ← takes remaining space
    justifyContent: "flex-end", // ← pushes button to bottom
    paddingHorizontal: 16,
    paddingBottom: 30,          // ← breathing room from screen edge
  },
  logoutButton: {
    backgroundColor: "#A78BCA",   // lighter purple to distinguish from primary actions
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default SettingsScreen;