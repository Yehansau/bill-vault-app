// Backend API calls
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SaveBillPayload } from "@/types/bill.types";

// IMPORTANT: Change this to YOUR computer's IP address
// Find IP: Windows (ipconfig) | Mac (ifconfig) | Linux (hostname -I)

const API_BASE_URL = "http://10.79.228.249:8000/api";

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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // No response → network issue
    if (!error.response) {
      alert("Network error. Please check your connection.");
      console.error("Network error:", error.message);
      return Promise.reject(error); // ← throw it so the hook catches it;
    }
    console.error("Error response data:", JSON.stringify(error.response.data));

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 || status === 400) {
      // Expected auth errors
      console.warn("Auth error:", data);
      // Alert should be shown in screen logic OR here (pick one)
      return Promise.reject(error); // ← throw it
    }

    // Unexpected server errors
    alert("Something went wrong. Please try again.");
    console.error("Server error:", error);
    return Promise.reject(error); // ← throw it
  },
);

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
        // Authorization header is automatically added by your interceptor
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
};

export const warrantiesAPI = {
  // Get all warranties for home screen warranty tracker
  list: () => api.get("/warranties/"),

  // Get single warranty
  detail: (id: string) => api.get(`/warranties/${id}/`),
};
