// Backend API calls
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { SaveBillPayload } from "@/types/bill.types";

// IMPORTANT: Change this to YOUR computer's IP address
// Find IP: Windows (ipconfig) | Mac (ifconfig) | Linux (hostname -I)

const API_BASE_URL = "https://bill-vault.com/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error reading token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors + auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // No response → network issue
    if (!error.response) {
      Alert.alert(
        "Network Error",
        "Please check your connection and try again.",
      );
      return Promise.reject(error);
    }

    console.error("Error response data:", JSON.stringify(error.response.data));

    const status = error.response.status;
    const originalRequest = error.config;

    // Token expired → try to refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        if (!refreshToken) {
          // No refresh token → force logout
          await handleLogout();
          return Promise.reject(error);
        }

        // Call your refresh endpoint
        const res = await axios.post(`${API_BASE_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = (res.data as { access: string }).access;

        // Save new token
        await AsyncStorage.setItem("token", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh also failed → force logout
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    if (status === 400) {
      console.warn("Auth error:", error.response.data);
      return Promise.reject(error);
    }

    Alert.alert("Something went wrong", "Please try again later.");
    return Promise.reject(error);
  },
);

const handleLogout = async () => {
  await AsyncStorage.multiRemove([
    "token",
    "refresh_token",
    "email",
    "full_name",
  ]);
  Alert.alert("Session Expired", "Please log in again.");
  // If you have a router ref or navigation, redirect to login here
};

export default api;

// API functions
export const authAPI = {
  register: (data: any, p0: { headers: { Authorization: undefined } }) =>
    api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  verifyToken: () => api.get("/auth/verify"),
};

export const billsAPI = {
  // Step 1: Upload image to Firebase + duplicate check
  upload: (formData: FormData) =>
    api.post("/bills/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Step 2: Run OCR + ML classification
  process: (data: {
    firebase_url: string;
    language: string;
    upload_type: string;
  }) =>
    api.post("/bills/process/", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }),

  // Step 3: Save final reviewed bill to database
  save: (data: SaveBillPayload) => api.post("/bills/save/", data),

  // Get all bills for home screen
  list: () => api.get("/bills/"),

  // Get single bill details
  detail: (id: string) => api.get(`/bills/${id}/`),

  // Add warranty to a bill item
  addWarranty: (billId: string, data: any) =>
    api.post(`/bills/${billId}/warranty/`, data),

  // Files screen
  folders: () => api.get("/bills/folders/"),
  folderBills: (category: string) => api.get(`/bills/folders/${category}/`),
  storage: () => api.get("/bills/storage/"),
};

export const warrantiesAPI = {
  // Get all warranties for home screen warranty tracker
  list: () => api.get("/warranties/"),

  // Get single warranty
  detail: (id: string) => api.get(`/warranties/${id}/`),
};

export const analyticsAPI = {
  // Get analytics data
  getSummary: () => api.get("/analytics/"),
};
