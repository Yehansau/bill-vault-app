// Theme colors - supports light and dark mode
export const COLORS = {
  light: {
    primary: "#6C63FF", // Purple
    secondary: "#FF6584", // Pink
    success: "#4CAF50", // Green
    warning: "#FFC107", // Yellow
    error: "#F44336", // Red
    background: "#FFFFFF", // White
    backgroundSecondary: "#F5F5F5",
    text: "#000000", // Black
    textSecondary: "#757575", // Gray
    border: "#E0E0E0",
    disabled: "#BDBDBD",
  },
  dark: {
    primary: "#6C63FF", // Purple (same)
    secondary: "#FF6584", // Pink (same)
    success: "#4CAF50", // Green (same)
    warning: "#FFC107", // Yellow (same)
    error: "#F44336", // Red (same)
    background: "#121212", // Dark background
    backgroundSecondary: "#1E1E1E",
    text: "#FFFFFF", // White text
    textSecondary: "#B0B0B0", // Light gray
    border: "#333333",
    disabled: "#555555",
  },
};

// For backwards compatibility with code that uses COLORS.primary directly
// You can access colors like: COLORS.light.primary or just COLORS.primary
Object.assign(COLORS, COLORS.light);

// Bill Categories (unchanged)
export const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "electricals", name: "Electricals", icon: "💡" },
  { id: "hardware", name: "Hardware", icon: "🔧" },
  { id: "appliances", name: "Appliances", icon: "🏠" },
  { id: "grocery", name: "Grocery", icon: "🛒" },
  { id: "restaurant", name: "Restaurant", icon: "🍽️" },
  { id: "utilities", name: "Utilities", icon: "⚡" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "clothing", name: "Clothing", icon: "👔" },
  { id: "home_garden", name: "Home & Garden", icon: "🌱" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "others", name: "Others", icon: "📦" },
];

// AsyncStorage Keys (unchanged)
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  USER_EMAIL: "user_email",
  USER_ID: "user_id",
  ACCOUNT_TYPE: "account_type",
  FULL_NAME: "full_name",
  BUSINESS_NAME: "business_name",
};

// Account Types (unchanged)
export const ACCOUNT_TYPES = {
  INDIVIDUAL: "individual",
  BUSINESS: "business",
};

// Validation Regex (unchanged)
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
};

// API Response Messages (unchanged)
export const MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Session expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
};
