import axios from "axios";
import Constants from "expo-constants";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.YOUR_MACHINE_IP;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network error. Please check your connection.";
    return Promise.reject(new Error(message));
  },
);

export const generationAPI = {
  generate: ({ imageBase64, mimeType, styles, customPrompt }) =>
    api.post("/generation/generate", {
      imageBase64,
      mimeType,
      styles,
      customPrompt,
    }),

  getStatus: (sessionId) => api.get(`/generation/status/${sessionId}`),
};

export const historyAPI = {
  getHistory: (sessionId) => api.get(`/history/${sessionId}`),
  deleteGeneration: (generationId) => api.delete(`/history/${generationId}`),
};

export default api;
