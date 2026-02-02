// Backend API calls
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: Change this to YOUR computer's IP address
// Find IP: Windows (ipconfig) | Mac (ifconfig) | Linux (hostname -I)
const API_BASE_URL = "http://192.168.1.5:8000/api"; // CHANGE THIS!

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
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
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;

// API functions
export const authAPI = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  verifyToken: () => api.get("/auth/verify"),
};

export const billsAPI = {
  upload: (data: any) => api.post("/bills/upload", data),
  list: () => api.get("/bills/"),
  detail: (id: string) => api.get(`/bills/${id}`),
};
