import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/env";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  const token = await readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("raomeo-mobile-auth");
    }
    return Promise.reject(error);
  }
);

async function readStoredToken() {
  try {
    const raw = await AsyncStorage.getItem("raomeo-mobile-auth");
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch {
    return null;
  }
}

export const endpoints = {
  login: (payload) => api.post("/auth/login", payload),
  dashboard: () => api.get("/front_desk/live_status"),
  rooms: (params) => api.get("/rooms", { params }),
  roomCategories: () => api.get("/room_categories"),
  reservations: (params) => api.get("/reservations", { params }),
  reservationCalendar: (params) => api.get("/reservations/calendar", { params }),
  guests: (params) => api.get("/guests", { params }),
  housekeepingTasks: (params) => api.get("/housekeeping_tasks", { params }),
  maintenanceTickets: (params) => api.get("/maintenance_tickets", { params }),
  invoices: (params) => api.get("/invoices", { params }),
  foodBeverageOrders: (params) => api.get("/food_beverage_orders", { params }),
  search: (params) => api.get("/pareto_search", { params })
};
