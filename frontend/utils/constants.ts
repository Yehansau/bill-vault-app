// Theme colors - supports light and dark mode
export const COLORS = {
  light: {
    primary: "#6C63FF",
    secondary: "#FF6584",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    background: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    text: "#000000",
    textSecondary: "#757575",
    border: "#E0E0E0",
    disabled: "#BDBDBD",
  },
  dark: {
    primary: "#6C63FF",
    secondary: "#FF6584",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    background: "#121212",
    backgroundSecondary: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#B0B0B0",
    border: "#333333",
    disabled: "#555555",
  },
};

// Bill Categories
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

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  USER_EMAIL: "user_email",
  USER_ID: "user_id",
  ACCOUNT_TYPE: "account_type",
  FULL_NAME: "full_name",
  BUSINESS_NAME: "business_name",
};

// Account Types
export const ACCOUNT_TYPES = {
  INDIVIDUAL: "individual" as const,
  BUSINESS: "business" as const,
};

// Validation Regex
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
};

// API Response Messages
export const MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Session expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
};
